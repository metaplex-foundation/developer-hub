---
title: "NFT Gate Guard"
metaTitle: "NFT Gate Guard Guard | Core Candy Machine"
description: "Core Candy Machine의 'NFT Gate' 가드는 지정된 NFT/pNFT 컬렉션 보유자로 민팅을 제한합니다."
---

## 개요

**NFT Gate** 가드는 지정된 NFT 컬렉션 보유자로 민팅을 제한합니다.

{% diagram  %}

{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="20" %}
{% node #candy-guard label="Core Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="Guards" theme="mint" z=1/%}
{% node label="nftGate" /%}
{% node #requiredCollection label="- Required Collection" /%}
{% node label="..." /%}
{% /node %}

{% node parent="requiredCollection" x="270" y="-23"  %}
{% node #collectionNftMint theme="blue" %}
Collection NFT {% .whitespace-nowrap %}

Mint Account
{% /node %}
{% node theme="dimmed" %}
Owner: Token Metadata Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="requiredCollection" to="collectionNftMint" /%}

{% edge from="collectionNftMint" to="mint-candy-guard" theme="indigo" dashed=true %}
Check that the payer

has 1 NFT

from this collection
{% /edge %}
{% node parent="candy-machine" #mint-candy-guard x="600" %}
  {% node theme="pink" %}
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

{% node #nft parent="mint-candy-machine" y="140" x="71" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}

{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## 가드 설정

NFT Gate 가드에는 다음 설정이 포함됩니다:

- **Required Collection**: 필수 NFT 컬렉션의 민트 주소입니다. 민팅 시 증명으로 제공하는 NFT는 이 컬렉션의 일부여야 합니다.

{% dialect-switcher title="NFT Gate Guard를 사용한 Candy Machine 설정" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    nftGate: some({
      requiredCollection: requiredCollectionNft.publicKey,
    }),
  },
});
```

API References: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [NftGate](https://mpl-core-candy-machine.typedoc.metaplex.com/types/NftGate.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 민트 설정

NFT Gate 가드에는 다음 민트 설정이 포함됩니다:

- **Mint**: 결제자가 필수 컬렉션에서 NFT를 소유하고 있다는 증명으로 제공할 NFT의 민트 주소입니다.
- **Token Account** (선택 사항): 선택적으로 NFT와 소유자를 명시적으로 연결하는 토큰 계정을 제공할 수 있습니다. 기본적으로 결제자의 연결된 토큰 계정이 사용됩니다.

참고로, SDK의 도움 없이 명령어를 구성할 계획이라면 이러한 민트 설정과 더 많은 것들을 명령어 인수와 나머지 계정의 조합으로 제공해야 합니다. 자세한 내용은 [Candy Guard의 프로그램 문서](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#nftgate)를 참조하세요.

{% dialect-switcher title="NFT Gate Guard를 사용한 Candy Machine 설정" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

Umi 라이브러리를 통해 민팅할 때, 다음과 같이 `mint` 속성을 통해 소유권 증명으로 사용할 NFT의 민트 주소를 제공하기만 하면 됩니다.

```ts
mintV1(umi, {
  // ...
  mintArgs: {
    nftGate: some({ mint: nftToBurn.publicKey }),
  },
});
```

API References: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [NftGateMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/NftGateMintArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route Instruction

_NFT Gate 가드는 route instruction을 지원하지 않습니다._
