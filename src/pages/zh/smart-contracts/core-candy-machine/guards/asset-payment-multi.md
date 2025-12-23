---
title: "多资产支付守卫"
metaTitle: "多资产支付守卫 | Core Candy Machine"
description: "Core Candy Machine 的 'Asset Payment Multi' 守卫收取来自特定 collection 的其他 Core Asset 作为从 Core Candy Machine 铸造的支付。"
---

## 概述

**Asset Payment Multi** 守卫通过向付款人收取来自指定资产 collection 的一个或多个 Core Asset 来允许铸造。资产将被转移到预定义的目的地。

如果付款人没有拥有来自必需 collection 的资产，铸造将失败。

该守卫类似于 [Asset Payment 守卫](/zh/smart-contracts/core-candy-machine/guards/asset-payment)，但可以接受多个资产进行支付。

{% diagram  %}

{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="20" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="Guards" theme="mint" z=1/%}
{% node label="assetPayment" /%}
{% node #guardRequiredCollection label="- Required Collection" /%}
{% node #guardDestinationWallet label="- Destination Wallet" /%}
{% node label="- Number" /%}
{% node label="..." /%}
{% /node %}

{% node parent="guardRequiredCollection" #collectionNftMint x="270" y="-100"  %}
{% node theme="blue" %}
Collection
{% /node %}
{% node theme="dimmed" %}
Owner: Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="guardRequiredCollection" to="collectionNftMint" /%}

{% node parent="guardDestinationWallet" #destinationWallet x="300"  %}
{% node theme="blue" %}
Destination Wallet {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
Owner: System Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="guardDestinationWallet" to="destinationWallet" /%}


{% edge from="collectionNftMint" to="mint-candy-guard" theme="indigo" dashed=true arrow="none" /%}

{% node parent="mint-candy-guard" theme="transparent" x="-180" y="20" %}
从此 collection

转移 n 个资产
{% /node %}

{% edge from="mint-candy-guard" to="destinationWallet" theme="indigo" %}
{% /edge %}
{% node parent="candy-machine" #mint-candy-guard x="600" %}
  {% node theme="pink" %}
    Mint from

    _Core Candy Guard Program_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  访问控制
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-9" %}
  {% node theme="pink" %}
    Mint from

    _Core Candy Machine Program_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  铸造逻辑
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="92" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}

{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## 守卫设置

Asset Payment 守卫包含以下设置：

- **Required Collection**：必需 Collection 的铸造地址。我们用于支付的资产必须属于此 collection。
- **Destination**：将接收所有资产的钱包地址。
- **Number**：需要支付的资产数量。

{% dialect-switcher title="使用 Asset Payment Multi 守卫设置 Candy Machine" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    assetPaymentMulti: some({
      requiredCollection: requiredCollection.publicKey,
      destination: umi.identity.publicKey,
      num: 2
    }),
  },
});
```

API 参考：[create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html)、[AssetPaymentMulti](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetPaymentMulti.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 铸造设置

Asset Payment 守卫包含以下铸造设置：
- **[Asset Address]**：用于支付的资产地址数组。这些资产必须属于必需的 collection 且必须属于铸造者。
- **Collection Address**：用于支付的 Collection 地址。
- **Destination**：将接收所有资产的钱包地址。

注意，如果您计划在没有我们 SDK 帮助的情况下构建指令，您需要将这些铸造设置和更多内容作为指令参数和剩余账户的组合提供。详情请参阅 [Core Candy Guard 的程序文档](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#assetpayment)。

{% dialect-switcher title="使用 Asset Payment Multi 守卫设置 Candy Machine" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

您可以使用 `mintArgs` 参数传递 Asset Payment 守卫的铸造设置，如下所示。

```ts

mintV1(umi, {
  // ...
  mintArgs: {
    assetPaymentMulti: some({
      requiredCollection: publicKey(requiredCollection),
      destination,
      assets: [firstAssetToSend.publicKey, secondAssetToSend.publicKey],
      num: 2
    }),
  },
});
```

API 参考：[mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html)、[AssetPaymentMultiMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetPaymentMultiMintArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route 指令

_Asset Payment Multi 守卫不支持 route 指令。_
