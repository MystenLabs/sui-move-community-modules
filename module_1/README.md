## Module 1 — Simple NFT (Sui Move)

This introductory Sui Move module defines a simple `SimpleNFT` object, demonstrating basic NFT creation and Sui’s display system, which provides metadata (name, description, image_url) that wallets and marketplaces use to display your NFT properly; it’s ready to use—just build, publish, and interact with your SimpleNFT using the provided commands

### What's inside

- **Module**: `module_1::simple_nft`
- **Structs**:
  - **SimpleNFT**: key object with fields `id`, `name`, `description`, and `image_url`.
  - **SIMPLE_NFT**: drop capability struct for one-time witness pattern.
  - **Init function**:
  - `init(otw: SIMPLE_NFT, ctx: &mut TxContext)` — initialize the module with display configuration.
- **Entry functions**:
  - `create_simple_nft(name: String, ctx: &mut TxContext)` — create a `SimpleNFT` and transfer it to the sender.

### Build

From the repository root:

```bash
sui move build
```

### Publish

From the repository root, publish just this package:

```bash
sui client publish
```

Save the returned `packageId` for subsequent calls.

### Interact (Sui CLI examples)

Replace placeholders like `<PACKAGE_ID>` with real values.

1. Create a simple NFT

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module simple_nft \
  --function create_simple_nft \
  --args "My First NFT" \
  --gas-budget 100000000
```

### Implementation guide (mapping to TODOs)

- **SimpleNFT**:
  - Contains `id: UID`, `name: String`, `description: String`, and `image_url: String`.
  - In `create_simple_nft`, construct the SimpleNFT using `object::new(ctx)` for the `id`.
  - Transfer to sender using `transfer::transfer(simple_nft, ctx.sender())`.
- **Display system**:
  - Uses `sui::display::new_with_fields<SimpleNFT>()` with template fields.
  - Configured in `init` function with `{name}`, `{description}`, `{image_url}` templates.
- **SIMPLE_NFT (One-Time Witness)**:

  - Uses `SIMPLE_NFT` struct with `drop` capability for secure module initialization.

  ### Troubleshooting

- Make sure Sui CLI is configured and you have gas on the selected network.
- If you see type or module import errors, ensure you’re on a recent Sui CLI.
