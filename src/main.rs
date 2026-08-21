#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, vec, Env, String, Vec};

const MAX_PAGE_LIMIT: u32 = 50;
/// Ideas created within this window (in ledger seconds) count as "trending" candidates.
const TRENDING_WINDOW_SECS: u64 = 7 * 24 * 60 * 60;
/// Safety cap on how many storage reads a single trending page will do while
/// filtering out-of-window ideas, so a call can't run unbounded.
const TRENDING_SCAN_CAP: u32 = 500;

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    NextId,
    IdeaCount,
    MaxVotes,
    Idea(u32),
    // Ideas grouped by their *exact* vote count. Keeping one small Vec per
    // vote count (instead of one giant sorted Vec of all ideas) means a
    // page read/write only ever touches the buckets it needs, so cost
    // doesn't grow with total dataset size.
    VoteBucket(u32),
}

#[derive(Clone)]
#[contracttype]
pub struct IdeaData {
    pub id: u32,
    pub title: String,
    pub content: String,
    pub author: String,
    pub is_premium: bool,
    pub votes: u32,
    pub created: u64,
    pub tags: Vec<String>,
}

#[derive(Clone, PartialEq, Eq)]
#[contracttype]
pub enum SortBy {
    Newest,
    MostVotes,
    Trending,
}

#[derive(Clone)]
#[contracttype]
pub struct Cursor {
    /// For MostVotes/Trending: the vote-count bucket currently being read.
    /// For Newest: unused (last_id drives iteration instead).
    pub bucket: u32,
    /// Index within that bucket's Vec to resume from.
    pub offset: u32,
    /// For Newest: the last idea id returned, so we resume just below it.
    pub last_id: u32,
}

#[derive(Clone)]
#[contracttype]
pub struct Page {
    pub ideas: Vec<IdeaData>,
    pub has_more: bool,
    /// Only meaningful when `has_more` is true.
    pub next_cursor: Cursor,
}

#[contract]
pub struct HelloContract;

#[contractimpl]
impl HelloContract {
    pub fn hello(env: Env, to: String) -> Vec<String> {
        vec![&env, String::from_str(&env, "Hello"), to]
    }

    pub fn create_idea(
        env: Env,
        title: String,
        content: String,
        author: String,
        is_premium: bool,
        tags: Vec<String>,
    ) -> u32 {
        let idea_id: u32 = env.storage().instance().get(&DataKey::NextId).unwrap_or(0);
        env.storage()
            .instance()
            .set(&DataKey::NextId, &(idea_id + 1));

        let count: u32 = env
            .storage()
            .instance()
            .get(&DataKey::IdeaCount)
            .unwrap_or(0);
        env.storage()
            .instance()
            .set(&DataKey::IdeaCount, &(count + 1));

        let idea = IdeaData {
            id: idea_id,
            title,
            content,
            author,
            is_premium,
            votes: 0,
            created: env.ledger().timestamp(),
            tags,
        };

        env.storage()
            .persistent()
            .set(&DataKey::Idea(idea_id), &idea);

        Self::add_to_vote_bucket(&env, 0, idea_id);

        idea_id
    }

    pub fn vote_idea(env: Env, idea_id: u32, is_upvote: bool) {
        let key = DataKey::Idea(idea_id);
        let mut idea: IdeaData = env.storage().persistent().get(&key).unwrap();

        let old_votes = idea.votes;
        idea.votes = if is_upvote {
            idea.votes.saturating_add(1)
        } else {
            idea.votes.saturating_sub(1)
        };

        env.storage().persistent().set(&key, &idea);

        if idea.votes != old_votes {
            Self::remove_from_vote_bucket(&env, old_votes, idea_id);
            Self::add_to_vote_bucket(&env, idea.votes, idea_id);

            let max_votes: u32 = env
                .storage()
                .instance()
                .get(&DataKey::MaxVotes)
                .unwrap_or(0);
            if idea.votes > max_votes {
                env.storage()
                    .instance()
                    .set(&DataKey::MaxVotes, &idea.votes);
            }
        }
    }

    pub fn get_idea(env: Env, idea_id: u32) -> IdeaData {
        env.storage()
            .persistent()
            .get(&DataKey::Idea(idea_id))
            .unwrap()
    }

    /// Cursor-based pagination over ideas. Pass `cursor: None` to start from
    /// the beginning of whichever ordering `sort_by` selects; when the
    /// returned `Page.has_more` is true, pass `Some(page.next_cursor)` back
    /// in to continue. Once `has_more` is false, `next_cursor` is unused.
    pub fn get_ideas_paginated(
        env: Env,
        sort_by: SortBy,
        cursor: Option<Cursor>,
        limit: u32,
    ) -> Page {
        let limit = if limit == 0 || limit > MAX_PAGE_LIMIT {
            MAX_PAGE_LIMIT
        } else {
            limit
        };

        match sort_by {
            SortBy::Newest => Self::page_newest(&env, cursor, limit),
            SortBy::MostVotes => Self::page_by_votes(&env, cursor, limit, None),
            SortBy::Trending => {
                let cutoff = env
                    .ledger()
                    .timestamp()
                    .saturating_sub(TRENDING_WINDOW_SECS);
                Self::page_by_votes(&env, cursor, limit, Some(cutoff))
            }
        }
    }

    // ---- internal helpers ----

    fn page_newest(env: &Env, cursor: Option<Cursor>, limit: u32) -> Page {
        let next_id: u32 = env.storage().instance().get(&DataKey::NextId).unwrap_or(0);

        let empty_cursor = Cursor {
            bucket: 0,
            offset: 0,
            last_id: 0,
        };

        let start = match cursor {
            Some(c) if c.last_id > 0 => c.last_id - 1,
            Some(_) => {
                return Page {
                    ideas: vec![env],
                    has_more: false,
                    next_cursor: empty_cursor,
                }
            }
            None => {
                if next_id == 0 {
                    return Page {
                        ideas: vec![env],
                        has_more: false,
                        next_cursor: empty_cursor,
                    };
                }
                next_id - 1
            }
        };

        let mut ideas = vec![env];
        let mut id = start;

        let (has_more, next_cursor) = loop {
            if env.storage().persistent().has(&DataKey::Idea(id)) {
                let idea: IdeaData = env.storage().persistent().get(&DataKey::Idea(id)).unwrap();
                ideas.push_back(idea);
                if ideas.len() >= limit {
                    break if id == 0 {
                        (false, empty_cursor)
                    } else {
                        (
                            true,
                            Cursor {
                                bucket: 0,
                                offset: 0,
                                last_id: id,
                            },
                        )
                    };
                }
            }
            if id == 0 {
                break (false, empty_cursor);
            }
            id -= 1;
        };

        Page {
            ideas,
            has_more,
            next_cursor,
        }
    }

    /// Walks vote-count buckets from `max_votes` down to 0, collecting ideas
    /// (optionally filtering to those created after `created_after`, used
    /// for Trending). Each bucket is its own small storage entry, so this
    /// only ever loads the buckets it actually needs for the page.
    fn page_by_votes(
        env: &Env,
        cursor: Option<Cursor>,
        limit: u32,
        created_after: Option<u64>,
    ) -> Page {
        let max_votes: u32 = env
            .storage()
            .instance()
            .get(&DataKey::MaxVotes)
            .unwrap_or(0);

        let (mut bucket, mut offset) = match cursor {
            Some(c) => (c.bucket, c.offset),
            None => (max_votes, 0),
        };

        let mut ideas = vec![env];
        let mut scanned: u32 = 0;

        loop {
            let bucket_ids: Vec<u32> = env
                .storage()
                .persistent()
                .get(&DataKey::VoteBucket(bucket))
                .unwrap_or(vec![env]);

            while offset < bucket_ids.len() {
                let id = bucket_ids.get(offset).unwrap();
                offset += 1;
                scanned += 1;

                let idea: IdeaData = env.storage().persistent().get(&DataKey::Idea(id)).unwrap();
                if created_after.map_or(true, |cutoff| idea.created >= cutoff) {
                    ideas.push_back(idea);
                }

                if ideas.len() >= limit || scanned >= TRENDING_SCAN_CAP {
                    let (has_more, next_cursor) = Self::normalize_cursor(
                        env,
                        Cursor {
                            bucket,
                            offset,
                            last_id: 0,
                        },
                    );
                    return Page {
                        ideas,
                        has_more,
                        next_cursor,
                    };
                }
            }

            offset = 0;
            if bucket == 0 {
                return Page {
                    ideas,
                    has_more: false,
                    next_cursor: Cursor {
                        bucket: 0,
                        offset: 0,
                        last_id: 0,
                    },
                };
            }
            bucket -= 1;
        }
    }

    /// Advances a bucket/offset cursor past any now-empty trailing buckets
    /// so callers don't get a "next page" that turns out to be empty.
    /// Returns (has_more, cursor) — cursor is only meaningful when has_more is true.
    fn normalize_cursor(env: &Env, cursor: Cursor) -> (bool, Cursor) {
        let mut c = cursor;
        loop {
            let bucket_ids: Vec<u32> = env
                .storage()
                .persistent()
                .get(&DataKey::VoteBucket(c.bucket))
                .unwrap_or(vec![env]);
            if c.offset < bucket_ids.len() {
                return (true, c);
            }
            if c.bucket == 0 {
                return (
                    false,
                    Cursor {
                        bucket: 0,
                        offset: 0,
                        last_id: 0,
                    },
                );
            }
            c.bucket -= 1;
            c.offset = 0;
        }
    }

    fn add_to_vote_bucket(env: &Env, votes: u32, idea_id: u32) {
        let key = DataKey::VoteBucket(votes);
        let mut ids: Vec<u32> = env.storage().persistent().get(&key).unwrap_or(vec![env]);
        ids.push_back(idea_id);
        env.storage().persistent().set(&key, &ids);
    }

    fn remove_from_vote_bucket(env: &Env, votes: u32, idea_id: u32) {
        let key = DataKey::VoteBucket(votes);
        let mut ids: Vec<u32> = env.storage().persistent().get(&key).unwrap_or(vec![env]);
        if let Some(pos) = ids.iter().position(|id| id == idea_id) {
            ids.remove(pos as u32);
            env.storage().persistent().set(&key, &ids);
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::Ledger;

    fn client(env: &Env) -> HelloContractClient<'_> {
        let contract_id = env.register(HelloContract, ());
        HelloContractClient::new(env, &contract_id)
    }

    fn mk_idea(env: &Env, cl: &HelloContractClient) -> u32 {
        cl.create_idea(
            &String::from_str(env, "title"),
            &String::from_str(env, "content"),
            &String::from_str(env, "author"),
            &false,
            &vec![env],
        )
    }

    #[test]
    fn create_and_get_idea_roundtrip() {
        let env = Env::default();
        let cl = client(&env);
        let id = mk_idea(&env, &cl);
        let idea = cl.get_idea(&id);
        assert_eq!(idea.id, id);
        assert_eq!(idea.votes, 0);
    }

    #[test]
    fn vote_idea_up_and_down() {
        let env = Env::default();
        let cl = client(&env);
        let id = mk_idea(&env, &cl);
        cl.vote_idea(&id, &true);
        cl.vote_idea(&id, &true);
        assert_eq!(cl.get_idea(&id).votes, 2);
        cl.vote_idea(&id, &false);
        assert_eq!(cl.get_idea(&id).votes, 1);
    }

    #[test]
    fn vote_idea_cannot_go_below_zero() {
        let env = Env::default();
        let cl = client(&env);
        let id = mk_idea(&env, &cl);
        cl.vote_idea(&id, &false);
        assert_eq!(cl.get_idea(&id).votes, 0);
    }

    #[test]
    fn newest_pagination_covers_all_no_dupes_descending() {
        let env = Env::default();
        let cl = client(&env);
        for _ in 0..25 {
            mk_idea(&env, &cl);
        }

        let mut seen: Vec<u32> = vec![&env];
        let mut cursor: Option<Cursor> = None;
        loop {
            let page = cl.get_ideas_paginated(&SortBy::Newest, &cursor, &7);
            for idea in page.ideas.iter() {
                seen.push_back(idea.id);
            }
            if !page.has_more {
                break;
            }
            cursor = Some(page.next_cursor);
        }

        assert_eq!(seen.len(), 25);
        let mut w = 0u32;
        while w < seen.len() - 1 {
            assert!(seen.get(w).unwrap() > seen.get(w + 1).unwrap());
            w += 1;
        }
    }

    #[test]
    fn most_votes_pagination_non_increasing_and_complete() {
        let env = Env::default();
        let cl = client(&env);
        let votes_plan = [5u32, 5, 3, 3, 3, 1, 0, 0, 8, 2];
        for &v in votes_plan.iter() {
            let id = mk_idea(&env, &cl);
            for _ in 0..v {
                cl.vote_idea(&id, &true);
            }
        }

        let mut seen_votes: Vec<u32> = vec![&env];
        let mut cursor: Option<Cursor> = None;
        loop {
            let page = cl.get_ideas_paginated(&SortBy::MostVotes, &cursor, &3);
            for idea in page.ideas.iter() {
                seen_votes.push_back(idea.votes);
            }
            if !page.has_more {
                break;
            }
            cursor = Some(page.next_cursor);
        }

        assert_eq!(seen_votes.len(), 10);
        let mut w = 0u32;
        while w < seen_votes.len() - 1 {
            assert!(seen_votes.get(w).unwrap() >= seen_votes.get(w + 1).unwrap());
            w += 1;
        }
    }

    #[test]
    fn vote_change_reorders_most_votes_ranking() {
        let env = Env::default();
        let cl = client(&env);
        let a = mk_idea(&env, &cl);
        let b = mk_idea(&env, &cl);
        let c = mk_idea(&env, &cl);
        cl.vote_idea(&a, &true);
        cl.vote_idea(&a, &true);
        cl.vote_idea(&b, &true);

        let page = cl.get_ideas_paginated(&SortBy::MostVotes, &None, &10);
        assert_eq!(page.ideas.get(0).unwrap().id, a);
        assert_eq!(page.ideas.get(1).unwrap().id, b);
        assert_eq!(page.ideas.get(2).unwrap().id, c);

        cl.vote_idea(&c, &true);
        cl.vote_idea(&c, &true);
        cl.vote_idea(&c, &true);

        let page2 = cl.get_ideas_paginated(&SortBy::MostVotes, &None, &10);
        assert_eq!(page2.ideas.get(0).unwrap().id, c);
    }

    #[test]
    fn trending_excludes_old_ideas_outside_window() {
        let env = Env::default();
        let cl = client(&env);

        // "old" idea created at day 0 — outside the 7-day trending window
        env.ledger().with_mut(|li| li.timestamp = 0);
        let old = mk_idea(&env, &cl);
        for _ in 0..10 {
            cl.vote_idea(&old, &true);
        }

        // "recent" idea created at day 10 (now)
        env.ledger().with_mut(|li| li.timestamp = 10 * 24 * 60 * 60);
        let recent = mk_idea(&env, &cl);
        cl.vote_idea(&recent, &true);

        let all = cl.get_ideas_paginated(&SortBy::MostVotes, &None, &10);
        assert_eq!(all.ideas.get(0).unwrap().id, old);

        let trending = cl.get_ideas_paginated(&SortBy::Trending, &None, &10);
        assert_eq!(trending.ideas.len(), 1);
        assert_eq!(trending.ideas.get(0).unwrap().id, recent);
    }

    #[test]
    fn page_limit_is_capped_at_max() {
        let env = Env::default();
        let cl = client(&env);
        let mut i = 0;
        while i < MAX_PAGE_LIMIT + 10 {
            mk_idea(&env, &cl);
            i += 1;
        }
        let page = cl.get_ideas_paginated(&SortBy::Newest, &None, &(MAX_PAGE_LIMIT + 10));
        assert_eq!(page.ideas.len(), MAX_PAGE_LIMIT);
    }

    #[test]
    fn large_dataset_pagination_is_complete() {
        let env = Env::default();
        let cl = client(&env);
        let total = 300u32; // kept modest for test runtime; cost per call is O(page), not O(total)
        let mut i = 0;
        while i < total {
            mk_idea(&env, &cl);
            i += 1;
        }

        let mut count = 0u32;
        let mut cursor: Option<Cursor> = None;
        loop {
            let page = cl.get_ideas_paginated(&SortBy::Newest, &cursor, &MAX_PAGE_LIMIT);
            count += page.ideas.len();
            if !page.has_more {
                break;
            }
            cursor = Some(page.next_cursor);
        }
        assert_eq!(count, total);
    }

    #[test]
    fn empty_storage_returns_empty_page() {
        let env = Env::default();
        let cl = client(&env);
        let page = cl.get_ideas_paginated(&SortBy::Newest, &None, &10);
        assert_eq!(page.ideas.len(), 0);
        assert!(!page.has_more);

        let page2 = cl.get_ideas_paginated(&SortBy::MostVotes, &None, &10);
        assert_eq!(page2.ideas.len(), 0);
        assert!(!page2.has_more);
    }
}
