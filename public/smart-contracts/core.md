# Metaplex Core

Use this file when the user asks about creating, reading, updating, transferring, or burning Metaplex Core Assets or Collections on Solana.

Human docs: https://metaplex.com/docs/smart-contracts/core

## Agent Routing

- **Prefer CLI** for operational tasks — an agent creating, transferring, or burning assets should use `mplx` commands.
- **Prefer SDK** when the user is building an app, backend, script, or reusable integration that needs to send transactions programmatically.
- If the user only needs code examples or conceptual guidance, do not assume live wallet access is available.

---

## Common Questions

Use this section to match what the user is asking to the right steps.

---

**"I want to create an NFT"**

1. [Initial Setup](#initial-setup) — verify CLI, RPC, and wallet
2. [Create an Asset](#create-an-asset)

---

**"I want to create an NFT collection and mint into it"**

1. [Initial Setup](#initial-setup)
2. [Create a Collection](#create-a-collection) — get your Collection Address
3. [Create an Asset](#create-an-asset) — pass `--collection <COLLECTION_ADDRESS>`

---

**"If the user's request is ambiguous about collections"**

- If the user says "new collection" or implies one should be created, follow the [Create a Collection](#create-a-collection) → [Create an Asset](#create-an-asset) flow.
- If the user does not mention a collection **and** does not provide a collection address, ask before proceeding:
  *"Should this NFT be part of a collection? If so, do you have an existing collection address, or should I create a new one?"*

---

**"I want to create an NFT with royalties"**

1. [Initial Setup](#initial-setup)
2. [Create an Asset with Plugins](#create-an-asset-with-plugins) — use the Royalties plugin

---

**"I want to transfer an NFT to another wallet"**

1. [Initial Setup](#initial-setup) — confirm the correct wallet is active (only the owner or Transfer Delegate can transfer)
2. [Transfer an Asset](#transfer-an-asset)

---

**"I want to update an NFT's name or image"**

1. [Update an Asset](#update-an-asset)

> **Note:** Updating a name requires changes in two places — the on-chain field (`--name`) and the off-chain metadata JSON (`--uri`). Both must be updated together. See the [Update an Asset](#update-an-asset) section for the full steps.

---

**"I want to burn an NFT"**

1. [Burn an Asset](#burn-an-asset)

---

**"I want to use a Core asset as a wallet / agent wallet"**

A Core asset has a derived Asset Signer PDA that can hold SOL and tokens and sign transactions via Core Execute.

1. [Initial Setup](#initial-setup)
2. [Execute / Asset Signer PDA](#execute--asset-signer-pda)

---

**"I want to read/inspect an asset or collection"**

1. [Fetch an Asset or Collection](#fetch-an-asset-or-collection)

---

## Initial Setup

Before running any Core operation, verify the environment is ready.

### 1. Check CLI Installation

```bash
mplx --version
```

If the command is not found, install it:

```bash
npm install -g @metaplex-foundation/cli
```

### 2. Configure RPC Endpoint

```bash
mplx config rpcs list
```

If no RPC is configured, set one:

```bash
# Devnet (testing)
mplx config rpcs set devnet

# Mainnet (requires a custom RPC endpoint)
mplx config rpcs add mainnet <RPC_ENDPOINT>
mplx config rpcs set mainnet
```

### 3. Configure Wallet

```bash
mplx config wallets list
```

If no wallet is configured, create one:

```bash
mplx config wallets new --name main
```

Fund the wallet with enough SOL to cover rent and transaction fees.

### 4. SDK Setup (for code paths)

```bash
npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi-bundle-defaults
```

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplCore } from '@metaplex-foundation/mpl-core'

const umi = createUmi('https://api.mainnet-beta.solana.com').use(mplCore())
```

---

## What Is a Metaplex Core Asset

A Core Asset is a **single on-chain account** that stores ownership, metadata URI, and plugin data. It is Metaplex's modern NFT standard — lighter and more flexible than Token Metadata.

- Each asset requires a fresh keypair at creation time. Do not reuse an existing asset address.
- Metadata JSON should be uploaded first and referenced by URI.
- Collections are separate Core accounts — not Token Metadata collections.
- Plugins add behavior (royalties, freeze, burn delegation, etc.) at the asset or collection level.

**Program ID:** `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d`

---

## Off-Chain Metadata JSON

All Core Assets reference an off-chain metadata JSON file via their URI. This file must follow the Metaplex metadata standard.

### NFT Metadata JSON

```json
{
  "name": "Asset Name",
  "description": "Description of the asset",
  "image": "https://...",
  "external_url": "https://yourproject.com",
  "animation_url": "https://...",
  "attributes": [
    {
      "trait_type": "Background",
      "value": "Blue"
    },
    {
      "trait_type": "Rarity",
      "value": "Legendary"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://...",
        "type": "image/png"
      }
    ],
    "category": "image"
  }
}
```

**Required:** `name`, `image`, `properties`
**Optional:** `description`, `external_url`, `animation_url`, `attributes`

> **Note:** While `external_url` and `attributes` are optional, including them is strongly recommended — wallets and marketplaces rely on them for display and indexing.
>
> **Collections:** When creating a collection's metadata JSON, omit `attributes` — traits belong to individual assets, not the collection itself.

**Categories:** `image`, `video`, `audio`, `vr`, `html`

**`properties.files` ordering convention:**
- **Index 0** — always the image file, matching the top-level `image` field
- **Index 1** — the `animation_url` file, if present — can be any rich media type: video, audio, HTML, 3D model, etc.
- **Index 2+** — any additional files

> **Using `--files` with the CLI:** When creating an asset from local files, the `image` field in your metadata JSON can be left as a placeholder (e.g. `"image": ""`). The CLI will upload the image first, then automatically inject the resulting URL into the metadata before uploading it.

---

## Operations

### Create an Asset

**CLI:**

```bash
# Basic create
mplx core asset create --name <NAME> --uri <URI>

# Mint to a specific owner
mplx core asset create --name <NAME> --uri <URI> --owner <OWNER_ADDRESS>

# Mint into a collection
mplx core asset create --name <NAME> --uri <URI> --collection <COLLECTION_ADDRESS>

# Create from local files (uploads image and metadata automatically)
mplx core asset create --files --image ./image.png --offchain ./metadata.json

# Generate template files
mplx core asset template
```

**SDK:**

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'

const asset = generateSigner(umi)

await create(umi, {
  asset,
  name: 'My NFT',
  uri: 'https://example.com/metadata.json',
}).sendAndConfirm(umi)
```

Minting into a collection — fetch the collection first:

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import { create, fetchCollection } from '@metaplex-foundation/mpl-core'

const collection = await fetchCollection(umi, publicKey('COLLECTION_ADDRESS'))
const asset = generateSigner(umi)

await create(umi, {
  asset,
  collection,
  name: 'Item #1',
  uri: 'https://example.com/item1.json',
}).sendAndConfirm(umi)
```

Common errors:
- `Asset account already exists` — generate a new asset signer
- `Collection not found` — verify you're passing a Core Collection, not a Token Metadata collection
- `Insufficient funds` — fund the payer wallet

---

### Create an Asset with Plugins

Plugins are attached at creation time via the `--pluginsFile` flag (CLI) or the `plugins` array (SDK).

**CLI — plugins file:**

```json
[{
  "type": "Royalties",
  "basisPoints": 500,
  "creators": [{"address": "<CREATOR_ADDRESS>", "percentage": 100}],
  "ruleSet": {"type": "None"}
}]
```

```bash
mplx core asset create --name <NAME> --uri <URI> --pluginsFile ./plugins.json
```

**SDK:**

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import { create, ruleSet } from '@metaplex-foundation/mpl-core'

const asset = generateSigner(umi)

await create(umi, {
  asset,
  name: 'NFT with Royalties',
  uri: 'https://example.com/metadata.json',
  plugins: [
    {
      type: 'Royalties',
      basisPoints: 500,
      creators: [{ address: publicKey('CREATOR_ADDRESS'), percentage: 100 }],
      ruleSet: ruleSet('None'),
    },
  ],
}).sendAndConfirm(umi)
```

Available plugin types: `Royalties`, `FreezeDelegate`, `BurnDelegate`, `TransferDelegate`, `Attributes`, `ImmutableMetadata`, `PermanentFreezeDelegate`, `PermanentTransferDelegate`, `PermanentBurnDelegate`.

RuleSet options: `{"type": "None"}`, `{"type": "ProgramAllowList", "programs": [...]}`, `{"type": "ProgramDenyList", "programs": [...]}`.

Notes:
- `basisPoints: 500` = 5% royalties
- Creator percentages must total 100

---

### Fetch an Asset or Collection

**CLI:**

```bash
mplx core asset fetch <ASSET_ADDRESS>
mplx core collection fetch <COLLECTION_ADDRESS>
```

If CLI help output differs from docs, check:

```bash
mplx core asset --help
mplx core collection --help
```

**SDK:**

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { fetchAsset, fetchCollection } from '@metaplex-foundation/mpl-core'

const asset = await fetchAsset(umi, publicKey('ASSET_ADDRESS'))
const collection = await fetchCollection(umi, publicKey('COLLECTION_ADDRESS'))
```

For large indexed queries, prefer a DAS-enabled RPC.

---

### Update an Asset

**CLI:**

```bash
mplx core asset update <ASSET_ADDRESS> --name <NEW_NAME>
mplx core asset update <ASSET_ADDRESS> --uri <NEW_URI>
mplx core asset update <ASSET_ADDRESS> --image ./new-image.png   # re-uploads via Irys
mplx core asset update <ASSET_ADDRESS> --collectionId <ADDR>     # move to different collection
```

**SDK:**

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { update, fetchAsset } from '@metaplex-foundation/mpl-core'

const asset = await fetchAsset(umi, publicKey('ASSET_ADDRESS'))

await update(umi, {
  asset,
  name: 'New Name',
  uri: 'https://example.com/new-metadata.json',
}).sendAndConfirm(umi)
```

Only the update authority or an authorized Update Delegate can update asset metadata.

**Important — name exists in two places:** The `--name` flag updates the on-chain name field only. The name also lives inside the off-chain metadata JSON referenced by the URI. Both must be kept in sync — if you update the name, you should:
1. Edit the metadata JSON with the new name and re-upload it
2. Run `mplx core asset update <ASSET_ADDRESS> --name <NEW_NAME>` to update the on-chain field
3. Run `mplx core asset update <ASSET_ADDRESS> --uri <NEW_URI>` to point to the updated JSON

Skipping either step means the on-chain name and the metadata JSON will disagree, which causes inconsistent display across wallets and marketplaces.

---

### Transfer an Asset

**CLI:**

```bash
mplx core asset transfer <ASSET_ADDRESS> <NEW_OWNER_ADDRESS>
```

The CLI auto-detects the Collection from the asset — no need to pass it manually.

**SDK:**

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { transfer } from '@metaplex-foundation/mpl-core'

await transfer(umi, {
  asset,
  newOwner: publicKey('NEW_OWNER_ADDRESS'),
}).sendAndConfirm(umi)
```

Only the owner or an authorized Transfer Delegate can transfer the asset. Transfer changes ownership, not update authority.

---

### Burn an Asset

**CLI:**

```bash
mplx core asset burn <ASSET_ADDRESS>
mplx core asset burn <ASSET_ADDRESS> --collection <COLLECTION_ADDRESS>
mplx core asset burn --list ./assets.json   # bulk burn from a list
```

**SDK:**

```ts
import { burn } from '@metaplex-foundation/mpl-core'

await burn(umi, { asset }).sendAndConfirm(umi)
```

Burning is irreversible. Only the owner or an authorized Burn Delegate can burn the asset.

**Before burning, confirm with the user:** *"Burning is permanent and cannot be undone. Are you sure you want to burn asset `<ASSET_ADDRESS>`?"* Do not proceed without explicit confirmation.

---

### Create a Collection

**CLI:**

```bash
mplx core collection create --name <NAME> --uri <URI>
mplx core collection create --name <NAME> --uri <URI> --pluginsFile ./plugins.json
mplx core collection template
```

**SDK:**

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createCollection } from '@metaplex-foundation/mpl-core'

const collection = generateSigner(umi)

await createCollection(umi, {
  collection,
  name: 'My Collection',
  uri: 'https://example.com/collection.json',
}).sendAndConfirm(umi)
```

Use a fresh signer for the collection address. After creation, save the Collection Address — you'll need it when minting assets into it.

---

### Execute / Asset Signer PDA

Every Core asset has a derived **Asset Signer PDA** — a wallet address that only the asset's owner can authorize via CPI. It can hold SOL and tokens and sign transactions through Core Execute.

**CLI — inspect and activate:**

```bash
# 1. Check the PDA address and balance
mplx core asset execute info <ASSET_ADDRESS>

# 2. Fund the PDA
mplx toolbox sol transfer 0.1 <SIGNER_PDA_ADDRESS>

# 3. Register it as a CLI wallet
mplx config wallets add vault --asset <ASSET_ADDRESS>

# 4. Switch to it
mplx config wallets set vault

# 5. Use commands as the PDA
mplx toolbox sol balance
mplx toolbox sol transfer 0.01 <DESTINATION>
mplx core asset create --name "PDA-created NFT" --uri "https://example.com/nft"
```

**SDK:**

```ts
import { findAssetSignerPda } from '@metaplex-foundation/mpl-core'

const [signerPda] = findAssetSignerPda(umi, { asset: publicKey('ASSET_ADDRESS') })
```

CPI limitations — these operations cannot be wrapped in `execute()`:
- Large account creation (Merkle trees, Candy Machines)
- Native SOL wrapping (`transferSol` to a token account fails in CPI context)

Create infrastructure with a normal wallet first, then switch to the asset-signer wallet.

---

## CLI Quick Reference

```bash
# Asset
mplx core asset create --name <NAME> --uri <URI>
mplx core asset create --name <NAME> --uri <URI> --collection <ADDR>
mplx core asset create --files --image ./image.png --offchain ./metadata.json
mplx core asset create --files --image ./image.png --offchain ./metadata.json --collection <ADDR>
mplx core asset fetch <ADDR>
mplx core asset update <ADDR> --name <NAME>
mplx core asset update <ADDR> --uri <URI>
mplx core asset transfer <ADDR> <NEW_OWNER>
mplx core asset burn <ADDR>
mplx core asset execute info <ADDR>

# Collection
mplx core collection create --name <NAME> --uri <URI>
mplx core collection fetch <ADDR>

# Wallets
mplx config wallets add vault --asset <ADDR>
mplx config wallets set vault
```

---

## Notes

- Core Assets are a different standard from Token Metadata NFTs — do not use Token Metadata SDK functions on Core assets.
- For fungible tokens, use `mplx toolbox token create` — not Core.
- For compressed NFTs, use Bubblegum.
- A fresh signer is required at creation time for both assets and collections.
- Large Candy Machine or Merkle tree creation cannot be done through an asset-signer PDA due to CPI size limits.

---

## Troubleshooting

| Problem                          | Solution                                                                           |
| -------------------------------- | ---------------------------------------------------------------------------------- |
| `mplx: command not found`        | Run `npm install -g @metaplex-foundation/cli`                                      |
| `Asset account already exists`   | Generate a new asset signer — never reuse an existing address                      |
| `Collection not found`           | Confirm the address is a Core Collection, not a Token Metadata collection          |
| `Insufficient funds`             | Fund the payer wallet with more SOL                                                |
| Update fails — not authority     | Only the update authority or an authorized delegate can update                     |
| Transfer fails — not owner       | Only the owner or an authorized Transfer Delegate can transfer                     |

---

## Further Reading

| Resource                  | Link                                                                                     |
| ------------------------- | ---------------------------------------------------------------------------------------- |
| Core docs                 | [metaplex.com/docs/smart-contracts/core](https://metaplex.com/docs/smart-contracts/core) |
| Metaplex Skill            | [github.com/metaplex-foundation/skill](https://github.com/metaplex-foundation/skill)     |
| Candy Machine (NFT drops) | [metaplex.com/docs/smart-contracts/core-candy-machine](https://metaplex.com/docs/smart-contracts/core-candy-machine) |
| Bubblegum (compressed NFTs) | [metaplex.com/docs/smart-contracts/bubblegum](https://metaplex.com/docs/smart-contracts/bubblegum) |
