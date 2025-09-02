/**
        Example of testing in a different file, 
        which is essentially the same as a different file
*/

#[test_only]
module nft_with_marketplace::tests_in_different_folder {
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
