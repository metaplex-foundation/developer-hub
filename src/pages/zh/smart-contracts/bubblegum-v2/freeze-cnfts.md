---
title: 冻结和解冻压缩NFT
metaTitle: 冻结和解冻压缩NFT | Bubblegum V2
description: 了解如何在Bubblegum上冻结和解冻压缩NFT。
---

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
