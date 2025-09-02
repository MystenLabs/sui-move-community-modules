# If this code throws errors, it might be due to your shell environment,
# please check the doc warnings for examples: https://docs.sui.io/references/cli/ptb

export PACKAGE="0x9c08c2742ed347588f473a71d2dc015ef7ddf3eea28a034606a95b32c96e8919"
export MARKETPLACE="@0xb884376b4cfa30e5a7792ee18f3f99813cdd8d2b54ff13651aa3bda30e6bb430"
export MY_ADDRESS="@0x24042ef53b9b743e0aa936e4bd5509a5e606b84901be0a81508c93d33653b59f"

export NFT_PRICE=1000

# 1. Mint and burn NFT

sui client ptb \
    --move-call $PACKAGE::nft::mint "'Sui_Nft'" \
    --assign nft \
    --move-call $PACKAGE::nft::burn nft

# 2. Mint and list NFT

sui client ptb \
    --move-call $PACKAGE::nft::mint "'Sui NFT'" \
    --assign nft \
    --move-call $PACKAGE::marketplace::list_nft $MARKETPLACE nft $NFT_PRICE

# 3. Buy and send NFT to self

# Retrieved from the previous PTBs events
export NFT_ID="@0xdf7b0587c4f5c865dbf347f182cb1bbb4b2854744ef180b2315942dd18ada623" 
export PAYMENT=$NFT_PRICE

sui client ptb \
    --split-coins gas "[$PAYMENT]" \
    --assign payment \
    --move-call $PACKAGE::marketplace::buy_nft $MARKETPLACE $NFT_ID payment \
    --assign nft \
    --transfer-objects "[nft]" $MY_ADDRESS


# 4. Mint, list, buy, burn, claim payment and transfer to self

sui client ptb \
    --move-call $PACKAGE::nft::mint '"Sui NFT"' \
    --assign nft \
    --move-call sui::object::id "<$PACKAGE::nft::SimpleNft>" nft \
    --assign nft_id \
    --move-call $PACKAGE::marketplace::list_nft $MARKETPLACE nft $NFT_PRICE \
    --split-coins gas "[$PAYMENT]" \
    --assign payment \
    --move-call $PACKAGE::marketplace::buy_nft $MARKETPLACE nft_id payment \
    --assign nft \
    --move-call $PACKAGE::marketplace::claim_payments $MARKETPLACE \
    --assign payments \
    --transfer-objects "[nft,payments]" $MY_ADDRESS