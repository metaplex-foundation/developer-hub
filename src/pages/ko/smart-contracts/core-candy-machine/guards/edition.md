---
title: "Edition Guard"
metaTitle: "Edition Guard | Core Candy Machine"
description: "Core Candy Machine의 'Edition' 가드는 Core Candy Machine에서 Edition의 민팅을 허용합니다."
---

## 개요

**Edition** 가드는 특별한 종류의 가드입니다. 구매자에게 요금을 청구하거나, 민팅을 허용하는 조건을 확인하는 데 사용되지 않습니다. 대신 Edition 가드는 생성된 Asset이 어떤 에디션 번호를 가져야 하는지 결정합니다.

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

## 가드 설정

Edition 가드에는 다음 설정이 포함됩니다:

- **editionStartOffset**: 에디션 번호가 카운팅을 시작하는 번호입니다.

{% dialect-switcher title="Edition 가드를 사용한 Candy Machine 설정" %}
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

API References: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 민팅 설정

_Edition 가드는 민팅 설정이 필요하지 않습니다._

## Route Instruction

_Edition 가드는 route instruction이 필요하지 않습니다._
