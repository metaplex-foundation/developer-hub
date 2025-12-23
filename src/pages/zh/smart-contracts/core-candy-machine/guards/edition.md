---
title: "版本守卫"
metaTitle: "版本守卫 | Core Candy Machine"
description: "Core Candy Machine 的 'Edition' 守卫允许从 Core Candy Machine 铸造版本。"
---

## 概述

**Edition** 守卫是一种特殊类型的守卫。它不用于向买家收费或验证他们是否被允许铸造的条件。相反，Edition 守卫确定创建的资产应该具有什么版本号。

{% diagram  %}

{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine" y="100" x="22" %}
{% node #candy-guard label="Core Candy Guard" theme="blue" /%}
{% node label="Owner: Core Candy Guard Program" theme="dimmed" /%}
{% node #candy-guard-guards label="Guards" theme="mint"/%}
{% node #edition label="edition" /%}
{% node #editionStartOffset label="- editionStartOffset" /%}
{% node label="..." /%}
{% /node %}

{% node parent="editionStartOffset" x="270" y="-9"  %}
{% node #editionCounterPda %}
Edition Counter PDA {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="editionStartOffset" to="editionCounterPda" path="straight" /%}

{% node parent="candy-machine" #mint-candy-guard x="600" %}
  {% node theme="pink" %}
    Mint from

    _Core Candy Guard_
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="60" theme="transparent" %}
  版本号控制
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-8" %}
  {% node theme="pink" %}
    Mint from

    _Core Candy Machine_
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="110" theme="transparent" %}
  铸造逻辑
{% /node %}

{% node #nft parent="mint-candy-machine" y="120" x="65" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" /%}
{% edge from="editionCounterPda" to="mint-candy-guard" arrow="none" dashed=true %}
确定

版本号
{% /edge %}

{% edge from="candy-guard-guards" to="guards" /%}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## 守卫设置

Edition 守卫包含以下设置：

- **editionStartOffset**：版本号开始计数的数字。

{% dialect-switcher title="使用 Edition 守卫设置 Candy Machine" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts

create(umi, {
  // ...
  guards: {
    edition: { editionStartOffset: 0 },
  },
});
```

API 参考：[create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 铸造设置

_Edition 守卫不需要铸造设置。_

## Route 指令

_Edition 守卫不需要 route 指令。_
