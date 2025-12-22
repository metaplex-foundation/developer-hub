---
title: 验证集合
metaTitle: 验证集合 | Bubblegum
description: 了解如何在Bubblegum上设置、验证和取消验证集合
---

每当在压缩NFT上设置集合时，集合的更新权限——或任何已批准的集合委托——可以验证和/或取消验证该cNFT上的集合。{% .lead %}

从技术上讲，这将切换cNFT的**集合**对象上的**已验证**布尔值，让任何人知道集合的权限已批准此压缩NFT作为集合的一部分。

如果您不熟悉NFT相关的集合概念，它们是特殊的非压缩NFT，可用于将其他NFT分组在一起。因此，**集合NFT**的数据用于描述整个集合的名称和品牌。您可以[在此处阅读更多关于Metaplex已验证集合的信息](/zh/token-metadata/collections)。

请注意，可以使用[此处记录的](/zh/bubblegum/mint-cnfts#minting-to-a-collection)**Mint to Collection V1**指令直接将压缩NFT铸造到集合中。也就是说，如果您已经铸造了一个没有集合的cNFT，让我们看看如何验证、取消验证以及设置该cNFT上的集合。

## 验证集合

Bubblegum程序的**Verify Collection**指令可用于将压缩NFT的**已验证**布尔值设置为`true`。为使其工作，**集合**对象必须已在cNFT上设置——例如，在铸造时。

该指令接受以下参数：

- **集合铸造**：集合NFT的铸造账户。
- **集合权限**：作为签名者的集合NFT的更新权限——或已批准的集合委托。如果集合权限是委托权限，请注意程序同时支持新的统一**元数据委托**系统和旧的**集合权限记录**账户。只需将适当的PDA传递给**集合权限记录PDA**参数。

此外，由于此指令将最终替换Bubblegum树上的叶子，因此必须提供更多参数来验证压缩NFT的完整性。由于这些参数对所有更改叶子的指令是通用的，它们在[以下FAQ](/zh/bubblegum/faq#replace-leaf-instruction-arguments)中有记录。幸运的是，我们可以使用辅助方法，它将使用Metaplex DAS API自动为我们获取这些参数。

{% dialect-switcher title="验证压缩NFT的集合" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  verifyCollection,
} from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await verifyCollection(umi, {
  ...assetWithProof,
  collectionMint,
  collectionAuthority,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 设置并验证集合

如果压缩NFT上尚未设置**集合**对象，可以使用**Set and Verify Collection**指令同时设置并验证它。此指令接受与**Verify Collection**指令相同的参数，但如果树创建者或委托与集合权限不同，还需要将**树创建者或委托**属性作为签名者传递。

{% dialect-switcher title="设置并验证压缩NFT的集合" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  setAndVerifyCollection,
} from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await setAndVerifyCollection(umi, {
  ...assetWithProof,
  treeCreatorOrDelegate,
  collectionMint,
  collectionAuthority,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 取消验证集合

集合的更新权限也可以使用**Unverify Collection**指令取消验证压缩NFT的集合。为了发送此指令，cNFT的**集合**对象预期已设置并验证。**Unverify Collection**指令所需的属性与**Verify Collection**指令所需的属性相同。

{% dialect-switcher title="取消验证压缩NFT的集合" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  unverifyCollection,
} from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await unverifyCollection(umi, {
  ...assetWithProof,
  collectionMint,
  collectionAuthority,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
