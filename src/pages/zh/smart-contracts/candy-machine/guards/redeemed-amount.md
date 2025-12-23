---
title: "Redeemed Amount 守卫"
metaTitle: Redeemed Amount 守卫 | Candy Machine
description: "Redeemed Amount 守卫在整个 Candy Machine 铸造的 NFT 数量达到配置的最大数量时禁止铸造。"
---

## 概述

**Redeemed Amount** 守卫在整个 Candy Machine 铸造的 NFT 数量达到配置的最大数量时禁止铸造。

当与[守卫组](/zh/candy-machine/guard-groups)一起使用时，此守卫变得更有趣，因为它允许我们向我们的组添加全局铸造阈值。

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="21" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="Guards" theme="mint" z=1/%}
{% node #redeemedAmount label="RedeemedAmount" /%}
{% node #maximum label="- maximum" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine" #mint-candy-guard x="595" %}
  {% node theme="pink" %}
    Mint from

    _Candy Guard Program_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  Access Control
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-8" %}
  {% node theme="pink" %}
    Mint from

    _Candy Machine Program_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="70" theme="blue" %}
  NFT
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}
{% edge from="maximum" to="mint-candy-guard" arrow="none" dashed=true %}
一旦铸造了该数量的

NFT

铸造将失败
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" /%}

{% /diagram %}

## 守卫设置

Redeemed Amount 守卫包含以下设置：

- **Maximum（最大值）**：可以铸造的 NFT 最大数量。

{% dialect-switcher title="使用 Redeemed Amount 守卫设置 Candy Machine" %}
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
{% dialect title="Sugar" id="sugar" %}
{% totem %}
将此对象添加到您的 config.json 文件的 guard 部分：

```json
"redeemedAmount" : {
    "maximum": number,
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

请注意，即使 Candy Machine 包含 500 个项目，由于此守卫，只有 300 个项目可以铸造。

因此，当使用[守卫组](/zh/candy-machine/guard-groups)时，此守卫变得更有用。以下是使用两个组的另一个示例，前 300 个 NFT 可以以 1 SOL 的价格铸造，但最后 200 个需要 2 SOL 才能铸造。

{% dialect-switcher title="使用带有组的 Redeemed Amount 守卫示例" %}
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
{% dialect title="Sugar" id="sugar" %}
{% totem %}

像所有其他守卫一样，它也可以作为组添加，如下所示：

```json
    "groups": [
      {
        "label": "early",
        "guards": {
          "redeemedAmount": {
            "maximum": 300,
          },
          "solPayment": {
            "value": 1,
            "destination": "<PUBKEY>"
          }
        }
      },
      {
        "label": "late",
        "guards": {
          "solPayment": {
            "value": 2,
            "destination": "<PUBKEY>"
          }
        }
      }
    ]

```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 铸造设置

_Redeemed Amount 守卫不需要铸造设置。_

## Route 指令

_Redeemed Amount 守卫不支持 route 指令。_
