---
title: "Sol Payment 가드"
metaTitle: Sol Payment 가드 | Candy Machine
description: "Sol Payment 가드는 민팅할 때 지불자에게 SOL 금액을 청구할 수 있게 해줍니다."
---

## 개요

**Sol Payment** 가드는 민팅할 때 지불자에게 SOL 금액을 청구할 수 있게 해줍니다. SOL 금액과 대상 주소 모두 구성할 수 있습니다.

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
소유자: Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="20" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
소유자: Candy Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="가드" theme="mint" z=1/%}
{% node label="Sol Payment" /%}
{% node #amount label="- 금액" /%}
{% node #destination label="- 대상" /%}
{% node label="..." /%}
{% /node %}

{% node parent="destination" x="270" y="-9" %}
{% node #payer theme="indigo" %}
대상 지갑 {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
소유자: System Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" x="600" %}
  {% node #mint-candy-guard theme="pink" %}
    민팅 from

    _Candy Guard Program_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  접근 제어
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-8" %}
  {% node theme="pink" %}
    민팅 from 
    
    _Candy Machine Program_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  민팅 로직
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="72" theme="blue" %}
  NFT
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}
{% edge from="destination" to="payer" arrow="none" dashed=true /%}
{% edge from="mint-candy-guard" to="payer" %}
지불자로부터

SOL 전송
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" /%}

{% /diagram %}

## 가드 설정

Sol Payment 가드는 다음 설정들을 포함합니다:

- **Lamports**: 지불자에게 청구할 SOL(또는 lamports) 금액입니다.
- **Destination**: 이 가드와 관련된 모든 결제를 받을 지갑의 주소입니다.

{% dialect-switcher title="Sol Payment 가드를 사용하여 Candy Machine 설정" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

이 예시에서는 현재 identity를 대상 지갑으로 사용하고 있음을 참고하세요.

```ts
create(umi, {
  // ...
  guards: {
    solPayment: some({
      lamports: sol(1.5),
      destination: umi.identity.publicKey,
    }),
  },
});
```

API 참조: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [SolPayment](https://mpl-candy-machine.typedoc.metaplex.com/types/SolPayment.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

config.json 파일의 guard 섹션에 다음 객체를 추가하세요:

```json
"solPayment": {
    "value": 1,
    "destination": "<PUBKEY>"
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 민팅 설정

Sol Payment 가드는 다음 민팅 설정들을 포함합니다:

- **Destination**: 이 가드와 관련된 모든 결제를 받을 지갑의 주소입니다.

SDK의 도움 없이 명령어를 구성할 계획이라면, 이러한 민팅 설정들을 명령어 인수와 나머지 계정의 조합으로 제공해야 함을 참고하세요. 자세한 내용은 [Candy Guard의 프로그램 문서](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#solpayment)를 참조하세요.

{% dialect-switcher title="Sol Payment 가드로 민팅" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

다음과 같이 `mintArgs` 인수를 사용하여 Sol Payment 가드의 민팅 설정을 전달할 수 있습니다.

```ts
mintV2(umi, {
  // ...
  mintArgs: {
    solPayment: some({ destination: treasury }),
  },
});
```

API 참조: [mintV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/mintV2.html), [SolPaymentMintArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/SolPaymentMintArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_가드가 할당되는 즉시 sugar를 사용하여 민팅할 수 없습니다 - 따라서 특정 민팅 설정이 없습니다._

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route 명령어

_Sol Payment 가드는 route 명령어를 지원하지 않습니다._