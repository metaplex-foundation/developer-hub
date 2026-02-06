---
title: Sol Fixed Fee Guard
metaTitle: Sol Fixed Fee Guard | Core Candy Machine
description: Core Candy Machine의 'Sol Fixed Fee' 가드는 민팅 시 결제자에게 SOL 수수료를 청구합니다
---

## 개요

**Sol Fixed Fee** 가드는 민팅 시 결제자에게 SOL 수수료를 청구할 수 있게 해줍니다. SOL 수량과 목적지 주소를 모두 구성할 수 있습니다. [Sol Payment](/ko/smart-contracts/core-candy-machine/guards/sol-payment) Guard와 유사하게 작동합니다.

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
{% node label="Sol Fixed Fee" /%}
{% node #amount label="- Amount" /%}
{% node #destination label="- Destination" /%}
{% node label="..." /%}
{% /node %}

{% node parent="destination" x="270" y="-9" %}
{% node #payer theme="indigo" %}
Destination Wallet {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
Owner: System Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" x="600" %}
  {% node #mint-candy-guard theme="pink" %}
    Mint from

    _Candy Guard Program_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  Access Control
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-9" %}
  {% node theme="pink" %}
    Mint from

    _Candy Machine Program_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="72" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}
{% edge from="destination" to="payer" arrow="none" dashed=true /%}
{% edge from="mint-candy-guard" to="payer" %}
Transfers SOL

from the payer
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## 가드 설정

Sol Payment 가드에는 다음 설정이 포함됩니다:

- **Lamports**: 결제자에게 청구할 SOL(또는 lamports) 수량입니다.
- **Destination**: 이 가드와 관련된 모든 결제를 받을 지갑의 주소입니다.

{% dialect-switcher title="Sol Payment 가드를 사용한 Candy Machine 설정" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

이 예시에서는 현재 identity를 목적지 지갑으로 사용하고 있습니다.

```ts
create(umi, {
  // ...
  guards: {
    solFixedFee: some({
      lamports: sol(1.5),
      destination: umi.identity.publicKey,
    }),
  },
});
```

API References: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [SolFixedFee](https://mpl-core-candy-machine.typedoc.metaplex.com/types/SolFixedFee.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 민트 설정

Sol Fixed Fee 가드에는 다음 민트 설정이 포함됩니다:

- **Destination**: 이 가드와 관련된 모든 결제를 받을 지갑의 주소입니다.

참고로, SDK의 도움 없이 명령어를 구성할 계획이라면 이러한 민트 설정과 더 많은 것들을 명령어 인수와 나머지 계정의 조합으로 제공해야 합니다. 자세한 내용은 [Core Candy Guard의 프로그램 문서](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#solfixedfee)를 참조하세요.

{% dialect-switcher title="Sol Fixed Fee Guard로 민팅하기" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

다음과 같이 `mintArgs` 인수를 사용하여 Sol Fixed Fee 가드의 민트 설정을 전달할 수 있습니다.

```ts
mintV1(umi, {
  // ...
  mintArgs: {
    solFixedFee: some({ destination: treasury }),
  },
});
```

API References: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [SolFixedFeeMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/SolFixedFeeMintArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route Instruction

_Sol Fixed Fee 가드는 route instruction을 지원하지 않습니다._
