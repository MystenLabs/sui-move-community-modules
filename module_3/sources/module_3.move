module module_3::hero; 
    // ========= IMPORTS =========
    use std::string::String;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::event;
    
    // ========= STRUCTS =========
    public struct Hero has key, store {
        id: UID,
        name: String,
        image_url: String,
        power: u64,
    }

    public struct ListHero has key, store {
        id: UID,
        nft: Hero,
        price: u64,
        seller: address,
    }

    public struct HeroMetadata has key, store {
        id: UID,
        timestamp: u64,
    }

    // ========= EVENTS =========

    public struct HeroListed has copy, drop {
        id: ID,
        price: u64,
        seller: address,
        timestamp: u64,
    }

    public struct HeroBought has copy, drop {
        id: ID,
        price: u64,
        buyer: address,
        seller: address,
        timestamp: u64,
    }

    // ========= FUNCTIONS =========

    #[allow(lint(self_transfer))]
    public entry fun create_hero(name: String, image_url: String, power: u64,  ctx: &mut TxContext) {
        let hero = Hero {
            id: object::new(ctx),
            name,
            image_url,
            power
        };

        let hero_metadata = HeroMetadata {
            id: object::new(ctx),
            timestamp: ctx.epoch_timestamp_ms(),
        };

        transfer::public_transfer(hero, ctx.sender());

        transfer::freeze_object(hero_metadata);
    }



    public entry fun list_hero(nft: Hero, price: u64, ctx: &mut TxContext) {
        let list_hero = ListHero {
            id: object::new(ctx),
            nft,
            price,
            seller: ctx.sender(),
        };

        event::emit(HeroListed {
            id: object::id(&list_hero),
            price,
            seller: ctx.sender(),
            timestamp: ctx.epoch_timestamp_ms(),
        });

        transfer::share_object(list_hero);
    }

    public entry fun buy_hero(list_hero: ListHero, coin: Coin<SUI>, ctx: &mut TxContext) {
        let ListHero { id, nft, price, seller } = list_hero;

        assert!(coin::value(&coin) == price, 0);

        transfer::public_transfer(coin, seller);

        transfer::public_transfer(nft, ctx.sender());

        event::emit(HeroBought {
            id: id.to_inner(),
            price,
            buyer: ctx.sender(),
            seller,
            timestamp: ctx.epoch_timestamp_ms(),
        });

        id.delete();
    }

    public entry fun transfer_hero(hero: Hero, to: address) {
        transfer::public_transfer(hero, to);
    }

    // ========= GETTER FUNCTIONS =========
    
    #[test_only]
    public fun hero_name(hero: &Hero): String {
        hero.name
    }

    #[test_only]
    public fun hero_image_url(hero: &Hero): String {
        hero.image_url
    }

    #[test_only]
    public fun hero_power(hero: &Hero): u64 {
        hero.power
    }

    #[test_only]
    public fun hero_id(hero: &Hero): ID {
        object::id(hero)
    }





