module enthro::events {
    use aptos_framework::event;
    
    friend enthro::main;

    #[event]
    struct StartStreamEvent has drop, store {
        streamer_address: address,
        stream_address: address,
        token_id: address
    }

    #[event]
    struct UploadVideoEvent has drop, store {
        streamer_address: address,
        video_address: address,
        token_id: address
    }

    #[event]
    struct ClaimStreamEarningsEvent has drop, store {
        stream_address: address,
        sender_address: address,
        amount: u64
    }

    #[event]
    struct ClaimVideoEarningsEvent has drop, store {
        video_address: address,
        sender_address: address,
        amount: u64
    }

    #[event]
    struct TipStreamEvent has drop, store {
        stream_address: address,
        sender_address: address,
        amount: u64
    }

    #[event]
    struct TipVideoEvent has drop, store {
        video_address: address,
        sender_address: address,
        amount: u64
    }

    public(friend) fun start_stream_event(
        streamer_address: address,
        stream_address: address,
        token_id: address
    ) {
        event::emit(StartStreamEvent {
            streamer_address,
            stream_address,
            token_id
        });
    }

    public(friend) fun upload_video_event(
        streamer_address: address,
        video_address: address,
        token_id: address
    ) {
        event::emit(UploadVideoEvent {
            streamer_address,
            video_address,
            token_id
        });
    }

    public(friend) fun claim_stream_earnings_event(
        stream_address: address,
        sender_address: address,
        amount: u64
    ) {
        event::emit(ClaimStreamEarningsEvent {
            stream_address,
            sender_address,
            amount
        });
    }
    
    public(friend) fun claim_video_earnings_event(
        video_address: address,
        sender_address: address,
        amount: u64
    ) {
        event::emit(ClaimVideoEarningsEvent {
            video_address,
            sender_address,
            amount
        });
    }

    public(friend) fun tip_stream_event(
        stream_address: address,
        sender_address: address,
        amount: u64
    ) {
        event::emit(TipStreamEvent {
            stream_address,
            sender_address,
            amount
        });
    }

    public(friend) fun tip_video_event(
        video_address: address,
        sender_address: address,
        amount: u64
    ) {
        event::emit(TipVideoEvent {
            video_address,
            sender_address,
            amount
        });
    }
}