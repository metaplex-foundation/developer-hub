---
title: 资产销毁守卫
metaTitle: 资产销毁守卫 | Core Candy Machine
description: "Core Candy Machine 的 'Asset Burn' 守卫将铸造限制为预定义 Collection 的持有者，并在从 Core Candy Machine 购买时销毁持有者的资产。"
---

## 概述

**Asset Burn** 守卫将铸造限制为预定义 Collection 的持有者，并销毁持有者的资产。因此，付款人在铸造时必须提供要销毁的资产地址。

要让铸造者销毁多个资产，可以使用 [Asset Burn Multi 守卫](/zh/smart-contracts/core-candy-machine/guards/asset-burn-multi)。

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
{% node #nftBurn label="nftBurn" /%}
{% node #requiredCollection label="- Required Collection" /%}
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

销毁 1 个资产
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

{% dialect-switcher title="使用 Asset Burn 守卫设置 Candy Machine" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    assetBurn: some({ requiredCollection: requiredCollection.publicKey }),
  },
});
```

API 参考：[create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html)、[AssetBurn](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetBurn.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 铸造设置

Asset Burn 守卫包含以下铸造设置：

- **Required Collection**：必需 Collection 的铸造地址。
- **Address**：要销毁的资产地址。此资产必须属于必需的 collection 且必须属于铸造者。

注意，如果您计划在没有我们 SDK 帮助的情况下构建指令，您需要将这些铸造设置和更多内容作为指令参数和剩余账户的组合提供。详情请参阅 [Candy Guard 的程序文档](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#asseturn)。

{% dialect-switcher title="使用 Asset Burn 守卫铸造" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

您可以使用 `mintArgs` 参数传递 Asset Burn 守卫的铸造设置，如下所示。

```ts

mintV1(umi, {
  // ...
  mintArgs: {
    assetBurn: some({
      requiredCollection: requiredCollection.publicKey,
      asset: assetToBurn.publicKey,
    }),
  },
});
```

API 参考：[mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html)、[AssetBurnMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetBurnMintArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route 指令

_Asset Burn 守卫不支持 route 指令。_
