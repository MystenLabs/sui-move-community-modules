/*
/// Module: fungible_token
*/
module fungible_token::fungible_token {
    use sui::coin::{create_currency, TreasuryCap, Coin};
    use sui::transfer::{public_freeze_object, public_transfer};

    public struct FUNGIBLE_TOKEN has drop {}

    fun init(otw: FUNGIBLE_TOKEN, ctx: &mut TxContext) {
        let (treasury_cap, metadata) = create_currency<FUNGIBLE_TOKEN>(
            otw,
            9,
            b"SFT",
            b"SimpleFungibleToken",
            b"An example of a simple funigible token",
            option::none(),
            ctx,
        );

        public_freeze_object(metadata);
        transfer::public_transfer(treasury_cap, ctx.sender());
    }

    #[allow(lint(self_transfer))]
    public fun mint(treasury_cap: &mut TreasuryCap<FUNGIBLE_TOKEN>, ctx: &mut TxContext) {
        let coin = treasury_cap.mint(1000000000, ctx);

        public_transfer(coin, ctx.sender())
    }

    public fun burn(treasury_cap: &mut TreasuryCap<FUNGIBLE_TOKEN>, coin: Coin<FUNGIBLE_TOKEN>) {
        treasury_cap.burn(coin);
    }
}
