---
title: "Redeemed Amount Guard"
metaTitle: "Redeemed Amount Guard | Core Candy Machine"
description: "Core Candy Machine의 'Redeemed Amount' 가드는 전체 Core Candy Machine에 대해 민팅된 Asset 수가 구성된 최대 수에 도달하면 민팅을 금지합니다."
---

## 개요

**Redeemed Amount** 가드는 전체 Core Candy Machine에 대해 민팅된 Asset 수가 구성된 최대 수에 도달하면 민팅을 금지합니다.

이 가드는 그룹에 전역 민팅 임계값을 추가할 수 있게 해주므로 [Guard Groups](/kr/core-candy-machine/guard-groups)와 함께 사용할 때 더욱 흥미로워집니다.

{% diagram  %}

{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="21" %}
{% node #candy-guard label="Core Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="Guards" theme="mint" z=1/%}
{% node #redeemedAmount label="RedeemedAmount" /%}
{% node #maximum label="- maximum" /%}
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

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-9" %}
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
{% edge from="maximum" to="mint-candy-guard" arrow="none" dashed=true %}
once that amount of

Assets have been minted

Minting will fail
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## 가드 설정

Redeemed Amount 가드에는 다음 설정이 포함됩니다:

- **Maximum**: 민팅할 수 있는 NFT의 최대 수량입니다.

{% dialect-switcher title="Redeemed Amount Guard를 사용한 Core Candy Machine 설정" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  itemsAvailable: 500,
  guards: {
    redeemedAmount: some({ maximum: 300 }),
  },
});
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

Candy Machine에 500개의 아이템이 포함되어 있더라도 이 가드 때문에 이 아이템 중 300개만 민팅 가능하다는 점에 주목하세요.

따라서 이 가드는 [Guard Groups](/kr/core-candy-machine/guard-groups)를 사용할 때 더욱 유용해집니다. 다음은 처음 300개의 Asset은 1 SOL로 민팅할 수 있지만 마지막 200개는 민팅하는 데 2 SOL이 필요하도록 두 개의 그룹을 사용하는 또 다른 예시입니다.

{% dialect-switcher title="그룹 예시와 함께 Redeemed Amount Guard 사용하기" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  itemsAvailable: 500,
  groups: [
    {
      label: "early",
      guards: {
        redeemedAmount: some({ maximum: 300 }),
        solPayment: some({ lamports: sol(1), destination: treasury }),
      },
    },
    {
      label: "late",
      guards: {
        solPayment: some({ lamports: sol(2), destination: treasury }),
      },
    },
  ],
});
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 민트 설정

_Redeemed Amount 가드는 민트 설정이 필요하지 않습니다._

## Route Instruction

_Redeemed Amount 가드는 route instruction을 지원하지 않습니다._