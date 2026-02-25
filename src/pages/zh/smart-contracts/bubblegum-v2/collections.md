---
title: 管理集合
metaTitle: 管理集合 - Bubblegum V2
description: 了解如何在Bubblegum上设置、验证和取消验证集合。
created: '01-15-2025'
updated: '02-24-2026'
keywords:
  - NFT collection
  - verify collection
  - cNFT collection
  - MPL-Core collection
  - setCollectionV2
  - BubblegumV2 plugin
about:
  - Compressed NFTs
  - NFT collections
  - MPL-Core
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 铸造后如何将cNFT添加到集合中？
    a: 使用带有newCoreCollection参数的setCollectionV2指令。集合必须启用BubblegumV2插件。
  - q: 可以更改cNFT的集合吗？
    a: 可以。使用带有coreCollection（当前）和newCoreCollection（新）两个参数的setCollectionV2。两个集合权限都必须签名。
  - q: BubblegumV2插件是什么？
    a: 它是一个MPL-Core集合插件，在集合上启用Bubblegum V2功能，如冻结/解冻、灵魂绑定cNFT和版税强制执行。
---

## Summary

**Managing collections** for compressed NFTs uses the **setCollectionV2** instruction to add, change, or remove MPL-Core collections on existing cNFTs. This page covers setting and removing collections after minting.

- Set an MPL-Core collection on an existing cNFT using setCollectionV2
- Remove a collection from a cNFT
- Change between collections (both authorities must sign)
- Collections must have the BubblegumV2 plugin enabled

cNFT可以在铸造时或之后添加到MPL-Core集合。{% .lead %}

如果您不熟悉NFT相关的集合概念，它们是特殊的非压缩NFT，可用于将其他NFT分组在一起。**集合**的数据因此用于描述整个集合的名称和品牌。自Bubblegum V2以来，它还允许在集合级别提供额外功能，例如允许委托人在无需叶子所有者交互的情况下冻结和解冻cNFT。您可以[在此处阅读更多关于MPL-Core集合的信息](/zh/smart-contracts/core/collections)。
请注意，可以通过使用**MintV2**指令[此处记录](/zh/smart-contracts/bubblegum-v2/mint-cnfts#minting-to-a-collection)直接将压缩NFT铸造到集合中。也就是说，如果您已经铸造了没有集合的cNFT，让我们看看如何在该cNFT上设置集合。与使用具有"已验证"布尔值的Metaplex Token Metadata集合的Bubblegum v1不同，Bubblegum V2使用没有该布尔值的MPL-Core集合。

MPL-Core集合必须包含[`BubblegumV2`插件](/zh/smart-contracts/core/plugins/bubblegum)。

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

## Notes

- The MPL-Core collection must have the `BubblegumV2` plugin enabled before cNFTs can be added to it.
- Unlike Bubblegum V1 (which uses Token Metadata collections with a "verified" boolean), V2 uses MPL-Core collections without verification flags.
- When changing between collections, both the old and new collection authorities must sign the transaction.

## FAQ

#

## Glossary

| Term | Definition |
|------|------------|
| **setCollectionV2** | The Bubblegum V2 instruction for setting, changing, or removing the collection of a cNFT |
| **MPL-Core Collection** | A Core standard collection account used to group cNFTs in Bubblegum V2 |
| **BubblegumV2 Plugin** | An MPL-Core plugin that enables V2 features on a collection (freeze, soulbound, royalties) |
| **Collection Authority** | The update authority of the MPL-Core collection |
