module module_1::simple_nft {
    use std::string::String;
    
    public struct SimpleNFT has key, store {
        id: UID,
        name: String,
        description: String,
        image_url: String,
    }

    public struct SIMPLE_NFT has drop {}

    fun init(otw: SIMPLE_NFT, ctx: &mut TxContext) {
        let keys = vector[
            b"name".to_string(),
            b"description".to_string(),
            b"image_url".to_string(),
        ];

        let values = vector[
            b"{name}".to_string(),
            b"{description}".to_string(),
            b"{image_url}".to_string(),
        ];

        let publisher = sui::package::claim(otw, ctx);

        let mut display = sui::display::new_with_fields<SimpleNFT>(
            &publisher,
            keys,
            values,
            ctx,
        );

        display.update_version();

        transfer::public_transfer(publisher, ctx.sender());
        transfer::public_transfer(display, ctx.sender());
    }

    #[allow(lint(self_transfer))]
    public entry fun create_simple_nft(name: String, ctx: &mut TxContext) {
        let simple_nft = SimpleNFT {
            id: object::new(ctx),
            name: name,
            description: b"A simple NFT".to_string(),
            image_url: b"https://walrus.tusky.io/km06X8OdA9is0sH7aTuExWi_4JLrMEwn9jCJCIqwEkQ".to_string(),
        };

        transfer::transfer(simple_nft, ctx.sender());
    }
}
