---
title: "Sol Payment Guard"
metaTitle: Sol Payment Guard | Core Candy Machine
description: "Core Candy Machine'Sol Payment'ガードは、ミント時にペイヤーからSOL量を請求します。"
---

## 概要

**Sol Payment**ガードにより、ミント時にペイヤーからSOL量を請求できます。SOL量と宛先アドレスの両方を設定できます。

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
{% node label="Sol Payment" /%}
{% node #amount label="- Amount" /%}
{% node #destination label="- Destination" /%}
{% node label="..." /%}
{% /node %}

{% node parent="destination" x="270" y="-9" %}
{% node #payer theme="indigo" %}
宛先ウォレット {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
Owner: System Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" x="600" %}
  {% node #mint-candy-guard theme="pink" %}
    からのミント

    _Candy Guard Program_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  アクセス制御
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-9" %}
  {% node theme="pink" %}
    からのミント
    
    _Candy Machine Program_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  ミントロジック
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="72" theme="blue" %}
  アセット
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}
{% edge from="destination" to="payer" arrow="none" dashed=true /%}
{% edge from="mint-candy-guard" to="payer" %}
ペイヤーからSOLを転送
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## ガード設定

Sol Paymentガードには以下の設定が含まれます：

- **Lamports**：ペイヤーに請求するSOL（またはlamport）の量。
- **Destination**：このガードに関連するすべての支払いを受け取るウォレットのアドレス。

{% dialect-switcher title="Sol Paymentガードを使用したCandy Machineの設定" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

この例では、現在のidentityを宛先ウォレットとして使用していることに注意してください。

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

APIリファレンス: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [SolPayment](https://mpl-core-candy-machine.typedoc.metaplex.com/types/SolPayment.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ミント設定

Sol Paymentガードには以下のミント設定が含まれます：

- **Destination**：このガードに関連するすべての支払いを受け取るウォレットのアドレス。

SDKの支援なしに命令を構築する予定の場合、これらのミント設定とその他を命令引数と残存アカウントの組み合わせとして提供する必要があることに注意してください。詳細については、[Core Candy Guardのプログラムドキュメント](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#solpayment)を参照してください。

{% dialect-switcher title="Sol Payment Guardでのミント" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

Sol Paymentガードのミント設定は、次のように`mintArgs`引数を使用して渡すことができます。

```ts
mintV1(umi, {
  // ...
  mintArgs: {
    solPayment: some({ destination: treasury }),
  },
});
```

APIリファレンス: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [SolPaymentMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/SolPaymentMintArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route命令

_Sol Paymentガードはroute命令をサポートしていません。_