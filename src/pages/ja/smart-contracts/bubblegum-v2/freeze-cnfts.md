---
title: 圧縮NFTの凍結と解凍
metaTitle: 圧縮NFTの凍結と解凍 - Bubblegum V2
description: Bubblegumで圧縮NFTを凍結・解凍する方法を学びます。
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

## Out of Scope


Bubblegum V2では、圧縮NFTを凍結・解凍できます。これはステーキングなどのさまざまなユースケースに役立ちます。 {% .lead %}

## 圧縮NFTの凍結

事前にリーフデリゲートに委任された圧縮NFTを凍結するには、`freezeV2`命令を使用できます。まだ委任されていない場合は、以下の`delegateAndFreezeV2`を参照してください。`freezeV2`命令は次のように使用できます：

{% dialect-switcher title="リーフデリゲートとして圧縮NFTを凍結" %}
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
  authority: leafDelegate, // これはデフォルトで支払者になります
  leafDelegate: leafDelegate.publicKey,
  // cNFTがコレクションの一部である場合、コレクションアドレスを渡します。
  //coreCollection: collectionSigner.publicKey,
}).sendAndConfirm(umi);
```
{% /totem %}
{% totem-accordion title="永続凍結デリゲートとして" %}
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

## Notes

- A cNFT must be delegated to a leaf delegate before it can be frozen with `freezeV2`. Use `delegateAndFreezeV2` to do both in one transaction.
- The permanent freeze delegate operates at the collection level and requires the `PermanentFreezeDelegate` plugin on the collection.
- Soulbound (non-transferable) status set by `setNonTransferableV2` is **permanent** and cannot be reversed.
- Frozen cNFTs cannot be transferred or burned by the owner. Only the freeze authority can thaw them.

## FAQ

#

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
