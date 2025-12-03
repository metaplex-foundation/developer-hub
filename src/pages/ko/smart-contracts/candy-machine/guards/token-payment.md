---
title: 토큰 결제 가드
metaTitle: 토큰 결제 가드 | Candy Machine
description: "토큰 결제 가드는 지불자에게 일부 토큰을 청구하여 민팅을 허용합니다."
---

## 개요

**토큰 결제(Token Payment)** 가드는 구성된 민트 계정에서 지불자에게 일부 토큰을 청구하여 민팅을 허용합니다. 토큰 개수와 목적지 주소 모두 구성할 수 있습니다.

지불자가 결제할 필요한 토큰 수량을 가지고 있지 않으면 민팅이 실패합니다.

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
{% node label="Token Payment" /%}
{% node #guardAmount label="- Amount" /%}
{% node #guardMint label="- Token Mint" /%}
{% node #guardDestinationAta label="- Destination ATA" /%}
{% node label="..." /%}
{% /node %}

{% node parent="guardMint" #mint x="270" y="-80" %}
{% node  theme="blue" %}
Mint Account {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
Owner: Token Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="guardMint" #tokenAccount x="270" y="1" %}
{% node  theme="blue" %}
Token Account {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
Owner: Token Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="guardMint" #destinationWallet x="258" y="80" %}
{% node  theme="indigo" %}
Destination Wallet {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
Owner: System Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% edge from="mint" to="tokenAccount" arrow="none" /%}
{% edge from="tokenAccount" to="destinationWallet" arrow="none" /%}

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
{% edge from="guardMint" to="mint" arrow="none" dashed=true /%}
{% edge from="guardDestinationAta" to="tokenAccount" arrow="none" dashed=true /%}
{% edge from="mint-candy-guard" to="tokenAccount" theme="pink" %}
Transfer x Amount tokens

from the payer{% .whitespace-nowrap %}
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" /%}

{% /diagram %}

## 가드 설정

토큰 결제 가드는 다음 설정을 포함합니다:

- **Amount**: 지불자에게 청구할 토큰 개수입니다.
- **Mint**: 결제하려는 SPL 토큰을 정의하는 민트 계정의 주소입니다.
- **Destination Associated Token Address (ATA)**: 토큰을 보낼 연관 토큰 계정의 주소입니다. **Token Mint** 속성과 이 토큰을 받아야 하는 지갑의 주소를 사용하여 연관 토큰 주소 PDA를 찾으면 이 주소를 얻을 수 있습니다.

{% dialect-switcher title="토큰 결제 가드를 사용하여 Candy Machine 설정" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

이 예에서는 현재 신원을 목적지 지갑으로 사용하고 있습니다.

```ts
import { findAssociatedTokenPda } from "@metaplex-foundation/mpl-toolbox";
create(umi, {
  // ...
  guards: {
    tokenPayment: some({
      amount: 300,
      mint: tokenMint.publicKey,
      destinationAta: findAssociatedTokenPda(umi, {
        mint: tokenMint.publicKey,
        owner: umi.identity.publicKey,
      }),
    }),
  },
});
```

API 참조: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [TokenPayment](https://mpl-candy-machine.typedoc.metaplex.com/types/TokenPaymentArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

config.json 파일의 guard 섹션에 다음 객체를 추가하세요:

```json
"tokenPayment" : {
    "amount": number in basis points (e.g. 1000 for 1 Token that has 3 decimals),
    "mint": "<PUBKEY>",
    "destinationAta": "<PUBKEY>"
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 민팅 설정

토큰 결제 가드는 다음 민팅 설정을 포함합니다:

- **Mint**: 결제하려는 SPL 토큰을 정의하는 민트 계정의 주소입니다.
- **Destination Associated Token Address (ATA)**: 토큰을 보낼 연관 토큰 계정의 주소입니다.

SDK의 도움 없이 명령어를 구성할 계획이라면, 이러한 민팅 설정 및 그 이상을 명령어 인수와 나머지 계정의 조합으로 제공해야 합니다. 자세한 내용은 [Candy Guard의 프로그램 문서](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#tokenpayment)를 참조하세요.

{% dialect-switcher title="NFT 소각 가드로 민팅" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

다음과 같이 `mintArgs` 인수를 사용하여 토큰 결제 가드의 민팅 설정을 전달할 수 있습니다.

```ts
mintV2(umi, {
  // ...
  mintArgs: {
    tokenPayment: some({
      mint: tokenMint.publicKey,
      destinationAta,
    }),
  },
});
```

API 참조: [mintV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/mintV2.html), [TokenPaymentMintArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/TokenPaymentMintArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_가드가 할당되는 즉시 sugar를 사용하여 민팅할 수 없으므로 특정 민팅 설정이 없습니다._

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 라우트 명령어

_토큰 결제 가드는 라우트 명령어를 지원하지 않습니다._
