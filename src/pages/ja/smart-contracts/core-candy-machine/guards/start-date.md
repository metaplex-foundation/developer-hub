---
title: "Start Dateガード"
metaTitle: "Start Dateガード - Core Candy Machineガード | Metaplex"
description: "Start Dateガードは、Core Candy Machineでミントが許可される最も早い日時を設定し、設定されたタイムスタンプより前のすべてのミント試行をブロックします。"
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

**Start Date**ガードは、Core Candy Machineでミントが許可される最も早い日時を設定し、設定されたタイムスタンプより前のすべてのミント試行をブロックします。 {% .lead %}

## 概要

**Start Date** ガードは、ミントの開始日を決定します。この日付より前は、ミントが許可されません。

{% diagram  %}

{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine" y="100" x="22" %}
{% node #candy-guard label="Core Candy Guard" theme="blue" /%}
{% node label="Owner: Core Candy Guard Program" theme="dimmed" /%}
{% node #candy-guard-guards label="Guards" theme="mint"/%}
{% node #startDate label="startDate" /%}
{% node #date label="- Date" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine" #mint-candy-guard x="500" %}
  {% node theme="pink" %}
    Mint from

    _Core Candy Guard Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  Access Control
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-8" %}
  {% node theme="pink" %}
    Mint from

    _Core Candy Machine Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="150" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="120" x="93" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" /%}
{% edge from="date" to="mint-candy-guard" arrow="none" dashed=true %}
Before that date

minting will fail
{% /edge %}

{% edge from="candy-guard-guards" to="guards" /%}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## ガード設定

Start Date ガードには以下の設定が含まれます：

- **Date**: この日付より前はミントが許可されません。

{% dialect-switcher title="Start Date ガードを使用した Core Candy Machine の設定" %}
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

API リファレンス: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [StartDate](https://mpl-core-candy-machine.typedoc.metaplex.com/types/StartDate.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ミント設定

_Start Date ガードはミント設定を必要としません。_

## Route 命令

_Start Date ガードは route 命令をサポートしません。_

## 注意事項

- Start DateガードはUTCタイムスタンプを使用します。`dateTime()`で渡す日付値はISO 8601形式で明示的なタイムゾーン情報を含むようにしてください。
- ミントの開始と終了の両方のウィンドウを定義するには、Start Dateガードと[End Date](/smart-contracts/core-candy-machine/guards/end-date)ガードを組み合わせてください。
- 日付比較はオンチェーンのSolanaクラスタークロックを使用するため、実時間とわずかなずれが生じる場合があります。

