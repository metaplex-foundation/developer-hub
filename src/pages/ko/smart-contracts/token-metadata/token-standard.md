---
title: 토큰 표준
metaTitle: 토큰 표준 | Token Metadata
description: Token Metadata가 지원하는 다양한 토큰 표준에 대한 개요
---

Solana에서 토큰 사용이 발전함에 따라, 단순히 "대체 가능" 토큰과 "대체 불가능" 토큰보다 더 많은 유형의 토큰이 있다는 것이 명확해졌습니다.

한 예는 커뮤니티가 "반 대체 가능 토큰"이라고 부르는 것으로, 공급량이 1보다 많지만 JSON 메타데이터에 이미지와 속성 배열과 같은 일반적인 NFT 속성을 가진 SPL 토큰입니다.

일반적인 합의는 이러한 토큰들이 표준 NFT와 같은 뷰에서 지갑에 저장되거나, 자체 뷰에서 저장되지만 "표준" 대체 가능 SPL 토큰과는 분리되어야 한다는 것입니다. 이러한 토큰들은 검의 종류나 나무 조각과 같은 대체 가능한 아이템을 지원하는 게임 컨텍스트에서 인기를 얻고 있지만, USDC와 같은 일반적인 대체 가능 SPL 토큰과는 다른 리그에 있습니다.

## [토큰 표준 필드](/token-metadata/token-standard#the-token-standard-field)

이 특정 사용 사례를 지원하지만 미래의 다른 토큰 유형으로의 확장을 허용할 만큼 표준을 충분히 광범위하게 만들기 위해, 우리는 Metadata 계정의 `Token Standard` 열거형을 사용하여 토큰의 대체 가능성을 추적합니다. 이 필드는 특정 JSON 표준에 매핑되며 토큰 유형을 객관적으로 구분하는 데 사용됩니다.

이는 이 필드가 있기 전에는 무엇이 "NFT"인지 아닌지를 결정하기 위해 일관성 없는 휴리스틱을 적용해야 했던 지갑과 같은 서드파티의 고충을 해결합니다.

토큰 표준 필드는 다음 값을 가질 수 있습니다:

- `0` / `NonFungible`: Master Edition이 있는 대체 불가능 토큰.
- `1` / `FungibleAsset` (1): 속성도 가질 수 있는 메타데이터를 가진 토큰, 때때로 반 대체 가능이라고 불림.
- `2` / `Fungible` (2): 간단한 메타데이터를 가진 토큰.
- `3` / `NonFungibleEdition` (3): Edition 계정이 있는 대체 불가능 토큰 (Master Edition에서 출력됨).
- `4` / `ProgrammableNonFungible` (4): 사용자 정의 인증 규칙을 강제하기 위해 항상 동결되어 있는 특별한 `NonFungible` 토큰.

토큰 표준은 Token Metadata 프로그램에 의해 자동으로 설정되며 수동으로 업데이트될 수 없다는 것이 중요합니다. 올바른 표준을 적용하기 위해 다음 로직을 사용합니다:

- 토큰이 **Master Edition 계정**을 가지고 있다면, `NonFungible` 또는 `ProgrammableNonFungible`입니다.
- 토큰이 **Edition 계정**을 가지고 있다면, `NonFungibleEdition`입니다.
- 토큰이 (Master) Edition 계정을 가지지 않고 (공급량이 > 1이 될 수 있도록 보장) **소수점 자리를 0개 사용**한다면, `FungibleAsset`입니다.
- 토큰이 (Master) Edition 계정을 가지지 않고 (공급량이 > 1이 될 수 있도록 보장) **최소 하나의 소수점 자리를 사용**한다면, `Fungible`입니다.

각 토큰 표준 유형은 아래에 정의된 고유한 JSON 스키마를 가집니다.

## 대체 가능 표준

이들은 제한된 메타데이터와 공급량 >= 0을 가진 간단한 SPL 토큰입니다. 예로는 USDC, GBTC, RAY가 있습니다.

{% partial file="token-standard-short.md" /%}

{% totem %}
{% totem-accordion title="예제" %}

```json
{
  "name": "USD Coin",
  "symbol": "USDC",
  "description": "Fully reserved fiat-backed stablecoin created by Circle.",
  "image": "https://www.circle.com/hs-fs/hubfs/sundaes/USDC.png?width=540&height=540&name=USDC.png"
}
```

{% /totem-accordion %}
{% /totem %}

## 대체 가능 자산 표준

이들은 더 광범위한 메타데이터와 공급량 >= 0을 가진 대체 가능 토큰입니다. 이런 종류의 토큰의 예는 커뮤니티가 "반 대체 가능 토큰"이라고 불러온 것으로, 검이나 나무 조각과 같은 대체 가능하지만 속성이 많은 게임 내 아이템을 나타내는 데 자주 사용됩니다.

{% partial file="token-standard-full.md" /%}

{% totem %}
{% totem-accordion title="예제" %}

```json
{
  "name": "SolanaGame Steel Sword",
  "symbol": "SG-SS-1",
  "description": "SolanaGame steel sword available after Level 4",
  "image": "<https://arweave.net/26YdhY_eAzv26YdhY1uu9uiA3nmDZYwP8MwZAultcE?ext=jpeg>",
  "animation_url": "<https://arweave.net/ZAultcE_eAzv26YdhY1uu9uiA3nmDZYwP8MwuiA3nm?ext=glb>",
  "external_url": "<https://SolanaGame.io>",
  "attributes": [
    {
      "trait_type": "attack",
      "value": "4"
    },
    {
      "trait_type": "defense",
      "value": "3"
    },
    {
      "trait_type": "durability",
      "value": "47"
    },
    {
      "trait_type": "components",
      "value": "iron: 10; carbon: 1; wood: 2"
    }
  ]
}
```

{% /totem-accordion %}
{% /totem %}

## 대체 불가능 표준

이들은 커뮤니티가 이미 익숙한 "표준" 대체 불가능 토큰으로, Metadata PDA와 Master Edition (또는 Edition) PDA 모두를 가집니다. 이들의 예로는 Solana Monkey Business, Stylish Studs, Thugbirdz가 있습니다.

{% partial file="token-standard-full.md" /%}

{% totem %}
{% totem-accordion title="예제" %}

```json
{
  "name": "SolanaArtProject #1",
  "description": "Generative art on Solana.",
  "image": "https://arweave.net/26YdhY_eAzv26YdhY1uu9uiA3nmDZYwP8MwZAultcE?ext=jpeg",
  "animation_url": "https://arweave.net/ZAultcE_eAzv26YdhY1uu9uiA3nmDZYwP8MwuiA3nm?ext=glb",
  "external_url": "https://example.com",
  "attributes": [
    {
      "trait_type": "trait1",
      "value": "value1"
    },
    {
      "trait_type": "trait2",
      "value": "value2"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://www.arweave.net/abcd5678?ext=png",
        "type": "image/png"
      },
      {
        "uri": "https://watch.videodelivery.net/9876jkl",
        "type": "unknown",
        "cdn": true
      },
      {
        "uri": "https://www.arweave.net/efgh1234?ext=mp4",
        "type": "video/mp4"
      }
    ],
    "category": "video",

    // @deprecated
    // 사용하지 마세요 - 향후 릴리스에서 제거될 수 있습니다.
    // 대신 온체인 데이터를 사용하세요.
    "collection": {
      "name": "Solflare X NFT",
      "family": "Solflare"
    },

    // @deprecated
    // 사용하지 마세요 - 향후 릴리스에서 제거될 수 있습니다.
    // 대신 온체인 데이터를 사용하세요.
    "creators": [
      {
        "address": "xEtQ9Fpv62qdc1GYfpNReMasVTe9YW5bHJwfVKqo72u",
        "share": 100
      }
    ]
  }
}
```

{% /totem-accordion %}
{% /totem %}

## 프로그래머블 대체 불가능 표준

이 표준은 위의 **대체 불가능** 표준과 유사하지만, 기본 토큰 계정이 Token Metadata 프로그램을 거치지 않고는 아무도 프로그래머블 NFT를 전송, 잠금 또는 소각할 수 없도록 보장하기 위해 항상 동결 상태로 유지됩니다. 이를 통해 크리에이터는 2차 판매 로열티 강제와 같은 NFT에 대한 사용자 정의 인증 규칙을 정의할 수 있습니다.

[프로그래머블 NFT에 대해 더 자세히 읽어보세요](https://github.com/metaplex-foundation/mpl-token-metadata/blob/main/programs/token-metadata/program/ProgrammableNFTGuide.md).

{% partial file="token-standard-full.md" /%}

{% totem %}
{% totem-accordion title="예제" %}

```json
{
  "name": "SolanaArtProject #1",
  "description": "Generative art on Solana.",
  "image": "https://arweave.net/26YdhY_eAzv26YdhY1uu9uiA3nmDZYwP8MwZAultcE?ext=jpeg",
  "animation_url": "https://arweave.net/ZAultcE_eAzv26YdhY1uu9uiA3nmDZYwP8MwuiA3nm?ext=glb",
  "external_url": "https://example.com",
  "attributes": [
    {
      "trait_type": "trait1",
      "value": "value1"
    },
    {
      "trait_type": "trait2",
      "value": "value2"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://www.arweave.net/abcd5678?ext=png",
        "type": "image/png"
      },
      {
        "uri": "https://watch.videodelivery.net/9876jkl",
        "type": "unknown",
        "cdn": true
      },
      {
        "uri": "https://www.arweave.net/efgh1234?ext=mp4",
        "type": "video/mp4"
      }
    ],
    "category": "video"
  }
}
```

{% /totem-accordion %}
{% /totem %}