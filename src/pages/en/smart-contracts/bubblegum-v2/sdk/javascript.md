---
title: JavaScript SDK
metaTitle: JavaScript SDK - Bubblegum V2 - Metaplex
description: Complete reference for the Metaplex Bubblegum V2 JavaScript SDK. Covers Umi setup, creating trees, minting, transferring, burning, updating, delegating, freezing, and fetching compressed NFTs.
created: '01-15-2025'
updated: '02-25-2026'
keywords:
  - mpl-bubblegum JavaScript
  - Bubblegum V2 TypeScript SDK
  - compressed NFT JavaScript
  - cNFT SDK
  - Umi framework
  - mintV2
  - transferV2
  - createTree
  - getAssetWithProof
about:
  - Compressed NFTs
  - JavaScript SDK
  - Umi framework
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - Install @metaplex-foundation/mpl-bubblegum and Umi
  - Create and configure a Umi instance with the mplBubblegum plugin
  - Create a Bubblegum tree using createTree
  - Mint compressed NFTs using mintV2
faqs:
  - q: What is the Bubblegum V2 JavaScript SDK?
    a: The Bubblegum V2 JavaScript SDK (@metaplex-foundation/mpl-bubblegum) is a TypeScript library for creating and managing compressed NFTs on Solana. It is built on the Umi framework and includes the DAS API plugin automatically.
  - q: Do I need a special RPC provider to use this SDK?
    a: Yes. You need an RPC provider that supports the Metaplex DAS API to fetch and index compressed NFTs. Standard Solana RPC endpoints do not support DAS. See the RPC Providers page for compatible options.
  - q: How do I get the asset ID of a cNFT after minting?
    a: Use parseLeafFromMintV2Transaction after the mint transaction confirms. It extracts the leaf schema including the asset ID from the transaction.
  - q: Why do I get a "Transaction too large" error?
    a: Merkle proofs grow with tree depth. Pass truncateCanopy true to getAssetWithProof, or use versioned transactions with Address Lookup Tables.
  - q: Can I use this SDK with Bubblegum V1 trees?
    a: No. This SDK targets Bubblegum V2 and uses LeafSchemaV2. Use the legacy Bubblegum SDK for V1 trees.
  - q: What is getAssetWithProof and why do I need it?
    a: getAssetWithProof is a helper that fetches all parameters needed for leaf-mutating instructions (proof, root, leaf index, nonce, metadata) from the DAS API in one call. Almost every write instruction requires it.
---

The **Bubblegum V2 JavaScript SDK** (`@metaplex-foundation/mpl-bubblegum`) is the recommended TypeScript/JavaScript library for creating and managing [compressed NFTs](/smart-contracts/bubblegum-v2) on Solana. Built on the [Umi framework](/dev-tools/umi), it provides type-safe functions for all Bubblegum V2 operations and includes the [DAS API](/smart-contracts/bubblegum-v2/fetch-cnfts) plugin automatically. {% .lead %}

{% callout title="What You'll Learn" %}
This SDK reference covers:
- Setting up Umi with the Bubblegum V2 plugin
- Creating merkle trees for storing cNFTs
- Minting, transferring, burning, and updating cNFTs
- Delegating, freezing, and verifying creators
- Fetching cNFTs using the DAS API
- Handling transaction size limits and common errors
{% /callout %}

## Summary

The **Bubblegum V2 JavaScript SDK** wraps all MPL-Bubblegum V2 program instructions in a type-safe API and includes the DAS API plugin for reading cNFT data.

- Install: `npm install @metaplex-foundation/mpl-bubblegum @metaplex-foundation/umi-bundle-defaults`
- Register with Umi using `.use(mplBubblegum())` — the DAS API plugin is included automatically
- Use `getAssetWithProof` before any write operation (transfer, burn, update, delegate, freeze, verify)
- Applies to Bubblegum V2 (MPL-Bubblegum 5.x) — not compatible with V1 trees

*Maintained by Metaplex Foundation · Last verified February 2026 · Applies to MPL-Bubblegum 5.x · [View source on GitHub](https://github.com/metaplex-foundation/mpl-bubblegum)*

## Quick Start

**Jump to:** [Setup](#umi-setup) · [Create Tree](#create-a-bubblegum-tree) · [Mint](#mint-a-compressed-nft) · [Transfer](#transfer-a-compressed-nft) · [Burn](#burn-a-compressed-nft) · [Update](#update-a-compressed-nft) · [Delegate](#delegate-a-compressed-nft) · [Collections](#collections) · [Freeze](#freeze-and-thaw) · [Verify Creators](#verify-creators) · [Fetch](#fetching-cnfts) · [Errors](#common-errors) · [Quick Reference](#quick-reference)

1. Install dependencies: `npm install @metaplex-foundation/mpl-bubblegum @metaplex-foundation/umi-bundle-defaults`
2. Create a Umi instance with `.use(mplBubblegum())`
3. Create a Bubblegum tree with `createTree`
4. Mint cNFTs with `mintV2`; use `getAssetWithProof` before any subsequent write operation

## Installation

```bash {% title="Terminal" %}
npm install @metaplex-foundation/mpl-bubblegum @metaplex-foundation/umi-bundle-defaults
```

{% quick-links %}
{% quick-link title="TypeDoc API Reference" target="_blank" icon="JavaScript" href="https://mpl-bubblegum.typedoc.metaplex.com/" description="Full generated API documentation for the SDK." /%}
{% quick-link title="npm Package" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/mpl-bubblegum" description="Package on npmjs.com with version history." /%}
{% /quick-links %}

## Umi Setup

The `mplBubblegum` plugin registers all Bubblegum V2 instructions and the DAS API plugin with your Umi instance.

```ts {% title="setup.ts" %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'
import { keypairIdentity } from '@metaplex-foundation/umi'

const umi = createUmi('https://api.devnet.solana.com')
  .use(mplBubblegum())
  .use(keypairIdentity(yourKeypair))
```

{% totem %}
{% totem-accordion title="Loading a Keypair from File" %}
```ts {% title="load-keypair.ts" %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'
import { keypairIdentity } from '@metaplex-foundation/umi'
import { readFileSync } from 'fs'

const secretKey = JSON.parse(readFileSync('/path/to/keypair.json', 'utf-8'))
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey))
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplBubblegum())
  .use(keypairIdentity(keypair))
```
{% /totem-accordion %}
{% totem-accordion title="Browser Wallet Adapter" %}
```ts {% title="browser-wallet.ts" %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'

const umi = createUmi('https://api.devnet.solana.com')
  .use(mplBubblegum())
  .use(walletAdapterIdentity(wallet)) // from @solana/wallet-adapter-react
```
{% /totem-accordion %}
{% /totem %}

## Create a Bubblegum Tree

`createTree` allocates a new [merkle tree](/smart-contracts/bubblegum-v2/concurrent-merkle-trees) on-chain and registers it as a Bubblegum V2 tree. Tree parameters are permanent — choose them carefully before creating.

```ts {% title="create-tree.ts" %}
import { createTree } from '@metaplex-foundation/mpl-bubblegum'
import { generateSigner } from '@metaplex-foundation/umi'

const merkleTree = generateSigner(umi)

await createTree(umi, {
  merkleTree,
  maxDepth: 14,        // tree holds 2^14 = 16,384 cNFTs
  maxBufferSize: 64,   // concurrent writes per block
  canopyDepth: 10,     // cached upper nodes (reduces proof size in txs)
  public: false,       // false = only tree creator/delegate can mint
}).sendAndConfirm(umi)

console.log('Tree address:', merkleTree.publicKey)
```

{% callout type="note" %}
`public: false` means only the tree creator (or an approved tree delegate) can mint from the tree. Set `public: true` to allow anyone to mint. See [Create Trees](/smart-contracts/bubblegum-v2/create-trees) for tree size cost estimates.
{% /callout %}

## Mint a Compressed NFT

### Mint Without Collection

`mintV2` creates a new cNFT leaf in the specified tree.

```ts {% title="mint-cnft.ts" %}
import { mintV2 } from '@metaplex-foundation/mpl-bubblegum'
import { none } from '@metaplex-foundation/umi'

await mintV2(umi, {
  leafOwner: umi.identity.publicKey,
  merkleTree: merkleTree.publicKey,
  metadata: {
    name: 'My Compressed NFT',
    uri: 'https://example.com/my-nft.json',
    sellerFeeBasisPoints: 500, // 5% royalty
    collection: none(),
    creators: [{ address: umi.identity.publicKey, verified: false, share: 100 }],
  },
}).sendAndConfirm(umi)
```

### Mint to a Collection

Pass a `coreCollection` to associate the cNFT with an [MPL-Core collection](/smart-contracts/bubblegum-v2/collections). The collection must have the `BubblegumV2` plugin enabled.

```ts {% title="mint-to-collection.ts" %}
import { mintV2 } from '@metaplex-foundation/mpl-bubblegum'
import { publicKey } from '@metaplex-foundation/umi'

await mintV2(umi, {
  leafOwner: umi.identity.publicKey,
  merkleTree: merkleTree.publicKey,
  metadata: {
    name: 'My Collection cNFT',
    uri: 'https://example.com/my-nft.json',
    sellerFeeBasisPoints: 500,
    collection: publicKey('YourCollectionAddressHere'),
    creators: [{ address: umi.identity.publicKey, verified: false, share: 100 }],
  },
  coreCollection: publicKey('YourCollectionAddressHere'),
}).sendAndConfirm(umi)
```

### Get Asset ID After Minting

Use `parseLeafFromMintV2Transaction` to retrieve the leaf schema (including the asset ID) after a mint confirms.

```ts {% title="parse-mint.ts" %}
import { mintV2, parseLeafFromMintV2Transaction } from '@metaplex-foundation/mpl-bubblegum'
import { none } from '@metaplex-foundation/umi'

const { signature } = await mintV2(umi, {
  leafOwner: umi.identity.publicKey,
  merkleTree: merkleTree.publicKey,
  metadata: {
    name: 'My Compressed NFT',
    uri: 'https://example.com/my-nft.json',
    sellerFeeBasisPoints: 500,
    collection: none(),
    creators: [],
  },
}).sendAndConfirm(umi)

const leaf = await parseLeafFromMintV2Transaction(umi, signature)
console.log('Asset ID:', leaf.id)
console.log('Leaf index:', leaf.nonce)
```

## Transfer a Compressed NFT

`transferV2` moves ownership of a cNFT to a new wallet. `getAssetWithProof` fetches all required proof parameters from the [DAS API](/smart-contracts/bubblegum-v2/fetch-cnfts).

```ts {% title="transfer.ts" %}
import { getAssetWithProof, transferV2 } from '@metaplex-foundation/mpl-bubblegum'
import { publicKey } from '@metaplex-foundation/umi'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })

await transferV2(umi, {
  ...assetWithProof,
  leafOwner: umi.identity, // current owner as signer
  newLeafOwner: publicKey('NewOwnerAddressHere'),
}).sendAndConfirm(umi)
```

## Burn a Compressed NFT

`burnV2` permanently destroys a cNFT and removes its leaf from the tree.

```ts {% title="burn.ts" %}
import { getAssetWithProof, burnV2 } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })

await burnV2(umi, {
  ...assetWithProof,
  leafOwner: umi.identity, // owner must sign
}).sendAndConfirm(umi)
```

## Update a Compressed NFT

`updateMetadataV2` modifies a cNFT's metadata. Update authority depends on whether the cNFT belongs to a collection — see [Update cNFTs](/smart-contracts/bubblegum-v2/update-cnfts) for authority rules.

```ts {% title="update.ts" %}
import {
  getAssetWithProof,
  updateMetadataV2,
  UpdateArgsArgs,
} from '@metaplex-foundation/mpl-bubblegum'
import { some, publicKey } from '@metaplex-foundation/umi'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })

const updateArgs: UpdateArgsArgs = {
  name: some('Updated Name'),
  uri: some('https://example.com/updated.json'),
}

await updateMetadataV2(umi, {
  ...assetWithProof,
  leafOwner: assetWithProof.leafOwner,
  currentMetadata: assetWithProof.metadata,
  updateArgs,
  // If cNFT belongs to a collection, pass the collection address:
  coreCollection: publicKey('YourCollectionAddressHere'),
}).sendAndConfirm(umi)
```

## Delegate a Compressed NFT

A [leaf delegate](/smart-contracts/bubblegum-v2/delegate-cnfts) can transfer, burn, and freeze a cNFT on the owner's behalf. The delegate resets to the new owner after any transfer.

### Approve a Delegate

```ts {% title="approve-delegate.ts" %}
import { getAssetWithProof, delegate } from '@metaplex-foundation/mpl-bubblegum'
import { publicKey } from '@metaplex-foundation/umi'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })

await delegate(umi, {
  ...assetWithProof,
  leafOwner: umi.identity,
  previousLeafDelegate: umi.identity.publicKey, // current delegate (use owner if none)
  newLeafDelegate: publicKey('DelegateAddressHere'),
}).sendAndConfirm(umi)
```

### Revoke a Delegate

Set the new delegate to the owner's own address.

```ts {% title="revoke-delegate.ts" %}
import { getAssetWithProof, delegate } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })

await delegate(umi, {
  ...assetWithProof,
  leafOwner: umi.identity,
  previousLeafDelegate: currentDelegatePublicKey,
  newLeafDelegate: umi.identity.publicKey, // revoke by delegating to self
}).sendAndConfirm(umi)
```

## Collections

`setCollectionV2` sets, changes, or removes the MPL-Core collection on a cNFT. See [Managing Collections](/smart-contracts/bubblegum-v2/collections) for full details.

### Set or Change a Collection

```ts {% title="set-collection.ts" %}
import {
  getAssetWithProof,
  setCollectionV2,
  MetadataArgsV2Args,
} from '@metaplex-foundation/mpl-bubblegum'
import { unwrapOption, publicKey } from '@metaplex-foundation/umi'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })
const collection = unwrapOption(assetWithProof.metadata.collection)

const metadata: MetadataArgsV2Args = {
  ...assetWithProof.metadata,
  collection: collection?.key ?? null,
}

await setCollectionV2(umi, {
  ...assetWithProof,
  metadata,
  newCollectionAuthority: newCollectionUpdateAuthority,
  newCoreCollection: publicKey('NewCollectionAddressHere'),
}).sendAndConfirm(umi)
```

### Remove a Collection

```ts {% title="remove-collection.ts" %}
import { getAssetWithProof, setCollectionV2 } from '@metaplex-foundation/mpl-bubblegum'
import { unwrapOption } from '@metaplex-foundation/umi'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })
const collection = unwrapOption(assetWithProof.metadata.collection)

await setCollectionV2(umi, {
  ...assetWithProof,
  authority: collectionAuthoritySigner,
  coreCollection: collection!.key,
}).sendAndConfirm(umi)
```

## Freeze and Thaw

Two freeze mechanisms are available. See [Freeze cNFTs](/smart-contracts/bubblegum-v2/freeze-cnfts) for the full breakdown of asset-level vs collection-level freeze.

### Freeze a cNFT (Leaf Delegate)

```ts {% title="freeze.ts" %}
import {
  getAssetWithProof,
  delegateAndFreezeV2,
} from '@metaplex-foundation/mpl-bubblegum'
import { publicKey } from '@metaplex-foundation/umi'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })

// Delegates and freezes in one instruction
await delegateAndFreezeV2(umi, {
  ...assetWithProof,
  leafOwner: umi.identity,
  newLeafDelegate: publicKey('FreezeAuthorityAddressHere'),
}).sendAndConfirm(umi)
```

### Thaw a cNFT

```ts {% title="thaw.ts" %}
import { getAssetWithProof, thawV2 } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })

await thawV2(umi, {
  ...assetWithProof,
  leafDelegate: umi.identity, // freeze authority must sign
}).sendAndConfirm(umi)
```

### Create a Soulbound cNFT

A soulbound cNFT is permanently non-transferable. The collection must have the `PermanentFreezeDelegate` plugin enabled. See [Freeze cNFTs](/smart-contracts/bubblegum-v2/freeze-cnfts#create-a-soulbound-c-nft) for setup details.

```ts {% title="soulbound.ts" %}
import { getAssetWithProof, setNonTransferableV2 } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })

await setNonTransferableV2(umi, {
  ...assetWithProof,
  // permanent freeze delegate must sign
}).sendAndConfirm(umi)
```

{% callout type="warning" %}
`setNonTransferableV2` is irreversible. The cNFT cannot be made transferable again after this call.
{% /callout %}

## Verify Creators

`verifyCreatorV2` sets the `verified` flag on a creator entry. The creator being verified must sign the transaction. See [Verify Creators](/smart-contracts/bubblegum-v2/verify-creators) for details.

### Verify a Creator

```ts {% title="verify-creator.ts" %}
import {
  getAssetWithProof,
  verifyCreatorV2,
  MetadataArgsV2Args,
} from '@metaplex-foundation/mpl-bubblegum'
import { unwrapOption, none } from '@metaplex-foundation/umi'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })
const collectionOption = unwrapOption(assetWithProof.metadata.collection)

const metadata: MetadataArgsV2Args = {
  name: assetWithProof.metadata.name,
  uri: assetWithProof.metadata.uri,
  sellerFeeBasisPoints: assetWithProof.metadata.sellerFeeBasisPoints,
  collection: collectionOption ? collectionOption.key : none(),
  creators: assetWithProof.metadata.creators,
}

await verifyCreatorV2(umi, {
  ...assetWithProof,
  metadata,
  creator: umi.identity, // the creator being verified must sign
}).sendAndConfirm(umi)
```

### Unverify a Creator

```ts {% title="unverify-creator.ts" %}
import {
  getAssetWithProof,
  unverifyCreatorV2,
  MetadataArgsV2Args,
} from '@metaplex-foundation/mpl-bubblegum'
import { unwrapOption, none } from '@metaplex-foundation/umi'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })

const metadata: MetadataArgsV2Args = {
  name: assetWithProof.metadata.name,
  uri: assetWithProof.metadata.uri,
  sellerFeeBasisPoints: assetWithProof.metadata.sellerFeeBasisPoints,
  collection: unwrapOption(assetWithProof.metadata.collection)?.key ?? none(),
  creators: assetWithProof.metadata.creators,
}

await unverifyCreatorV2(umi, {
  ...assetWithProof,
  metadata,
  creator: umi.identity,
}).sendAndConfirm(umi)
```

## Fetching cNFTs

The DAS API plugin is automatically registered by `mplBubblegum()`. See [Fetch cNFTs](/smart-contracts/bubblegum-v2/fetch-cnfts) for the full breakdown of available methods.

### Fetch a Single cNFT

```ts {% title="fetch-asset.ts" %}
import { publicKey } from '@metaplex-foundation/umi'

const asset = await umi.rpc.getAsset(assetId)
console.log('Owner:', asset.ownership.owner)
console.log('Name:', asset.content.metadata.name)
```

### Fetch cNFTs by Owner

```ts {% title="fetch-by-owner.ts" %}
import { publicKey } from '@metaplex-foundation/umi'

const result = await umi.rpc.getAssetsByOwner({
  owner: publicKey('OwnerAddressHere'),
})
console.log('cNFTs owned:', result.items.length)
```

### Fetch cNFTs by Collection

```ts {% title="fetch-by-collection.ts" %}
import { publicKey } from '@metaplex-foundation/umi'

const result = await umi.rpc.getAssetsByGroup({
  groupKey: 'collection',
  groupValue: publicKey('CollectionAddressHere'),
})
console.log('cNFTs in collection:', result.items.length)
```

### Derive Leaf Asset ID from Tree and Index

```ts {% title="find-asset-id.ts" %}
import { findLeafAssetIdPda } from '@metaplex-foundation/mpl-bubblegum'

const [assetId] = await findLeafAssetIdPda(umi, {
  merkleTree: merkleTree.publicKey,
  leafIndex: 0,
})
```

## Transaction Patterns

### Handling "Transaction Too Large" Errors

Merkle proofs grow with tree depth. Pass `truncateCanopy: true` to `getAssetWithProof` to automatically remove proof nodes already cached in the [canopy](/smart-contracts/bubblegum-v2/merkle-tree-canopy), reducing transaction size.

```ts {% title="truncate-canopy.ts" %}
import { getAssetWithProof } from '@metaplex-foundation/mpl-bubblegum'

// truncateCanopy fetches tree config and removes redundant proof nodes
const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })
```

For very deep trees where even a truncated proof exceeds the transaction limit, use [versioned transactions with Address Lookup Tables](/dev-tools/umi/toolbox/address-lookup-table).

### Send and Confirm

```ts {% title="send-and-confirm.ts" %}
const result = await mintV2(umi, { ... }).sendAndConfirm(umi)
console.log('Signature:', result.signature)
```

### Build Without Sending

```ts {% title="build-only.ts" %}
const tx = await mintV2(umi, { ... }).buildAndSign(umi)
// send later: await umi.rpc.sendTransaction(tx)
```

## Common Errors

### `Transaction too large`
The merkle proof exceeds the 1232-byte transaction limit. Use `{ truncateCanopy: true }` in `getAssetWithProof`, or implement versioned transactions with Address Lookup Tables.

### `Invalid proof`
The proof is stale — the tree was modified after you fetched the proof. Always call `getAssetWithProof` immediately before submitting a write transaction.

### `Leaf already exists` / `Invalid leaf`
The asset ID or leaf index is incorrect. Re-derive the asset ID using `findLeafAssetIdPda` or re-fetch via `getAssetsByOwner`.

### `InvalidAuthority`
You are not the owner, delegate, or required authority for this instruction. Verify the correct signer is set as `leafOwner` or `leafDelegate`.

### `Tree is full`
The merkle tree has reached its `maxDepth` capacity (`2^maxDepth` leaves). Create a new tree to continue minting.

### `Account not found` on DAS fetch
Your RPC provider may not support the Metaplex DAS API. Switch to a [compatible RPC provider](/rpc-providers).

## Notes

- `getAssetWithProof` is required before nearly every write instruction. Always call it immediately before submitting to avoid stale proof errors.
- Proofs fetched via DAS can become stale if the tree is modified between fetch and submit. High-concurrency scenarios should fetch and submit in the same atomic flow.
- `setNonTransferableV2` (soulbound) is irreversible. There is no way to restore transferability once set.
- Delegate authority resets to the new owner after any `transferV2`. The new owner must re-delegate if needed.
- This SDK targets Bubblegum V2 (`LeafSchemaV2`). It is not compatible with Bubblegum V1 trees or the decompression workflow.
- Collections used with cNFTs must have the `BubblegumV2` plugin enabled. Standard MPL-Core collections without this plugin cannot be used.

## Quick Reference

### Bubblegum V2 Functions

| Function | Purpose |
|----------|---------|
| `createTree` | Create a new Bubblegum V2 merkle tree |
| `mintV2` | Mint a new compressed NFT |
| `transferV2` | Transfer cNFT ownership |
| `burnV2` | Permanently destroy a cNFT |
| `updateMetadataV2` | Update cNFT metadata (name, URI, creators, royalties) |
| `delegate` | Approve or revoke a leaf delegate |
| `setTreeDelegate` | Approve or revoke a tree delegate |
| `setCollectionV2` | Set, change, or remove an MPL-Core collection |
| `freezeV2` | Freeze a cNFT (requires existing leaf delegate) |
| `thawV2` | Thaw a frozen cNFT |
| `delegateAndFreezeV2` | Delegate and freeze in a single instruction |
| `setNonTransferableV2` | Make a cNFT permanently soulbound (irreversible) |
| `verifyCreatorV2` | Set verified flag on a creator entry |
| `unverifyCreatorV2` | Remove verified flag from a creator entry |
| `getAssetWithProof` | Fetch all proof parameters needed for write instructions |
| `findLeafAssetIdPda` | Derive a cNFT asset ID from tree address and leaf index |
| `parseLeafFromMintV2Transaction` | Extract leaf schema (including asset ID) from a mint transaction |

### Minimum Dependencies

```json {% title="package.json" %}
{
  "dependencies": {
    "@metaplex-foundation/mpl-bubblegum": "^5.0.0",
    "@metaplex-foundation/umi": "^1.0.0",
    "@metaplex-foundation/umi-bundle-defaults": "^1.0.0"
  }
}
```

### Program Addresses

| Program | Address |
|---------|---------|
| MPL-Bubblegum V2 | `BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY` |
| SPL Account Compression | `cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK` |
| SPL Noop | `noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV` |

### Tree Size Reference

| Max Depth | Capacity | Approx. Cost |
|-----------|----------|-------------|
| 14 | 16,384 | ~0.34 SOL |
| 17 | 131,072 | ~1.1 SOL |
| 20 | 1,048,576 | ~8.5 SOL |
| 24 | 16,777,216 | ~130 SOL |
| 30 | 1,073,741,824 | ~2,000 SOL |

## FAQ

### What is the Bubblegum V2 JavaScript SDK?

The Bubblegum V2 JavaScript SDK (`@metaplex-foundation/mpl-bubblegum`) is a TypeScript library for creating and managing [compressed NFTs](/smart-contracts/bubblegum-v2) on Solana. Built on the [Umi framework](/dev-tools/umi), it provides type-safe wrappers for all MPL-Bubblegum V2 program instructions and includes the [DAS API](/smart-contracts/bubblegum-v2/fetch-cnfts) plugin automatically.

### Do I need a special RPC provider to use this SDK?

Yes. Compressed NFTs require an RPC provider supporting the Metaplex DAS API to index and fetch cNFT data. Standard Solana RPCs do not support DAS. See the [RPC Providers](/rpc-providers) page for compatible options (Helius, Triton, Shyft, and others).

### How do I get the asset ID of a cNFT after minting?

Use `parseLeafFromMintV2Transaction` with the confirmed transaction signature. It decodes the mint transaction and returns the full leaf schema including `leaf.id` (the asset ID) and `leaf.nonce` (the leaf index).

### Why do I get a "Transaction too large" error?

Merkle proofs grow with tree depth. Pass `{ truncateCanopy: true }` to `getAssetWithProof` to automatically remove proof nodes cached in the on-chain canopy. For very deep trees, use [versioned transactions with Address Lookup Tables](/dev-tools/umi/toolbox/address-lookup-table).

### Can I use this SDK with Bubblegum V1 trees?

No. This SDK targets Bubblegum V2 which uses `LeafSchemaV2` and V2 merkle trees. Use the legacy Bubblegum SDK for V1 trees. V2 trees and V1 trees are not cross-compatible.

### What is `getAssetWithProof` and why do I need it?

`getAssetWithProof` is a helper that calls both `getAsset` and `getAssetProof` on the DAS API and parses the responses into the exact parameter shape expected by Bubblegum V2 write instructions. Almost every mutation instruction (transfer, burn, update, delegate, freeze, verify) requires these parameters. Always call it immediately before submitting to avoid stale proof errors.

## Glossary

| Term | Definition |
|------|------------|
| **Umi** | Metaplex's framework for building Solana applications; handles wallet connections, RPC, and transaction building |
| **mplBubblegum** | The Umi plugin that registers all Bubblegum V2 instructions and the DAS API plugin |
| **cNFT** | Compressed NFT — stored as a hashed leaf in an on-chain merkle tree instead of a dedicated account |
| **Merkle Tree** | On-chain account storing hashed NFT data as leaves; created with `createTree` |
| **Leaf** | A single cNFT entry in the merkle tree, identified by its leaf index |
| **Proof** | A list of sibling hashes enabling cryptographic verification that a leaf belongs to a tree |
| **Canopy** | Cached upper nodes of the merkle tree stored on-chain to reduce required proof size in transactions |
| **LeafSchemaV2** | The V2 leaf data structure containing id, owner, delegate, nonce, data hash, creator hash, collection hash, asset data hash, and flags |
| **getAssetWithProof** | SDK helper that fetches and parses all DAS API data needed for write instructions |
| **DAS API** | Digital Asset Standard API — RPC extension for indexing and fetching cNFT data |
| **TreeConfig** | PDA derived from the merkle tree address storing Bubblegum tree configuration |
| **Leaf Delegate** | Account authorized by the cNFT owner to transfer, burn, or freeze the cNFT |
| **Tree Delegate** | Account authorized by the tree creator to mint cNFTs from a private tree |
| **Soulbound** | A permanently non-transferable cNFT set via `setNonTransferableV2` — irreversible |
