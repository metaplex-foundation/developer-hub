---
title: "Gatekeeper Guard"
metaTitle: "Gatekeeper Guard | Core Candy Machine"
description: "Core Candy Machine `Gatekeeper` 가드는 민팅 지갑이 지정된 Gatekeeper Network에서 유효한 Gateway Token을 가지고 있는지 확인합니다."
---

## 개요

**Gatekeeper** 가드는 민팅 지갑이 지정된 **Gatekeeper Network**에서 유효한 **Gateway Token**을 가지고 있는지 확인합니다.

대부분의 경우, 이 토큰은 Captcha 챌린지를 완료한 후 획득되지만 어떤 Gatekeeper Network든 사용할 수 있습니다.

Core Candy Machine 측면에서는 설정할 것이 많지 않지만, 선택한 Gatekeeper Network에 따라 민팅 지갑에 필요한 Gateway Token을 부여하기 위해 사전 검증 확인을 수행하도록 요청해야 할 수 있습니다.

다음은 Gatekeep Network 설정 시 도움이 될 수 있는 추가 권장 자료입니다.

- [The CIVIC Documentation](https://docs.civic.com/civic-pass/overview)
- [Gateway JS Library](https://www.npmjs.com/package/@identity.com/solana-gateway-ts)
- [Gateway React Components](https://www.npmjs.com/package/@civic/solana-gateway-react)

{% diagram  %}

{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
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

{% node parent="mint-candy-guard" y="150" x="-30" %}
  {% node #mint-candy-machine theme="pink" %}
    Mint from

    _Core Candy Machine Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="92" theme="blue" %}
  Asset
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

Gatekeeper 가드에는 다음 설정이 포함됩니다:

- **Gatekeeper Network**: 민팅 지갑의 유효성을 확인하는 데 사용될 Gatekeeper Network의 공개 키입니다. 예를 들어, 민팅 지갑이 captcha를 통과했는지 확인하는 "**Civic Captcha Pass**" Network를 사용할 수 있으며, 다음 주소를 사용합니다: `ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6`.
- **Expire On Use**: NFT가 민팅된 후 민팅 지갑의 Gateway Token을 만료된 것으로 표시할지 여부입니다.
  - `true`로 설정하면, 다른 NFT를 민팅하기 위해 Gatekeeper Network를 다시 거쳐야 합니다.
  - `false`로 설정하면, Gateway Token이 자연스럽게 만료될 때까지 다른 NFT를 민팅할 수 있습니다.

{% dialect-switcher title="Gatekeeper 가드를 사용한 Core Candy Machine 설정" %}
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

API References: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [Gatekeeper](https://mpl-core-candy-machine.typedoc.metaplex.com/types/Gatekeeper.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

config.json 파일의 가드 섹션에 이 객체를 추가하세요:

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

Gatekeeper 가드는 다음 민팅 설정을 받습니다:

- **Gatekeeper Network**: 민팅 지갑의 유효성을 확인하는 데 사용될 Gatekeeper Network의 공개 키입니다.
- **Expire On Use**: NFT가 민팅된 후 민팅 지갑의 Gateway Token을 만료된 것으로 표시할지 여부입니다.
- **Token Account** (선택사항): 작은 면책 조항으로, 이 설정을 제공해야 하는 경우는 매우 드물지만 필요한 경우를 위해 여기에 있습니다. 이는 지불자와 Gatekeeper Network에서 파생된 Gateway Token PDA를 참조하며, 지불자의 민팅 자격을 확인하는 데 사용됩니다. 이 PDA 주소는 SDK에서 유추할 수 있으므로 제공할 필요가 없습니다. 그러나 일부 Gatekeeper Network는 같은 지갑에 여러 Gateway Token을 발급할 수 있습니다. 이들의 PDA 주소를 구분하기 위해 기본값이 `[0, 0, 0, 0, 0, 0, 0, 0]`인 **Seeds** 배열을 사용합니다.

참고로, SDK의 도움 없이 직접 지시문을 구성할 계획이라면, 이러한 민팅 설정과 추가 항목들을 지시문 인수와 나머지 계정의 조합으로 제공해야 합니다. 자세한 내용은 [Candy Guard의 프로그램 문서](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#gatekeeper)를 참조하세요.

{% dialect-switcher title="Gatekeeper 가드로 민팅하기" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

다음과 같이 `mintArgs` 인수를 사용하여 Gatekeeper 가드의 민팅 설정을 전달할 수 있습니다.

```ts
mintV1(umi, {
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
{% /dialect-switcher %}

## Route Instruction

_Gatekeeper 가드는 route instruction을 지원하지 않습니다._
