module casino::gold {
    use sui::coin::create_currency;
    use sui::transfer::{public_freeze_object, public_transfer};

    public struct GOLD has drop {}

    fun init(otw: GOLD, ctx: &mut TxContext) {
        let (treasury, metadata) = create_currency<GOLD>(
            otw,
            9,
            b"GLD",
            b"Casino Gold",
            b"Completely legit",
            option::none(),
            ctx,
        );

        public_freeze_object(metadata);
        public_transfer(treasury, ctx.sender())
    }

    #[test_only]
    public fun test_init(otw: GOLD, ctx: &mut TxContext) {
        init(otw, ctx);
    }
}
