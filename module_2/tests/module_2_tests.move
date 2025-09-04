
#[test_only]
module module_2::module_2_tests;

use module_2::hero::{Self, Hero};
use sui::test_scenario::{Self as ts, next_tx};

// Error codes for assertions
 const EHeroNameMismatch: u64 = 1;
 const EHeroImageUrlMismatch: u64 = 2;
 const EHeroPowerMismatch: u64 = 3;
 const EHeroNotCreated: u64 = 4;
 const EHeroNotTransferred: u64 = 5;
 const EHeroCannotTransferToSelf: u64 = 6;

const SENDER: address = @0x1;
const RECIPIENT: address = @0x2;


 #[test]
    fun test_create_hero() {
       let mut scenario = ts::begin(SENDER);

        // Create a hero
        {
            hero::create_hero(
                b"Ali".to_string(),
                b"https://example.com/ali.png".to_string(),
                9000,
                scenario.ctx(),
            );
        };

        // Move to next transaction to access the created hero
        next_tx(&mut scenario, SENDER);

        // Verify hero was created and test getter functions
        assert!(ts::has_most_recent_for_sender<Hero>(&scenario), EHeroNotCreated);
        
        {
            let hero = ts::take_from_sender<Hero>(&scenario);
            // Test getter functions
            assert!(hero.hero_name() == b"Ali".to_string(), EHeroNameMismatch);
            assert!(hero.hero_image_url() == b"https://example.com/ali.png".to_string(), EHeroImageUrlMismatch);
            assert!(hero.hero_power() == 9000, EHeroPowerMismatch);
            ts::return_to_sender(&scenario, hero);
        };

        ts::end(scenario);
    }

     #[test]
    fun test_transfer_hero() {
        let mut scenario = ts::begin(SENDER);

        // Create a hero
        {
            hero::create_hero(
                b"Serkan".to_string(),
                b"https://example.com/serkan.png".to_string(),
                8500,
                scenario.ctx(),
            );
        };

        next_tx(&mut scenario, SENDER);

        // Transfer the hero to recipient
        {
            let hero = ts::take_from_sender<Hero>(&scenario);
            hero::transfer_hero(hero, RECIPIENT);
        };

        // Move to next transaction as recipient
        next_tx(&mut scenario, RECIPIENT);

        // Verify hero is now owned by recipient
        assert!(ts::has_most_recent_for_address<Hero>(RECIPIENT), EHeroNotTransferred);

        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = EHeroImageUrlMismatch)]
    fun test_create_hero_with_invalid_image_url_should_fail() {
        let mut scenario = ts::begin(SENDER);

        // Create a hero 
        {
            hero::create_hero(     
                b"Mantas".to_string(),
                b"https://example.com/mantas.png".to_string(),
                7500,
                scenario.ctx(),
            );
        };

        next_tx(&mut scenario, SENDER);

        // Verify hero was created and test getter functions
        // This should fail with EHeroImageUrlMismatch error
         {
            let hero = ts::take_from_sender<Hero>(&scenario);
            // Test getter functions
            assert!(hero.hero_name() == b"Mantas".to_string(), EHeroNameMismatch);
            assert!(hero.hero_image_url() == b"https://example.com/teo.png".to_string(), EHeroImageUrlMismatch);
            assert!(hero.hero_power() == 7500, EHeroPowerMismatch);
            ts::return_to_sender(&scenario, hero);
        };

        ts::end(scenario);
       
    }

