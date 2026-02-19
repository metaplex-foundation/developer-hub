---
title: "Start Date 가드"
metaTitle: Start Date 가드 | Candy Machine
description: "Start Date 가드는 민팅의 시작 날짜를 결정합니다."
---

## 개요

**Start Date** 가드는 민팅의 시작 날짜를 결정합니다. 이 날짜 이전에는 민팅이 허용되지 않습니다.

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node label="소유자: Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine" y="100" x="22" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node label="소유자: Candy Guard Program" theme="dimmed" /%}
{% node #candy-guard-guards label="가드" theme="mint"/%}
{% node #startDate label="startDate" /%}
{% node #date label="- 날짜" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine" #mint-candy-guard x="500" %}
  {% node theme="pink" %}
    민팅 from

    _Candy Guard Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  접근 제어
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-8" %}
  {% node theme="pink" %}
    민팅 from

    _Candy Machine Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="110" theme="transparent" %}
  민팅 로직
{% /node %}

{% node #nft parent="mint-candy-machine" y="120" x="70" theme="blue" %}
  NFT
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" /%}
{% edge from="date" to="mint-candy-guard" arrow="none" dashed=true %}
해당 날짜 이전에는

민팅이 실패합니다
{% /edge %}

{% edge from="candy-guard-guards" to="guards" /%}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## 가드 설정

Start Date 가드는 다음 설정을 포함합니다:

- **Date**: 민팅이 허용되지 않는 기준 날짜입니다.

{% dialect-switcher title="Start Date 가드를 사용하여 Candy Machine 설정" %}
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

API 참조: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [StartDate](https://mpl-candy-machine.typedoc.metaplex.com/types/StartDate.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

config.json 파일의 guard 섹션에 다음 객체를 추가하세요:

```json
"startDate" : {
    "date": "string",
}
```

날짜는 RFC 3339 표준을 사용하여 지정해야 합니다. 대부분의 경우 사용되는 형식은 "yyyy-mm-ddThh:mm:ssZ"이며, T는 전체 날짜와 전체 시간 사이의 구분자이고 Z는 UTC로부터의 시간대 오프셋입니다(UTC 시간의 경우 Z 또는 +00:00을 사용).

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 민팅 설정

_Start Date 가드는 민팅 설정이 필요하지 않습니다._

## Route 명령어

_Start Date 가드는 route 명령어를 지원하지 않습니다._
