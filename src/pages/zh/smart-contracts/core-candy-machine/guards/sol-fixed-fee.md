---
title: SOL 固定费用守卫
metaTitle: "SOL 固定费用守卫 - Core Candy Machine 守卫 | Metaplex"
description: "Sol Fixed Fee 守卫在从 Core Candy Machine 铸造时向付款人收取固定数量的 SOL，将费用转移到配置的目标钱包。"
keywords:
  - sol fixed fee
  - Core Candy Machine
  - candy guard
  - SOL payment
  - mint fee
  - fixed fee
  - Solana NFT
  - minting restriction
about:
  - Candy Machine guards
  - SOL payment collection
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
---

**Sol Fixed Fee** 守卫在从 Core Candy Machine 铸造时向付款人收取固定数量的 SOL，将费用转移到配置的目标钱包。 {% .lead %}

## 概述

**Sol Fixed Fee** 守卫允许我们在铸造时向付款人收取一定数量的 SOL。可以配置 SOL 的数量和目标地址。它的工作方式类似于 [Sol Payment](/zh/smart-contracts/core-candy-machine/guards/sol-payment) 守卫。

{% diagram  %}

{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="20" %}
{% node #candy-guard label="Core Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="Guards" theme="mint" z=1/%}
{% node label="Sol Fixed Fee" /%}
{% node #amount label="- Amount" /%}
{% node #destination label="- Destination" /%}
{% node label="..." /%}
{% /node %}

{% node parent="destination" x="270" y="-9" %}
{% node #payer theme="indigo" %}
Destination Wallet {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
Owner: System Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" x="600" %}
  {% node #mint-candy-guard theme="pink" %}
    Mint from

    _Candy Guard Program_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  访问控制
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-9" %}
  {% node theme="pink" %}
    Mint from

    _Candy Machine Program_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  铸造逻辑
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="72" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}
{% edge from="destination" to="payer" arrow="none" dashed=true /%}
{% edge from="mint-candy-guard" to="payer" %}
从付款人

转移 SOL
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## 守卫设置

Sol Payment 守卫包含以下设置：

- **Lamports**：向付款人收取的 SOL（或 lamports）数量。
- **Destination**：应接收与此守卫相关的所有付款的钱包地址。

{% dialect-switcher title="使用 Sol Payment 守卫设置 Candy Machine" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

注意，在此示例中，我们使用当前身份作为目标钱包。

```ts
create(umi, {
  // ...
  guards: {
    solFixedFee: some({
      lamports: sol(1.5),
      destination: umi.identity.publicKey,
    }),
  },
});
```

API 参考：[create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html)、[SolFixedFee](https://mpl-core-candy-machine.typedoc.metaplex.com/types/SolFixedFee.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 铸造设置

Sol Fixed Fee 守卫包含以下铸造设置：

- **Destination**：应接收与此守卫相关的所有付款的钱包地址。

注意，如果您计划在没有我们 SDK 帮助的情况下构建指令，您需要将这些铸造设置和更多内容作为指令参数和剩余账户的组合提供。详情请参阅 [Core Candy Guard 的程序文档](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#solfixedfee)。

{% dialect-switcher title="使用 Sol Fixed Fee 守卫铸造" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

您可以使用 `mintArgs` 参数传递 Sol Fixed Fee 守卫的铸造设置，如下所示。

```ts
mintV1(umi, {
  // ...
  mintArgs: {
    solFixedFee: some({ destination: treasury }),
  },
});
```

API 参考：[mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html)、[SolFixedFeeMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/SolFixedFeeMintArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route 指令

_Sol Fixed Fee 守卫不支持 route 指令。_

## 注意事项

- Sol Fixed Fee 守卫要求在守卫设置和铸造设置中同时提供 `destination` 钱包地址。
- 费用金额以 lamports 为单位指定。使用 `sol()` 辅助函数将 SOL 转换为 lamports（例如 `sol(1.5)` 等于 1,500,000,000 lamports）。
- 此守卫的工作方式类似于 [Sol Payment](/zh/smart-contracts/core-candy-machine/guards/sol-payment) 守卫。主要区别在于 Sol Fixed Fee 专为固定费用收取场景设计。

