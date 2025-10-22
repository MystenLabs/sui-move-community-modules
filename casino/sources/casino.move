module casino::casino;

use casino::gold::CasinoGold;
use sui::balance::{Self, Balance};
use sui::coin::{TreasuryCap, Coin};
use sui::package::Publisher;
use sui::random::Random;
use sui::sui::SUI;
use sui::transfer::share_object;

const ENotPublisher: u64 = 123;

public struct Casino has key {
    id: UID,
    bank: Balance<SUI>,
    money_printer: TreasuryCap<CasinoGold>,
    win_threshold: u8,
}

public struct CASINO has drop {}

fun init(otw: CASINO, ctx: &mut TxContext) {
    sui::package::claim_and_keep(otw, ctx);
}

public fun create_casino(
    publisher: &Publisher,
    treasury: TreasuryCap<CasinoGold>,
    win_threshold: u8,
    ctx: &mut TxContext,
) {
    assert!(publisher.from_package<CasinoGold>(), ENotPublisher);

    share_object(Casino {
        id: object::new(ctx),
        bank: balance::zero<SUI>(),
        money_printer: treasury,
        win_threshold,
    })
}

public fun buy_gold(
    casino: &mut Casino,
    payment: Coin<SUI>,
    ctx: &mut TxContext,
): Coin<CasinoGold> {
    let sent_amount = payment.value();

    casino.bank.join(payment.into_balance());

    casino.money_printer.mint(sent_amount, ctx)
}

entry fun roll(r: &Random, casino: &mut Casino, wager: Coin<CasinoGold>, ctx: &mut TxContext) {
    let mut gen = r.new_generator(ctx);
    let wager_amount = wager.value();
    casino.money_printer.burn(wager);

    let random_number = gen.generate_u8_in_range(0, 100);

    let winner = random_number > casino.win_threshold;

    if (winner) {
        casino.money_printer.mint_and_transfer(wager_amount * 2, ctx.sender(), ctx)
    }
}

#[test_only]
public fun test_init(otw: CASINO, ctx: &mut TxContext) {
    init(otw, ctx);
}
