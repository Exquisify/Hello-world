#[starknet::contract]
mod HelloWorld {
    use starknet::get_caller_address;
    use starknet::ContractAddress;
    use starknet::contract_address_const;
    use array::ArrayTrait;
    use option::OptionTrait;
    use traits::Into;
    use traits::TryInto;
    use box::BoxTrait;
    use zeroable::Zeroable;

    #[derive(Drop, Serde, starknet::Store)]
    struct Idea {
        id: u256,
        author: ContractAddress,
        title: felt252,
        content: felt252,
        timestamp: u64,
        votes: i64,
        is_premium: bool,
    }

    #[derive(Drop, Serde, starknet::Store)]
    struct Comment {
        id: u256,
        idea_id: u256,
        author: ContractAddress,
        content: felt252,
        timestamp: u64,
    }

    #[derive(Drop, Serde, starknet::Store)]
    struct User {
        address: ContractAddress,
        subscription_expiry: u64,
        is_registered: bool,
    }

    #[storage]
    struct Storage {
        ideas: LegacyMap<u256, Idea>,
        idea_count: u256,
        comments: LegacyMap<u256, Comment>,
        comment_count: u256,
        user_ideas: LegacyMap<(ContractAddress, u256), u256>,
        user_idea_count: LegacyMap<ContractAddress, u256>,
        users: LegacyMap<ContractAddress, User>,
        votes: LegacyMap<(ContractAddress, u256), i64>, // User, idea_id -> vote (-1, 0, 1)
        idea_tags: LegacyMap<(u256, felt252), bool>, // idea_id, tag -> exists
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        IdeaCreated: IdeaCreated,
        IdeaVoted: IdeaVoted,
        CommentAdded: CommentAdded,
        UserRegistered: UserRegistered,
        UserSubscribed: UserSubscribed,
    }

    #[derive(Drop, starknet::Event)]
    struct IdeaCreated {
        id: u256,
        author: ContractAddress,
        title: felt252,
        is_premium: bool,
    }

    #[derive(Drop, starknet::Event)]
    struct IdeaVoted {
        id: u256,
        voter: ContractAddress,
        direction: i64,
    }

    #[derive(Drop, starknet::Event)]
    struct CommentAdded {
        id: u256,
        idea_id: u256,
        author: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct UserRegistered {
        user: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct UserSubscribed {
        user: ContractAddress,
        expiry: u64,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.idea_count.write(0);
        self.comment_count.write(0);
    }

    #[external(v0)]
    impl HelloWorldImpl of super::IHelloWorld<ContractState> {
        fn register_user(ref self: ContractState) {
            let caller = get_caller_address();
            let user = self.users.read(caller);
            assert(!user.is_registered, "User already registered");

            self.users.write(
                caller,
                User {
                    address: caller,
                    subscription_expiry: 0,
                    is_registered: true,
                }
            );

            self.emit(Event::UserRegistered(UserRegistered { user: caller }));
        }

        fn subscribe(ref self: ContractState, duration_days: u64) {
            let caller = get_caller_address();
            let mut user = self.users.read(caller);
            assert(user.is_registered, "User not registered");

            // In a real contract, you would handle token transfers for payment here
            
            // Calculate new expiry (current timestamp + duration in seconds)
            // Note: In a real contract, you would use block timestamp
            let current_time: u64 = starknet::get_block_timestamp();
            let seconds_in_day: u64 = 86400;
            let duration_seconds: u64 = duration_days * seconds_in_day;
            
            let new_expiry = if user.subscription_expiry > current_time {
                user.subscription_expiry + duration_seconds
            } else {
                current_time + duration_seconds
            };

            user.subscription_expiry = new_expiry;
            self.users.write(caller, user);

            self.emit(Event::UserSubscribed(UserSubscribed { user: caller, expiry: new_expiry }));
        }

        fn create_idea(
            ref self: ContractState, title: felt252, content: felt252, is_premium: bool, tags: Array<felt252>
        ) -> u256 {
            let caller = get_caller_address();
            let user = self.users.read(caller);
            assert(user.is_registered, "User not registered");

            // If premium content, check subscription
            if is_premium {
                let current_time: u64 = starknet::get_block_timestamp();
                assert(user.subscription_expiry > current_time, "Premium subscription required");
            }

            let idea_id = self.idea_count.read() + 1;
            self.idea_count.write(idea_id);

            let timestamp: u64 = starknet::get_block_timestamp();

            let idea = Idea {
                id: idea_id,
                author: caller,
                title: title,
                content: content,
                timestamp: timestamp,
                votes: 0,
                is_premium: is_premium,
            };

            self.ideas.write(idea_id, idea);

            // Store tags
            let mut i: u32 = 0;
            let tags_len = tags.len();
            loop {
                if i >= tags_len {
                    break;
                }
                let tag = *tags.at(i);
                self.idea_tags.write((idea_id, tag), true);
                i += 1;
            };

            // Add to user's ideas
            let user_idea_count = self.user_idea_count.read(caller);
            self.user_idea_count.write(caller, user_idea_count + 1);
            self.user_ideas.write((caller, user_idea_count), idea_id);

            self.emit(
                Event::IdeaCreated(
                    IdeaCreated { id: idea_id, author: caller, title: title, is_premium: is_premium }
                )
            );

            idea_id
        }

        fn vote_idea(ref self: ContractState, idea_id: u256, direction: i64) {
            let caller = get_caller_address();
            let user = self.users.read(caller);
            assert(user.is_registered, "User not registered");

            // Validate idea exists
            let mut idea = self.ideas.read(idea_id);
            assert(idea.id == idea_id, "Idea does not exist");

            // Check if premium and user has subscription
            if idea.is_premium {
                let current_time: u64 = starknet::get_block_timestamp();
                assert(user.subscription_expiry > current_time, "Premium subscription required to vote on premium content");
            }

            // Validate direction (-1 for downvote, 1 for upvote, 0 to remove vote)
            assert(direction >= -1 && direction <= 1, "Invalid vote direction");

            // Get previous vote
            let previous_vote = self.votes.read((caller, idea_id));

            // Update idea votes
            idea.votes = idea.votes - previous_vote + direction;
            self.ideas.write(idea_id, idea);

            // Update user vote
            self.votes.write((caller, idea_id), direction);

            self.emit(Event::IdeaVoted(IdeaVoted { id: idea_id, voter: caller, direction: direction }));
        }

        fn add_comment(ref self: ContractState, idea_id: u256, content: felt252) -> u256 {
            let caller = get_caller_address();
            let user = self.users.read(caller);
            assert(user.is_registered, "User not registered");

            // Validate idea exists
            let idea = self.ideas.read(idea_id);
            assert(idea.id == idea_id, "Idea does not exist");

            // Check if premium and user has subscription
            if idea.is_premium {
                let current_time: u64 = starknet::get_block_timestamp();
                assert(user.subscription_expiry > current_time, "Premium subscription required to comment on premium content");
            }

            let comment_id = self.comment_count.read() + 1;
            self.comment_count.write(comment_id);

            let timestamp: u64 = starknet::get_block_timestamp();

            let comment = Comment {
                id: comment_id,
                idea_id: idea_id,
                author: caller,
                content: content,
                timestamp: timestamp,
            };

            self.comments.write(comment_id, comment);

            self.emit(
                Event::CommentAdded(CommentAdded { id: comment_id, idea_id: idea_id, author: caller })
            );

            comment_id
        }

        fn get_idea(self: @ContractState, idea_id: u256) -> Idea {
            let idea = self.ideas.read(idea_id);
            assert(idea.id == idea_id, "Idea does not exist");
            
            // If premium, check caller's subscription
            if idea.is_premium {
                let caller = get_caller_address();
                let user = self.users.read(caller);
                let current_time: u64 = starknet::get_block_timestamp();
                
                // Allow author to view their own premium content
                if caller != idea.author {
                    assert(user.subscription_expiry > current_time, "Premium subscription required");
                }
            }
            
            idea
        }

        fn is_subscribed(self: @ContractState, user_address: ContractAddress) -> (bool, u64) {
            let user = self.users.read(user_address);
            let current_time: u64 = starknet::get_block_timestamp();
            
            (user.subscription_expiry > current_time, user.subscription_expiry)
        }

        fn get_user_ideas(self: @ContractState, user_address: ContractAddress) -> Array<u256> {
            let count = self.user_idea_count.read(user_address);
            let mut result = ArrayTrait::new();
            
            let mut i: u256 = 0;
            loop {
                if i >= count {
                    break;
                }
                let idea_id = self.user_ideas.read((user_address, i));
                result.append(idea_id);
                i += 1;
            };
            
            result
        }
    }
}

#[starknet::interface]
trait IHelloWorld<TContractState> {
    fn register_user(ref self: TContractState);
    fn subscribe(ref self: TContractState, duration_days: u64);
    fn create_idea(
        ref self: TContractState, title: felt252, content: felt252, is_premium: bool, tags: Array<felt252>
    ) -> u256;
    fn vote_idea(ref self: TContractState, idea_id: u256, direction: i64);
    fn add_comment(ref self: TContractState, idea_id: u256, content: felt252) -> u256;
    fn get_idea(self: @TContractState, idea_id: u256) -> HelloWorld::Idea;
    fn is_subscribed(self: @TContractState, user_address: ContractAddress) -> (bool, u64);
    fn get_user_ideas(self: @TContractState, user_address: ContractAddress) -> Array<u256>;
}