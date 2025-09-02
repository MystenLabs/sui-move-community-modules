module nft_with_marketplace::marketplace {
    use nft_with_marketplace::nft::SimpleNft;
    use sui::bag::{Self, Bag};
    use sui::coin::Coin;
    use sui::event;
    use sui::sui::SUI;
    use sui::table::{Self, Table};
    use sui::transfer::share_object;

    const EInvalidPaymentAmount: u64 = 123;

    public struct NftListed has copy, drop {
        current_owner: address,
        nft_id: ID,
        price: u64,
    }

    public struct NftBought has copy, drop {
        new_owner: address,
        nft_id: ID,
        price: u64,
    }

    public struct NftMarketplace has key {
        id: UID,
        items: Bag,
        payments: Table<address, Coin<SUI>>,
    }

    public struct Listing has key, store {
        id: UID,
        price: u64,
        owner: address,
        nft: SimpleNft,
    }

    public struct OwnerCap has key {
        id: UID,
    }

    fun init(ctx: &mut TxContext) {
        transfer::transfer(
            OwnerCap {
                id: object::new(ctx),
            },
            ctx.sender(),
        );
    }

    public fun create_marketplace(_: &OwnerCap, ctx: &mut TxContext) {
        let marketplace = NftMarketplace {
            id: object::new(ctx),
            items: bag::new(ctx),
            payments: table::new(ctx),
        };
        share_object(marketplace);
    }

    public fun list_nft(
        marketplace: &mut NftMarketplace,
        nft: SimpleNft,
        price: u64,
        ctx: &mut TxContext,
    ) {
        let nft_id = object::id(&nft);
        let listing = Listing {
            id: object::new(ctx),
            price,
            owner: ctx.sender(),
            nft,
        };

        marketplace.items.add(nft_id, listing);

        event::emit(NftListed {
            current_owner: ctx.sender(),
            nft_id,
            price,
        });
    }

    public fun buy_nft(
        marketplace: &mut NftMarketplace,
        nft_id: ID,
        payment: Coin<SUI>,
        ctx: &mut TxContext,
    ): SimpleNft {
        let Listing {
            id,
            owner,
            price,
            nft,
        } = marketplace.items.remove(nft_id);

        assert!(price == payment.value(), EInvalidPaymentAmount);

        if (marketplace.payments.contains(owner)) {
            marketplace.payments.borrow_mut(owner).join(payment)
        } else {
            marketplace.payments.add(owner, payment)
        };

        id.delete();

        event::emit(NftBought {
            new_owner: ctx.sender(),
            nft_id: object::id(&nft),
            price,
        });
        nft
    }

    public fun claim_payments(marketplace: &mut NftMarketplace, ctx: &mut TxContext): Coin<SUI> {
        marketplace.payments.remove(ctx.sender())
    }
}
