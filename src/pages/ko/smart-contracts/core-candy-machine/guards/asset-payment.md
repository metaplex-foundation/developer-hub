---
title: "Asset Payment Guard"
metaTitle: "Asset Payment Guard | Core Candy Machine"
description: "Core Candy Machine의 'Asset Payment' 가드는 Core Candy Machine에서 민팅을 위한 지불로 특정 컬렉션의 다른 Core Asset을 요구합니다."
---

## 개요

**Asset Payment** 가드는 지불자에게 지정된 Asset 컬렉션에서 Core Asset을 청구하여 민팅을 허용합니다. Asset은 미리 정의된 목적지로 전송됩니다.

지불자가 필수 컬렉션의 Asset을 소유하지 않은 경우 민팅이 실패합니다.

민팅자가 하나 이상의 Asset을 지불하게 하려면 [Asset Payment Multi Guard](/ko/smart-contracts/core-candy-machine/guards/asset-payment-multi)를 사용할 수 있습니다.

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

1 Asset from

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

{% dialect-switcher title="Asset Payment 가드를 사용한 Candy Machine 설정" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    assetPayment: some({
      requiredCollection: requiredCollection.publicKey,
      destination: umi.identity.publicKey,
    }),
  },
});
```

API References: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [AssetPayment](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetPayment.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 민팅 설정

Asset Payment 가드에는 다음 민팅 설정이 포함됩니다:

- **Asset Address**: 지불할 Asset의 주소입니다. 이는 필수 컬렉션의 일부여야 하며 민팅하는 사람에게 속해야 합니다.
- **Collection Address**: 지불에 사용되는 컬렉션의 주소입니다.
- **Destination**: 모든 Asset을 받을 지갑의 주소입니다.

참고로, SDK의 도움 없이 직접 지시문을 구성할 계획이라면, 이러한 민팅 설정과 추가 항목들을 지시문 인수와 나머지 계정의 조합으로 제공해야 합니다. 자세한 내용은 [Core Candy Guard의 프로그램 문서](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#assetpayment)를 참조하세요.

{% dialect-switcher title="Asset Payment 가드를 사용한 Candy Machine 설정" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

다음과 같이 `mintArgs` 인수를 사용하여 Asset Payment 가드의 민팅 설정을 전달할 수 있습니다.

```ts

mintV1(umi, {
  // ...
  mintArgs: {
    assetPayment: some({
      requiredCollection: publicKey(requiredCollection),
      destination,
      asset: assetToSend.publicKey,
    }),
  },
});
```

API References: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [AssetPaymentMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetPaymentMintArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route Instruction

_Asset Payment 가드는 route instruction을 지원하지 않습니다._
