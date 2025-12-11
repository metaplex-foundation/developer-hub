---
title: "Edition ガード"
metaTitle: "Edition ガード | Core Candy Machine"
description: "Core Candy Machine の 'Edition' ガードは、Core Candy Machine からエディションをミントできるようにします。"
---

## 概要

**Edition** ガードは特別な種類のガードです。購入者に課金したり、ミントが許可されている条件を確認したりするために使用されるものではありません。代わりに、Edition ガードは作成されたアセットが持つべきエディション番号を決定します。

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
  Edition Number Control
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-8" %}
  {% node theme="pink" %}
    Mint from

    _Core Candy Machine_
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="110" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="120" x="65" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" /%}
{% edge from="editionCounterPda" to="mint-candy-guard" arrow="none" dashed=true %}
Determine the

edition number
{% /edge %}

{% edge from="candy-guard-guards" to="guards" /%}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## ガード設定

Edition ガードには以下の設定が含まれます：

- **editionStartOffset**: エディション番号がカウントアップを開始する数値。

{% dialect-switcher title="Edition ガードを使用した Candy Machine の設定" %}
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

API リファレンス: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ミント設定

_Edition ガードはミント設定を必要としません。_

## Route 命令

_Edition ガードは route 命令を必要としません。_
