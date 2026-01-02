---
title: 验证创作者
metaTitle: 验证创作者 | Bubblegum
description: 了解如何在Bubblegum上验证和取消验证创作者
---

如果压缩NFT在其元数据中设置了创作者列表，这些创作者可以使用特殊指令在cNFT上验证和取消验证自己。{% .lead %}

这些指令将切换cNFT的**创作者**数组中相应项的**已验证**布尔值。该布尔值很重要，因为它允许钱包和市场等应用程序知道哪些创作者是真实的，哪些不是。

值得注意的是，创作者可以在[铸造压缩NFT](/zh/smart-contracts/bubblegum/mint-cnfts)时通过签署铸造交易直接验证自己。也就是说，现在让我们看看创作者如何在现有的压缩NFT上验证或取消验证自己。

## 验证创作者

Bubblegum程序提供了**Verify Creator**指令，必须由我们尝试验证的创作者签名。

此外，由于此指令将最终替换Bubblegum树上的叶子，因此必须提供更多参数来验证压缩NFT的完整性。由于这些参数对所有更改叶子的指令是通用的，它们在[以下FAQ](/zh/smart-contracts/bubblegum/faq#replace-leaf-instruction-arguments)中有记录。幸运的是，我们可以使用辅助方法，它将使用Metaplex DAS API自动为我们获取这些参数。

{% dialect-switcher title="验证压缩NFT的创作者" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  verifyCreator,
} from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await verifyCreator(umi, { ...assetWithProof, creator }).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 取消验证创作者

与**Verify Creator**指令类似，**Unverify Creator**指令必须由创作者签名，并将在压缩NFT上取消验证他们。

{% dialect-switcher title="取消验证压缩NFT的创作者" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  unverifyCreator,
} from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await unverifyCreator(umi, { ...assetWithProof, creator }).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
