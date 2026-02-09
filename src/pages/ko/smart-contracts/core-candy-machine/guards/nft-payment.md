---
title: "NFT Payment Guard"
metaTitle: "NFT Payment Guard | Core Candy Machine"
description: "Core Candy Machine의 'NFT Payment' 가드는 지정된 NFT 컬렉션에서 결제자에게 NFT/pNFT를 청구하여 민팅을 허용합니다. 결제로 사용된 NFT/pNFT는 사전 정의된 목적지로 전송됩니다."
---

## 개요

**NFT Payment** 가드는 지정된 NFT 컬렉션에서 결제자에게 NFT를 청구하여 민팅을 허용합니다. NFT는 사전 정의된 목적지로 전송됩니다.

결제자가 필수 컬렉션에서 NFT를 소유하지 않으면 민팅이 실패합니다.

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
{% node label="nftPayment" /%}
{% node #guardRequiredCollection label="- Required Collection" /%}
{% node #guardDestinationWallet label="- Destination Wallet" /%}
{% node label="..." /%}
{% /node %}

{% node parent="guardRequiredCollection" #collectionNftMint x="270" y="-100"  %}
{% node theme="blue" %}
Collection NFT {% .whitespace-nowrap %}

Mint Account
{% /node %}
{% node theme="dimmed" %}
Owner: Token Metadata Program {% .whitespace-nowrap %}
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

{% edge from="collectionNftMint" to="mint-candy-guard" theme="indigo" dashed=true arrow="none" %}
Transfers

1 NFT from

this collection
{% /edge %}

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

NFT Payment 가드에는 다음 설정이 포함됩니다:

- **Required Collection**: 필수 NFT 컬렉션의 민트 주소입니다. 결제에 사용하는 NFT는 이 컬렉션의 일부여야 합니다.
- **Destination**: 모든 NFT를 받을 지갑의 주소입니다.

{% dialect-switcher title="NFT Payment Guard를 사용한 Candy Machine 설정" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    nftPayment: some({
      requiredCollection: requiredCollectionNft.publicKey,
      destination: umi.identity.publicKey,
    }),
  },
});
```

API References: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [NftPayment](https://mpl-core-candy-machine.typedoc.metaplex.com/types/NftPayment.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 민트 설정

NFT Payment 가드에는 다음 민트 설정이 포함됩니다:

- **Destination**: 모든 NFT를 받을 지갑의 주소입니다.
- **Mint**: 결제에 사용할 NFT의 민트 주소입니다. 이는 필수 컬렉션의 일부여야 하며 민터에게 속해야 합니다.
- **Token Standard**: 결제에 사용되는 NFT의 토큰 표준입니다.
- **Token Account** (선택 사항): 선택적으로 NFT와 소유자를 명시적으로 연결하는 토큰 계정을 제공할 수 있습니다. 기본적으로 결제자의 연결된 토큰 계정이 사용됩니다.
- **Rule Set** (선택 사항): Rule Set이 있는 Programmable NFT로 결제하는 경우, 결제에 사용되는 NFT의 Rule Set입니다.

참고로, SDK의 도움 없이 명령어를 구성할 계획이라면 이러한 민트 설정과 더 많은 것들을 명령어 인수와 나머지 계정의 조합으로 제공해야 합니다. 자세한 내용은 [Core Candy Guard의 프로그램 문서](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#nftpayment)를 참조하세요.

{% dialect-switcher title="NFT Payment Guard를 사용한 Candy Machine 설정" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

다음과 같이 `mintArgs` 인수를 사용하여 NFT Payment 가드의 민트 설정을 전달할 수 있습니다.

```ts
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";

mintV1(umi, {
  // ...
  mintArgs: {
    nftPayment: some({
      destination,
      mint: nftToPayWith.publicKey,
      tokenStandard: TokenStandard.NonFungible,
    }),
  },
});
```

API References: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [NftPaymentMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/NftPaymentMintArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route Instruction

_NFT Payment 가드는 route instruction을 지원하지 않습니다._
