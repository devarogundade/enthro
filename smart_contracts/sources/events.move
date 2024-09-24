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
    struct ClaimEarningsEvent has drop, store {
        streamer_address: address,
        amount: u64
    }

    #[event]
    struct TipEvent has drop, store {
        streamer_address: address,
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

    public(friend) fun claim_earnings_event(
        streamer_address: address,
        amount: u64
    ) {
        event::emit(ClaimEarningsEvent {
            streamer_address,
            amount
        });
    }

    public(friend) fun tip_event(
        streamer_address: address,
        sender_address: address,
        amount: u64
    ) {
        event::emit(TipEvent {
            streamer_address,
            sender_address,
            amount
        });
    }
}