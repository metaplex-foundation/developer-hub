---
title: "Sol Payment Guard"
metaTitle: Sol Payment Guard | Candy Machine
description: "Sol Paymentガードは、ミント時に支払者にSOLの金額を請求することを可能にします。"
---

## 概要

**Sol Payment**ガードは、ミント時に支払者にSOLの金額を請求することを可能にします。SOLの金額と宛先アドレスの両方を設定できます。

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
{% node label="Sol Payment" /%}
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
{% edge from="destination" to="payer" arrow="none" dashed=true /%}
{% edge from="mint-candy-guard" to="payer" %}
Transfers SOL

from the payer
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" /%}

{% /diagram %}

## ガード設定

Sol Paymentガードには以下の設定が含まれます：

- **Lamports**: 支払者に請求するSOL（またはlamports）の金額。
- **Destination**: このガードに関連するすべての支払いを受け取るウォレットのアドレス。

{% dialect-switcher title="Sol Paymentガードを使用してCandy Machineを設定する" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

この例では、現在のIDを宛先ウォレットとして使用しています。

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

APIリファレンス: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [SolPayment](https://mpl-candy-machine.typedoc.metaplex.com/types/SolPayment.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

config.jsonファイルのガードセクションに以下のオブジェクトを追加してください：

```json
"solPayment": {
    "value": 1,
    "destination": "<PUBKEY>"
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ミント設定

Sol Paymentガードには以下のミント設定が含まれます：

- **Destination**: このガードに関連するすべての支払いを受け取るウォレットのアドレス。

注意：SDK の助けなしで命令を構築する予定の場合、これらのミント設定およびそれ以外を命令引数と残りのアカウントの組み合わせとして提供する必要があります。詳細については、[Candy GuardのプログラムドキュメントAtion](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#solpayment)を参照してください。

{% dialect-switcher title="Sol Paymentガードでミントする" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

次のように`mintArgs`引数を使用してSol Paymentガードのミント設定を渡すことができます。

```ts
mintV2(umi, {
  // ...
  mintArgs: {
    solPayment: some({ destination: treasury }),
  },
});
```

APIリファレンス: [mintV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/mintV2.html), [SolPaymentMintArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/SolPaymentMintArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_ガードが割り当てられるとすぐに、sugarを使用してミントすることはできません - したがって、特定のミント設定はありません。_

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ルート命令

_Sol Paymentガードはルート命令をサポートしません。_