---
title: "코어 캔디 머신 - 자산 게이트 가드"
metaTitle: "코어 캔디 머신 - 가드 - 자산 게이트"
description: "코어 캔디 머신의 '자산 게이트' 가드는 민팅 지갑이 특정 컬렉션의 다른 코어 자산을 보유해야 코어 캔디 머신에서 민팅을 허용합니다"
---

## 개요

**자산 게이트** 가드는 지불자가 지정된 자산 컬렉션의 자산을 보유한 경우 민팅을 허용합니다. 자산은 **전송되지 않습니다**.

지불자가 필수 컬렉션의 자산을 소유하지 않으면 민팅이 실패합니다.

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
{% node #assetGate label="assetGate" /%}
{% node #requiredCollection label="- Required Collection" /%}
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
Check that the payer

has at least 1 asset

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

자산 게이트 가드에는 다음 설정이 포함됩니다:

- **Required Collection**: 필수 컬렉션의 민트 주소입니다. 소유권을 증명하는 데 사용하는 자산은 이 컬렉션에 포함되어야 합니다.

{% dialect-switcher title="자산 게이트 가드를 사용하여 캔디 머신 설정" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    assetGate: some({
      requiredCollection: requiredCollection.publicKey,
    }),
  },
});
```

API 참조: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [AssetGate](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetGate.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 민트 설정

자산 게이트 가드에는 다음 민트 설정이 포함됩니다:

- **Asset Address**: 소유권을 증명하는 데 사용할 자산의 주소입니다. 이는 필수 컬렉션에 포함되어야 하며 민터의 소유여야 합니다.
- **Collection Address**: 소유권을 증명하는 데 사용되는 컬렉션의 주소입니다.

SDK의 도움 없이 지시사항을 구성할 계획이라면, 이러한 민트 설정과 더 많은 것들을 지시사항 인수와 나머지 계정의 조합으로 제공해야 합니다. 자세한 내용은 [코어 캔디 가드의 프로그램 문서](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#assetgate)를 참조하세요.

{% dialect-switcher title="자산 게이트 가드를 사용하여 캔디 머신 설정" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

다음과 같이 `mintArgs` 인수를 사용하여 자산 게이트 가드의 민트 설정을 전달할 수 있습니다.

```ts

mintV1(umi, {
  // ...
  mintArgs: {
    assetGate: some({
      requiredCollection: publicKey(requiredCollection),
      destination,
    }),
  },
});
```

API 참조: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [AssetGateMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetGateMintArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 라우트 지시사항

_자산 게이트 가드는 라우트 지시사항을 지원하지 않습니다._
