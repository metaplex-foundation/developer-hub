---
title: "제3자 서명자 가드"
metaTitle: 제3자 서명자 가드 | Candy Machine
description: "제3자 서명자 가드는 각 민팅 트랜잭션에 사전 정의된 주소의 서명을 요구합니다."
---

## 개요

**제3자 서명자(Third Party Signer)** 가드는 각 민팅 트랜잭션에 사전 정의된 주소의 서명을 요구합니다. 서명자는 이 가드의 민팅 설정 내에서 전달되어야 합니다.

이를 통해 모든 단일 민팅 트랜잭션이 특정 서명자를 거쳐야 하는 보다 중앙 집중식 민팅이 가능합니다.

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
{% edge from="guardSigner" to="signer" arrow="none" dashed=true /%}
{% edge from="mint-candy-guard" to="signer" arrow="none" dashed=true  theme="pink" %}
If this Signer Account does not

sign the mint transaction

minting will fail
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" /%}

{% /diagram %}
## 가드 설정

제3자 서명자 가드는 다음 설정을 포함합니다:

- **Signer Key**: 각 민팅 트랜잭션에 서명해야 하는 서명자의 주소입니다.

{% dialect-switcher title="제3자 서명자 가드를 사용하여 Candy Machine 설정" %}
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

API 참조: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [ThirdPartySigner](https://mpl-candy-machine.typedoc.metaplex.com/types/ThirdPartySigner.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

config.json 파일의 guard 섹션에 다음 객체를 추가하세요:

```json
"thirdPartySigner" : {
    "signerKey": "<PUBKEY>"
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 민팅 설정

제3자 서명자 가드는 다음 민팅 설정을 포함합니다:

- **Signer**: 필요한 제3자 서명자입니다. 이 서명자의 주소는 가드 설정의 Signer Key와 일치해야 합니다.

{% dialect-switcher title="제3자 서명자 가드로 민팅" %}
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

myConfiguredSigner 키페어로 트랜잭션에도 서명하는 것을 잊지 마세요.

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_가드가 할당되는 즉시 sugar를 사용하여 민팅할 수 없으므로 특정 민팅 설정이 없습니다._

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 라우트 명령어

_제3자 서명자 가드는 라우트 명령어를 지원하지 않습니다._
