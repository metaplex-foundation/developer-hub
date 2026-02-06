---
title: "게이트키퍼 가드"
metaTitle: 게이트키퍼 가드 | Candy Machine
description: "게이트키퍼 가드는 민팅 지갑이 지정된 게이트키퍼 네트워크로부터 유효한 게이트웨이 토큰을 가지고 있는지 확인합니다."
---

## 개요

**게이트키퍼(Gatekeeper)** 가드는 민팅 지갑이 지정된 **게이트키퍼 네트워크**로부터 유효한 **게이트웨이 토큰**을 가지고 있는지 확인합니다.

대부분의 경우, 이 토큰은 캡차 챌린지를 완료한 후 획득되지만 모든 게이트키퍼 네트워크를 사용할 수 있습니다.

Candy Machine 측에서 설정할 것은 많지 않지만, 선택한 게이트키퍼 네트워크에 따라 민팅 지갑에 필요한 게이트웨이 토큰을 부여하기 위해 몇 가지 사전 검증 확인을 수행하도록 요청해야 할 수 있습니다.

게이트키퍼 네트워크를 설정할 때 도움이 될 수 있는 추가 권장 자료는 다음과 같습니다.

- [CIVIC 문서](https://docs.civic.com/civic-pass/overview)
- [Gateway JS 라이브러리](https://www.npmjs.com/package/@identity.com/solana-gateway-ts)
- [Gateway React 컴포넌트](https://www.npmjs.com/package/@civic/solana-gateway-react)

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node label="Owner: Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine" y="100" x="22" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node #candy-guard-guards label="Guards" theme="mint" z=1/%}
{% node #gatekeeper label="Gatekeeper" /%}
{% node #gatekeeper-network label="- Gatekeeper Network" /%}
{% node #expire label="- Expire on use" /%}
{% node label="..." /%}
{% /node %}

{% node parent="gatekeeper" x="250" y="-17" %}
{% node #request-token theme="indigo" %}
Request Gateway Token

from the Gatekeeper

Network e.g. Captcha
{% /node %}
{% /node %}

{% node parent="request-token" y="140" x="34" %}
{% node #gateway-token theme="indigo" label="Gateway Token" /%}
{% /node %}

{% node parent="candy-machine" x="600" %}
  {% node #mint-candy-guard theme="pink" %}
    Mint from

    _Candy Guard Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  Access Control
{% /node %}

{% node parent="mint-candy-guard" y="150" x="-9" %}
  {% node #mint-candy-machine theme="pink" %}
    Mint from

    _Candy Machine Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="78" theme="blue" %}
  NFT
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" /%}
{% edge from="gatekeeper-network" to="request-token" /%}
{% edge from="request-token" to="gateway-token" /%}

{% edge from="gateway-token" to="mint-candy-guard" arrow="none" dashed=true /%}
{% node theme="transparent" parent="mint-candy-guard" x="-210" %}
if a valid token for the given

Network and payer does not exist

Minting will fail
{% /node %}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## 가드 설정

게이트키퍼 가드는 다음 설정을 포함합니다:

- **Gatekeeper Network**: 민팅 지갑의 유효성을 확인하는 데 사용될 게이트키퍼 네트워크의 공개 키입니다. 예를 들어, "**Civic Captcha Pass**" 네트워크를 사용할 수 있으며 — 이는 민팅 지갑이 캡차를 통과했는지 확인합니다 — 다음 주소를 사용합니다: `ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6`.
- **Expire On Use**: NFT가 민팅된 후 민팅 지갑의 게이트웨이 토큰을 만료된 것으로 표시할지 여부입니다.
  - `true`로 설정하면, 또 다른 NFT를 민팅하려면 게이트키퍼 네트워크를 다시 거쳐야 합니다.
  - `false`로 설정하면, 게이트웨이 토큰이 자연스럽게 만료될 때까지 또 다른 NFT를 민팅할 수 있습니다.

{% dialect-switcher title="게이트키퍼 가드를 사용하여 Candy Machine 설정" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    gatekeeper: some({
      network: publicKey("ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6"),
      expireOnUse: true,
    }),
  },
});
```

API 참조: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [Gatekeeper](https://mpl-candy-machine.typedoc.metaplex.com/types/Gatekeeper.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

config.json 파일의 guard 섹션에 다음 객체를 추가하세요:

```json
"gatekeeper" : {
    "gatekeeperNetwork": "<PUBKEY>",
    "expireOnUse": boolean
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 민팅 설정

게이트키퍼 가드는 다음 민팅 설정을 허용합니다:

- **Gatekeeper Network**: 민팅 지갑의 유효성을 확인하는 데 사용될 게이트키퍼 네트워크의 공개 키입니다.
- **Expire On Use**: NFT가 민팅된 후 민팅 지갑의 게이트웨이 토큰을 만료된 것으로 표시할지 여부입니다.
- **Token Account** (선택사항): 작은 면책 조항으로, 이 설정을 제공해야 하는 경우는 매우 드물지만 필요한 경우를 위해 여기 있습니다. 이것은 지불자와 게이트키퍼 네트워크에서 파생된 게이트웨이 토큰 PDA를 참조하며, 지불자의 민팅 자격을 확인하는 데 사용됩니다. 이 PDA 주소는 SDK에서 추론할 수 있으므로 제공할 필요가 없습니다. 그러나 일부 게이트키퍼 네트워크는 동일한 지갑에 여러 게이트웨이 토큰을 발행할 수 있습니다. PDA 주소를 구분하기 위해 기본값이 `[0, 0, 0, 0, 0, 0, 0, 0]`인 **Seeds** 배열을 사용합니다.

SDK의 도움 없이 명령어를 구성할 계획이라면, 이러한 민팅 설정 및 그 이상을 명령어 인수와 나머지 계정의 조합으로 제공해야 합니다. 자세한 내용은 [Candy Guard의 프로그램 문서](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#gatekeeper)를 참조하세요.

{% dialect-switcher title="게이트키퍼 가드로 민팅" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

다음과 같이 `mintArgs` 인수를 사용하여 게이트키퍼 가드의 민팅 설정을 전달할 수 있습니다.

```ts
mintV2(umi, {
  // ...
  mintArgs: {
    gatekeeper: some({
      network: publicKey("ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6"),
      expireOnUse: true,
    }),
  },
});
```

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_가드가 할당되는 즉시 sugar를 사용하여 민팅할 수 없으므로 특정 민팅 설정이 없습니다._

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 라우트 명령어

_게이트키퍼 가드는 라우트 명령어를 지원하지 않습니다._
