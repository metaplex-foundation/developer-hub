---
title: 管理集合
metaTitle: 管理集合 - Bubblegum V2
description: 了解如何在Bubblegum上设置、验证和取消验证集合。
created: '01-15-2025'
updated: '06-19-2026'
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
  - q: 继承版税的cNFT可以从集合中移除吗？
    a: 不可以。请先将sellerFeeBasisPoints更新为明确值，然后使用setCollectionV2移除集合。
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

## 继承版税 {% #inherited-royalties %}

通过[从集合继承 seller fee basis points](/zh/smart-contracts/bubblegum-v2/mint-cnfts#inheriting-royalties-from-the-collection)铸造的 cNFT 会在叶子上存储哨兵值 `65535`。这会影响集合管理：

- **移除集合** — 当叶子仍使用继承哨兵时，`setCollectionV2` 会拒绝该操作。请先通过 [`updateMetadataV2`](/zh/smart-contracts/bubblegum-v2/update-cnfts#inherited-royalties) 将 cNFT 的 `sellerFeeBasisPoints` 更新为明确值。
- **移动到另一个集合** — 当目标集合具有 `Royalties` 插件时允许。cNFT 保留继承哨兵并从新集合解析版税。
- **移动到没有版税的集合** — 会被 `CollectionMustHaveRoyaltiesPlugin` 拒绝。

## Notes

- The MPL-Core collection must have the `BubblegumV2` plugin enabled before cNFTs can be added to it.
- Unlike Bubblegum V1 (which uses Token Metadata collections with a "verified" boolean), V2 uses MPL-Core collections without verification flags.
- When changing between collections, both the old and new collection authorities must sign the transaction.
- 继承 seller fee 的 cNFT 在叶子上的版税设置为明确值之前，无法从集合中移除。

## FAQ

### 铸造后如何将 cNFT 添加到集合中？

使用 `setCollectionV2` 指令，并将 `newCoreCollection` 参数设置为集合的公钥。集合权限必须签名。

### 可以更改 cNFT 的集合吗？

可以。使用 `setCollectionV2` 并同时传入 `coreCollection`（当前）和 `newCoreCollection`（新）参数。如果权限是不同的账户，两个集合权限都必须签名。

### BubblegumV2 插件是什么？

它是一个 MPL-Core 集合插件，在集合级别启用 Bubblegum V2 功能，如冻结/解冻、灵魂绑定 cNFT、版税强制执行和永久委托。

### 继承版税的 cNFT 可以从集合中移除吗？

不可以。程序会返回 `CannotRemoveFromCollectionWithInheritedSellerFee`。请先用 `updateMetadataV2` 将 `sellerFeeBasisPoints` 设置为明确值，然后调用 `setCollectionV2` 移除集合。

## Glossary

| Term | Definition |
|------|------------|
| **setCollectionV2** | The Bubblegum V2 instruction for setting, changing, or removing the collection of a cNFT |
| **MPL-Core Collection** | A Core standard collection account used to group cNFTs in Bubblegum V2 |
| **BubblegumV2 Plugin** | An MPL-Core plugin that enables V2 features on a collection (freeze, soulbound, royalties) |
| **Collection Authority** | The update authority of the MPL-Core collection |
