---
title: 转移压缩NFT
metaTitle: 转移压缩NFT | Bubblegum V2
description: 了解如何在Bubblegum上转移压缩NFT。
---

**transferV2**指令可用于将压缩NFT从一个所有者转移到另一个。要授权转移，当前所有者或委托权限（如果有）必须签署交易。委托权限可以是叶子委托人或集合的`permanentTransferDelegate`。

请注意，此指令更新压缩NFT，因此会替换Bubblegum树上的叶子。这意味着必须提供额外的参数来验证压缩NFT的完整性。由于这些参数对于所有改变叶子的指令都是通用的，它们在[以下FAQ](/zh/bubblegum-v2/faq#replace-leaf-instruction-arguments)中有记录。幸运的是，我们可以使用辅助方法，该方法将使用Metaplex DAS API自动为我们获取这些参数。

{% callout title="交易大小" type="note" %}
如果遇到交易大小错误，请考虑在`getAssetWithProof`中使用`{ truncateCanopy: true }`。详见[FAQ](/zh/bubblegum-v2/faq#replace-leaf-instruction-arguments)。
{% /callout %}

## 转移Bubblegum V2压缩NFT

该指令接受以下参数：

- **叶子所有者**：压缩NFT的当前所有者。默认为交易的付款人。
- **叶子委托人**：压缩NFT的当前所有者及其委托权限（如果有）。其中一个必须签署交易。
- **权限**：签署交易的可选权限。可以是叶子所有者或`permanentTransferDelegate`，默认为交易的`payer`。
- **新叶子所有者**：压缩NFT新所有者的地址
- **默克尔树**：Bubblegum树的地址
- **根**：Bubblegum树的当前根
- **数据哈希**：压缩NFT元数据的哈希
- **创作者哈希**：压缩NFT创作者的哈希
- **Nonce**：压缩NFT的nonce
- **索引**：压缩NFT的索引
- **集合**：压缩NFT的核心集合（如果cNFT是集合的一部分）

使用JavaScript时，我们建议首先使用`getAssetWithProof`函数获取参数，然后将它们传递给`transferV2`指令。

{% dialect-switcher title="转移压缩NFT" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, transferV2 } from '@metaplex-foundation/mpl-bubblegum';
const assetWithProof = await getAssetWithProof(umi, assetId, {
  truncateCanopy: true,
})

// 然后leafOwnerA可以用它将NFT转移给leafOwnerB。
const leafOwnerB = generateSigner(umi)
await transferV2(umi, {
  // 从带证明的资产传递参数。
  ...assetWithProof,
  authority: leafOwnerA,
  newLeafOwner: leafOwnerB.publicKey,
  // 如果cNFT是集合的一部分，传递核心集合。
  //coreCollection: coreCollection.publicKey,
}).sendAndConfirm(umi)
```

{% totem-accordion title="使用委托人" %}

```ts
import { getAssetWithProof, transferV2 } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {
  truncateCanopy: true,
})
await transferV2(umi, {
  // 从带证明的资产传递参数。
  ...assetWithProof,
  authority: delegateAuthority, // <- 委托权限签署交易。
  newLeafOwner: leafOwnerB.publicKey,
  // 如果cNFT是集合的一部分，传递核心集合。
  //coreCollection: coreCollection.publicKey,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="使用永久转账委托人" %}

```ts
import { getAssetWithProof, transferV2 } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {
  truncateCanopy: true,
})
await transferV2(umi, {
  ...assetWithProof,
  authority: permanentTransferDelegate, // <- 委托权限签署交易。
  newLeafOwner: leafOwnerB.publicKey,
  coreCollection: coreCollection.publicKey,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### 压缩NFT的可转移性检查

`canTransfer`函数可用于检查压缩NFT是否可以转移。如果NFT可以转移则返回`true`，否则返回`false`。已冻结和`NonTransferable`的cNFT不能转移。

```ts
import { canTransfer } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {
  truncateCanopy: true,
})

const canBeTransferred = canTransfer(assetWithProof)
console.log("canBeTransferred", canBeTransferred ? "Yes" : "No")
```
