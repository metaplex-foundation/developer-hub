---
title: "Edition Guard"
metaTitle: "Edition 가드 | 코어 캔디 머신"
description: "코어 캔디 머신의 'Edition' 가드는 구성 가능한 오프셋 값부터 시작하여 코어 캔디 머신에서 민팅된 Asset에 순차적인 에디션 번호를 할당합니다."
keywords:
  - edition
  - Core Candy Machine
  - candy guard
  - edition number
  - numbered editions
  - Solana NFT
  - minting restriction
about:
  - Candy Machine guards
  - edition numbering
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
---

**Edition** 가드는 구성 가능한 오프셋 값부터 시작하여 코어 캔디 머신에서 민팅된 Asset에 순차적인 에디션 번호를 할당합니다. {% .lead %}

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

## Notes

- Edition 가드는 민팅을 제한하거나 수수료를 청구하지 않습니다 -- 민팅된 Asset에 대한 에디션 번호 할당만 제어합니다.
- 에디션 번호는 `editionStartOffset` 값부터 순차적으로 증가합니다. 이 값을 `0`으로 설정하면 첫 번째 민팅된 Asset이 에디션 번호 0을 받습니다.
- 에디션 카운터는 온체인 PDA(Edition Counter PDA)를 통해 추적되어, 각 민팅이 고유한 순차적 에디션 번호를 받도록 보장합니다.

