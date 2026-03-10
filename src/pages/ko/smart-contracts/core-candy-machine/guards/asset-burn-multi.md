---
title: 자산 소각 멀티 가드
metaTitle: 자산 소각 멀티 가드 | 코어 캔디 머신
description: "코어 캔디 머신의 'Asset Burn Multi' 가드는 지정된 컬렉션의 보유자로 민팅을 제한하고, 민팅 비용으로 해당 컬렉션에서 구성 가능한 수의 보유자 Asset을 소각합니다."
keywords:
  - asset burn multi
  - Core Candy Machine
  - candy guard
  - burn multiple assets
  - burn to mint
  - collection holder
  - Solana NFT
  - minting restriction
about:
  - Candy Machine guards
  - multi-asset burn-to-mint mechanics
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
---

**Asset Burn Multi** 가드는 민팅 지갑이 지정된 컬렉션에서 구성 가능한 수의 Asset을 보유하고 영구적으로 소각해야 코어 캔디 머신에서 새로운 Asset을 민팅할 수 있습니다. {% .lead %}

## 개요

**자산 소각 멀티** 가드는 미리 정의된 컬렉션의 보유자로 민팅을 제한하고 보유자의 자산(들)을 소각합니다. 따라서 민팅할 때 지불자가 소각할 자산(들)의 주소를 제공해야 합니다.

이는 [자산 소각 가드](/ko/smart-contracts/core-candy-machine/guards/asset-burn)와 유사하지만 소각할 자산을 하나 이상 받을 수 있습니다.

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="20" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="Guards" theme="mint" z=1/%}
{% node #nftBurn label="nftBurnMulti" /%}
{% node #requiredCollection label="- Required Collection" /%}
{% node label="- Number" /%}
{% node label="..." /%}
{% /node %}

{% node parent="requiredCollection" x="270" y="-9"  %}
{% node #collectionNftMint theme="blue" %}
Collection {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
Owner: Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="requiredCollection" to="collectionNftMint" /%}

{% edge from="collectionNftMint" to="mint-candy-guard" theme="indigo" dashed=true %}
Burn n Asset(s)

from this collection
{% /edge %}
{% node parent="candy-machine" x="600" %}
  {% node #mint-candy-guard theme="pink" %}
    Mint from

    _Candy Guard Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  Access Control
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-9" %}
  {% node theme="pink" %}
    Mint from

    _Candy Machine Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="69" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}

{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## 가드 설정

자산 소각 가드에는 다음 설정이 포함됩니다:

- **Required Collection**: 필수 컬렉션의 주소입니다. 민팅에 사용하는 자산은 이 컬렉션에 포함되어야 합니다.
- **Number**: 새로운 자산과 교환하여 소각해야 하는 자산의 수량입니다.

{% dialect-switcher title="자산 소각 멀티 가드를 사용하여 캔디 머신 설정" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    assetBurnMulti: some({
      requiredCollection: requiredCollection.publicKey,
      num: 2,
    }),
  },
});
```

API 참조: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [AssetBurnMulti](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetBurnMulti.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 민트 설정

자산 소각 멀티 가드에는 다음 민트 설정이 포함됩니다:

- **Required Collection**: 필수 컬렉션의 민트 주소입니다.
- **[Address]**: 소각할 자산(들)의 주소 배열입니다. 이들은 필수 컬렉션에 포함되어야 하며 민터의 소유여야 합니다.

SDK의 도움 없이 지시사항을 구성할 계획이라면, 이러한 민트 설정과 더 많은 것들을 지시사항 인수와 나머지 계정의 조합으로 제공해야 합니다. 자세한 내용은 [Candy Guard의 프로그램 문서](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#asseturn)를 참조하세요.

{% dialect-switcher title="자산 소각 멀티 가드로 민팅" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

다음과 같이 `mintArgs` 인수를 사용하여 자산 소각 멀티 가드의 민트 설정을 전달할 수 있습니다.

```ts

mintV1(umi, {
  // ...
  mintArgs: {
    assetBurnMulti: some({
      requiredCollection: requiredCollection.publicKey,
      assets: [assetToBurn1.publicKey, assetToBurn2.publicKey],
    }),
  },
});
```

API 참조: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [AssetBurnMultiMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetBurnMultiMintArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 라우트 지시사항

_자산 소각 멀티 가드는 라우트 지시사항을 지원하지 않습니다._

## Notes

- 소각되는 모든 Asset은 영구적으로 파괴되며 복구할 수 없습니다. 소각은 민트 트랜잭션 중에 원자적으로 발생합니다.
- `assets` 배열에 제공된 Asset 주소의 수는 가드 설정에 구성된 `num` 값과 일치해야 합니다. 더 적거나 많은 주소를 제공하면 트랜잭션이 실패합니다.
- 각 Asset은 민팅 지갑에 속해야 하며 지정된 컬렉션에 포함되어야 합니다. 어떤 Asset이라도 두 조건 중 하나를 충족하지 못하면 전체 민트 트랜잭션이 실패합니다.
- 민팅당 단일 Asset만 소각하려면 더 간단한 [Asset Burn](/ko/smart-contracts/core-candy-machine/guards/asset-burn) 가드를 대신 사용하세요.

