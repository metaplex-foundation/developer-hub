---
title: 销毁压缩NFT
metaTitle: 销毁压缩NFT | Bubblegum
description: 了解如何在Bubblegum上销毁压缩NFT。
---

**Burn**指令可用于销毁压缩NFT，从而永久地将其从Bubblegum树中移除。要授权此操作，当前所有者或委托权限（如果有）必须签署交易。该指令接受以下参数：

- **叶子所有者**和**叶子委托**：压缩NFT的当前所有者及其委托权限（如果有）。其中之一必须签署交易。

请注意，由于此指令会替换Bubblegum树上的叶子，因此必须提供额外的参数来验证压缩NFT的完整性，然后才能销毁它。由于这些参数对所有更改叶子的指令是通用的，它们在[以下FAQ](/zh/smart-contracts/bubblegum-v2/faq#replace-leaf-instruction-arguments)中有记录。幸运的是，我们可以使用辅助方法，它将使用Metaplex DAS API自动为我们获取这些参数。

{% callout title="交易大小" type="note" %}
如果遇到交易大小错误，请考虑在`getAssetWithProof`中使用`{ truncateCanopy: true }`。详情请参阅[FAQ](/zh/smart-contracts/bubblegum-v2/faq#replace-leaf-instruction-arguments)。
{% /callout %}

{% dialect-switcher title="销毁压缩NFT" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, burn } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await burn(umi, {
  ...assetWithProof,
  leafOwner: currentLeafOwner,
}).sendAndConfirm(umi)
```

{% totem-accordion title="使用委托" %}

```ts
import { getAssetWithProof, burn } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await burn(umi, {
  ...assetWithProof,
  leafDelegate: currentLeafDelegate,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
