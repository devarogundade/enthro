module enthro::main {
    // ============== Imports ============== //

    use std::option::{Self, Option};
    use std::signer;
    use std::string::{Self, String};
    use std::vector;
    use aptos_framework::account::{Self, SignerCapability};
    use aptos_framework::coin::{Self, CoinStore};
    use aptos_framework::fungible_asset::{Self, Metadata};
    use aptos_framework::object::{Self, Object};
    use aptos_std::table::{Self, Table};
    use std::error;
    use std::bcs;
    use aptos_framework::timestamp;

    use enthro::tokens;
    use enthro::assets;
    use enthro::events;

    const E_ALREADY_EXISTS: u64 = 500;
    const E_NOT_ENOUGH: u64 = 501;
    const E_NOT_ALLOWED: u64 = 502;

    const VISIBILITY_PUBLIC: u64 = 0;
    const VISIBILITY_FOLLOWERS: u64 = 1;
    const VISIBILITY_S_FOLLOWERS: u64 = 2;

    struct Stream has key {
        title: String,
        description: String,
        thumbnail: String,
        start_secs: u64,
        live: bool,
        visibility: u64,
        claimed_tipped_amount: u64,
        unclaimed_tipped_amount: u64,
        timestamp: u64,
        owner: address,
        tips: bool,
        creator: address,
        media_key: MediaKey
    }

    struct Video has key {
        title: String,
        description: String,
        thumbnail: String,
        visibility: u64,
        claimed_tipped_amount: u64,
        unclaimed_tipped_amount: u64,
        timestamp: u64,
        owner: address,
        tips: bool,
        creator: address,
        media_key: MediaKey
    }

    struct Streamer has key {
        followers_collection: String,
        s_followers_collection: String,
        s_follow_amount: u64,
        unclaimed_apt: u64,
        claimed_apt: u64,
        channel: Channel
    }

    struct Channel has copy, drop, store {
        name: String,
        about: String,
        image: String,
        cover: String
    }

    struct MediaKey has copy, drop, store {
        collection: String,
        token: String
    }

    struct EnthroState has key {
        admin_address: Option<address>,
        enthro_coin: Option<Object<Metadata>>,       
        signer_cap: SignerCapability
    }

    fun init_module(enthro: &signer) {
        
        let (res_signer, res_signer_cap) = account::create_resource_account(enthro, b"Enthro");

        // create enthro collection
        tokens::create_collection(
            &res_signer, 
            string::utf8(b"Enthro Collection"), 
            string::utf8(b"Enthro"), 
            string::utf8(b"https://enthro.xyz")
        );

        let state = EnthroState {
            admin_address: option::none(),
            enthro_coin: option::none(),
            signer_cap: res_signer_cap
        };

        move_to(enthro, state);
    }

    public entry fun init_state<AptosCoin>(admin: &signer, enthro_coin: Object<Metadata>) acquires EnthroState {
        let admin_address = signer::address_of(admin);

        let state = borrow_global_mut<EnthroState>(@enthro);
        state.admin_address = option::some(admin_address);
        state.enthro_coin = option::some(enthro_coin);

        coin::register<AptosCoin>(admin);
    }

    public entry fun create_streamer(
        sender: &signer,
        name: String,
        about: String,
        image: String,
        cover: String,
        followers_collection: String,
        s_followers_collection: String,
        s_follow_amount: u64,
        website_uri: String
    ) acquires EnthroState {
        let state = borrow_global<EnthroState>(@enthro);
        let res_signer = &account::create_signer_with_capability(&state.signer_cap);

        // create followers collection
        tokens::create_collection(res_signer, about, followers_collection, website_uri);

        // create super followers collection
        tokens::create_collection(res_signer, about, s_followers_collection, website_uri);

        let channel = Channel {
            name,
            about,
            image,
            cover
        };

        let streamer = Streamer {
            followers_collection,
            s_followers_collection, 
            s_follow_amount, 
            unclaimed_apt: 0,
            claimed_apt: 0,
            channel 
        };

        move_to(sender, streamer);
    }

    public entry fun start_stream(
        sender: &signer,
        title: String,
        description: String,
        token_uri: String,
        visibility: u64,
        tips: bool,
        thumbnail: String,
        start_secs: u64,
    ) acquires Streamer, EnthroState {
        let state = borrow_global<EnthroState>(@enthro);
        let res_signer = &account::create_signer_with_capability(&state.signer_cap);

        let sender_address = signer::address_of(sender);

        let streamer = borrow_global<Streamer>(sender_address);

        let seed = b"Stream_";
        vector::append(&mut seed, bcs::to_bytes(&title));
        let (stream_signer,_) = account::create_resource_account(sender, seed);

        let stream_address = signer::address_of(&stream_signer);
        assert!(!exists<Stream>(stream_address), error::invalid_argument(E_ALREADY_EXISTS));

        let collection = string::utf8(b"Enthro Collection");

        let token_id = tokens::create_token(
            res_signer, 
            collection, 
            description, 
            title, 
            token_uri, 
            sender_address
        );

        let media_key = MediaKey {
            collection,
            token: title
        };

        let stream = Stream {
            title,
            description,
            thumbnail,
            start_secs,
            live: false,
            visibility,
            claimed_tipped_amount: 0,
            unclaimed_tipped_amount: 0,
            timestamp: timestamp::now_seconds(),
            owner: stream_address,
            tips,
            creator: sender_address,
            media_key
        };

        move_to(&stream_signer, stream);

        events::start_stream_event(
            sender_address,
            stream_address,
            token_id
        );
    }

    public entry fun upload_video(
        sender: &signer,
        title: String,
        description: String,
        token_uri: String,
        visibility: u64,
        tips: bool,
        thumbnail: String,
    ) acquires Streamer, EnthroState {
        let state = borrow_global<EnthroState>(@enthro);
        let res_signer = &account::create_signer_with_capability(&state.signer_cap);

        let sender_address = signer::address_of(sender);

        let streamer = borrow_global<Streamer>(sender_address);

        let seed = b"Video_";
        vector::append(&mut seed, bcs::to_bytes(&title));
        let (video_signer,_) = account::create_resource_account(sender, seed);

        let video_address = signer::address_of(&video_signer);
        assert!(!exists<Video>(video_address), error::invalid_argument(E_ALREADY_EXISTS));

        let collection = if (visibility == VISIBILITY_S_FOLLOWERS) {
            streamer.s_followers_collection
        } else {
            streamer.followers_collection
        };

        let token_id = tokens::create_token(
            res_signer, 
            collection,
            description,
            title,
            token_uri,
            sender_address
        );

        let media_key = MediaKey {
            collection,
            token: title
        };

        let video = Video {
            title,
            description,
            thumbnail,
            visibility,
            claimed_tipped_amount: 0,
            unclaimed_tipped_amount: 0,
            timestamp: timestamp::now_seconds(),
            owner: sender_address,
            tips,
            creator: sender_address,
            media_key
        };

        move_to(&video_signer, video);

        events::upload_video_event(
            sender_address,
            video_address,
            token_id
        );
    }

    public entry fun follow_streamer<AptosCoin>(
        sender: &signer,
        streamer_address: address,
        visibility: u64
    ) acquires Streamer, EnthroState {
        let state = borrow_global<EnthroState>(@enthro);
        let res_signer = &account::create_signer_with_capability(&state.signer_cap);

        let sender_address = signer::address_of(sender);

        let streamer = borrow_global_mut<Streamer>(streamer_address);

        let collection = if (visibility == VISIBILITY_S_FOLLOWERS) {
            // tranfer apt to contract
            coin::transfer<AptosCoin>(
                sender,
                signer::address_of(res_signer),
                streamer.s_follow_amount
            );

            streamer.unclaimed_apt = streamer.unclaimed_apt + streamer.s_follow_amount;

            streamer.s_followers_collection
        } else {
            streamer.followers_collection
        };

        // mint collection token
        tokens::create_token(
            sender, 
            collection,
            streamer.channel.about, 
            streamer.channel.name, 
            streamer.channel.image, 
            sender_address
        );
    }

    public entry fun tip_stream(
        sender: &signer,
        stream_address: address,
        amount: u64
    ) acquires Stream, EnthroState {
        let sender_address = signer::address_of(sender);

        let stream = borrow_global_mut<Stream>(stream_address);

        let state = borrow_global<EnthroState>(@enthro);
        let enthro_coin = *option::borrow(&state.enthro_coin);   

        assets::deposit_enthro(sender, enthro_coin, amount);

        stream.unclaimed_tipped_amount = stream.unclaimed_tipped_amount + amount;
        
        events::tip_stream_event(
            stream_address,
            sender_address,
            amount
        );
    }

    public entry fun tip_video(
        sender: &signer,
        video_address: address,
        amount: u64
    ) acquires Video, EnthroState {
        let sender_address = signer::address_of(sender);

        let video = borrow_global_mut<Video>(video_address);

        let state = borrow_global<EnthroState>(@enthro);
        let enthro_coin = *option::borrow(&state.enthro_coin);   

        assets::deposit_enthro(sender, enthro_coin, amount);

        video.unclaimed_tipped_amount = video.unclaimed_tipped_amount + amount;
        
        events::tip_video_event(
            video_address,
            sender_address,
            amount
        );
    }

    public entry fun transfer_stream(
        sender: &signer,
        stream_address: address,
        receiver: address
    ) acquires Stream, EnthroState {
        let state = borrow_global<EnthroState>(@enthro);
        let res_signer = &account::create_signer_with_capability(&state.signer_cap);

        let sender_address = signer::address_of(sender);

        let stream = borrow_global_mut<Stream>(stream_address);

        let token_obj = tokens::get_token_obj(
            signer::address_of(res_signer),
            stream.media_key.collection,
            stream.media_key.token
        );

        // check if the sender owned the stream token
        assert!(object::owner(token_obj) == sender_address, error::invalid_argument(E_NOT_ALLOWED));

        stream.owner = receiver;

        // transfer the stream token to receiver
        object::transfer(sender, token_obj, receiver);
    }

    public entry fun transfer_video(
        sender: &signer,
        video_address: address,
        receiver: address
    ) acquires Video, EnthroState {
        let state = borrow_global<EnthroState>(@enthro);
        let res_signer = &account::create_signer_with_capability(&state.signer_cap);

        let sender_address = signer::address_of(sender);
        
        let video = borrow_global_mut<Video>(video_address);

        let token_obj = tokens::get_token_obj(
            signer::address_of(res_signer),
            video.media_key.collection,
            video.media_key.token
        );

        // check if the sender owned the video token
        assert!(object::owner(token_obj) == sender_address, E_NOT_ALLOWED);

        video.owner = receiver;

        // transfer the video token to receiver
        object::transfer(sender, token_obj, receiver);
    }

    public entry fun claim_earnings<AptosCoin>(
        sender: &signer,
        amount: u64
    ) acquires Streamer, EnthroState  {
        let state = borrow_global<EnthroState>(@enthro);
        let res_signer = &account::create_signer_with_capability(&state.signer_cap);

        let sender_address = signer::address_of(sender);

        let streamer = borrow_global_mut<Streamer>(sender_address);

        assert!(streamer.unclaimed_apt >= amount, error::invalid_argument(E_NOT_ENOUGH));

        coin::transfer<AptosCoin>(
            res_signer,
            sender_address,
            amount
        );

        streamer.unclaimed_apt = streamer.unclaimed_apt - amount;
        streamer.claimed_apt = streamer.claimed_apt + amount;
    }

    public entry fun claim_stream_tips(
        sender: &signer,
        stream_address: address,
        amount: u64
    ) acquires Stream, EnthroState {
        let state = borrow_global<EnthroState>(@enthro);
        let res_signer = &account::create_signer_with_capability(&state.signer_cap);

        let sender_address = signer::address_of(sender);

        let stream = borrow_global_mut<Stream>(stream_address);

        assert!(stream.unclaimed_tipped_amount <= amount, error::invalid_argument(E_NOT_ENOUGH));

        let token_obj = tokens::get_token_obj(
            signer::address_of(res_signer),
            stream.media_key.collection,
            stream.media_key.token
        );

        // check if the sender owned the stream token
        assert!(object::owner(token_obj) == sender_address, error::invalid_argument(E_NOT_ALLOWED));

        stream.claimed_tipped_amount = stream.claimed_tipped_amount + amount;
        stream.unclaimed_tipped_amount = stream.unclaimed_tipped_amount - amount;

        events::claim_stream_earnings_event(
            stream_address,
            sender_address,
            amount
        );
    }

    public entry fun claim_video_tips(
        sender: &signer,
        video_address: address,
        amount: u64
    ) acquires Video, EnthroState {
        let state = borrow_global<EnthroState>(@enthro);
        let res_signer = &account::create_signer_with_capability(&state.signer_cap);

        let sender_address = signer::address_of(sender);

        let video = borrow_global_mut<Video>(video_address);

        assert!(video.unclaimed_tipped_amount <= amount, error::invalid_argument(E_NOT_ENOUGH));

        let token_obj = tokens::get_token_obj(
            signer::address_of(res_signer),
            video.media_key.collection,
            video.media_key.token
        );

        // check if the sender owned the video token
        assert!(object::owner(token_obj) == sender_address, error::invalid_argument(E_NOT_ALLOWED));

        video.claimed_tipped_amount = video.claimed_tipped_amount + amount;
        video.unclaimed_tipped_amount = video.unclaimed_tipped_amount - amount;

        events::claim_video_earnings_event(
            video_address,
            sender_address,
            amount
        );
    }

    #[view]
    public fun get_earnings(
        streamer_address: address
    ): (u64, u64) acquires Streamer {
        let streamer = borrow_global<Streamer>(streamer_address);
        (streamer.unclaimed_apt, streamer.claimed_apt)
    }

    #[view]
    public fun get_stream_tips(
        stream_address: address
    ): (u64, u64) acquires Stream {
        let stream = borrow_global<Stream>(stream_address);
        (stream.unclaimed_tipped_amount, stream.claimed_tipped_amount)
    }
    
    #[view]
    public fun get_video_tips(
        video_address: address
    ): (u64, u64) acquires Video {
        let video = borrow_global<Video>(video_address);
        (video.unclaimed_tipped_amount, video.claimed_tipped_amount)
    }
}