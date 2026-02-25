---
title: 冻结和解冻压缩NFT
metaTitle: 冻结和解冻压缩NFT - Bubblegum V2
description: 了解如何在Bubblegum上冻结和解冻压缩NFT。
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
  - q: 如何冻结压缩NFT？
    a: 使用带有叶子委托人或永久冻结委托人的freezeV2指令。cNFT必须首先委托给冻结权限。
  - q: 叶子委托人冻结和永久冻结有什么区别？
    a: 叶子委托人冻结是资产级别的，需要所有者先进行委托。永久冻结委托人在集合级别运作，无需所有者交互即可冻结集合中的任何cNFT。
  - q: 如何使cNFT成为灵魂绑定（不可转移）？
    a: 使用带有永久冻结委托人的setNonTransferableV2。集合必须启用PermanentFreezeDelegate插件。
  - q: 灵魂绑定的cNFT可以再次变为可转移的吗？
    a: 不可以。由setNonTransferableV2设置的不可转移标志是永久性的，无法撤销。
---

## Summary

**Freezing and thawing compressed NFTs** controls transferability using Bubblegum V2's freeze instructions. This page covers freeze, delegate-and-freeze, thaw, thaw-and-revoke, and making cNFTs soulbound (non-transferable).

- Freeze a cNFT via a leaf delegate or permanent freeze delegate
- Delegate and freeze in a single transaction with delegateAndFreezeV2
- Thaw a frozen cNFT and optionally revoke the delegate in one step
- Make a cNFT permanently non-transferable (soulbound) with setNonTransferableV2

通过Bubblegum V2，我们可以冻结和解冻压缩NFT。这对于各种用例很有用，例如质押。{% .lead %}

## 冻结压缩NFT

要冻结之前已委托给叶子委托人的压缩NFT，我们可以使用`freezeV2`指令。如果尚未委托，请参阅下面的`delegateAndFreezeV2`。`freezeV2`指令可以这样使用：

{% dialect-switcher title="作为叶子委托人冻结压缩NFT" %}
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
  authority: leafDelegate, // 这默认为付款人
  leafDelegate: leafDelegate.publicKey,
  // 如果cNFT是集合的一部分，传递集合地址。
  //coreCollection: collectionSigner.publicKey,
}).sendAndConfirm(umi);
```
{% /totem %}
{% totem-accordion title="作为永久冻结委托人" %}
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

## 委托并冻结压缩NFT

要冻结压缩NFT，我们可以使用`delegateAndFreezeV2`指令。此指令可以这样使用：

{% dialect-switcher title="委托并冻结压缩NFT" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}
```js
import {
  getAssetWithProof,
  delegateAndFreezeV2,
} from '@metaplex-foundation/mpl-bubblegum';

// newLeafDelegate应该是一个能够稍后解冻cNFT的publicKey。

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

## 解冻压缩NFT

要解冻压缩NFT，我们可以使用`thawV2`指令。此指令可以这样使用：

{% dialect-switcher title="作为叶子委托人解冻压缩NFT" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}
```js
import {
  getAssetWithProof,
  thawV2,
} from '@metaplex-foundation/mpl-bubblegum';

const assetWithProof = await getAssetWithProof(umi, assetId);
// delegateAuthority应该是已被批准为cNFT委托权限的签名者。
await thawV2(umi, {
  ...assetWithProof,
  authority: delegateAuthority,
}).sendAndConfirm(umi);
```
{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

如果cNFT已委托给永久冻结委托人，我们可以这样解冻它：

{% dialect-switcher title="作为永久冻结委托人解冻压缩NFT" %}
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

## 解冻并撤销委托权限

要同时解冻和撤销委托权限，我们可以使用`thawAndRevokeV2`指令。此指令可以这样使用：

{% dialect-switcher title="解冻并撤销委托权限" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}
```js
import {
  getAssetWithProof,
  thawAndRevokeV2,
} from '@metaplex-foundation/mpl-bubblegum';

// delegateAuthority应该是已被批准为cNFT委托权限的签名者。
const assetWithProof = await getAssetWithProof(umi, assetId);
await thawAndRevokeV2(umi, {
  ...assetWithProof,
  authority: delegateAuthority,
}).sendAndConfirm(umi);
```
{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 使cNFT成为灵魂绑定
要使cNFT成为灵魂绑定，cNFT必须是带有[`permanentFreezeDelegate`](/zh/smart-contracts/core/plugins/permanent-freeze-delegate)插件的[mpl-core集合](/zh/smart-contracts/core/collections)的一部分。使用`setNonTransferableV2`指令，我们可以使cNFT不可转让。

{% dialect-switcher title="使cNFT成为灵魂绑定" %}
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
    authority, // 集合上的永久冻结委托人
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
