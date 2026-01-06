---
title: "已兑换数量守卫"
metaTitle: "已兑换数量守卫 | Core Candy Machine"
description: "Core Candy Machine 的 'Redeemed Amount' 守卫在整个 Core Candy Machine 的铸造资产数量达到配置的最大数量时禁止铸造。"
---

## 概述

**Redeemed Amount** 守卫在整个 Core Candy Machine 的铸造资产数量达到配置的最大数量时禁止铸造。

当与[守卫组](/zh/smart-contracts/core-candy-machine/guard-groups)一起使用时，此守卫变得更加有趣，因为它允许我们为组添加全局铸造阈值。

{% diagram  %}

{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="21" %}
{% node #candy-guard label="Core Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="Guards" theme="mint" z=1/%}
{% node #redeemedAmount label="RedeemedAmount" /%}
{% node #maximum label="- maximum" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine" #mint-candy-guard x="595" %}
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

{% node #nft parent="mint-candy-machine" y="140" x="93" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}
{% edge from="maximum" to="mint-candy-guard" arrow="none" dashed=true %}
一旦铸造了该数量的

资产

铸造将失败
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## 守卫设置

Redeemed Amount 守卫包含以下设置：

- **Maximum**：可以铸造的最大 NFT 数量。

{% dialect-switcher title="使用 Redeemed Amount 守卫设置 Core Candy Machine" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  itemsAvailable: 500,
  guards: {
    redeemedAmount: some({ maximum: 300 }),
  },
});
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

注意，即使 Candy Machine 包含 500 个物品，由于此守卫，只有 300 个物品可以铸造。

因此，当使用[守卫组](/zh/smart-contracts/core-candy-machine/guard-groups)时，此守卫变得更有用。这是另一个使用两个组的示例，前 300 个资产可以以 1 SOL 铸造，但最后 200 个需要 2 SOL 铸造。

{% dialect-switcher title="使用 Redeemed Amount 守卫与组的示例" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  itemsAvailable: 500,
  groups: [
    {
      label: "early",
      guards: {
        redeemedAmount: some({ maximum: 300 }),
        solPayment: some({ lamports: sol(1), destination: treasury }),
      },
    },
    {
      label: "late",
      guards: {
        solPayment: some({ lamports: sol(2), destination: treasury }),
      },
    },
  ],
});
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 铸造设置

_Redeemed Amount 守卫不需要铸造设置。_

## Route 指令

_Redeemed Amount 守卫不支持 route 指令。_
