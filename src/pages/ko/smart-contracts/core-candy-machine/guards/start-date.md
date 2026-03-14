---
title: "Start Date Guard"
metaTitle: "Start Date Guard - Core Candy Machine Guard | Metaplex"
description: "Start Date 가드는 Core Candy Machine에서 민팅이 허용되는 가장 이른 날짜와 시간을 설정하여, 구성된 타임스탬프 이전의 모든 민트 시도를 차단합니다."
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

**Start Date** 가드는 Core Candy Machine에서 민팅이 허용되는 가장 이른 날짜와 시간을 설정하여, 구성된 타임스탬프 이전의 모든 민트 시도를 차단합니다. {% .lead %}

## 개요

**Start Date** 가드는 민트의 시작 날짜를 결정합니다. 이 날짜 이전에는 민팅이 허용되지 않습니다.

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

## 가드 설정

Start Date 가드에는 다음 설정이 포함됩니다:

- **Date**: 민팅이 허용되지 않는 날짜입니다.

{% dialect-switcher title="Start Date Guard를 사용한 Core Candy Machine 설정" %}
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

API References: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [StartDate](https://mpl-core-candy-machine.typedoc.metaplex.com/types/StartDate.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 민트 설정

_Start Date 가드는 민트 설정이 필요하지 않습니다._

## Route Instruction

_Start Date 가드는 route instruction을 지원하지 않습니다._

## Notes

- Start Date 가드는 UTC 타임스탬프를 사용합니다. `dateTime()`을 통해 전달되는 날짜 값은 명시적인 타임존 정보가 포함된 ISO 8601 형식이어야 합니다.
- 민팅의 시작과 종료 기간을 모두 정의하려면 Start Date 가드를 [End Date](/ko/smart-contracts/core-candy-machine/guards/end-date) 가드와 결합하세요.
- 날짜 비교는 온체인 Solana 클러스터 클록을 사용하며, 실제 시간과 약간의 차이가 있을 수 있습니다.

