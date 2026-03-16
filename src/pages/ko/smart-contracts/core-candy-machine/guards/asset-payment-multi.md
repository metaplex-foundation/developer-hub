---
title: "Asset Payment Multi Guard"
metaTitle: "Asset Payment Multi 가드 | 코어 캔디 머신"
description: "코어 캔디 머신의 'Asset Payment Multi' 가드는 코어 캔디 머신에서 민팅하기 위해 특정 컬렉션의 하나 이상의 Core Asset을 지불로 요구합니다."
keywords:
  - asset payment multi
  - Core Candy Machine
  - candy guard
  - multiple NFT payment
  - bulk asset payment
  - Solana NFT
  - minting restriction
about:
  - Candy Machine guards
  - multi-asset mint payment
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
---

**Asset Payment Multi** 가드는 코어 캔디 머신에서 민팅하기 위해 민터가 지정된 컬렉션에서 하나 이상의 Core Asset을 지불로 전송해야 합니다. {% .lead %}

## 개요

**Asset Payment Multi** 가드는 지불자에게 지정된 Asset 컬렉션에서 하나 또는 여러 개의 Core Asset(들)을 청구하여 민팅을 허용합니다. Asset(들)은 미리 정의된 목적지로 전송됩니다.

지불자가 필수 컬렉션의 Asset을 소유하지 않은 경우 민팅이 실패합니다.

이 가드는 [Asset Payment Guard](/ko/smart-contracts/core-candy-machine/guards/asset-payment)와 유사하지만 지불에 하나 이상의 asset을 받을 수 있습니다.

{% diagram  %}

{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="20" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="Guards" theme="mint" z=1/%}
{% node label="assetPayment" /%}
{% node #guardRequiredCollection label="- Required Collection" /%}
{% node #guardDestinationWallet label="- Destination Wallet" /%}
{% node label="- Number" /%}
{% node label="..." /%}
{% /node %}

{% node parent="guardRequiredCollection" #collectionNftMint x="270" y="-100"  %}
{% node theme="blue" %}
Collection
{% /node %}
{% node theme="dimmed" %}
Owner: Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="guardRequiredCollection" to="collectionNftMint" /%}

{% node parent="guardDestinationWallet" #destinationWallet x="300"  %}
{% node theme="blue" %}
Destination Wallet {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
Owner: System Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="guardDestinationWallet" to="destinationWallet" /%}

{% edge from="collectionNftMint" to="mint-candy-guard" theme="indigo" dashed=true arrow="none" /%}

{% node parent="mint-candy-guard" theme="transparent" x="-180" y="20" %}
Transfers

n Asset(s) from

this collection
{% /node %}

{% edge from="mint-candy-guard" to="destinationWallet" theme="indigo" %}
{% /edge %}
{% node parent="candy-machine" #mint-candy-guard x="600" %}
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

{% node #nft parent="mint-candy-machine" y="140" x="92" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}

{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## 가드 설정

Asset Payment 가드에는 다음 설정이 포함됩니다:

- **Required Collection**: 필수 컬렉션의 민트 주소입니다. 지불에 사용하는 Asset은 이 컬렉션의 일부여야 합니다.
- **Destination**: 모든 Asset을 받을 지갑의 주소입니다.
- **Number**: 지불해야 하는 asset의 수량입니다.

{% dialect-switcher title="Asset Payment Multi 가드를 사용한 Candy Machine 설정" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    assetPaymentMulti: some({
      requiredCollection: requiredCollection.publicKey,
      destination: umi.identity.publicKey,
      num: 2
    }),
  },
});
```

API References: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [AssetPaymentMulti](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetPaymentMulti.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 민팅 설정

Asset Payment 가드에는 다음 민팅 설정이 포함됩니다:
- **[Asset Address]**: 지불할 Asset들의 배열입니다. 이들은 필수 컬렉션의 일부여야 하며 민팅하는 사람에게 속해야 합니다.
- **Collection Address**: 지불에 사용되는 컬렉션의 주소입니다.
- **Destination**: 모든 Asset을 받을 지갑의 주소입니다.

참고로, SDK의 도움 없이 직접 지시문을 구성할 계획이라면, 이러한 민팅 설정과 추가 항목들을 지시문 인수와 나머지 계정의 조합으로 제공해야 합니다. 자세한 내용은 [Core Candy Guard의 프로그램 문서](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#assetpayment)를 참조하세요.

{% dialect-switcher title="Asset Payment Multi 가드를 사용한 Candy Machine 설정" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

다음과 같이 `mintArgs` 인수를 사용하여 Asset Payment 가드의 민팅 설정을 전달할 수 있습니다.

```ts

mintV1(umi, {
  // ...
  mintArgs: {
    assetPaymentMulti: some({
      requiredCollection: publicKey(requiredCollection),
      destination,
      assets: [firstAssetToSend.publicKey, secondAssetToSend.publicKey],
      num: 2
    }),
  },
});
```

API References: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [AssetPaymentMultiMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetPaymentMultiMintArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route Instruction

_Asset Payment Multi 가드는 route instruction을 지원하지 않습니다._

## Notes

- 지불로 사용된 모든 Asset은 목적지 지갑으로 영구적으로 전송됩니다 -- 민터는 각 Asset의 소유권을 잃습니다.
- 가드 설정의 `num` 필드는 민팅 시 `assets` 배열에 제공되는 Asset 주소의 수와 일치해야 합니다.
- `assets` 배열의 모든 Asset은 지정된 필수 컬렉션에 속해야 합니다. 어떤 Asset이라도 다른 컬렉션에 속하면 민트 트랜잭션이 실패합니다.
- 지불로 단일 Asset만 요구하려면 [Asset Payment](/ko/smart-contracts/core-candy-machine/guards/asset-payment) 가드를 대신 사용하세요.

