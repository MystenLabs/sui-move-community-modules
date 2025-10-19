## Module 2 — Basic Hero (Sui Move)

An introductory Sui Move module that defines a simple `Hero` object and two entry functions to create and transfer it. Several TODOs are left in the code for learning purposes.

### What’s inside

- **Module**: `module_2::hero`
- **Structs**:
  - **Hero**: key object to be completed with fields like `id`, `name`, `power`, and `image_url`.
- **Entry functions**:
  - `create_hero(name: String, image_url: String, power: u64, ctx: &mut TxContext)` — create a `Hero` and transfer it to the sender.
  - `transfer_hero(hero: Hero, to: address)` — transfer a `Hero` to another address.

### Implementation Guide (Object Transfer)

In Sui Move, objects can be transferred in **3 main ways**:

#### 1. `transfer::public_transfer(obj, recipient)`

- **Ownership**: The object becomes **owned** by the specified recipient
- **Access**: Only the owner can interact with the object
- **Transferable**: The owner can transfer it to others
- **Example**: `transfer::public_transfer(hero, ctx.sender())` - transfers hero to the transaction sender

#### 2. `transfer::share_object(obj)`

- **Ownership**: The object becomes **shared** (not owned by anyone)
- **Access**: Anyone can interact with the object (subject to capability restrictions)
- **Use Case**: Perfect for marketplace listings, shared resources, or public objects
- **Example**: `transfer::share_object(list_hero)` - makes a hero listing available to everyone

#### 3. `transfer::freeze_object(obj)`

- **Ownership**: The object becomes **immutable** and unowned
- **Access**: No one can modify the object (read-only)
- **Use Case**: Metadata, historical records, or permanent data
- **Example**: `transfer::freeze_object(hero_metadata)` - makes hero metadata permanent

#### Key Differences:

- **`transfer::transfer()`** is an alias for `transfer::public_transfer()` - both transfer ownership
- **Shared objects** require consensus and have higher gas costs
- **Frozen objects** cannot be modified after freezing
- **Owned objects** are the most efficient and commonly used

### Build and test

From the repository root:

```bash
sui move build
sui move test
```

### Publish

From the repository root, publish just this package:

```bash
sui client publish
```

Save the returned `packageId` for subsequent calls.

### Interact (Sui CLI examples)

Replace placeholders like `<PACKAGE_ID>`, `<HERO_ID>`, and `<RECIPIENT_ADDRESS>` with real values.

1. Create a hero

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module hero \
  --function create_hero \
  --args "Arthur" "https://example.com/arthur.png" 9000 \
  --gas-budget 100000000
```

2. Transfer a hero

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module hero \
  --function transfer_hero \
  --args <HERO_ID> <RECIPIENT_ADDRESS> \
  --gas-budget 50000000
```

### Implementation guide (mapping to TODOs)

- **Hero**:
  - Add `id: UID`, `name: String`, `power: u64`, `image_url: String`.
  - In `create_hero`, construct the `Hero` using `object::new(ctx)` for the `id`.
  - Transfer to sender using `transfer::transfer(hero, ctx.sender())`.
- **transfer_hero**:
  - Use `transfer::public_transfer(hero, to)`.

### Troubleshooting

- Make sure Sui CLI is configured and you have gas on the selected network.
- If you see type or module import errors, ensure you’re on a recent Sui CLI.
