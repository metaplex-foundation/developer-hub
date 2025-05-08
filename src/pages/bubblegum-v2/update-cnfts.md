---
title: Updating Compressed NFTs
metaTitle: Updating Compressed NFTs | Bubblegum V2
description: Learn how to update compressed NFTs on Bubblegum.
---

The **updateMetadataV2** instruction can be used to modify the metadata of a Compressed NFT. The Merkle root is updated to reflect the propagated hash of the data, and RPC providers who conform to the [Metaplex DAS API](https://github.com/metaplex-foundation/digital-asset-standard-api) will update their index of the cNFTs.

The metadata can be updated by one of two authorities, depending on if the compressed NFT is a verified item in a collection.

## Update Authority

There are two possible update authorities for a cNFT which are either the tree owner or the collection authority if the cNFT belongs to a collection.

### Collection Authority

If your cNFT belongs to a collection then the update authority of that cNFT will be the authority of the collection. When updating the cNFT you will need to pass in a `coreCollection` arg to the update function.

The authority will be inferred from the current umi identity. If the authority is different from the current umi identity, then you will either have to pass in the `authority` arg as a signer type or create a 'noopSigner' for later signing.

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
