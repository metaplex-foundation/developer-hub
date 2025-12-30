---
title: "상환 수량 가드"
metaTitle: 상환 수량 가드 | Candy Machine
description: "상환 수량 가드는 전체 Candy Machine에 대해 민팅된 NFT 개수가 구성된 최대 수량에 도달하면 민팅을 금지합니다."
---

## 개요

**상환 수량(Redeemed Amount)** 가드는 전체 Candy Machine에 대해 민팅된 NFT 개수가 구성된 최대 수량에 도달하면 민팅을 금지합니다.

이 가드는 [가드 그룹](/ko/smart-contracts/candy-machine/guard-groups)과 함께 사용할 때 더 흥미로워지며, 그룹에 글로벌 민팅 임계값을 추가할 수 있게 합니다.

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="21" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="Guards" theme="mint" z=1/%}
{% node #redeemedAmount label="RedeemedAmount" /%}
{% node #maximum label="- maximum" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine" #mint-candy-guard x="595" %}
  {% node theme="pink" %}
    Mint from

    _Candy Guard Program_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  Access Control
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-8" %}
  {% node theme="pink" %}
    Mint from

    _Candy Machine Program_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="70" theme="blue" %}
  NFT
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}
{% edge from="maximum" to="mint-candy-guard" arrow="none" dashed=true %}
once that amount of

NFTs have been minted

Minting will fail
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" /%}

{% /diagram %}

## 가드 설정

상환 수량 가드는 다음 설정을 포함합니다:

- **Maximum**: 민팅할 수 있는 NFT의 최대 수량입니다.

{% dialect-switcher title="상환 수량 가드를 사용하여 Candy Machine 설정" %}
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
{% dialect title="Sugar" id="sugar" %}
{% totem %}
config.json 파일의 guard 섹션에 다음 객체를 추가하세요:

```json
"redeemedAmount" : {
    "maximum": number,
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

Candy Machine에 500개의 아이템이 포함되어 있더라도 이 가드로 인해 이 아이템 중 300개만 민팅할 수 있습니다.

따라서 이 가드는 [가드 그룹](/ko/smart-contracts/candy-machine/guard-groups)을 사용할 때 더 유용해집니다. 다음은 처음 300개의 NFT는 1 SOL에 민팅할 수 있지만 마지막 200개는 2 SOL이 필요한 두 그룹을 사용하는 또 다른 예입니다.

{% dialect-switcher title="그룹과 함께 상환 수량 가드를 사용하는 예" %}
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
{% dialect title="Sugar" id="sugar" %}
{% totem %}

다른 모든 가드와 마찬가지로 다음과 같이 그룹으로도 추가할 수 있습니다:

```json
    "groups": [
      {
        "label": "early",
        "guards": {
          "redeemedAmount": {
            "maximum": 300,
          },
          "solPayment": {
            "value": 1,
            "destination": "<PUBKEY>"
          }
        }
      },
      {
        "label": "late",
        "guards": {
          "solPayment": {
            "value": 2,
            "destination": "<PUBKEY>"
          }
        }
      }
    ]

```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 민팅 설정

_상환 수량 가드는 민팅 설정이 필요하지 않습니다._

## 라우트 명령어

_상환 수량 가드는 라우트 명령어를 지원하지 않습니다._
