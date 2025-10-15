---
title: Token2022 Paymentガード
metaTitle: Token2022 Paymentガード | Core Candy Machine
description: "Core Candy Machineの「Token2022 Payment」ガードは、支払者にSPL Token2022の設定値を請求することでミントを許可します。"
---

## 概要

**Token2022 Payment**ガードは、設定されたミントアカウントから支払者にトークンを請求することでミントを許可します。トークンの数と宛先アドレスの両方も設定できます。

支払者が支払うために必要な量のトークンを持っていない場合、ミントは失敗します。

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
_Core Candy Guard Program_

からミント{% .whitespace-nowrap %}

{% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
アクセス制御
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-9" %}
{% node theme="pink" %}
_Core Candy Machine Program_

からミント{% .whitespace-nowrap %}

{% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
ミントロジック
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="93" theme="blue" %}
Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}
{% edge from="guardMint" to="mint" arrow="none" dashed=true /%}
{% edge from="guardDestinationAta" to="tokenAccount" arrow="none" dashed=true /%}
{% edge from="mint-candy-guard" to="tokenAccount" theme="pink" %}
支払者からx量の

トークンを転送{% .whitespace-nowrap %}
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

{% callout %}

**Token2022 Payment**ガードは**Token Payment**ガードと同じように機能します。唯一の違いは、ミントとトークンアカウントが[SPL Token-2022プログラム](https://spl.solana.com/token-2022)からのものである必要があることです。

{% /callout %}

## ガード設定

Token Paymentガードには以下の設定が含まれます:

- **Amount**: 支払者に請求するトークンの数。
- **Mint**: 支払いに使用したいSPLトークンを定義するミントアカウントのアドレス。
- **Destination Associated Token Address (ATA)**: トークンを送信する関連トークンアカウントのアドレス。このアドレスは、**Token Mint**属性とこれらのトークンを受け取る任意のウォレットのアドレスを使用して、Associated Token Address PDAを見つけることで取得できます。

{% dialect-switcher title="Token Paymentガードを使用してCore Candy Machineをセットアップする" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

この例では、現在のアイデンティティを宛先ウォレットとして使用していることに注意してください。

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

APIリファレンス: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [TokenPayment](https://mpl-core-candy-machine.typedoc.metaplex.com/types/TokenPaymentArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ミント設定

Token Paymentガードには以下のミント設定が含まれます:

- **Mint**: 支払いに使用したいSPLトークンを定義するミントアカウントのアドレス。
- **Destination Associated Token Address (ATA)**: トークンを送信する関連トークンアカウントのアドレス。

SDKを使用せずに手動で命令を構築する場合は、これらのミント設定などを命令の引数と残りのアカウントの組み合わせとして提供する必要があることに注意してください。詳細については、[Candy Guardのプログラムドキュメント](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#tokenpayment)を参照してください。

{% dialect-switcher title="NFT Burnガードを使用してミントする" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

Token PaymentガードのMint Settingsは、次のように`mintArgs`引数を使用して渡すことができます。

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

APIリファレンス: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [TokenPaymentMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/Token2022PaymentMintArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ルート命令

_Token Paymentガードはルート命令をサポートしていません。_
