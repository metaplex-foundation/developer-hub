---
title: "结束日期守卫"
metaTitle: "结束日期守卫 - 在截止时间后停止铸造 | Core Candy Machine"
description: "End Date 守卫设置一个截止时间，在此之后不再允许从 Core Candy Machine 铸造。配置结束时间戳以自动关闭铸造。"
keywords:
  - end date
  - Core Candy Machine
  - candy guard
  - mint deadline
  - minting end time
  - time-based guard
  - Solana NFT
  - minting restriction
about:
  - Candy Machine guards
  - time-based minting controls
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
---

**End Date** 守卫设置一个截止时间，在此之后不再允许从 Core Candy Machine 铸造。 {% .lead %}

## 概述

**End Date** 守卫指定铸造结束的日期。在此日期之后，不再允许铸造。

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node label="Owner: Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine" y="100" x="22" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node #candy-guard-guards label="Guards" theme="mint"/%}
{% node #endDate label="endDate" /%}
{% node #date label="- Date" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine" #mint-candy-guard x="500" %}
  {% node theme="pink" %}
    Mint from

    _Candy Guard Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  访问控制
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-8" %}
  {% node theme="pink" %}
    Mint from

    _Candy Machine Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="110" theme="transparent" %}
  铸造逻辑
{% /node %}

{% node #nft parent="mint-candy-machine" y="120" x="73" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" /%}
{% edge from="date" to="mint-candy-guard" arrow="none" dashed=true %}
在该日期之后

铸造将失败
{% /edge %}

{% edge from="candy-guard-guards" to="guards" /%}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## 守卫设置

End Date 守卫包含以下设置：

- **Date**：不再允许铸造的日期。

{% dialect-switcher title="使用 End Date 守卫设置 Candy Machine" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { dateTime } from "@metaplex-foundation/umi";

create(umi, {
  // ...
  guards: {
    endDate: some({ date: dateTime("2022-01-24T15:30:00.000Z") }),
  },
});
```

API 参考：[create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html)、[EndDate](https://mpl-core-candy-machine.typedoc.metaplex.com/types/EndDate.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

将此对象添加到您的 config.json 文件的守卫部分：

```json
"endDate" : {
    "date": "string",
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 铸造设置

_End Date 守卫不需要铸造设置。_

## Route 指令

_End Date 守卫不支持 route 指令。_

## 注意事项

- End Date 守卫仅阻止配置的时间戳之后的新铸造。它不会影响已经铸造的资产。
- 要将铸造限制在特定时间窗口内，请将 End Date 守卫与 [Start Date](/zh/smart-contracts/core-candy-machine/guards/start-date) 守卫组合使用。
- 日期值必须是通过 Umi 的 `dateTime` 辅助函数传递的有效 UTC 时间戳字符串。

