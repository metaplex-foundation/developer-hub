---
title: Token2022 Payment Guard
metaTitle: Token2022 Payment Guard | Core Candy Machine
description: "Core Candy Machine 'Token2022 Payment' guard는 지불자에게 SPL Token2022의 설정된 값을 청구하여 민팅을 허용합니다."
---

## 개요

**Token2022 Payment** guard는 구성된 민트 계정에서 지불자에게 일정 토큰을 청구하여 민팅을 허용합니다. 토큰 수량과 대상 주소 모두 구성할 수 있습니다.

지불자가 지불할 필요한 양의 토큰을 보유하지 않은 경우 민팅에 실패합니다.

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
{% node label="Token 2022 Payment" /%}
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
Owner: Token 2022 Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="guardMint" #tokenAccount x="270" y="1" %}
{% node  theme="blue" %}
Token Account {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
Owner: Token 2022 Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="guardMint" #destinationWallet x="272" y="80" %}
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
{% edge from="guardMint" to="mint" arrow="none" dashed=true /%}
{% edge from="guardDestinationAta" to="tokenAccount" arrow="none" dashed=true /%}
{% edge from="mint-candy-guard" to="tokenAccount" theme="pink" %}
Transfer x Amount tokens

from the payer{% .whitespace-nowrap %}
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

{% callout %}

**Token2022 Payment** guard는 **Token Payment** guard와 동일하게 작동합니다&mdash;유일한 차이점은 민트 및 토큰 계정이 [SPL Token-2022 프로그램](https://spl.solana.com/token-2022)에서 가져와야 한다는 것입니다.

{% /callout %}

## Guard 설정

Token Payment guard는 다음 설정을 포함합니다:

- **Amount**: 지불자에게 청구할 토큰 수량.
- **Mint**: 지불하려는 SPL Token을 정의하는 민트 계정의 주소.
- **Destination Associated Token Address (ATA)**: 토큰을 보낼 연결된 토큰 계정의 주소. **Token Mint** 속성과 이 토큰을 받을 지갑의 주소를 사용하여 연결된 토큰 주소 PDA를 찾아 이 주소를 얻을 수 있습니다.

{% dialect-switcher title="Token Payment guard를 사용하여 Core Candy Machine 설정하기" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

이 예제에서는 현재 신원을 대상 지갑으로 사용합니다.

```ts
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox'
create(umi, {
  // ...
  guards: {
    token2022Payment: some({
      amount: 300,
      mint: tokenMint.publicKey,
      destinationAta: findAssociatedTokenPda(umi, {
        mint: tokenMint.publicKey,
        owner: umi.identity.publicKey,
      })[0],
    }),
  },
})
```

API References: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [TokenPayment](https://mpl-core-candy-machine.typedoc.metaplex.com/types/TokenPaymentArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 민팅 설정

Token Payment guard는 다음 민팅 설정을 포함합니다:

- **Mint**: 지불하려는 SPL Token을 정의하는 민트 계정의 주소.
- **Destination Associated Token Address (ATA)**: 토큰을 보낼 연결된 토큰 계정의 주소.

SDK의 도움 없이 직접 명령어를 구성할 계획이라면, 이러한 민팅 설정과 추가 설정을 명령어 인수 및 나머지 계정의 조합으로 제공해야 합니다. 자세한 내용은 [Candy Guard의 프로그램 문서](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#tokenpayment)를 참조하세요.

{% dialect-switcher title="NFT Burn Guard로 민팅하기" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

다음과 같이 `mintArgs` 인수를 사용하여 Token Payment guard의 민팅 설정을 전달할 수 있습니다.

```ts
mintV1(umi, {
  // ...
  mintArgs: {
    tokenPayment: some({
      mint: tokenMint.publicKey,
      destinationAta,
    }),
  },
})
```

API References: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [TokenPaymentMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/Token2022PaymentMintArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route Instruction

_Token Payment guard는 route instruction을 지원하지 않습니다._
