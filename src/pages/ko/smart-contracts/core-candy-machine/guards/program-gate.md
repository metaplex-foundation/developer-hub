---
title: "Program Gate Guard"
metaTitle: "Program  Guard Guard | Core Candy Machine"
description: "Core Candy Machine의 'Program Gate' 가드는 민트 트랜잭션 중에 사용할 수 있는 프로그램을 제한합니다."
---

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
