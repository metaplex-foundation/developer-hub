---
title: 代币门控守卫
metaTitle: "代币门控守卫 | Core Candy Machine"
description: "Core Candy Machine 的 Token Gate 守卫将铸造限制为持有配置的 SPL 代币最低余额的钱包，无需转移或销毁代币。"
keywords:
  - Token Gate
  - Core Candy Machine
  - candy guard
  - token gating
  - SPL token holder
  - minting restriction
  - Solana NFT
about:
  - Candy Machine guards
  - Token-gated minting access
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
---

**Token Gate** 守卫将铸造限制为持有配置的 SPL 代币最低数量的钱包，不会销毁或转移这些代币。 {% .lead %}

## 概述

**代币门控** 守卫将铸造限制为配置的铸币账户的代币持有者。如果付款人没有所需数量的代币，铸造将失败。

{% diagram  %}

{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
所有者: Core Candy Machine Core 程序 {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="20" %}
{% node #candy-guard label="Core Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
所有者: Core Candy Guard 程序 {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="守卫" theme="mint" z=1/%}
{% node label="代币门控" /%}
{% node #guardAmount label="- 数量" /%}
{% node #guardMint label="- 代币铸币" /%}
{% node label="..." /%}
{% /node %}

{% node parent="guardMint" #mint x="270" y="-19" %}
{% node  theme="indigo" %}
铸币账户 {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
所有者: 代币程序 {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" x="600" %}
  {% node #mint-candy-guard theme="pink" %}
    从以下铸造

    _Core Candy Guard 程序_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  访问控制
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-9" %}
  {% node theme="pink" %}
    从以下铸造

    _Core Candy Machine 程序_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  铸造逻辑
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="93" theme="blue" %}
  资产
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}
{% edge from="guardMint" to="mint" arrow="none" dashed=true /%}
{% edge from="mint-candy-guard" to="mint" arrow="none" dashed=true  theme="pink" %}
检查付款人的代币账户

是否包含 x 数量的代币{% .whitespace-nowrap %}
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## 守卫设置

代币门控守卫包含以下设置：

- **数量**：所需的代币数量。
- **铸币**：定义我们用于门控的 SPL 代币的铸币账户地址。

{% dialect-switcher title="使用代币门控守卫设置 Candy Machine" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    tokenGate: some({
      amount: 300,
      mint: tokenMint.publicKey,
    }),
  },
});
```

API 参考：[create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [TokenGate](https://mpl-core-candy-machine.typedoc.metaplex.com/types/TokenGateArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 铸造设置

代币门控守卫包含以下铸造设置：

- **铸币**：定义我们用于门控的 SPL 代币的铸币账户地址。

请注意，如果您计划在没有我们 SDK 帮助的情况下构建指令，您需要将这些铸造设置和更多内容作为指令参数和剩余账户的组合提供。有关更多详细信息，请参阅 [Core Candy Guard 程序文档](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#tokengate)。

{% dialect-switcher title="使用代币门控守卫铸造" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

您可以使用 `mintArgs` 参数传递代币门控守卫的铸造设置，如下所示。

```ts
mintV1(umi, {
  // ...
  mintArgs: {
    tokenGate: some({ mint: tokenMint.publicKey }),
  },
});
```

API 参考：[mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [TokenGateMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/TokenGateMintArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 路由指令

_代币门控守卫不支持路由指令。_

## 注意事项

- Token Gate 守卫仅 **检查** 付款人是否持有所需的代币余额——它不会销毁或转移任何代币。如需消耗代币的守卫，请参阅 [Token Burn](/zh/smart-contracts/core-candy-machine/guards/token-burn) 或 [Token Payment](/zh/smart-contracts/core-candy-machine/guards/token-payment)。
- 此守卫使用原始 **SPL Token 程序**，不支持 Token-2022 铸币。
- 代币余额检查在铸造时进行。如果付款人的余额在守卫评估和交易执行之间低于所需 **数量**，铸造将失败。

