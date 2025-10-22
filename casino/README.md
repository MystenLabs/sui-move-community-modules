# Casino with Randomness Example

A Sui Move smart contract implementation of a casino game that demonstrates the use of native randomness for number generation.

## 🎰 Features

- **Custom Gold Token**: A fungible token (GLD) that serves as the casino's currency
- **Random Number Generation**: Uses Sui's on-chain randomness for fair game outcomes
- **Casino Game**: Simple dice roll game where players can wager GLD tokens
- **Treasury Management**: Casino maintains a SUI balance and can mint/burn GLD tokens
- **Configurable Win Threshold**: Adjustable difficulty for the casino game

## 🎮 How It Works

1. **Token Exchange**: Players can exchange SUI for GLD tokens at the casino
2. **Game Play**: Players wager GLD tokens on a random number game
3. **Random Generation**: The casino uses Sui's on-chain randomness to generate fair outcomes
4. **Payouts**: Winners receive double their wager in GLD tokens

## 🔧 Configuration

The casino can be configured with different win thresholds to adjust game difficulty:

- Lower threshold = easier to win (casino pays out more)
- Higher threshold = harder to win (casino keeps more)
