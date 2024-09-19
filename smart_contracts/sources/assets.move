module enthro::assets {    
    use std::option::{Self, Option};
    use std::signer;
    use aptos_framework::fungible_asset::{Self, Metadata, FungibleStore};
    use aptos_framework::object::{Self, Object};
    use aptos_framework::primary_fungible_store;
    use std::string::{Self, String};
    use aptos_framework::event;

    const T_SUPPLY: u64 = 1_000_000_000_000_000;

    friend enthro::main;

    #[event]
    struct MintFAEvent has store, drop {
        fa_obj_addr: address,
        amount: u64,
        recipient_addr: address,
    }

    struct FAController has key {
        mint_ref: fungible_asset::MintRef,
        burn_ref: fungible_asset::BurnRef,
        transfer_ref: fungible_asset::TransferRef,
        enthro_store: Object<FungibleStore>
    }

    fun init_module(enthro: &signer) {
        // create enthro coins
        let thub_metadata = create_fungible_asset_internal(
            enthro,
            option::some((T_SUPPLY as u128)),
            string::utf8(b"Enthro Coin"),
            string::utf8(b"ENTR"),
            8,
            string::utf8(b"https://enthro.xyz/images/enthro.png"),
            string::utf8(b"https://enthro.xyz")
        );
    }

    public(friend) fun deposit_enthro(
        sender: &signer,
        fa: Object<fungible_asset::Metadata>,
        amount: u64
    ) acquires FAController {
        let fa_obj_addr = object::object_address(&fa);
        let config = borrow_global<FAController>(fa_obj_addr);

        let sender_address = signer::address_of(sender);

        let sender_store = primary_fungible_store::ensure_primary_store_exists(
            sender_address,
            fa
        );

        fungible_asset::transfer(
            sender,
            sender_store,
            config.enthro_store,
            amount
        );
    }

    public(friend) fun transfer_enthro(
        fa: Object<fungible_asset::Metadata>,
        receiver: address,
        amount: u64
    ) acquires FAController {
        let fa_obj_addr = object::object_address(&fa);
        let config = borrow_global<FAController>(fa_obj_addr);

        let receiver_store = primary_fungible_store::ensure_primary_store_exists(
            receiver,
            fa
        );

        fungible_asset::transfer_with_ref(
            &config.transfer_ref,
            config.enthro_store,
            receiver_store,
            amount
        );
    }

    public entry fun mint_fungible_asset(
        sender: &signer,
        fa: Object<fungible_asset::Metadata>,
        amount: u64
    ) acquires FAController {
        let sender_addr = signer::address_of(sender);
        let fa_obj_addr = object::object_address(&fa);
        let config = borrow_global<FAController>(fa_obj_addr);
        primary_fungible_store::mint(&config.mint_ref, sender_addr, amount);
        event::emit(MintFAEvent {
            fa_obj_addr,
            amount,
            recipient_addr: sender_addr,
        });
    }

    fun create_fungible_asset_internal(
        sender: &signer,
        max_supply: option::Option<u128>,
        name: String,
        symbol: String,
        decimals: u8,
        icon_uri: String,
        project_uri: String
    ): Object<fungible_asset::Metadata> {
        let fa_obj_constructor_ref = &object::create_sticky_object(@enthro);
        let fa_obj_signer = object::generate_signer(fa_obj_constructor_ref);
        let fa_obj_addr = signer::address_of(&fa_obj_signer);

        primary_fungible_store::create_primary_store_enabled_fungible_asset(
            fa_obj_constructor_ref,
            max_supply,
            name,
            symbol,
            decimals,
            icon_uri,
            project_uri
        );

        let sender_address = signer::address_of(sender);
        let metadata_obj = object::address_to_object(fa_obj_addr);

        let mint_ref = fungible_asset::generate_mint_ref(fa_obj_constructor_ref);
        let burn_ref = fungible_asset::generate_burn_ref(fa_obj_constructor_ref);
        let transfer_ref = fungible_asset::generate_transfer_ref(fa_obj_constructor_ref);
        let enthro_store = primary_fungible_store::ensure_primary_store_exists(
            sender_address, 
            metadata_obj
        );

        move_to(&fa_obj_signer, FAController {
            mint_ref,
            burn_ref,
            transfer_ref,
            enthro_store
        });

        metadata_obj
    }

}