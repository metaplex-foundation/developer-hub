---
title: "Start Date Guard"
metaTitle: Start Date Guard | Candy Machine
description: "Start Dateガードはミントの開始日を決定します。"
---

## 概要

**Start Date**ガードはミントの開始日を決定します。この日付以前は、ミントが許可されません。

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node label="Owner: Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine" y="100" x="22" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node #candy-guard-guards label="Guards" theme="mint"/%}
{% node #startDate label="startDate" /%}
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
  Access Control
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-8" %}
  {% node theme="pink" %}
    Mint from

    _Candy Machine Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="110" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="120" x="70" theme="blue" %}
  NFT
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

Start Dateガードには以下の設定が含まれます：

- **Date**: ミントが許可されない日付より前の日付。

{% dialect-switcher title="Start Dateガードを使用してCandy Machineを設定する" %}
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

APIリファレンス: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [StartDate](https://mpl-candy-machine.typedoc.metaplex.com/types/StartDate.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

config.jsonファイルのガードセクションに以下のオブジェクトを追加してください：

```json
"startDate" : {
    "date": "string",
}
```

日付はRFC 3339標準を使用して指定する必要があります。ほとんどの場合、使用される形式は"yyyy-mm-ddThh:mm:ssZ"で、Tはフルデートとフルタイムの区切り文字、ZはUTCからのタイムゾーンオフセット（UTC時間の場合はZまたは+00:00を使用）です。

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ミント設定

_Start Dateガードにはミント設定は必要ありません。_

## ルート命令

_Start Dateガードはルート命令をサポートしません。_
