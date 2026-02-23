---
title: Minting Compressed NFTs
metaTitle: Minting Compressed NFTs - Bubblegum V2 - Metaplex
description: Learn how to mint compressed NFTs on Bubblegum V2. Covers minting with and without collections, MPL-Core collection setup, and retrieving the asset ID from mint transactions.
created: '01-15-2025'
updated: '02-24-2026'
keywords:
  - mint compressed NFT
  - mint cNFT
  - NFT minting
  - Bubblegum mint
  - collection mint
  - mintV2
  - MPL-Core collection
about:
  - Compressed NFTs
  - NFT minting
  - Solana transactions
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: How do I mint a compressed NFT to a collection?
    a: Use the mintV2 instruction with the coreCollection parameter set to your MPL-Core collection address. The collection must have the BubblegumV2 plugin enabled.
  - q: How do I get the asset ID after minting?
    a: Use the parseLeafFromMintV2Transaction helper after the transaction is finalized. It returns the leaf schema including the asset ID.
  - q: Can anyone mint from my tree?
    a: Only if the tree is set to public. For private trees, only the tree creator or tree delegate can mint.
  - q: What metadata fields are required for minting?
    a: The MetadataArgsV2 requires name, uri, sellerFeeBasisPoints, collection (or none), and creators array.
---

## Summary

**Minting compressed NFTs** adds new cNFTs to a Bubblegum Tree using the **mintV2** instruction. This page covers minting with and without MPL-Core collections, and retrieving the asset ID from mint transactions.

- Mint cNFTs to a Bubblegum Tree using the mintV2 instruction
- Mint directly into an MPL-Core collection with the BubblegumV2 plugin
- Retrieve the asset ID and leaf schema from the mint transaction
- Configure metadata including name, URI, creators, and royalties

## Out of Scope

This page does not cover: tree creation (see [Creating Trees](/smart-contracts/bubblegum-v2/create-trees)), updating metadata after mint (see [Updating cNFTs](/smart-contracts/bubblegum-v2/update-cnfts)), or collection management (see [Collections](/smart-contracts/bubblegum-v2/collections)).

In [the previous page](/smart-contracts/bubblegum-v2/create-trees), we saw that we need a Bubblegum Tree to mint Compressed NFTs, and we saw how to create one. Now, let's see how to mint compressed NFTs from a given Bubblegum Tree. {% .lead %}

The Bubblegum program offers multiple minting instructions for the different leaf schema versions. Bubblegum V2 introduces a new minting instruction called **mintV2** that is used to mint Compressed NFTs either to a given Collection or without a Collection.

## Minting without a Collection

The Bubblegum program provides the **mintV2** instruction that enables us to mint Compressed NFTs from a Bubblegum Tree. If the Bubblegum Tree is public, anyone will be able to use this instruction. Otherwise, only the Tree Creator or the Tree Delegate will be able to do so.

The main parameters of the **mintV2** instruction are:

- **Merkle Tree**: The Merkle Tree address from which the Compressed NFT will be minted.
- **Tree Creator Or Delegate**: The authority allowed to mint from the Bubblegum Tree — this can either be the creator or the delegate of the tree. This authority must sign the transaction. In the case of a public tree, this parameter can be any authority, but must still be a signer.
- **Leaf Owner**: The owner of the Compressed NFT that will be minted. It defaults to the payer of the transaction.
- **Leaf Delegate**: A delegate authority allowed to manage the minted cNFT, if any. Otherwise, it is set to the Leaf Owner.
- **Collection Authority**: The authority allowed to manage the given Collection.
- **Core Collection**: The MPL-Core Collection NFT to which the Compressed NFT will be added.
- **Metadata**: The metadata of the Compressed NFT that will be minted. It contains information such as the **Name** of the NFT, its **URI**, its **Collection**, its **Creators**, etc. In Bubblegum V2 the metadata is using `MetadataArgsV2` which excludes unneeded fields like `uses` and the `verified` flag for the collection.

{% dialect-switcher title="Mint a Compressed NFT without a Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { none } from '@metaplex-foundation/umi';
import { mintV2 } from '@metaplex-foundation/mpl-bubblegum';

await mintV2(umi, {
  leafOwner: umi.identity.publicKey,
  merkleTree: merkleTree.publicKey,
  metadata: {
    name: 'My NFT',
    uri: 'https://example.com/my-nft.json',
    sellerFeeBasisPoints: 550, 
    collection: none(),
    creators: [],
  },
}).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}

## Minting to a Collection

While it is possible to set and verify a Collection for a Compressed NFT _after_ it is minted, Bubblegum V2 allows you to mint a Compressed NFT directly to a given Collection. Bubblegum V2 uses MPL-Core Collections to group the compressed NFTs. The same **mintV2** instruction is used for that. In addition to the parameters described above, you need to pass in the core collection and sign as collection authority or delegate:

- **Core Collection**: The mint address passed to the `coreCollection` parameter, pointing to the MPL-Core Collection NFT…
- **Collection Authority**: The authority allowed to manage the given Collection NFT. This can either be the update authority of the Collection NFT or a delegated collection authority. This authority must sign the transaction regardless of whether the Bubblegum Tree is public or not.

Note that the **Metadata** parameter must contain the **Collection** Public Key.

{% dialect-switcher title="Mint a Compressed NFT to a Collection" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { some } from '@metaplex-foundation/umi';
import { mintV2 } from '@metaplex-foundation/mpl-bubblegum';

await mintV2(umi, {
  collectionAuthority: umi.identity,
  leafOwner: umi.identity.publicKey,
  merkleTree: merkleTree.publicKey,
  coreCollection: collectionSigner.publicKey,
  metadata: {
    name: 'My NFT',
    uri: 'https://example.com/my-nft.json',
    sellerFeeBasisPoints: 550, // 5.5%
    collection: some(collectionSigner.publicKey),
    creators: [],
  },
}).sendAndConfirm(umi);
```

{% totem-accordion title="Create a MPL-Core Collection" %}

If you do not have a Collection yet, you can create one using the [`@metaplex-foundation/mpl-core` library](/smart-contracts/core/collections#creating-a-collection-with-plugins). Keep in mind that you need to add the `BubblegumV2` Plugin to the collection, too.
npm install @metaplex-foundation/mpl-core
And create a Collection like so:

```ts
import { generateSigner } from '@metaplex-foundation/umi';
import { createCollection } from '@metaplex-foundation/mpl-core';

const collectionSigner = generateSigner(umi);
await createCollection(umi, {
    collection: collectionSigner,
    name: "My Collection",
    uri: "https://example.com/my-nft.json",
    plugins: [
      {
        type: "BubblegumV2",
      },
    ],
  }).sendAndConfirm(umi);
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### Get Asset ID and Leaf Schema from mint transaction {% #get-leaf-schema-from-mint-transaction %}

You can retrieve the leaf and determine the asset ID from the `mintV2` transaction using the `parseLeafFromMintV2Transaction` helper. This function parses the Transaction, therefore you have to make sure that it has been finalized before calling `parseLeafFromMintV2Transaction`.

{% callout type="note" title="Transaction finalization" %}
Please make sure that the transaction has been finalized before calling `parseLeafFromMintV2Transaction`.
{% /callout %}

{% dialect-switcher title="Get leaf schema from mint transaction" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  mintV2,
  parseLeafFromMintV2Transaction,
} from '@metaplex-foundation/mpl-bubblegum';

const { signature } = await mintV2(umi, {
  // ... see details above
}).sendAndConfirm(umi);

const leaf = await parseLeafFromMintV2Transaction(umi, signature);
const assetId = leaf.id;
```

{% /dialect %}
{% /dialect-switcher %}


## Notes

- The Bubblegum Tree must be created before minting. See [Creating Trees](/smart-contracts/bubblegum-v2/create-trees).
- For collection mints, the MPL-Core collection must have the `BubblegumV2` plugin enabled.
- The collection authority must sign the transaction when minting to a collection, regardless of whether the tree is public or private.
- Use `parseLeafFromMintV2Transaction` only after the transaction is **finalized**, not just confirmed.

## FAQ

### How do I mint a compressed NFT to a collection?

Use the `mintV2` instruction with the `coreCollection` parameter set to your MPL-Core collection address and provide the `collectionAuthority` signer. The collection must have the `BubblegumV2` plugin enabled.

### How do I get the asset ID after minting?

Use the `parseLeafFromMintV2Transaction` helper after the transaction is finalized. It parses the transaction and returns the leaf schema including the asset ID via `leaf.id`.

### Can anyone mint from my tree?

Only if the tree was created with `public: true`. For private trees, only the Tree Creator or Tree Delegate can mint cNFTs.

### What metadata fields are required for minting?

The `MetadataArgsV2` struct requires: `name` (string), `uri` (string pointing to JSON metadata), `sellerFeeBasisPoints` (0-10000), `collection` (public key or none), and `creators` (array of creator objects).

## Glossary

| Term | Definition |
|------|------------|
| **mintV2** | The Bubblegum V2 instruction for minting compressed NFTs, replacing the V1 mint instructions |
| **MetadataArgsV2** | The metadata structure passed to mintV2, containing name, URI, royalties, collection, and creators |
| **Collection Authority** | The signer authorized to manage the MPL-Core collection — required when minting to a collection |
| **BubblegumV2 Plugin** | An MPL-Core collection plugin that enables Bubblegum V2 features (freeze, soulbound, royalties) |
| **Asset ID** | A PDA derived from the merkle tree address and leaf index, uniquely identifying a compressed NFT |
| **Leaf Schema** | The data structure stored as a leaf in the merkle tree, containing the cNFT's hashed metadata and ownership info |
