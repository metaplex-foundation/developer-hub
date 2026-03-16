---
title: "开始日期守卫"
metaTitle: "开始日期守卫 - Core Candy Machine 守卫 | Metaplex"
description: "Start Date 守卫设置 Core Candy Machine 上允许铸造的最早日期和时间，在配置的时间戳之前阻止所有铸造尝试。"
keywords:
  - start date
  - Core Candy Machine
  - candy guard
  - mint schedule
  - launch date
  - time-based minting
  - Solana NFT
  - minting restriction
about:
  - Candy Machine guards
  - time-based mint control
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
---

**Start Date** 守卫设置 Core Candy Machine 上允许铸造的最早日期和时间，在配置的时间戳之前阻止所有铸造尝试。 {% .lead %}

## 概述

**开始日期** 守卫决定了铸造的开始日期。在此日期之前，不允许铸造。

{% diagram  %}

{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node label="所有者: Core Candy Machine Core 程序" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine" y="100" x="22" %}
{% node #candy-guard label="Core Candy Guard" theme="blue" /%}
{% node label="所有者: Core Candy Guard 程序" theme="dimmed" /%}
{% node #candy-guard-guards label="守卫" theme="mint"/%}
{% node #startDate label="startDate" /%}
{% node #date label="- 日期" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine" #mint-candy-guard x="500" %}
  {% node theme="pink" %}
    从以下铸造

    _Core Candy Guard 程序_
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  访问控制
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-8" %}
  {% node theme="pink" %}
    从以下铸造

    _Core Candy Machine 程序_
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="150" theme="transparent" %}
  铸造逻辑
{% /node %}

{% node #nft parent="mint-candy-machine" y="120" x="93" theme="blue" %}
  资产
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" /%}
{% edge from="date" to="mint-candy-guard" arrow="none" dashed=true %}
在该日期之前

铸造将失败
{% /edge %}

{% edge from="candy-guard-guards" to="guards" /%}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## 守卫设置

开始日期守卫包含以下设置：

- **日期**：在此日期之前不允许铸造。

{% dialect-switcher title="使用开始日期守卫设置 Core Candy Machine" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { dateTime } from "@metaplex-foundation/umi";

create(umi, {
  // ...
  guards: {
    startDate: some({ date: dateTime("2022-01-24T15:30:00.000Z") }),
  },
});
```

API 参考：[create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [StartDate](https://mpl-core-candy-machine.typedoc.metaplex.com/types/StartDate.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 铸造设置

_开始日期守卫不需要铸造设置。_

## 路由指令

_开始日期守卫不支持路由指令。_

## 注意事项

- Start Date 守卫使用 UTC 时间戳。确保通过 `dateTime()` 传递的日期值采用 ISO 8601 格式并包含明确的时区信息。
- 要同时定义铸造的开始和结束窗口，请将 Start Date 守卫与 [End Date](/zh/smart-contracts/core-candy-machine/guards/end-date) 守卫结合使用。
- 日期比较使用链上 Solana 集群时钟，该时钟可能与实际时间存在轻微偏差。

