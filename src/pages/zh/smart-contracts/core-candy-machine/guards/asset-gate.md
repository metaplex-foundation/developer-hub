---
title: "Core Candy Machine - 资产门控守卫"
metaTitle: "Core Candy Machine - Guards - Asset Gate"
description: "Core Candy Machine 的 'Asset Gate' 守卫要求铸造钱包持有来自特定 collection 的另一个 Core Asset 才能允许从 Core Candy Machine 铸造"
---

## 概述

**Asset Gate** 守卫在付款人是指定资产 collection 的资产持有者时允许铸造。资产将**不会**被转移。

如果付款人没有拥有来自必需 collection 的资产，铸造将失败。

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
{% node #assetGate label="assetGate" /%}
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
检查付款人是否

拥有至少 1 个

来自此 collection 的资产
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

Asset Gate 守卫包含以下设置：

- **Required Collection**：必需 Collection 的铸造地址。我们用于证明所有权的资产必须属于此 collection。

{% dialect-switcher title="使用 Asset Gate 守卫设置 Candy Machine" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    assetGate: some({
      requiredCollection: requiredCollection.publicKey,
    }),
  },
});
```

API 参考：[create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html)、[AssetGate](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetGate.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 铸造设置

Asset Gate 守卫包含以下铸造设置：

- **Asset Address**：用于证明所有权的资产地址。此资产必须属于必需的 collection 且必须属于铸造者。
- **Collection Address**：用于证明所有权的 Collection 地址。

注意，如果您计划在没有我们 SDK 帮助的情况下构建指令，您需要将这些铸造设置和更多内容作为指令参数和剩余账户的组合提供。详情请参阅 [Core Candy Guard 的程序文档](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#assetgate)。

{% dialect-switcher title="使用 Asset Gate 守卫设置 Candy Machine" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

您可以使用 `mintArgs` 参数传递 Asset Gate 守卫的铸造设置，如下所示。

```ts

mintV1(umi, {
  // ...
  mintArgs: {
    assetGate: some({
      requiredCollection: publicKey(requiredCollection),
      destination,
    }),
  },
});
```

API 参考：[mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html)、[AssetGateMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetGateMintArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route 指令

_Asset Gate 守卫不支持 route 指令。_
