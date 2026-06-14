#![no_std]
use soroban_sdk::{
    contract, contractimpl, vec, Env, String, Vec, symbol,
};

#[contract]
pub struct HelloContract;

#[contractimpl]
impl HelloContract {
    pub fn hello(env: Env, to: String) -> Vec<String> {
        vec![&env, String::from_str(&env, "Hello"), to]
    }

    pub fn create_idea(env: Env, title: String, content: String, author: String, is_premium: bool, tags: Vec<String>) -> u32 {
        let idea_id = env.prng().gen::<u32>();
        
        env.storage().instance().set(
            &symbol!("idea_").append(&idea_id),
            &IdeaData {
                title,
                content,
                author,
                is_premium,
                votes: 0,
                created: env.ledger().timestamp(),
                tags,
            }
        );
        
        idea_id
    }

    pub fn vote_idea(env: Env, idea_id: u32, voter: String, is_upvote: bool) {
        let key = symbol!("idea_").append(&idea_id);
        let mut idea: IdeaData = env.storage().instance().get(&key).unwrap();
        
        if is_upvote {
            idea.votes += 1;
        } else {
            idea.votes = idea.votes.saturating_sub(1);
        }
        
        env.storage().instance().set(&key, &idea);
    }

    pub fn get_idea(env: Env, idea_id: u32) -> IdeaData {
        let key = symbol!("idea_").append(&idea_id);
        env.storage().instance().get(&key).unwrap()
    }
}

#[derive(Clone, Debug, PartialEq, Eq, soroban_sdk::Encode, soroban_sdk::Decode)]
pub struct IdeaData {
    pub title: String,
    pub content: String,
    pub author: String,
    pub is_premium: bool,
    pub votes: i32,
    pub created: u64,
    pub tags: Vec<String>,
}