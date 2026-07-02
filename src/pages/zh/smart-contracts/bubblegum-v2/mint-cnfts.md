---
title: 铸造压缩NFT
metaTitle: 铸造压缩NFT - Bubblegum V2
description: 了解如何在Bubblegum V2上铸造压缩NFT。
created: '01-15-2025'
updated: '06-19-2026'
keywords:
  - mint compressed NFT
  - mint cNFT
  - NFT minting
  - Bubblegum mint
  - collection mint
  - mintV2
  - MPL-Core collection
about:
  - Compressed NFTs
  - NFT minting
  - Solana transactions
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 如何将压缩NFT铸造到集合中？
    a: 使用mintV2指令，将coreCollection参数设置为您的MPL-Core集合地址。集合必须启用BubblegumV2插件。
  - q: 铸造后如何获取资产ID？
    a: 在交易完成后使用parseLeafFromMintV2Transaction辅助函数。它返回包含资产ID的叶子模式。
  - q: 任何人都可以从我的树中铸造吗？
    a: 只有在树设置为公开时才可以。对于私有树，只有树创建者或树委托人才能铸造。
  - q: 铸造需要哪些元数据字段？
    a: MetadataArgsV2需要name、uri、sellerFeeBasisPoints、collection（或none）以及creators数组。
  - q: cNFT可以从MPL-Core集合继承版税吗？
    a: 可以。铸造到具有Royalties插件的集合时，可省略sellerFeeBasisPoints（或传入SELLER_FEE_BASIS_POINTS_INHERIT哨兵）。叶子上存储65535（0xffff），并在显示时从集合解析版税。
---

## Summary

**Minting compressed NFTs** adds new cNFTs to a Bubblegum Tree using the **mintV2** instruction. This page covers minting with and without MPL-Core collections, and retrieving the asset ID from mint transactions.

- Mint cNFTs to a Bubblegum Tree using the mintV2 instruction
- Mint directly into an MPL-Core collection with the BubblegumV2 plugin
- Retrieve the asset ID and leaf schema from the mint transaction
- Configure metadata including name, URI, creators, and royalties
- 从 MPL-Core 集合的 Royalties 插件继承 seller fee basis points

在[上一页](/zh/smart-contracts/bubblegum-v2/create-trees)中，我们看到需要一个Bubblegum树来铸造压缩NFT，以及如何创建一个。现在，让我们看看如何从给定的Bubblegum树铸造压缩NFT。{% .lead %}

Bubblegum程序为不同的叶子模式版本提供多个铸造指令。Bubblegum V2引入了一个新的铸造指令，名为**mintV2**，用于将压缩NFT铸造到给定的集合或不带集合。

## 不带集合铸造

Bubblegum程序提供**mintV2**指令，使我们能够从Bubblegum树铸造压缩NFT。如果Bubblegum树是公开的，任何人都可以使用此指令。否则，只有树创建者或树委托人才能这样做。

**mintV2**指令的主要参数是：

- **默克尔树**：将从中铸造压缩NFT的默克尔树地址。
- **树创建者或委托人**：允许从Bubblegum树铸造的权限——这可以是树的创建者或委托人。此权限必须签署交易。对于公开树，此参数可以是任何权限，但仍然必须是签名者。
- **叶子所有者**：将被铸造的压缩NFT的所有者。默认为交易的付款人。
- **叶子委托人**：允许管理铸造的cNFT的委托权限（如果有）。否则，设置为叶子所有者。
- **集合权限**：允许管理给定集合的权限。
- **Core集合**：压缩NFT将添加到的MPL-Core集合NFT。
- **元数据**：将被铸造的压缩NFT的元数据。它包含诸如NFT的**名称**、其**URI**、其**集合**、其**创作者**等信息。在Bubblegum V2中，元数据使用`MetadataArgsV2`，它排除了不需要的字段，如`uses`和集合的`verified`标志。

{% dialect-switcher title="不带集合铸造压缩NFT" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { none } from '@metaplex-foundation/umi';
import { mintV2 } from '@metaplex-foundation/mpl-bubblegum';

await mintV2(umi, {
  leafOwner: umi.identity.publicKey,
  merkleTree: merkleTree.publicKey,
  metadata: {
    name: 'My NFT',
    uri: 'https://example.com/my-nft.json',
    sellerFeeBasisPoints: 550,
    collection: none(),
    creators: [],
  },
}).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}

## 铸造到集合

虽然可以在铸造压缩NFT_之后_为其设置和验证集合，但Bubblegum V2允许您直接将压缩NFT铸造到给定的集合。Bubblegum V2使用MPL-Core集合对压缩NFT进行分组。为此使用相同的**mintV2**指令。除了上述参数外，您还需要传入核心集合并作为集合权限或委托人签名：

- **Core集合**：传递给`coreCollection`参数的铸造地址，指向MPL-Core集合NFT…
- **集合权限**：允许管理给定集合NFT的权限。这可以是集合NFT的更新权限或委托的集合权限。无论Bubblegum树是否公开，此权限必须签署交易。

请注意，**元数据**参数必须包含**集合**公钥。

{% dialect-switcher title="将压缩NFT铸造到集合" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { some } from '@metaplex-foundation/umi';
import { mintV2 } from '@metaplex-foundation/mpl-bubblegum';

await mintV2(umi, {
  collectionAuthority: umi.identity,
  leafOwner: umi.identity.publicKey,
  merkleTree: merkleTree.publicKey,
  coreCollection: collectionSigner.publicKey,
  metadata: {
    name: 'My NFT',
    uri: 'https://example.com/my-nft.json',
    sellerFeeBasisPoints: 550, // 5.5%
    collection: some(collectionSigner.publicKey),
    creators: [],
  },
}).sendAndConfirm(umi);
```

{% totem-accordion title="创建MPL-Core集合" %}

如果您还没有集合，可以使用[`@metaplex-foundation/mpl-core`库](/zh/smart-contracts/core/collections#creating-a-collection-with-plugins)创建一个。请记住，您还需要将`BubblegumV2`插件添加到集合中。
npm install @metaplex-foundation/mpl-core
然后像这样创建集合：

```ts
import { generateSigner } from '@metaplex-foundation/umi';
import { createCollection } from '@metaplex-foundation/mpl-core';

const collectionSigner = generateSigner(umi);
await createCollection(umi, {
    collection: collectionSigner,
    name: "My Collection",
    uri: "https://example.com/my-nft.json",
    plugins: [
      {
        type: "BubblegumV2",
      },
    ],
  }).sendAndConfirm(umi);
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 从集合继承版税

铸造到 MPL-Core 集合时，可以在叶子上存储**哨兵** seller fee basis points 值（`65535`，导出为 `SELLER_FEE_BASIS_POINTS_INHERIT` / `0xffff`），而不是将集合的版税百分比复制到每个 cNFT。市场和索引器在显示时从集合的 [Royalties 插件](/zh/smart-contracts/core/plugins/royalties) 解析有效版税，而链上叶子为哈希保留哨兵值。

当提供了 `coreCollection` 且省略 `metadata.sellerFeeBasisPoints` 时，JavaScript SDK 的 `mintV2` 辅助函数默认使用此行为。

**要求:**

- MPL-Core 集合必须同时具有 `BubblegumV2` 和 `Royalties` 插件。
- 使用继承 seller fee 时，`metadata.creators` 必须是**空数组**。创作者分配来自集合的 Royalties 插件，而非叶子级创作者。
- 继承 seller fee 仅对集合中的 cNFT 有效。无集合铸造必须使用 `0` 到 `10000` 之间的明确值。

{% code-tabs-imported from="bubblegum/mint-inherit-royalties" frameworks="umi" /%}

你仍可以传入明确的 `sellerFeeBasisPoints` 以覆盖单次铸造的集合默认值。

{% callout type="note" title="移除集合" %}
具有继承 seller fee 的 cNFT 在 seller fee 更新为明确值之前无法从集合中移除。请参阅[管理集合](/zh/smart-contracts/bubblegum-v2/collections#inherited-royalties)和[更新压缩 NFT](/zh/smart-contracts/bubblegum-v2/update-cnfts#inherited-royalties)。
{% /callout %}

### 从铸造交易获取资产ID和叶子模式 {% #get-leaf-schema-from-mint-transaction %}

您可以使用`parseLeafFromMintV2Transaction`辅助函数从`mintV2`交易中检索叶子并确定资产ID。此函数解析交易，因此您必须确保在调用`parseLeafFromMintV2Transaction`之前交易已完成。

{% callout type="note" title="交易完成" %}
请确保在调用`parseLeafFromMintV2Transaction`之前交易已完成。
{% /callout %}

{% dialect-switcher title="从铸造交易获取叶子模式" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  mintV2,
  parseLeafFromMintV2Transaction,
} from '@metaplex-foundation/mpl-bubblegum';

const { signature } = await mintV2(umi, {
  // ... 详见上文
}).sendAndConfirm(umi);

const leaf = await parseLeafFromMintV2Transaction(umi, signature);
const assetId = leaf.id;
```

{% /dialect %}
{% /dialect-switcher %}

## Notes

- The Bubblegum Tree must be created before minting. See [Creating Trees](/smart-contracts/bubblegum-v2/create-trees).
- For collection mints, the MPL-Core collection must have the `BubblegumV2` plugin enabled.
- 要从集合继承版税，集合还必须具有 `Royalties` 插件，且叶子的 `creators` 数组必须为空。
- The collection authority must sign the transaction when minting to a collection, regardless of whether the tree is public or private.
- Use `parseLeafFromMintV2Transaction` only after the transaction is **finalized**, not just confirmed.

## FAQ

### 如何将压缩 NFT 铸造到集合中？

使用 `mintV2` 指令，将 `coreCollection` 参数设置为 MPL-Core 集合地址，并提供 `collectionAuthority` 签名者。集合必须启用 `BubblegumV2` 插件。

### 铸造后如何获取资产 ID？

在交易完成后使用 `parseLeafFromMintV2Transaction` 辅助函数。它会解析交易并通过 `leaf.id` 返回包含资产 ID 的叶子模式。

### 任何人都可以从我的树铸造吗？

仅当树以 `public: true` 创建时才可以。对于私有树，只有树创建者或树委托人可以铸造 cNFT。

### 铸造需要哪些元数据字段？

`MetadataArgsV2` 结构体需要：`name`（字符串）、`uri`（指向 JSON 元数据的字符串）、`sellerFeeBasisPoints`（0-10000，或铸造到集合时省略以从其 Royalties 插件继承）、`collection`（公钥或 none）、`creators`（创作者对象数组；继承版税时必须为空）。

### cNFT 可以从 MPL-Core 集合继承版税吗？

可以。使用 `coreCollection` 铸造时，省略 `metadata.sellerFeeBasisPoints` 并将 `metadata.creators` 留空。SDK 在叶子上存储 `SELLER_FEE_BASIS_POINTS_INHERIT`（`65535`）。集合必须具有 `Royalties` 插件。请参阅[从集合继承版税](#inheriting-royalties-from-the-collection)。

## Glossary

| Term | Definition |
|------|------------|
| **mintV2** | The Bubblegum V2 instruction for minting compressed NFTs, replacing the V1 mint instructions |
| **MetadataArgsV2** | The metadata structure passed to mintV2, containing name, URI, royalties, collection, and creators |
| **SELLER_FEE_BASIS_POINTS_INHERIT** | Sentinel value `65535` (`0xffff`) stored on-chain to indicate royalties are inherited from the MPL-Core collection |
| **Collection Authority** | The signer authorized to manage the MPL-Core collection — required when minting to a collection |
| **BubblegumV2 Plugin** | An MPL-Core collection plugin that enables Bubblegum V2 features (freeze, soulbound, royalties) |
| **Asset ID** | A PDA derived from the merkle tree address and leaf index, uniquely identifying a compressed NFT |
| **Leaf Schema** | The data structure stored as a leaf in the merkle tree, containing the cNFT's hashed metadata and ownership info |
