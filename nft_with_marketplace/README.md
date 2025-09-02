# NFT with Marketplace Example

This project demonstrates an NFT (Non-Fungible Token) with a marketplace built on the Sui blockchain. It includes NFT minting, burning, marketplace listing, buying, and payment claiming functionality.

## Modules Overview

### 1. NFT Module (`sources/nft.move`)

The NFT module provides the core functionality for creating and managing Non-Fungible Tokens.

#### Key Components

- **SimpleNft Struct**: The main NFT structure containing:
  - `id`: Unique identifier (UID)
  - `name`: String name for the NFT

#### Public Functions

- **`mint(name: String, ctx: &mut TxContext): SimpleNft`**

  - Creates a new NFT with the specified name
  - Returns the minted NFT object

- **`burn(nft: SimpleNft)`**
  - Destroys an NFT permanently
  - Deletes the NFT's unique identifier

#### Testing

The module includes comprehensive test coverage:

- `test_mint()`: Verifies NFT creation and name assignment
- `test_burn()`: Ensures proper NFT destruction
- Additional test module for cross-module testing

### 2. Marketplace Module (`sources/marketplace.move`)

The marketplace module enables trading of NFTs with SUI coin payments.

#### Key Components

- **NftMarketplace**: Shared marketplace object containing:

  - `items`: Bag storing active listings
  - `payments`: Table tracking seller payments

- **Listing**: Individual NFT listing with:

  - `price`: SUI amount required to purchase
  - `owner`: Address of the seller
  - `nft`: The actual NFT being sold

- **OwnerCap**: Capability for marketplace creation

#### Public Functions

- **`create_marketplace(_: &OwnerCap, ctx: &mut TxContext)`**

  - Creates a new shared marketplace instance
  - Requires OwnerCap for authorization

- **`list_nft(marketplace: &mut NftMarketplace, nft: SimpleNft, price: u64, ctx: &mut TxContext)`**

  - Lists an NFT for sale at specified price
  - Emits `NftListed` event
  - Transfers NFT ownership to marketplace

- **`buy_nft(marketplace: &mut NftMarketplace, nft_id: ID, payment: Coin<SUI>, ctx: &mut TxContext): SimpleNft`**

  - Purchases an NFT with SUI payment
  - Validates payment amount matches listing price
  - Emits `NftBought` event
  - Returns the purchased NFT

- **`claim_payments(marketplace: &mut NftMarketplace, ctx: &mut TxContext): Coin<SUI>`**
  - Allows sellers to claim their accumulated payments
  - Returns all pending payments for the caller

#### Events

- **NftListed**: Emitted when an NFT is listed for sale
- **NftBought**: Emitted when an NFT is purchased

### 3. PTBS Examples (`ptbs.sh`)

Programmable Transaction Blocks (PTBs) provide a way to execute multiple operations in a single transaction. The `ptbs.sh` file contains practical examples:

#### Example 1: Mint and Burn

```bash
sui client ptb \
    --move-call $PACKAGE::nft::mint "'Sui_Nft'" \
    --assign nft \
    --move-call $PACKAGE::nft::burn nft
```

#### Example 2: Mint and List

```bash
sui client ptb \
    --move-call $PACKAGE::nft::mint "'Sui NFT'" \
    --assign nft \
    --move-call $PACKAGE::marketplace::list_nft $MARKETPLACE nft $NFT_PRICE
```

#### Example 3: Buy NFT

```bash
sui client ptb \
    --split-coins gas "[$PAYMENT]" \
    --assign payment \
    --move-call $PACKAGE::marketplace::buy_nft $MARKETPLACE $NFT_ID payment \
    --assign nft \
    --transfer-objects "[nft]" $MY_ADDRESS
```

#### Example 4: Complete Workflow

A comprehensive example that:

1. Mints an NFT
2. Lists it for sale
3. Buys the NFT
4. Claims payments
5. Transfers everything to the user

### Running PTBs

1. Make the script executable:

   ```bash
   chmod +x ptbs.sh
   ```

2. Update the environment variables in `ptbs.sh`:

   - `PACKAGE`: Your deployed package ID
   - `MARKETPLACE`: Your marketplace object ID
   - `MY_ADDRESS`: Your wallet address

3. Run individual examples:
   ```bash
   # Run specific sections by uncommenting them in ptbs.sh
   ./ptbs.sh
   ```

### Testing

Run the test suite:

```bash
sui move test
```
