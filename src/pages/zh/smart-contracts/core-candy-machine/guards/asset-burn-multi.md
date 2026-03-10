---
title: 多资产销毁守卫
metaTitle: 多资产销毁守卫 | Core Candy Machine
description: "Core Candy Machine 的 'Asset Burn Multi' 守卫将铸造限制为指定 collection 的持有者，并销毁可配置数量的持有者资产作为铸造成本。"
keywords:
  - asset burn multi
  - Core Candy Machine
  - candy guard
  - burn multiple assets
  - burn to mint
  - collection holder
  - Solana NFT
  - minting restriction
about:
  - Candy Machine guards
  - multi-asset burn-to-mint mechanics
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
---

**Asset Burn Multi** 守卫要求铸造钱包持有并永久销毁指定 collection 中可配置数量的资产，作为从 Core Candy Machine 铸造新资产的成本。 {% .lead %}

## 概述

**Asset Burn Multi** 守卫将铸造限制为预定义 Collection 的持有者，并销毁持有者的资产。因此，付款人在铸造时必须提供要销毁的资产地址。

它类似于 [Asset Burn 守卫](/zh/smart-contracts/core-candy-machine/guards/asset-burn)，但可以接受多个资产进行销毁。

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="20" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="Guards" theme="mint" z=1/%}
{% node #nftBurn label="nftBurnMulti" /%}
{% node #requiredCollection label="- Required Collection" /%}
{% node label="- Number" /%}
{% node label="..." /%}
{% /node %}

{% node parent="requiredCollection" x="270" y="-9"  %}
{% node #collectionNftMint theme="blue" %}
Collection {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
Owner: Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="requiredCollection" to="collectionNftMint" /%}

{% edge from="collectionNftMint" to="mint-candy-guard" theme="indigo" dashed=true %}
从此 collection

销毁 n 个资产
{% /edge %}
{% node parent="candy-machine" x="600" %}
  {% node #mint-candy-guard theme="pink" %}
    Mint from

    _Candy Guard Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  访问控制
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-9" %}
  {% node theme="pink" %}
    Mint from

    _Candy Machine Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  铸造逻辑
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="69" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}

{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## 守卫设置

Asset Burn 守卫包含以下设置：

- **Required Collection**：必需 Collection 的地址。我们用于铸造的资产必须属于此 collection。
- **Number**：需要销毁以换取新资产的资产数量。

{% dialect-switcher title="使用 Asset Burn Multi 守卫设置 Candy Machine" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    assetBurnMulti: some({
      requiredCollection: requiredCollection.publicKey,
      num: 2,
    }),
  },
});
```

API 参考：[create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html)、[AssetBurnMulti](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetBurnMulti.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 铸造设置

Asset Burn Multi 守卫包含以下铸造设置：

- **Required Collection**：必需 Collection 的铸造地址。
- **[Address]**：要销毁的资产地址数组。这些资产必须属于必需的 collection 且必须属于铸造者。

注意，如果您计划在没有我们 SDK 帮助的情况下构建指令，您需要将这些铸造设置和更多内容作为指令参数和剩余账户的组合提供。详情请参阅 [Candy Guard 的程序文档](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#asseturn)。

{% dialect-switcher title="使用 Asset Burn Multi 守卫铸造" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

您可以使用 `mintArgs` 参数传递 Asset Burn Multi 守卫的铸造设置，如下所示。

```ts

mintV1(umi, {
  // ...
  mintArgs: {
    assetBurnMulti: some({
      requiredCollection: requiredCollection.publicKey,
      assets: [assetToBurn1.publicKey, assetToBurn2.publicKey],
    }),
  },
});
```

API 参考：[mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html)、[AssetBurnMultiMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetBurnMultiMintArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route 指令

_Asset Burn Multi 守卫不支持 route 指令。_

## 注意事项

- 所有被销毁的资产将被永久销毁且无法恢复。销毁在铸造交易中原子性地发生。
- `assets` 数组中提供的资产地址数量必须与守卫设置中配置的 `num` 值匹配。提供更少或更多的地址将导致交易失败。
- 每个资产必须属于铸造钱包且必须属于指定的 collection。如果任何资产不满足任一条件，整个铸造交易将失败。
- 要每次铸造只销毁一个资产，请改用更简单的 [Asset Burn](/zh/smart-contracts/core-candy-machine/guards/asset-burn) 守卫。

