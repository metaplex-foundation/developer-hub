---
title: 销毁压缩NFT
metaTitle: 销毁压缩NFT | Bubblegum V2
description: 了解如何在Bubblegum V2上销毁压缩NFT。
---

**burnV2**指令可用于销毁压缩NFT，因此将其从Bubblegum树中永久移除。要授权此操作，当前所有者或委托权限（如果有）必须签署交易。该指令接受以下参数：

- **叶子所有者**、**叶子委托人**或**永久销毁委托人**：压缩NFT的当前所有者、其委托权限（如果有）或集合的永久销毁委托人。如果资产是集合的一部分，必须传递`coreCollection`参数。其中一个必须签署交易。

请注意，由于此指令替换Bubblegum树上的叶子，必须提供额外的参数来验证压缩NFT的完整性才能销毁它。由于这些参数对于所有改变叶子的指令都是通用的，它们在[以下FAQ](/zh/smart-contracts/bubblegum-v2/faq#replace-leaf-instruction-arguments)中有记录。幸运的是，我们可以使用辅助方法，该方法将使用Metaplex DAS API自动为我们获取这些参数。

{% callout title="交易大小" type="note" %}
如果遇到交易大小错误，请考虑在`getAssetWithProof`中使用`{ truncateCanopy: true }`。详见[FAQ](/zh/smart-contracts/bubblegum-v2/faq#replace-leaf-instruction-arguments)。
{% /callout %}

{% callout title="集合" type="note" %}
如果cNFT是集合的一部分，必须传递`coreCollection`参数。
{% /callout %}

{% dialect-switcher title="销毁压缩NFT" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, burnV2 } from '@metaplex-foundation/mpl-bubblegum';

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await burnV2(umi, {
  ...assetWithProof,
  leafOwner: currentLeafOwner,
}).sendAndConfirm(umi)
```

{% totem-accordion title="使用委托人" %}

```ts
import { getAssetWithProof, burnV2 } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await burnV2(umi, {
  ...assetWithProof,
  leafDelegate: currentLeafDelegate,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="使用永久销毁委托人" %}

```ts
import { getAssetWithProof, burnV2 } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await burnV2(umi, {
  ...assetWithProof,
  authority: permanentBurnDelegate, // 永久销毁委托人的签名者
  coreCollection: collection.publicKey,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
