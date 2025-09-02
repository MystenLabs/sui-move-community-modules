# CLI NFT

This project shows off the ease of deploying a contract and interacting with it on the Sui Blockchain.

Some common commands:

```zsh
# Creating a new keypair for the cli
sui client new-address <encryption-scheme> <name>

# Provides the link to the Sui faucet
sui client faucet

# Transfer object to different address
sui client transfer --to <new-owner> --object-id <object-identifier>

# Building the contracts
sui move build

# Publishing contracts
sui client publish
```

All the commands can be found in the [docs](https://docs.sui.io/references/cli/cheatsheet) or listed with:

```zsh
sui --help
```
