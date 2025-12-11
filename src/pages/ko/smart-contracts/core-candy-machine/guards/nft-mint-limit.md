---
title: "NFT Mint Limit Guard"
metaTitle: "NFT Mint Limit Guard | Core Candy Machine"
description: "Core Candy Machine의 'NFT Mint Limit' 가드는 지정된 NFT/pNFT 컬렉션 보유자로 민팅을 제한하고 제공된 NFT에 대해 민팅할 수 있는 Asset 수를 제한합니다."
---

## 개요

NFT Mint Limit 가드는 지정된 NFT 컬렉션 보유자로 민팅을 제한하고 제공된 Token Metadata NFT에 대해 수행할 수 있는 민트 수를 제한합니다. 이는 지갑 대신 NFT 주소를 기반으로 한 [NFT Gate](/ko/core-candy-machine/guards/nft-gate)와 [Mint Limit](/ko/core-candy-machine/guards/mint-limit) Guard의 조합으로 간주할 수 있습니다.

제한은 NFT 컬렉션별, Candy Machine별, 그리고 설정에서 제공되는 식별자별로 설정되어 동일한 Core Candy Machine 내에서 여러 NFT 민트 제한을 허용합니다.

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
{% node #mintLimit label="NftMintLimit" /%}
{% node #limit label="- Limit" /%}
{% node #id label="- ID" /%}
{% node label="- Required Collection" /%}
{% node label="..." /%}
{% /node %}

{% node parent="id" x="270" y="-9"  %}
{% node #nftMintCounterPda %}
NFT Mint Counter PDA {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="id" to="nftMintCounterPda" /%}

{% node #nft parent="nftMintCounterPda" x="0" y="40"  label="Seeds: candyGuard, candyMachine, id, mint" theme="transparent"  /%}

{% edge from="mintLimit" to="mint-candy-guard" theme="indigo" dashed=true/%}
{% node parent="candy-machine" x="600" %}
  {% node #mint-candy-guard theme="pink" %}
    Mint from

    _Candy Guard Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  Access Control
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-30" %}
  {% node  theme="pink" %}
    Mint from

    _Core Candy Machine Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #asset parent="mint-candy-machine" y="140" x="90" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="asset" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}

{% edge from="mint-candy-guard" to="mint-candy-machine" /%}

{% /diagram %}

## 가드 설정

Mint Limit 가드에는 다음 설정이 포함됩니다:

- **ID**: 이 가드의 고유 식별자입니다. 서로 다른 식별자는 주어진 NFT를 제공하여 얼마나 많은 아이템이 민팅되었는지 추적하기 위해 다른 카운터를 사용합니다. 이는 가드 그룹을 사용할 때 특히 유용하며, 각각이 서로 다른 민트 제한을 가질 수 있습니다.
- **Limit**: 해당 식별자에 대해 NFT당 허용되는 최대 민트 수입니다.
- **Required Collection**: 필수 NFT 컬렉션의 민트 주소입니다. 민팅 시 증명으로 제공하는 NFT는 이 컬렉션의 일부여야 합니다.

{% dialect-switcher title="NFT Mint Limit 가드를 사용한 Candy Machine 설정" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    nftMintLimit: some({
      id: 1,
      limit: 5,
      requiredCollection: requiredCollectionNft.publicKey,
    }),
  },
});
```

API References: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [MintLimit](https://mpl-core-candy-machine.typedoc.metaplex.com/types/NftMintLimit.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 민트 설정

NFT Mint Limit 가드에는 다음 민트 설정이 포함됩니다:

- **ID**: 이 가드의 고유 식별자입니다.
- **Mint**: 결제자가 필수 컬렉션에서 NFT를 소유하고 있다는 증명으로 제공할 NFT의 민트 주소입니다.

참고로, SDK의 도움 없이 명령어를 구성할 계획이라면 이러한 민트 설정과 더 많은 것들을 명령어 인수와 나머지 계정의 조합으로 제공해야 합니다. 자세한 내용은 [Core Candy Guard의 프로그램 문서](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#nftmintlimit)를 참조하세요.

{% dialect-switcher title="NFT Mint Limit Guard로 민팅하기" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

다음과 같이 `mintArgs` 인수를 사용하여 Mint Limit 가드의 민트 설정을 전달할 수 있습니다.

```ts
mintV1(umi, {
  // ...
  mintArgs: {
    nftMintLimit: some({ id: 1, mint: nftToVerify.publicKey }),
  },
});
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route Instruction

_NFT Mint Limit 가드는 route instruction을 지원하지 않습니다._

## NftMintLimit Accounts
`NftMintLimit` Guard가 사용될 때 각 NFT, CandyMachine 및 `id` 조합에 대해 `NftMintCounter` Account가 생성됩니다. 검증 목적으로 다음과 같이 가져올 수 있습니다:

```js
import {
  findNftMintCounterPda,
  fetchNftMintCounter
 } from "@metaplex-foundation/mpl-core-candy-machine";

const pda = findNftMintCounterPda(umi, {
  id: 1, // 가드 구성에서 설정한 nftMintLimit id
  mint: asset.publicKey, // 사용자가 소유한 nft의 주소
  candyMachine: candyMachine.publicKey,
  // 또는 candyMachine: publicKey("Address")로 CM 주소 사용
  candyGuard: candyMachine.mintAuthority
  // 또는 candyGuard: publicKey("Address")로 candyGuard 주소 사용
});

const nftMintCounter = fetchNftMintCounter(umi, pda)
```