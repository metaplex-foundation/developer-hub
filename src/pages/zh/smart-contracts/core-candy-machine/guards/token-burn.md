---
title: 代币销毁守卫
metaTitle: 代币销毁守卫 | Core Candy Machine
description: "Core Candy Machine '代币销毁' 守卫通过将铸造货币设置为 SPL 代币地址和值来允许铸造。"
---

## 概述

**代币销毁** 守卫通过从配置的铸币账户销毁付款人的部分代币来允许铸造。如果付款人没有足够数量的代币可供销毁，铸造将失败。

{% diagram  %}

{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
所有者: Core Candy Machine Core 程序 {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="20" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
所有者: Core Candy Guard 程序 {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="守卫" theme="mint" z=1/%}
{% node label="代币销毁" /%}
{% node #guardAmount label="- 数量" /%}
{% node #guardMint label="- 铸币" /%}
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
从付款人的代币账户

销毁代币
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## 守卫设置

代币销毁守卫包含以下设置：

- **数量**：要销毁的代币数量。
- **铸币**：定义我们要销毁的 SPL 代币的铸币账户地址。

{% dialect-switcher title="使用 NFT 销毁守卫设置 Candy Machine" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    tokenBurn: some({
      amount: 300,
      mint: tokenMint.publicKey,
    }),
  },
});
```

API 参考：[create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [TokenBurn](https://mpl-core-candy-machine.typedoc.metaplex.com/types/TokenBurnArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 铸造设置

代币销毁守卫包含以下铸造设置：

- **铸币**：定义我们要销毁的 SPL 代币的铸币账户地址。

请注意，如果您计划在没有我们 SDK 帮助的情况下构建指令，您需要将这些铸造设置和更多内容作为指令参数和剩余账户的组合提供。有关更多详细信息，请参阅 [Candy Guard 程序文档](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#tokenburn)。

{% dialect-switcher title="使用 NFT 销毁守卫铸造" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

您可以使用 `mintArgs` 参数传递代币销毁守卫的铸造设置，如下所示。

```ts
mintV1(umi, {
  // ...
  mintArgs: {
    tokenBurn: some({ mint: tokenMint.publicKey }),
  },
});
```

API 参考：[mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [TokenBurnMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/TokenBurnMintArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 路由指令

_代币销毁守卫不支持路由指令。_
