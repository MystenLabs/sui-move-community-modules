module casino::gold;

use sui::coin::TreasuryCap;
use sui::coin_registry::{CoinRegistry, new_currency};
use sui::transfer::public_freeze_object;

public struct CasinoGold has key { id: UID }

public fun register_gold(
    registry: &mut CoinRegistry,
    ctx: &mut TxContext,
): TreasuryCap<CasinoGold> {
    let (initializer, treasury) = new_currency<CasinoGold>(
        registry,
        9,
        b"GLD".to_string(),
        b"Casino Gold".to_string(),
        b"Completely legit".to_string(),
        b"https://example_icon_url.com".to_string(),
        ctx,
    );

    let metadata = initializer.finalize(ctx);

    public_freeze_object(metadata);
    treasury
}
