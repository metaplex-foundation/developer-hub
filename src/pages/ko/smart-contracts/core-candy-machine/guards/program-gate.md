---
title: "Program Gate Guard"
metaTitle: "Program Gate Guard - 트랜잭션 프로그램 제한 | Core Candy Machine"
description: "Core Candy Machine의 Program Gate 가드는 민트 트랜잭션에 포함할 수 있는 프로그램을 제한하여, 봇이 임의의 프로그램에서 악성 명령어를 추가하는 것을 방지합니다."
keywords:
  - Program Gate guard
  - Core Candy Machine
  - candy guard
  - transaction program allowlist
  - bot protection
  - mint security
  - Solana NFT
  - minting restriction
about:
  - Candy Machine guards
  - mint transaction program restrictions
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
---

**Program Gate** 가드는 민트 트랜잭션에 포함할 수 있는 프로그램을 제한하여, 봇이 허가되지 않은 프로그램에서 악성 명령어를 주입하는 것을 방지합니다. {% .lead %}

## 개요

**Program Gate** 가드는 민트 트랜잭션에 포함될 수 있는 프로그램을 제한합니다. 이는 봇이 민트와 같은 트랜잭션에서 임의의 프로그램으로부터 악성 명령어를 추가하는 것을 방지하는 데 유용합니다.

가드는 민트에 필요한 프로그램과 구성에서 지정된 다른 모든 프로그램을 허용합니다.

{% diagram  %}

{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="21" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="Guards" theme="mint" z=1/%}
{% node #addressGate label="ProgramGate" /%}
{% node #additional label="- additional" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine" #mint-candy-guard x="595" %}
  {% node theme="pink" %}
    Mint from

    _Core Candy Guard Program_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  Access Control
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-10" %}
  {% node theme="pink" %}
    Mint from

    _Core Candy Machine Program_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="93" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}
{% edge from="additional" to="mint-candy-guard" arrow="none" dashed=true %}
if the mint transaction contains instructions

from additional programs

Minting will fail
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## 가드 설정

Program Gate 가드에는 다음 설정이 포함됩니다:

- **Additional**: 민트 트랜잭션에 명령어를 포함할 수 있도록 허용된 추가 프로그램 주소 목록(최대 5개 주소)입니다.

{% dialect-switcher title="Program Gate 가드를 사용한 Core Candy Machine 설정" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    programGate: some({ additional: [<PUBKEY 1>, <PUBKEY 2>, ..., <PUBKEY 5>] }),
  },
});
```

API References: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [ProgramGate](https://mpl-core-candy-machine.typedoc.metaplex.com/types/ProgramGate.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 민트 설정

_Program Gate 가드는 민트 설정이 필요하지 않습니다._

## Route Instruction

_Program Gate 가드는 route instruction을 지원하지 않습니다._

## Notes

- `additional` 목록은 최대 5개의 프로그램 주소를 지원합니다. 표준 Candy Machine 민트 플로우에 필요한 프로그램은 자동으로 허용되므로 포함할 필요가 없습니다.
- 이 가드가 활성화되면 허용 목록에 없는 프로그램의 명령어가 포함된 민트 트랜잭션은 실패합니다. 이는 효과적인 봇 방지 조치이지만, 민팅 중 제3자 프로그램이 필요한 경우 합법적인 사용 사례를 차단할 수 있습니다.
- 이 가드는 허용된 프로그램이 내부적으로 수행하는 CPI(크로스 프로그램 호출) 호출을 제한하지 않습니다 -- 트랜잭션의 최상위 명령어만 검사합니다.

