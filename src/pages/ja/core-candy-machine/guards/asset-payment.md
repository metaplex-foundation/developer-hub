---
title: "Asset Paymentガード"
metaTitle: "Asset Paymentガード | Core Candy Machine"
description: "Core Candy Machineの「Asset Payment」ガードは、Core Candy Machineからのミントの支払いとして、特定のコレクションから別のCore Assetを必要とします"
---

## 概要

**Asset Payment**ガードは、指定されたAssetコレクションからCore Assetを支払者に請求することでミントを許可します。アセットは事前定義された宛先に転送されます。

支払者が必要なコレクションからアセットを所有していない場合、ミントは失敗します。

複数のアセットで支払う場合は、[Asset Payment Multiガード](/core-candy-machine/guards/asset-payment-multi)を使用できます。

{% diagram  %}

{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="20" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="Guards" theme="mint" z=1/%}
{% node label="assetPayment" /%}
{% node #guardRequiredCollection label="- Required Collection" /%}
{% node #guardDestinationWallet label="- Destination Wallet" /%}
{% node label="..." /%}
{% /node %}

{% node parent="guardRequiredCollection" #collectionNftMint x="270" y="-100"  %}
{% node theme="blue" %}
Collection
{% /node %}
{% node theme="dimmed" %}
Owner: Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="guardRequiredCollection" to="collectionNftMint" /%}

{% node parent="guardDestinationWallet" #destinationWallet x="300"  %}
{% node theme="blue" %}
Destination Wallet {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
Owner: System Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="guardDestinationWallet" to="destinationWallet" /%}


{% edge from="collectionNftMint" to="mint-candy-guard" theme="indigo" dashed=true arrow="none" /%}

{% node parent="mint-candy-guard" theme="transparent" x="-180" y="20" %}
このコレクションから

1つのアセットを転送
{% /node %}

{% edge from="mint-candy-guard" to="destinationWallet" theme="indigo" %}
{% /edge %}
{% node parent="candy-machine" #mint-candy-guard x="600" %}
  {% node theme="pink" %}
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

{% node #nft parent="mint-candy-machine" y="140" x="92" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}

{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## ガード設定

Asset Paymentガードには以下の設定が含まれます:

- **Required Collection**: 必要なコレクションのミントアドレス。支払いに使用するアセットは、このコレクションの一部である必要があります。
- **Destination**: すべてのアセットを受け取るウォレットのアドレス。

{% dialect-switcher title="Asset Paymentガードを使用してCandy Machineをセットアップする" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    assetPayment: some({
      requiredCollection: requiredCollection.publicKey,
      destination: umi.identity.publicKey,
    }),
  },
});
```

APIリファレンス: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [AssetPayment](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetPayment.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ミント設定

Asset Paymentガードには以下のミント設定が含まれます:
- **Asset Address**: 支払いに使用するアセットのアドレス。これは、必要なコレクションの一部であり、ミンターに属している必要があります。
- **Collection Address**: 支払いに使用されるコレクションのアドレス。
- **Destination**: すべてのアセットを受け取るウォレットのアドレス。

SDKを使用せずに手動で命令を構築する場合は、これらのミント設定などを命令の引数と残りのアカウントの組み合わせとして提供する必要があることに注意してください。詳細については、[Core Candy Guardのプログラムドキュメント](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#assetpayment)を参照してください。

{% dialect-switcher title="Asset Paymentガードを使用してCandy Machineをセットアップする" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

Asset PaymentガードのMint Settingsは、次のように`mintArgs`引数を使用して渡すことができます。

```ts

mintV1(umi, {
  // ...
  mintArgs: {
    assetPayment: some({
      requiredCollection: publicKey(requiredCollection),
      destination,
      asset: assetToSend.publicKey,
    }),
  },
});
```

APIリファレンス: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [AssetPaymentMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetPaymentMintArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ルート命令

_Asset Paymentガードはルート命令をサポートしていません。_
