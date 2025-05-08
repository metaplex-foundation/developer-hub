---
title: Freezing and Thawing Compressed NFTs
metaTitle: Freezing and Thawing Compressed NFTs | Bubblegum v2
description: Learn how to freeze and thaw Compressed NFTs on Bubblegum.
---

With Bubblegum v2, we can freeze and thaw Compressed NFTs. This is useful for various use cases, such as staking. {% .lead %}

## Freezing a Compressed NFT

To freeze a Compressed NFT, we can use the `freezeV2` instruction. This instruction accepts the following parameters:

```js
import {
  getAssetWithProof,
  freezeV2,
} from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId);
await freezeV2(umi, {
  ...assetWithProof,
  leafOwner: umi.identity.publicKey,
  coreCollection: collectionSigner.publicKey,
}).sendAndConfirm(umi)
```

## Thawing a Compressed NFT

To thaw a Compressed NFT, we can use the `thawV2` instruction. This instruction accepts the following parameters:

```js
import {
  getAssetWithProof,
  thawV2,
} from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId);
// delegateAuthority should be a Signer that has been approved as a delegate authority for the cNFT.
await thawV2(umi, {
  ...assetWithProof,
  authority: delegateAuthority,
}).sendAndConfirm(umi);
```

## Thaw and Revoke a Delegate Authority

To thaw and revoke a Delegate Authority at the same time, we can use the `thawAndRevokeV2` instruction. This instruction accepts the following parameters:

```js
import {
  getAssetWithProof,
  thawAndRevokeV2,
} from '@metaplex-foundation/mpl-bubblegum'

// delegateAuthority should be a Signer that has been approved as a delegate authority for the cNFT.
const assetWithProof = await getAssetWithProof(umi, assetId);
await thawAndRevokeV2(umi, {
  ...assetWithProof,
  authority: delegateAuthority,
}).sendAndConfirm(umi);
```

## Make a cNFT Soulbound
To make a cNFT Soulbound the cNFT has to be part of a [mpl-core collection](/core/collections) with the [`permanentFreezeDelegate`](/core/plugins/permanent-freeze-delegate) Plugin. Using the `setNonTransferableV2` instruction we can make the cNFT non-transferable.

```js
import {
  getAssetWithProof,
  setNonTransferableV2,
} from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId);

await setNonTransferableV2(umi, {
    ...assetWithProof,
    authority, // The permanent freeze delegate on collection
    coreCollection: collection.publicKey,
}).sendAndConfirm(umi);
```
