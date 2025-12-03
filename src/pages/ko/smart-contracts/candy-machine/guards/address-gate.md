---
title: "주소 게이트 가드"
metaTitle: 주소 게이트 가드 | Candy Machine
description: "민팅을 단일 주소로 제한합니다."
---

## 개요

**주소 게이트(Address Gate)** 가드는 민팅 지갑의 주소와 일치해야 하는 단일 주소로 민팅을 제한합니다.

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
{% node #addressGate label="AddressGate" /%}
{% node #address label="- Address" /%}
{% node label="..." /%}
{% /node %}

{% node parent="address" x="270" y="-9" %}
{% node #payer label="Payer" theme="indigo" /%}
{% node theme="dimmed" %}
Owner: Any Program {% .whitespace-nowrap %}
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

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-8" %}
  {% node theme="pink" %}
    Mint from

    _Candy Machine Program_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="72" theme="blue" %}
  NFT
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}
{% edge from="address" to="payer" arrow="none" dashed=true /%}
{% edge from="payer" to="mint-candy-guard" arrow="none" dashed=true%}
if the payer does not match the address on the guard

Minting will fail
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" /%}


{% /diagram %}

## 가드 설정

주소 게이트 가드는 다음 설정을 포함합니다:

- **Address**: Candy Machine에서 민팅이 허용되는 유일한 주소입니다.

{% dialect-switcher title="주소 게이트 가드를 사용하여 Candy Machine 설정" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    addressGate: some({ address: someWallet.publicKey }),
  },
});
```

API 참조: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [AddressGate](https://mpl-candy-machine.typedoc.metaplex.com/types/AddressGate.html)


{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

config.json 파일의 guard 섹션에 다음 객체를 추가하세요:

```json
"addressGate" : {
    "address": "<PUBKEY>"
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

이제 정의된 공개 키만 이 Candy Machine에서 민팅할 수 있습니다.

## 민팅 설정

_주소 게이트 가드는 민팅 설정이 필요하지 않습니다._

## 라우트 명령어

_주소 게이트 가드는 라우트 명령어를 지원하거나 필요로 하지 않습니다._
