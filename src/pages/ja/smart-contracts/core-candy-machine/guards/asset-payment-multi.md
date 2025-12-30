---
title: "Asset Payment Multiガード"
metaTitle: "Asset Payment Multiガード | Core Candy Machine"
description: "Core Candy Machineの「Asset Payment Multi」ガードは、Core Candy Machineからのミントの支払いとして、特定のコレクションから他のCore Assetを請求します。"
---

## 概要

**Asset Payment Multi**ガードは、指定されたAssetコレクションから1つ以上のCore Assetを支払者に請求することでミントを許可します。アセットは事前定義された宛先に転送されます。

支払者が必要なコレクションからアセットを所有していない場合、ミントは失敗します。

このガードは[Asset Paymentガード](/ja/smart-contracts/core-candy-machine/guards/asset-payment)に似ていますが、複数のアセットで支払うことができます。

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
{% node label="- Number" /%}
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

n個のアセットを転送
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
- **Number**: 支払う必要があるアセットの数。

{% dialect-switcher title="Asset Payment Multiガードを使用してCandy Machineをセットアップする" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    assetPaymentMulti: some({
      requiredCollection: requiredCollection.publicKey,
      destination: umi.identity.publicKey,
      num: 2
    }),
  },
});
```

APIリファレンス: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [AssetPaymentMulti](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetPaymentMulti.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ミント設定

Asset Paymentガードには以下のミント設定が含まれます:
- **[Asset Address]**: 支払いに使用するアセットの配列。これらは、必要なコレクションの一部であり、ミンターに属している必要があります。
- **Collection Address**: 支払いに使用されるコレクションのアドレス。
- **Destination**: すべてのアセットを受け取るウォレットのアドレス。

SDKを使用せずに手動で命令を構築する場合は、これらのミント設定などを命令の引数と残りのアカウントの組み合わせとして提供する必要があることに注意してください。詳細については、[Core Candy Guardのプログラムドキュメント](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#assetpayment)を参照してください。

{% dialect-switcher title="Asset Payment Multiガードを使用してCandy Machineをセットアップする" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

Asset PaymentガードのMint Settingsは、次のように`mintArgs`引数を使用して渡すことができます。

```ts

mintV1(umi, {
  // ...
  mintArgs: {
    assetPaymentMulti: some({
      requiredCollection: publicKey(requiredCollection),
      destination,
      assets: [firstAssetToSend.publicKey, secondAssetToSend.publicKey],
      num: 2
    }),
  },
});
```

APIリファレンス: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [AssetPaymentMultiMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetPaymentMultiMintArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ルート命令

_Asset Payment Multiガードはルート命令をサポートしていません。_
