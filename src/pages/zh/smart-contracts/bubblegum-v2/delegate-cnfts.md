---
title: 委托压缩NFT
metaTitle: 委托压缩NFT | Bubblegum V2
description: 了解如何在Bubblegum上委托压缩NFT。
---

压缩NFT的所有者可以将其委托给另一个账户，同时保持cNFT的所有权。{% .lead %}

这允许被委托的账户——我们也称为**委托权限**——代表所有者执行操作。这些操作是：

- [转移cNFT](/zh/smart-contracts/bubblegum-v2/transfer-cnfts)：转移后委托权限将被重置——即设置为新所有者。
- [销毁cNFT](/zh/smart-contracts/bubblegum-v2/burn-cnfts)。
- [冻结和解冻cNFT](/zh/smart-contracts/bubblegum-v2/freeze-cnfts)。

这些操作中的每一个都提供了如何使用委托权限执行它们的示例。通常，您只需提供**叶子委托人**账户作为签名者，而不是**叶子所有者**账户。
让我们看看如何批准和撤销压缩NFT的委托权限。

## 批准委托权限

要批准或替换委托权限，所有者必须发送**Delegate**指令。此指令接受以下参数：

- **叶子所有者**：压缩NFT的当前所有者作为签名者。默认为交易的付款人。
- **先前叶子委托人**：先前的委托权限（如果有）。否则，应设置为**叶子所有者**。
- **新叶子委托人**：要批准的新委托权限。

此外，由于此指令替换Bubblegum树上的叶子，因此必须提供更多参数来验证压缩NFT的完整性，由于这些参数对于所有改变叶子的指令都是通用的，它们在[以下FAQ](/zh/smart-contracts/bubblegum-v2/faq#replace-leaf-instruction-arguments)中有记录。幸运的是，我们可以使用辅助方法，该方法将使用Metaplex DAS API自动为我们获取这些参数。

{% dialect-switcher title="委托压缩NFT" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, delegate } from '@metaplex-foundation/mpl-bubblegum';

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true });
await delegate(umi, {
  ...assetWithProof,
  leafOwner,
  previousLeafDelegate: leafOwner.publicKey,
  newLeafDelegate: newDelegate,
}).sendAndConfirm(umi);
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 撤销委托权限

要撤销现有的委托权限，所有者只需将自己设置为新的委托权限。

{% dialect-switcher title="撤销压缩NFT的委托权限" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, delegate } from '@metaplex-foundation/mpl-bubblegum';

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await delegate(umi, {
  ...assetWithProof,
  leafOwner,
  previousLeafDelegate: currentDelegate,
  newLeafDelegate: leafOwner.publicKey,
}).sendAndConfirm(umi);
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
