---
title: 验证集合
metaTitle: 验证集合 | Bubblegum V2
description: 了解如何在Bubblegum上设置、验证和取消验证集合。
---

cNFT可以在铸造时或之后添加到MPL-Core集合。{% .lead %}

如果您不熟悉NFT相关的集合概念，它们是特殊的非压缩NFT，可用于将其他NFT分组在一起。**集合**的数据因此用于描述整个集合的名称和品牌。自Bubblegum V2以来，它还允许在集合级别提供额外功能，例如允许委托人在无需叶子所有者交互的情况下冻结和解冻cNFT。您可以[在此处阅读更多关于MPL-Core集合的信息](/zh/core/collections)。
请注意，可以通过使用**MintV2**指令[此处记录](/zh/bubblegum-v2/mint-cnfts#minting-to-a-collection)直接将压缩NFT铸造到集合中。也就是说，如果您已经铸造了没有集合的cNFT，让我们看看如何在该cNFT上设置集合。与使用具有"已验证"布尔值的Metaplex Token Metadata集合的Bubblegum v1不同，Bubblegum V2使用没有该布尔值的MPL-Core集合。

MPL-Core集合必须包含[`BubblegumV2`插件](/zh/core/plugins/bubblegum)。

以下部分展示如何在单步交易中为cNFT设置和移除集合。在添加`coreCollection`和`newCoreCollection`参数时，也可以在单个指令中执行两个操作。如果两个集合权限不是同一个钱包，则两者都必须签名。

## 设置压缩NFT的集合
**setCollectionV2**指令可用于设置cNFT的集合。它也可用于从cNFT移除集合或更改cNFT的集合。

{% dialect-switcher title="设置压缩NFT的集合" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  setCollectionV2,
  MetadataArgsV2Args
} from '@metaplex-foundation/mpl-bubblegum';
import {
  unwrapOption,
  none,
} from '@metaplex-foundation/umi';

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});

const collection = unwrapOption(assetWithProof.metadata.collection)

const metadata: MetadataArgsV2Args = {
  ...assetWithProof.metadata,
  collection: collection?.key ?? null,
};

const signature = await setCollectionV2(umi, {
  ...assetWithProof,
  newCollectionAuthority: newCollectionUpdateAuthority,
  metadata,
  newCoreCollection: newCoreCollection.publicKey,
}).sendAndConfirm(umi);
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 移除压缩NFT的集合
**setCollectionV2**指令也可用于从cNFT移除集合。

{% dialect-switcher title="移除压缩NFT的集合" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  setCollectionV2,
  MetadataArgsV2Args
} from '@metaplex-foundation/mpl-bubblegum'
import {
  unwrapOption,
  none,
} from '@metaplex-foundation/umi';

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});

const collection = unwrapOption(assetWithProof.metadata.collection)

const signature = await setCollectionV2(umi, {
  ...assetWithProof,
  authority: collectionAuthoritySigner,
  coreCollection: collection!.key
}).sendAndConfirm(umi);
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
