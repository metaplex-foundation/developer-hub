---
title: Sol Fixed Feeガード
metaTitle: Sol Fixed Feeガード | Core Candy Machine
description: Core Candy Machineの「Sol Fixed Fee」ガードは、ミント時に支払者にSOLでの金額を請求します
---

## 概要

**Sol Fixed Fee**ガードは、ミント時に支払者にSOLでの金額を請求できます。SOLの金額と宛先アドレスの両方を設定できます。[Sol Payment](/ja/smart-contracts/core-candy-machine/guards/sol-payment)ガードと同様に機能します。

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
{% node label="Sol Fixed Fee" /%}
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
    _Candy Guard Program_

    からミント{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  アクセス制御
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-9" %}
  {% node theme="pink" %}
    _Candy Machine Program_

    からミント{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  ミントロジック
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="72" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}
{% edge from="destination" to="payer" arrow="none" dashed=true /%}
{% edge from="mint-candy-guard" to="payer" %}
支払者から

SOLを転送
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## ガード設定

Sol Paymentガードには以下の設定が含まれます:

- **Lamports**: 支払者に請求するSOL（またはlamports）の金額。
- **Destination**: このガードに関連するすべての支払いを受け取るウォレットのアドレス。

{% dialect-switcher title="Sol Paymentガードを使用してCandy Machineをセットアップする" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

この例では、現在のアイデンティティを宛先ウォレットとして使用していることに注意してください。

```ts
create(umi, {
  // ...
  guards: {
    solFixedFee: some({
      lamports: sol(1.5),
      destination: umi.identity.publicKey,
    }),
  },
});
```

APIリファレンス: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [SolFixedFee](https://mpl-core-candy-machine.typedoc.metaplex.com/types/SolFixedFee.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ミント設定

Sol Fixed Feeガードには以下のミント設定が含まれます:

- **Destination**: このガードに関連するすべての支払いを受け取るウォレットのアドレス。

SDKを使用せずに手動で命令を構築する場合は、これらのミント設定などを命令の引数と残りのアカウントの組み合わせとして提供する必要があることに注意してください。詳細については、[Core Candy Guardのプログラムドキュメント](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#solfixedfee)を参照してください。

{% dialect-switcher title="Sol Fixed Feeガードを使用してミントする" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

Sol Fixed FeeガードのMint Settingsは、次のように`mintArgs`引数を使用して渡すことができます。

```ts
mintV1(umi, {
  // ...
  mintArgs: {
    solFixedFee: some({ destination: treasury }),
  },
});
```

APIリファレンス: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [SolFixedFeeMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/SolFixedFeeMintArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ルート命令

_Sol Fixed Feeガードはルート命令をサポートしていません。_
