---
title: "End Date Guard"
metaTitle: "End Date 가드 - 마감일 이후 민팅 중단 | 코어 캔디 머신"
description: "End Date 가드는 코어 캔디 머신에서 마감일 이후의 민팅을 더 이상 허용하지 않는 마감 시간을 설정합니다. 종료 타임스탬프를 구성하여 민팅을 자동으로 종료하세요."
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

**End Date** 가드는 코어 캔디 머신에서 마감일 이후의 민팅을 더 이상 허용하지 않는 마감 시간을 설정합니다. {% .lead %}

## 개요

**End Date** 가드는 민팅을 종료할 날짜를 지정합니다. 이 날짜 이후에는 더 이상 민팅이 허용되지 않습니다.

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

{% node #nft parent="mint-candy-machine" y="120" x="73" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" /%}
{% edge from="date" to="mint-candy-guard" arrow="none" dashed=true %}
After that date

minting will fail
{% /edge %}

{% edge from="candy-guard-guards" to="guards" /%}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## 가드 설정

End Date 가드에는 다음 설정이 포함됩니다:

- **Date**: 이 날짜 이후에는 더 이상 민팅이 허용되지 않습니다.

{% dialect-switcher title="End Date 가드를 사용한 Candy Machine 설정" %}
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

API References: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [EndDate](https://mpl-core-candy-machine.typedoc.metaplex.com/types/EndDate.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

config.json 파일의 가드 섹션에 이 객체를 추가하세요:

```json
"endDate" : {
    "date": "string",
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 민팅 설정

_End Date 가드는 민팅 설정이 필요하지 않습니다._

## Route Instruction

_End Date 가드는 route instruction을 지원하지 않습니다._

## Notes

- End Date 가드는 구성된 타임스탬프 이후의 새로운 민팅만 방지합니다. 이미 민팅된 Asset에는 영향을 주지 않습니다.
- 특정 기간에만 민팅을 제한하려면 End Date 가드를 [Start Date](/ko/smart-contracts/core-candy-machine/guards/start-date) 가드와 결합하세요.
- 날짜 값은 Umi의 `dateTime` 헬퍼를 통해 전달되는 유효한 UTC 타임스탬프 문자열이어야 합니다.

