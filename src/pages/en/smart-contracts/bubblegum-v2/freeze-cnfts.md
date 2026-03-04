---
title: Freezing and Thawing Compressed NFTs
metaTitle: Freezing and Thawing Compressed NFTs - Bubblegum V2 - Metaplex
description: Learn how to freeze, thaw, and make soulbound compressed NFTs on Bubblegum V2. Covers leaf delegates, permanent freeze delegates, and non-transferable cNFTs.
created: '01-15-2025'
updated: '02-24-2026'
keywords:
  - freeze NFT
  - thaw NFT
  - soulbound NFT
  - non-transferable NFT
  - permanent freeze
  - freezeV2
  - delegateAndFreezeV2
about:
  - Compressed NFTs
  - NFT freezing
  - Soulbound tokens
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: How do I freeze a compressed NFT?
    a: Use the freezeV2 instruction with a leaf delegate or permanent freeze delegate. The cNFT must first be delegated to the freeze authority.
  - q: What is the difference between a leaf delegate freeze and a permanent freeze?
    a: A leaf delegate freeze is asset-level and requires the owner to delegate first. A permanent freeze delegate operates at the collection level and can freeze any cNFT in the collection without owner interaction.
  - q: How do I make a cNFT soulbound (non-transferable)?
    a: Use setNonTransferableV2 with a permanent freeze delegate. The collection must have the PermanentFreezeDelegate plugin enabled.
  - q: Can a soulbound cNFT be made transferable again?
    a: No. The non-transferable flag set by setNonTransferableV2 is permanent and cannot be reversed.
---

## Summary

**Freezing and thawing compressed NFTs** controls transferability using Bubblegum V2's freeze instructions. This page covers freeze, delegate-and-freeze, thaw, thaw-and-revoke, and making cNFTs soulbound (non-transferable).

- Freeze a cNFT via a leaf delegate or permanent freeze delegate
- Delegate and freeze in a single transaction with delegateAndFreezeV2
- Thaw a frozen cNFT and optionally revoke the delegate in one step
- Make a cNFT permanently non-transferable (soulbound) with setNonTransferableV2

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
To make a cNFT Soulbound the cNFT has to be part of a [mpl-core collection](/smart-contracts/core/collections) with the [`permanentFreezeDelegate`](/smart-contracts/core/plugins/permanent-freeze-delegate) Plugin. Using the `setNonTransferableV2` instruction, we can make the cNFT non-transferable.

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


## Notes

- A cNFT must be delegated to a leaf delegate before it can be frozen with `freezeV2`. Use `delegateAndFreezeV2` to do both in one transaction.
- The permanent freeze delegate operates at the collection level and requires the `PermanentFreezeDelegate` plugin on the collection.
- Soulbound (non-transferable) status set by `setNonTransferableV2` is **permanent** and cannot be reversed.
- Frozen cNFTs cannot be transferred or burned by the owner. Only the freeze authority can thaw them.

## FAQ

### How do I freeze a compressed NFT?

Use `freezeV2` with a leaf delegate or permanent freeze delegate. If the cNFT hasn't been delegated yet, use `delegateAndFreezeV2` to delegate and freeze in one transaction.

### What is the difference between a leaf delegate freeze and a permanent freeze?

A leaf delegate freeze is asset-level — the owner must delegate first. A permanent freeze delegate is collection-level — it can freeze any cNFT in the collection without owner interaction, if the PermanentFreezeDelegate plugin is enabled.

### How do I make a cNFT soulbound?

Use `setNonTransferableV2` with the permanent freeze delegate authority. The collection must have the `PermanentFreezeDelegate` plugin. This is permanent and cannot be reversed.

### Can a soulbound cNFT be made transferable again?

No. The non-transferable flag is permanent. Once a cNFT is made soulbound, it cannot be transferred to another wallet.

## Glossary

| Term | Definition |
|------|------------|
| **freezeV2** | Instruction that freezes a cNFT, preventing transfers until thawed |
| **thawV2** | Instruction that unfreezes a cNFT, allowing transfers again |
| **delegateAndFreezeV2** | Instruction that delegates to a leaf delegate and freezes the cNFT in one transaction |
| **thawAndRevokeV2** | Instruction that thaws a cNFT and revokes the delegate authority in one transaction |
| **setNonTransferableV2** | Instruction that permanently makes a cNFT non-transferable (soulbound) |
| **Permanent Freeze Delegate** | A collection-level authority that can freeze/thaw any cNFT without owner consent |
| **Soulbound** | A non-transferable cNFT permanently bound to its owner's wallet |
