---
title: Managing Collections
metaTitle: Managing Collections - Bubblegum V2 - Metaplex
description: Learn how to set, change, and remove MPL-Core collections on compressed NFTs using Bubblegum V2. Covers the setCollectionV2 instruction.
created: '01-15-2025'
updated: '02-24-2026'
keywords:
  - NFT collection
  - verify collection
  - cNFT collection
  - MPL-Core collection
  - setCollectionV2
  - BubblegumV2 plugin
about:
  - Compressed NFTs
  - NFT collections
  - MPL-Core
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: How do I add a cNFT to a collection after minting?
    a: Use the setCollectionV2 instruction with the newCoreCollection parameter. The collection must have the BubblegumV2 plugin enabled.
  - q: Can I change the collection of a cNFT?
    a: Yes. Use setCollectionV2 with both coreCollection (current) and newCoreCollection (new) parameters. Both collection authorities must sign.
  - q: What is the BubblegumV2 plugin?
    a: It is an MPL-Core collection plugin that enables Bubblegum V2 features like freeze/thaw, soulbound cNFTs, and royalty enforcement on the collection.
---

## Summary

**Managing collections** for compressed NFTs uses the **setCollectionV2** instruction to add, change, or remove MPL-Core collections on existing cNFTs. This page covers setting and removing collections after minting.

- Set an MPL-Core collection on an existing cNFT using setCollectionV2
- Remove a collection from a cNFT
- Change between collections (both authorities must sign)
- Collections must have the BubblegumV2 plugin enabled

A cNFT can be added to an MPL-Core Collection either on mint or later. {% .lead %}

If you are not familiar with the concept of collections with regard to NFTs, they are special non-compressed NFTs that can be used to group other NFTs together. The data of the **Collection** is therefore used to describe the name and the branding of the entire collection. Since Bubblegum V2, it also allows additional features on collection level, like allowing freezing and thawing of cNFTs by a delegate without the need of interaction by the leaf owner. You can [read more about MPL-Core Collections here](/smart-contracts/core/collections).
Note that it is possible to mint a Compressed NFT directly into a collection by using the **MintV2** instruction [documented here](/smart-contracts/bubblegum-v2/mint-cnfts#minting-to-a-collection). That being said, if you have already minted a cNFT without a collection, let's see how we can set the collection on that cNFT. Unlike Bubblegum v1, which uses Metaplex Token Metadata Collections which have a "verified" boolean, Bubblegum V2 uses MPL-Core Collections which do not have that boolean.

The MPL-Core Collection has to contain the [`BubblegumV2` plugin](/smart-contracts/core/plugins/bubblegum).

The following sections show how to set and remove a collection from a cNFT in single-step transactions. It is also possible to do both operations in a single instruction when adding the `coreCollection` and `newCoreCollection` parameters. If both collection authorities are not the same wallet, both have to sign.

## Set the Collection of a Compressed NFT
The **setCollectionV2** instruction can be used to set the collection of a cNFT. It can also be used to remove the collection from a cNFT or change the collection of a cNFT.

{% dialect-switcher title="Set the Collection of a Compressed NFT" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  setCollectionV2,
  MetadataArgsV2Args
} from '@metaplex-foundation/mpl-bubblegum';
import {
  unwrapOption,
  none,
} from '@metaplex-foundation/umi';

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});

const collection = unwrapOption(assetWithProof.metadata.collection)

const metadata: MetadataArgsV2Args = {
  ...assetWithProof.metadata,
  collection: collection?.key ?? null,
};

const signature = await setCollectionV2(umi, {
  ...assetWithProof,
  newCollectionAuthority: newCollectionUpdateAuthority,
  metadata,
  newCoreCollection: newCoreCollection.publicKey,
}).sendAndConfirm(umi);
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Remove the Collection of a Compressed NFT
The **setCollectionV2** instruction can also be used to remove the collection from a cNFT.

{% dialect-switcher title="Remove the Collection of a Compressed NFT" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  setCollectionV2,
  MetadataArgsV2Args
} from '@metaplex-foundation/mpl-bubblegum'
import {
  unwrapOption,
  none,
} from '@metaplex-foundation/umi';

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});

const collection = unwrapOption(assetWithProof.metadata.collection)

const signature = await setCollectionV2(umi, {
  ...assetWithProof,
  authority: collectionAuthoritySigner,
  coreCollection: collection!.key
}).sendAndConfirm(umi);
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}


## Notes

- The MPL-Core collection must have the `BubblegumV2` plugin enabled before cNFTs can be added to it.
- Unlike Bubblegum V1 (which uses Token Metadata collections with a "verified" boolean), V2 uses MPL-Core collections without verification flags.
- When changing between collections, both the old and new collection authorities must sign the transaction.

## FAQ

### How do I add a cNFT to a collection after minting?

Use the `setCollectionV2` instruction with the `newCoreCollection` parameter set to the collection's public key. The collection authority must sign.

### Can I change the collection of a cNFT?

Yes. Use `setCollectionV2` with both `coreCollection` (current) and `newCoreCollection` (new). Both collection authorities must sign if they are different accounts.

### What is the BubblegumV2 plugin?

It is an MPL-Core collection plugin that enables Bubblegum V2 features like freeze/thaw, soulbound cNFTs, royalty enforcement, and permanent delegates on the collection level.

## Glossary

| Term | Definition |
|------|------------|
| **setCollectionV2** | The Bubblegum V2 instruction for setting, changing, or removing the collection of a cNFT |
| **MPL-Core Collection** | A Core standard collection account used to group cNFTs in Bubblegum V2 |
| **BubblegumV2 Plugin** | An MPL-Core plugin that enables V2 features on a collection (freeze, soulbound, royalties) |
| **Collection Authority** | The update authority of the MPL-Core collection |
