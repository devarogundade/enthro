module enthro::assets {    
    use std::option::{Self, Option};
    use std::signer;
    use aptos_framework::fungible_asset::{Self, Metadata, FungibleStore};
    use aptos_framework::object::{Self, Object};
    use aptos_framework::primary_fungible_store;
    use std::string::{Self, String};
    use aptos_framework::event;
    use aptos_framework::account::{Self, SignerCapability};

    const T_SUPPLY: u64 = 1_000_000_000_000_000;

    friend enthro::main;

    struct FAController has key {
        mint_ref: fungible_asset::MintRef,
        burn_ref: fungible_asset::BurnRef,
        transfer_ref: fungible_asset::TransferRef
    }

    struct Registry has key {
        signer_cap: SignerCapability
    }

    fun init_module(enthro: &signer) {
        let (res_signer, res_signer_cap) = account::create_resource_account(enthro, b"Registry");

        let registry = Registry {
            signer_cap: res_signer_cap
        };

        move_to(enthro, registry);

        // create enthro coins
        create_fungible_asset_internal(
            &res_signer,
            option::some((T_SUPPLY as u128)),
            string::utf8(b"Enthro Coin"),
            string::utf8(b"ENTR"),
            8,
            string::utf8(b"https://enthro.xyz/images/enthro.png"),
            string::utf8(b"https://enthro.xyz")
        );
    }
    
    // ============== Friend Functions ============== //

    public(friend) fun deposit_enthro(
        sender: &signer,
        fa: Object<fungible_asset::Metadata>,
        amount: u64
    ) acquires FAController, Registry {
        let registry = borrow_global<Registry>(@enthro);
        let res_signer = account::create_signer_with_capability(&registry.signer_cap);

        let fa_obj_addr = object::object_address(&fa);
        let config = borrow_global<FAController>(fa_obj_addr);

        let sender_address = signer::address_of(sender);

        let sender_store = primary_fungible_store::ensure_primary_store_exists(
            sender_address,
            fa
        );

        let enthro_store = primary_fungible_store::ensure_primary_store_exists(
            signer::address_of(&res_signer),
            fa
        );

        fungible_asset::transfer(
            sender,
            sender_store,
            enthro_store,
            amount
        );
    }

    public(friend) fun transfer_enthro(
        fa: Object<fungible_asset::Metadata>,
        receiver: address,
        amount: u64
    ) acquires FAController, Registry {
        let registry = borrow_global<Registry>(@enthro);
        let res_signer = account::create_signer_with_capability(&registry.signer_cap);

        let fa_obj_addr = object::object_address(&fa);
        let config = borrow_global<FAController>(fa_obj_addr);

        let receiver_store = primary_fungible_store::ensure_primary_store_exists(
            receiver,
            fa
        );

        let enthro_store = primary_fungible_store::ensure_primary_store_exists(
            signer::address_of(&res_signer),
            fa
        );

        fungible_asset::transfer_with_ref(
            &config.transfer_ref,
            enthro_store,
            receiver_store,
            amount
        );
    }

    public(friend) fun mint_fungible_asset(
        sender: &signer,
        fa: Object<fungible_asset::Metadata>,
        amount: u64
    ) acquires FAController {
        let sender_addr = signer::address_of(sender);
        let fa_obj_addr = object::object_address(&fa);
        let config = borrow_global<FAController>(fa_obj_addr);
        primary_fungible_store::mint(&config.mint_ref, sender_addr, amount);
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
        
        primary_fungible_store::mint(&mint_ref, sender_address, 500_000_000_000_000);
        primary_fungible_store::mint(&mint_ref, @creator, 500_000_000_000_000);

        move_to(&fa_obj_signer, FAController {
            mint_ref,
            burn_ref,
            transfer_ref
        });

        metadata_obj
    }

}