# Sui Fungible Token

A simple fungible token implementation on the Sui blockchain using the Sui framework's built-in coin module.

## Overview

This module demonstrates how to create and manage a fungible token on Sui using the `sui::coin` framework. It provides basic functionality for minting and burning tokens, along with event emission for tracking token operations.

## Module Structure

### Types

- `FUNGIBLE_TOKEN` - One time witness (OTW)

- `TokensMinted` - Event

- `TokensBurnt` - Event

## Functions

### `init`

- **Purpose**: Initializes the fungible token module
- **Parameters**:
  - `otw: FUNGIBLE_TOKEN` - The one-time witness for the token
  - `ctx: &mut TxContext` - Transaction context
- **What it does**:
  - Creates a new currency with 9 decimal places
  - Sets token symbol as "SFT" and name as "SimpleFungibleToken"
  - Freezes the metadata object to prevent modifications
  - Transfers the treasury capability to the module publisher

### `mint`

- **Purpose**: Mints new tokens and transfers them to the caller
- **Parameters**:
  - `treasury_cap: &mut TreasuryCap<FUNGIBLE_TOKEN>` - Reference to the treasury capability
  - `ctx: &mut TxContext` - Transaction context
- **What it does**:
  - Mints 1,000,000,000 units (1 billion tokens with 9 decimals = 1 token)
  - Emits a `TokensMinted` event with user address and amount
  - Transfers the minted coins to the transaction sender
- **Note**: Uses `#[allow(lint(self_transfer))]` to avoid self-transfer warning

### `burn`

- **Purpose**: Burns tokens and emits a burn event
- **Parameters**:
  - `treasury_cap: &mut TreasuryCap<FUNGIBLE_TOKEN>` - Reference to the treasury capability
  - `coin: Coin<FUNGIBLE_TOKEN>` - The coin to be burned
  - `ctx: &mut TxContext` - Transaction context
- **What it does**:
  - Records the amount of tokens to be burned
  - Burns the provided coin using the treasury capability
  - Emits a `TokensBurnt` event with user address and amount

## Usage

1. **Deployment**: The module initializes automatically when deployed, creating the token metadata and transferring treasury capability to the publisher
2. **Minting**: Call the `mint` function to create new tokens (requires treasury capability)
3. **Burning**: Call the `burn` function to destroy tokens (requires treasury capability and tokens to burn)
