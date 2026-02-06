---
title: Creating Assets
metaTitle: Creating Assets | Metaplex Core
description: Learn how to create Core NFT Assets on Solana using JavaScript or Rust. Includes uploading metadata, minting into collections, and adding plugins.
updated: '01-31-2026'
keywords:
  - create NFT
  - mint NFT
  - Solana NFT
  - mpl-core create
  - upload metadata
about:
  - NFT minting
  - Metadata upload
  - Asset creation
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
howToSteps:
  - Install SDK with npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi
  - Upload metadata JSON to Arweave or IPFS to get a URI
  - Call create(umi, { asset, name, uri }) with your metadata URI
  - Verify the Asset on core.metaplex.com
howToTools:
  - Node.js
  - Umi framework
  - mpl-core SDK
  - Arweave or IPFS for storage
faqs:
  - q: What's the difference between Core Assets and Token Metadata NFTs?
    a: Core Assets use a single account and cost ~80% less. Token Metadata uses 3+ accounts (mint, metadata, token). Core is recommended for new projects.
  - q: Can I create multiple assets in one transaction?
    a: No. Each create instruction creates one asset. For bulk minting, use Core Candy Machine or batch transactions.
  - q: Do I need to create a Collection first?
    a: No. Assets can exist without a Collection. However, Collections enable collection-level royalties and operations.
  - q: How do I mint to a different wallet?
    a: Pass the owner parameter in the create function with the recipient's address.
  - q: What metadata format should I use?
    a: Use the standard NFT metadata format with name, description, image, and optional attributes array. See the JSON Schema documentation.
---
This guide shows how to **create a Core Asset** (NFT) on Solana using the Metaplex Core SDK. You'll upload off-chain metadata, create the on-chain Asset account, and optionally add it to a Collection or attach plugins. {% .lead %}
{% callout title="What You'll Build" %}
A Core Asset with:
- Off-chain metadata (name, image, attributes) stored on Arweave
- On-chain Asset account with ownership and metadata URI
- Optional: Collection membership
- Optional: Plugins (royalties, freeze, attributes)
{% /callout %}
## Summary
Create a **Core Asset** by uploading metadata JSON to decentralized storage, then calling `create()` with the URI. Assets can be minted standalone or into Collections, and can include plugins at creation time.
- Upload metadata JSON to Arweave/IPFS, get a URI
- Call `create()` with name, URI, and optional plugins
- For collections: pass the `collection` parameter
- Costs ~0.0029 SOL per asset
## Out of Scope
Token Metadata NFTs (use mpl-token-metadata), compressed NFTs (use Bubblegum), fungible tokens (use SPL Token), and NFT migration.
## Quick Start
**Jump to:** [Upload Metadata](#uploading-off-chain-data) · [Create Asset](#create-an-asset) · [With Collection](#create-an-asset-into-a-collection) · [With Plugins](#create-an-asset-with-plugins)
1. Install: `npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. Upload metadata JSON to get a URI
3. Call `create(umi, { asset, name, uri })`
4. Verify on [core.metaplex.com](https://core.metaplex.com)
## Prerequisites
- **Umi** configured with a signer and RPC connection
- **SOL** for transaction fees (~0.003 SOL per asset)
- **Metadata JSON** ready to upload (name, image, attributes)
## The Creation Process
1. **Upload off-chain data.** Store a JSON file containing name, description, image URL, and attributes. The file must be accessible via a public **URI**.
2. **Create on-chain Asset account.** Call the `create` instruction with the metadata URI to mint the Asset.
## Uploading Off-chain Data
Use any storage service (Arweave, IPFS, AWS) to upload your metadata JSON. Umi provides uploader plugins for common services. See the [JSON Schema](/smart-contracts/core/json-schema) for all available metadata fields.
```ts {% title="upload-metadata.ts" %}
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
// Configure an uploader (Irys, AWS, etc.)
umi.use(irysUploader())
// Upload image first
const [imageUri] = await umi.uploader.upload([imageFile])
// Upload metadata JSON
const uri = await umi.uploader.uploadJson({
  name: 'My NFT',
  description: 'This is my NFT',
  image: imageUri,
  attributes: [
    { trait_type: 'Background', value: 'Blue' },
  ],
})
```
Now that you have a **URI**, you can create the Asset.
## Create an Asset
Use the `create` instruction to mint a new Core Asset.
{% totem %}
{% totem-accordion title="Technical Instruction Details" %}
**Instruction Accounts**
| Account | Description |
|---------|-------------|
| asset | The address of the new MPL Core Asset (signer) |
| collection | The collection to add the Asset to (optional) |
| authority | The authority of the new asset |
| payer | The account paying for storage fees |
| owner | The wallet that will own the asset |
| systemProgram | The System Program account |
**Instruction Arguments**
| Argument | Description |
|----------|-------------|
| name | The name of your MPL Core Asset |
| uri | The off-chain JSON metadata URI |
| plugins | Plugins to add at creation (optional) |
Full instruction details: [GitHub](https://github.com/metaplex-foundation/mpl-core/blob/main/programs/mpl-core/src/instruction.rs)
{% /totem-accordion %}
{% /totem %}
{% code-tabs-imported from="core/create-asset" frameworks="umi" /%}
## Create an Asset into a Collection
To create an Asset as part of a Collection, pass the `collection` parameter. The Collection must already exist.
{% code-tabs-imported from="core/create-asset-in-collection" frameworks="umi" /%}
See [Collections](/smart-contracts/core/collections) for creating Collections.
## Create an Asset with Plugins
Add plugins at creation time by passing them in the `plugins` array. This example adds the Royalties plugin:
{% code-tabs-imported from="core/create-asset-with-plugins" frameworks="umi" /%}
### Common Plugins
Here are a few commonly used plugins. See [Plugins Overview](/smart-contracts/core/plugins) for the full list.
- [Royalties](/smart-contracts/core/plugins/royalties) - Creator royalty enforcement
- [Freeze Delegate](/smart-contracts/core/plugins/freeze-delegate) - Allow freezing/unfreezing
- [Burn Delegate](/smart-contracts/core/plugins/burn-delegate) - Allow burning
- [Transfer Delegate](/smart-contracts/core/plugins/transfer-delegate) - Allow transfers
- [Update Delegate](/smart-contracts/core/plugins/update-delegate) - Allow metadata updates
- [Attributes](/smart-contracts/core/plugins/attribute) - On-chain key/value data
See [Plugins Overview](/smart-contracts/core/plugins) for the full list.
## Common Errors
### `Asset account already exists`
The asset keypair was already used. Generate a new signer:
```ts
const assetSigner = generateSigner(umi) // Must be unique
```
### `Collection not found`
The collection address doesn't exist or isn't a valid Core Collection. Verify the address and that you've created the Collection first.
### `Insufficient funds`
Your payer wallet needs ~0.003 SOL for rent. Fund it with:
```bash
solana airdrop 1 <WALLET_ADDRESS> --url devnet
```
## Notes
- The `asset` parameter must be a **new keypair** - you cannot reuse an existing account
- If minting to a different owner, pass the `owner` parameter
- Plugins added at creation are cheaper than adding them after (one transaction vs two)
- Use `commitment: 'finalized'` when creating assets in a script that immediately fetches them
## Quick Reference
### Program ID
| Network | Address |
|---------|---------|
| Mainnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
| Devnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
### Minimum Code
```ts {% title="minimal-create.ts" %}
import { generateSigner } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'
const asset = generateSigner(umi)
await create(umi, { asset, name: 'My NFT', uri: 'https://...' }).sendAndConfirm(umi)
```
### Cost Breakdown
| Item | Cost |
|------|------|
| Asset account rent | ~0.0029 SOL |
| Transaction fee | ~0.000005 SOL |
| **Total** | **~0.003 SOL** |
## FAQ
### What's the difference between Core Assets and Token Metadata NFTs?
Core Assets use a single account and cost ~80% less. Token Metadata uses 3+ accounts (mint, metadata, token). Core is recommended for new projects.
### Can I create multiple assets in one transaction?
No. Each `create` instruction creates one asset. For bulk minting, use [Core Candy Machine](/smart-contracts/core-candy-machine) or batch transactions.
### Do I need to create a Collection first?
No. Assets can exist without a Collection. However, Collections enable collection-level royalties and operations.
### How do I mint to a different wallet?
Pass the `owner` parameter:
```ts
await create(umi, { asset, name, uri, owner: recipientAddress })
```
### What metadata format should I use?
Use the standard NFT metadata format with `name`, `description`, `image`, and optional `attributes` array. See [JSON Schema](/smart-contracts/core/json-schema).
## Glossary
| Term | Definition |
|------|------------|
| **Asset** | A Core on-chain account representing an NFT |
| **URI** | The URL pointing to off-chain metadata JSON |
| **Signer** | A keypair that signs the transaction (asset must be a signer at creation) |
| **Collection** | A Core account that groups related Assets |
| **Plugin** | A modular extension adding behavior to an Asset |
| **Rent** | SOL required to keep an account alive on Solana |
