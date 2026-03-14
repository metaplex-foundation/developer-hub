---
title: Third Party Signer Guard
metaTitle: "Third Party Signer Guard - Core Candy Machine Guard | Metaplex"
description: "Third Party Signer 가드는 Core Candy Machine에서 각 민트 트랜잭션에 사전 정의된 주소가 공동 서명하도록 요구하여, 중앙화된 민트 인가 및 게이트 접근 워크플로우를 가능하게 합니다."
keywords:
  - third party signer
  - Core Candy Machine
  - candy guard
  - co-signer
  - authorized minting
  - gated mint
  - Solana NFT
  - minting restriction
about:
  - Candy Machine guards
  - transaction co-signing
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
---

**Third Party Signer** 가드는 Core Candy Machine에서 각 민트 트랜잭션에 사전 정의된 주소가 공동 서명하도록 요구하여, 중앙화된 민트 인가 및 게이트 접근 워크플로우를 가능하게 합니다. {% .lead %}

## 개요

**Third Party Signer** 가드는 각 민트 트랜잭션에 사전 정의된 주소가 서명하도록 요구합니다. 서명자는 이 가드의 민트 설정 내에서 전달되어야 합니다.

이를 통해 모든 단일 민트 트랜잭션이 특정 서명자를 통해야 하는 더 중앙 집중화된 민트가 가능합니다.

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
{% node label="Third Party Signer" /%}
{% node #guardSigner label="- Signer" /%}
{% node label="..." /%}
{% /node %}

{% node parent="guardSigner" #signer x="270" y="-19" %}
{% node  theme="indigo" %}
Signer {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
Owner: Any Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" x="600" %}
  {% node #mint-candy-guard theme="pink" %}
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
{% edge from="guardSigner" to="signer" arrow="none" dashed=true /%}
{% edge from="mint-candy-guard" to="signer" arrow="none" dashed=true  theme="pink" %}
If this Signer Account does not

sign the mint transaction

minting will fail
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}
## 가드 설정

Third Party Signer 가드에는 다음 설정이 포함됩니다:

- **Signer Key**: 각 민트 트랜잭션에 서명해야 하는 서명자의 주소입니다.

{% dialect-switcher title="Third Party Signer Guard를 사용한 Candy Machine 설정" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
const myConfiguredSigner = generateSigner(umi);

create(umi, {
  // ...
  guards: {
    thirdPartySigner: some({ signerKey: myConfiguredSigner.publicKey }),
  },
});
```

API References: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [ThirdPartySigner](https://mpl-core-candy-machine.typedoc.metaplex.com/types/ThirdPartySigner.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 민트 설정

Third Party Signer 가드에는 다음 민트 설정이 포함됩니다:

- **Signer**: 필요한 제3자 서명자입니다. 이 서명자의 주소는 가드 설정의 Signer Key와 일치해야 합니다.

{% dialect-switcher title="Third Party Signer Guard로 민팅하기" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

Umi 라이브러리를 통해 민팅할 때, 다음과 같이 `signer` 속성을 통해 제3자 서명자를 제공하기만 하면 됩니다.

```ts
create(umi, {
  // ...
  guards: {
    thirdPartySigner: some({ signer: myConfiguredSigner }),
  },
});
```

myConfiguredSigner 키페어로도 트랜잭션에 서명하는 것을 기억하세요.

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route Instruction

_Third Party Signer 가드는 route instruction을 지원하지 않습니다._

## Notes

- 가드 설정에서 구성된 `signerKey`는 민트 설정에서 전달되는 서명자의 공개 키와 정확히 일치해야 합니다. 그렇지 않으면 트랜잭션이 실패합니다.
- 제3자 서명자 키페어는 민팅 시점에 트랜잭션에 서명할 수 있어야 합니다. 백엔드 게이트 워크플로우에서는 서명자 키페어가 일반적으로 서버 측에서 보유되며 블록체인으로 전달하기 전에 트랜잭션에 서명합니다.
- 이 가드는 민트를 시작할 수 있는 사람을 제한하지 않습니다 -- 지정된 서명자가 공동 서명하도록만 요구합니다. 지갑 수준의 접근 제어를 위해 [Allow List](/ko/smart-contracts/core-candy-machine/guards/allow-list)와 같은 다른 가드와 결합하세요.

