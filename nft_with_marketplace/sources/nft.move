module nft_with_marketplace::nft {
    use std::string::String;

    public struct SimpleNft has key, store {
        id: UID,
        name: String,
    }

    public fun mint(name: String, ctx: &mut TxContext): SimpleNft {
        SimpleNft {
            id: object::new(ctx),
            name,
        }
    }

    public fun burn(nft: SimpleNft) {
        let SimpleNft {
            id,
            ..,
        } = nft;
        id.delete()
    }

    /**
        Example of testing in the same module
    */

    #[test_only]
    public fun get_nft_name(nft: &SimpleNft): String {
        nft.name
    }

    #[test_only]
    use sui::test_scenario;

    #[test_only]
    const USER: address = @0x01;

    #[test]
    fun test_mint() {
        let mut ts = test_scenario::begin(USER);
        let nft_name = b"Test NFT".to_string();
        let nft = mint(b"Test NFT".to_string(), ts.ctx());
        let nft_id = object::id(&nft);
        transfer::public_transfer(nft, USER);
        ts.next_tx(USER);

        assert!(ts.most_recent_id_for_sender<SimpleNft>() == option::some(nft_id));

        let nft = ts.take_from_sender<SimpleNft>();
        assert!(nft.name == nft_name);

        ts.return_to_sender(nft);
        ts.end();
    }

    #[test]
    fun test_burn() {
        let mut ts = test_scenario::begin(USER);
        let nft = mint(b"Test NFT".to_string(), ts.ctx());
        transfer::public_transfer(nft, USER);
        ts.next_tx(USER);

        let nft = ts.take_from_sender();
        burn(nft);
        ts.next_tx(USER);

        assert!(ts.most_recent_id_for_sender<SimpleNft>() == option::none());

        ts.end();
    }
}

/**
        Example of testing in a different module
*/

#[test_only]
module nft_with_marketplace::testing {
    use nft_with_marketplace::nft::{mint, burn};
    use sui::test_scenario;
    use sui::test_utils::destroy;

    #[test]
    fun test_mint() {
        let mut ts = test_scenario::begin(@0x01);
        let nft = mint(b"Test NFT".to_string(), ts.ctx());
        assert!(nft.get_nft_name() == b"Test NFT".to_string(), 0);

        destroy(nft);
        ts.end();
    }

    #[test]
    fun test_burn() {
        let mut ts = test_scenario::begin(@0x01);
        let nft = mint(b"Test NFT".to_string(), ts.ctx());
        assert!(nft.get_nft_name() == b"Test NFT".to_string(), 0);

        burn(nft);

        ts.end();
    }
}
