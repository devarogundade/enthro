module enthro::tokens {
    // ============== Imports ============== //

    use std::option;
    use std::signer;
    use std::string::{Self, String};
    use std::vector;
    use aptos_framework::event;
    use aptos_framework::object::{Self, Object};
    use aptos_token_objects::collection;
    use aptos_token_objects::token;   

    friend enthro::main;

    public(friend) fun create_collection(
        sender: &signer,
        description: String,
        name: String,
        website_uri: String
    ) {
        collection::create_unlimited_collection(
            sender,
            description,
            name,
            option::none(),
            website_uri
        );
    }

    public(friend) fun create_token(
        sender: &signer,
        collection: String,
        description: String,
        name: String,
        token_uri: String,
        receiver: address,
    ): address {      
        let sender_addresss = signer::address_of(sender);

        token::create_named_token(
            sender,
            collection,
            description,
            name,
            option::none(),
            token_uri
        );

        let token_addr = token::create_token_address(
            &sender_addresss,
            &collection,
            &name
        );

        let token_obj = object::address_to_object<token::Token>(token_addr);

        object::transfer(sender, token_obj, receiver);

        token_addr
    }

    #[view]
    public fun get_token_obj(
        creator_addresss: address,
        collection: String,
        name: String
    ): Object<token::Token> {
        let token_addr = token::create_token_address(
            &creator_addresss,
            &collection,
            &name
        );

        object::address_to_object<token::Token>(token_addr)
    }

}