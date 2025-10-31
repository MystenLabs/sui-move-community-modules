module module_2::hero {
    use std::string::String;
    
    public struct Hero has key, store {
        id: UID,
        name: String,
        image_url: String,
        power: u64, 
    }

    #[allow(lint(self_transfer))]
    public entry fun create_hero(name: String, image_url: String, power: u64,  ctx: &mut TxContext) {
        let hero = Hero {
            id: object::new(ctx),
            name,
            image_url,
            power,
        };

        transfer::public_transfer(hero, ctx.sender());
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
}
