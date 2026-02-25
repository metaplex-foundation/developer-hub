---
title: Updating Compressed NFTs
metaTitle: Updating Compressed NFTs - Bubblegum V2 - Metaplex
description: Learn how to update compressed NFT metadata using Bubblegum V2. Covers update authority for collection-based and tree-based cNFTs.
created: '01-15-2025'
updated: '02-24-2026'
keywords:
  - update compressed NFT
  - update cNFT
  - NFT metadata update
  - Bubblegum update
  - updateMetadataV2
about:
  - Compressed NFTs
  - NFT metadata
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Who can update a compressed NFT's metadata?
    a: If the cNFT belongs to a collection, only the collection authority can update it. If it does not belong to a collection, the tree authority (tree creator or delegate) can update it.
  - q: What fields can I update on a cNFT?
    a: You can update the name, URI, seller fee basis points, and other metadata fields defined in UpdateArgsArgs. Use some('newValue') for fields you want to change.
  - q: Do I need to pass the collection when updating?
    a: Yes, if the cNFT belongs to a collection. Pass the coreCollection parameter with the collection's public key. The collection authority must sign the transaction.
---

## Summary

**Updating a compressed NFT** modifies its metadata using the **updateMetadataV2** instruction. This page covers update authority rules for collection-based and tree-based cNFTs.

- Update cNFT metadata (name, URI, creators, royalties) using updateMetadataV2
- Collection authority updates cNFTs that belong to a collection
- Tree authority updates cNFTs that do not belong to a collection
- Changes are reflected in the merkle tree and indexed by DAS API providers

The **updateMetadataV2** instruction can be used to modify the metadata of a Compressed NFT. The Merkle root is updated to reflect the propagated hash of the data, and RPC providers who conform to the [Metaplex DAS API](https://github.com/metaplex-foundation/digital-asset-standard-api) will update their index of the cNFTs.

The metadata can be updated by one of two authorities, depending on if the compressed NFT is a verified item in a collection.

## Update Authority

A cNFT has two possible update authorities: the tree owner, or (if it belongs to a collection) the collection authority.

### Collection Authority

If your cNFT belongs to a collection, then the update authority of that cNFT will be the authority of the collection. When updating the cNFT you will need to pass in a `coreCollection` arg to the update function.

The authority will be inferred from the current umi identity. If the authority is different from the current umi identity, then you will either have to pass in the `authority` arg as a signer type or create a `noopSigner` for later signing.

```js
await updateMetadataV2(umi, {
  ...
  authority: collectionAuthority,
  coreCollection: publicKey("11111111111111111111111111111111"),
}).sendAndConfirm(umi)
```

### Tree Authority

If your cNFT does not belong to a collection then the update authority for the cNFT will be the authority of the tree that the cNFT belongs to. In this case, you would **omit** the `coreCollection` arg from the update function.

The authority will be inferred from the current umi identity. If the authority is different from the current umi identity, then you will either have to pass in the `authority` arg as a signer type or create a `noopSigner` for later signing.

## Update cNFT

{% dialect-switcher title="Update a Compressed NFT" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  updateMetadataV2,
  UpdateArgsArgs,
} from '@metaplex-foundation/mpl-bubblegum'
import { some } from '@metaplex-foundation/umi'

// Use the helper to fetch the asset and proof.
const assetWithProof = await getAssetWithProof(umi, assetId, {
  truncateCanopy: true,
})

// Then we can use it to update metadata for the NFT.
const updateArgs: UpdateArgsArgs = {
  name: some('New name'),
  uri: some('https://updated-example.com/my-nft.json'),
}
await updateMetadataV2(umi, {
  ...assetWithProof,
  leafOwner,
  currentMetadata: assetWithProof.metadata,
  updateArgs,
  // Optional param. If your authority is a different signer type 
  // than the current umi identity assign that signer here.
  authority: <Signer>,
  // Optional param. If cNFT belongs to a collection pass it here.
  coreCollection: publicKey("22222222222222222222222222222222"),
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}


## Notes

- The update authority depends on whether the cNFT belongs to a collection. Collection cNFTs use the collection authority; standalone cNFTs use the tree authority.
- You must pass `currentMetadata` from `getAssetWithProof` so the program can verify the current leaf before applying updates.
- Use `some()` for fields you want to update and omit fields you want to keep unchanged.

## FAQ

### Who can update a compressed NFT's metadata?

If the cNFT belongs to a collection, only the collection authority can update it. If it does not belong to a collection, the tree authority (tree creator or delegate) can update it.

### What fields can I update on a cNFT?

You can update the name, URI, seller fee basis points, and other metadata fields defined in `UpdateArgsArgs`. Use `some('newValue')` for fields you want to change.

### Do I need to pass the collection when updating?

Yes, if the cNFT belongs to a collection. Pass the `coreCollection` parameter with the collection's public key. The collection authority must sign the transaction.

## Glossary

| Term | Definition |
|------|------------|
| **updateMetadataV2** | The Bubblegum V2 instruction for modifying compressed NFT metadata |
| **Collection Authority** | The update authority of the MPL-Core collection, authorized to update cNFTs in that collection |
| **Tree Authority** | The tree creator or delegate, authorized to update cNFTs that do not belong to a collection |
| **UpdateArgsArgs** | The TypeScript type defining which metadata fields to update, using Option wrappers |
| **currentMetadata** | The existing metadata of the cNFT, fetched via getAssetWithProof and required for verification |
