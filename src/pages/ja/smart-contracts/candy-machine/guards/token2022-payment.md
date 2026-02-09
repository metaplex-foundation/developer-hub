---
title: "Token2022 Payment Guard"
metaTitle: Token2022 Payment Guard | Candy Machine
description: "Token2022 Paymentガードは、支払者にToken2022トークンを請求することでミントを許可します。"
---

## 概要

**Token2022 Payment**ガードは、設定されたミントアカウントから支払者にトークンを請求することでミントを許可します。トークンの数と宛先アドレスの両方も設定できます。

支払者が支払いに必要な量のトークンを持っていない場合、ミントは失敗します。

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

{% callout %}

**Token2022 Payment**ガードは**Token Payment**ガードと同じように動作します&mdash;唯一の違いは、ミントとトークンアカウントが[SPL Token-2022 program](https://spl.solana.com/token-2022)からのものであることです。

{% /callout %}

## ガード設定

Token Paymentガードには以下の設定が含まれます：

- **Amount**: 支払者に請求するトークンの数。
- **Mint**: 支払いに使用したいSPLトークンを定義するミントアカウントのアドレス。
- **Destination Associated Token Address (ATA)**: トークンを送信する関連トークンアカウントのアドレス。このアドレスは、**Token Mint**属性とこれらのトークンを受け取るウォレットのアドレスを使用してAssociated Token Address PDAを見つけることで取得できます。

{% dialect-switcher title="Token Paymentガードを使用してCandy Machineを設定する" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

この例では、現在のIDを宛先ウォレットとして使用しています。

```ts
import { findAssociatedTokenPda } from "@metaplex-foundation/mpl-toolbox";
create(umi, {
  // ...
  guards: {
    token2022Payment: some({
      amount: 300,
      mint: tokenMint.publicKey,
      destinationAta,
    }),
  },
});
```

APIリファレンス: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [TokenPayment](https://mpl-candy-machine.typedoc.metaplex.com/types/TokenPaymentArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

config.jsonファイルのガードセクションに以下のオブジェクトを追加してください：

```json
"token2022Payment" : {
    "amount": number in basis points (e.g. 1000 for 1 Token that has 3 decimals),
    "mint": "<PUBKEY>",
    "destinationAta": "<PUBKEY>"
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ミント設定

Token Paymentガードには以下のミント設定が含まれます：

- **Mint**: 支払いに使用したいSPLトークンを定義するミントアカウントのアドレス。
- **Destination Associated Token Address (ATA)**: トークンを送信する関連トークンアカウントのアドレス。

注意：SDK の助けなしで命令を構築する予定の場合、これらのミント設定およびそれ以外を命令引数と残りのアカウントの組み合わせとして提供する必要があります。詳細については、[Candy GuardのプログラムドキュメントAtion](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#tokenpayment)を参照してください。

{% dialect-switcher title="Token2022 Paymentガードでミントする" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

次のように`mintArgs`引数を使用してToken Paymentガードのミント設定を渡すことができます。

```ts
mintV2(umi, {
  // ...
  mintArgs: {
    token2022Payment: some({
      mint: tokenMint.publicKey,
      destinationAta,
    }),
  },
});
```

APIリファレンス: [mintV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/mintV2.html), [TokenPaymentMintArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/Token2022PaymentMintArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_ガードが割り当てられるとすぐに、sugarを使用してミントすることはできません - したがって、特定のミント設定はありません。_

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ルート命令

_Token Paymentガードはルート命令をサポートしません。_
