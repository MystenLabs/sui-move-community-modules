module module_2::hero {
    use std::string::String;
    
    public struct Hero has key, store {
        // TODO: Add the fields for the Hero
        // 1. The id of the Hero
        // 2. The name of the Hero
        // 3. The power of the Hero
        // 4. The imageurl of the Hero
    }

    #[allow(lint(self_transfer))]
    public entry fun create_hero(name: String, image_url: String, power: u64,  ctx: &mut TxContext) {
        // TODO: Create the Hero object
        // TODO: Transfer the Hero object to the sender
    }

    public entry fun transfer_hero(hero: Hero, to: address) {
        // TODO: Transfer the Hero object to the recipient
    }
    
    // ========= GETTER FUNCTIONS =========

    public fun hero_name(hero: &Hero): String {
        hero.name
    }
    
    public fun hero_power(hero: &Hero): u64 {
        hero.power
    }
    
    public fun hero_image_url(hero: &Hero): String {
        hero.image_url
    }
}
