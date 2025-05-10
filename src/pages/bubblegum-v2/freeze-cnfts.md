---
title: Freezing and Thawing Compressed NFTs
metaTitle: Freezing and Thawing Compressed NFTs | Bubblegum V2
description: Learn how to freeze and thaw Compressed NFTs on Bubblegum.
---

With Bubblegum V2, we can freeze and thaw Compressed NFTs. This is useful for various use cases, such as staking. {% .lead %}

## Freezing a Compressed NFT

To freeze a Compressed NFT that has been delegated to a leaf delegate before, we can use the `freezeV2` instruction. If it has not been delegated yet, see `delegateAndFreezeV2` below. The `freezeV2` instruction can be used like this:

{% dialect-switcher title="Freeze a Compressed NFT as a leaf delegate" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}
```js
import {
  getAssetWithProof,
  freezeV2,
} from '@metaplex-foundation/mpl-bubblegum';

const assetWithProof = await getAssetWithProof(umi, assetId);
await freezeV2(umi, {
  ...assetWithProof,
  leafOwner: umi.identity.publicKey,
  authority: leafDelegate, // this would default to the payer
  leafDelegate: leafDelegate.publicKey,
  // If the cNFT is part of a collection, pass the collection address.
  //coreCollection: collectionSigner.publicKey,
}).sendAndConfirm(umi);
```
{% /totem %}
{% totem-accordion title="as a permanent freeze delegate" %}
```js
import {
  getAssetWithProof,
  freezeV2,
} from '@metaplex-foundation/mpl-bubblegum';

const assetWithProof = await getAssetWithProof(umi, assetId);
await freezeV2(umi, {
  ...assetWithProof,
  leafOwner: umi.identity.publicKey,
  authority: permanentFreezeDelegate,
  leafDelegate: permanentFreezeDelegate.publicKey,
  coreCollection: collectionSigner.publicKey,
}).sendAndConfirm(umi);
```
{% /totem-accordion %}
{% /dialect %}
{% /dialect-switcher %}

## Delegate and Freeze a Compressed NFT

To freeze a Compressed NFT, we can use the `delegateAndFreezeV2` instruction. This instruction can be used like this:

{% dialect-switcher title="Delegate and Freeze a Compressed NFT" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}
```js
import {
  getAssetWithProof,
  delegateAndFreezeV2,
} from '@metaplex-foundation/mpl-bubblegum';

// newLeafDelegate should be a publicKey that will be able to thaw the cNFT later.

const assetWithProof = await getAssetWithProof(umi, assetId);
await delegateAndFreezeV2(umi, {
  ...assetWithProof,
  leafOwner: umi.identity.publicKey,
  newLeafDelegate,
}).sendAndConfirm(umi);

```
{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Thawing a Compressed NFT

To thaw a Compressed NFT, we can use the `thawV2` instruction. This instruction can be used like this:

{% dialect-switcher title="Thaw a Compressed NFT as a leaf delegate" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}
```js
import {
  getAssetWithProof,
  thawV2,
} from '@metaplex-foundation/mpl-bubblegum';

const assetWithProof = await getAssetWithProof(umi, assetId);
// delegateAuthority should be a Signer that has been approved as a delegate authority for the cNFT.
await thawV2(umi, {
  ...assetWithProof,
  authority: delegateAuthority,
}).sendAndConfirm(umi);
```
{% /totem %}    
{% /dialect %}
{% /dialect-switcher %}

If the cNFT has been delegated to a permanent freeze delegate, we can thaw it like this:

{% dialect-switcher title="Thaw a Compressed NFT as a permanent freeze delegate" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}
```js
import {
  getAssetWithProof,
  thawV2,
} from '@metaplex-foundation/mpl-bubblegum';

const assetWithProof = await getAssetWithProof(umi, assetId);
await thawV2(umi, {
  ...assetWithProof,
  authority: permanentFreezeDelegate,
}).sendAndConfirm(umi);
```
{% /totem %}    
{% /dialect %}
{% /dialect-switcher %}


## Thaw and Revoke a Delegate Authority

To thaw and revoke a Delegate Authority at the same time, we can use the `thawAndRevokeV2` instruction. This instruction can be used like this:

{% dialect-switcher title="Thaw and Revoke a Delegate Authority" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}
```js
import {
  getAssetWithProof,
  thawAndRevokeV2,
} from '@metaplex-foundation/mpl-bubblegum';

// delegateAuthority should be a Signer that has been approved as a delegate authority for the cNFT.
const assetWithProof = await getAssetWithProof(umi, assetId);
await thawAndRevokeV2(umi, {
  ...assetWithProof,
  authority: delegateAuthority,
}).sendAndConfirm(umi);
```
{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Make a cNFT Soulbound
To make a cNFT Soulbound the cNFT has to be part of a [mpl-core collection](/core/collections) with the [`permanentFreezeDelegate`](/core/plugins/permanent-freeze-delegate) Plugin. Using the `setNonTransferableV2` instruction, we can make the cNFT non-transferable.

{% dialect-switcher title="Make a cNFT Soulbound" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}
```js
import {
  getAssetWithProof,
  setNonTransferableV2,
} from '@metaplex-foundation/mpl-bubblegum';

const assetWithProof = await getAssetWithProof(umi, assetId);

await setNonTransferableV2(umi, {
    ...assetWithProof,
    authority, // The permanent freeze delegate on collection
    coreCollection: collection.publicKey,
}).sendAndConfirm(umi);
```
{% /totem %}
{% /dialect %}
{% /dialect-switcher %}