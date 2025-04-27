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