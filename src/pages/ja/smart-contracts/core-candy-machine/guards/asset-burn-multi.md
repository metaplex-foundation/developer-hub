---
title: Asset Burn Multiガード
metaTitle: Asset Burn Multiガード | Core Candy Machine
description: "Core Candy Machineの「Asset Burn Multi」ガードは、事前定義されたコレクションの保有者へのミントを制限し、購入時に保有者のアセットをバーンします。"
---

## 概要

**Asset Burn Multi**ガードは、事前定義されたコレクションの保有者へのミントを制限し、保有者のアセットをバーンします。したがって、バーンするアセットのアドレスは、ミント時に支払者によって提供される必要があります。

これは[Asset Burnガード](/ja/smart-contracts/core-candy-machine/guards/asset-burn)に似ていますが、複数のアセットをバーンすることができます。

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
{% node #nftBurn label="nftBurnMulti" /%}
{% node #requiredCollection label="- Required Collection" /%}
{% node label="- Number" /%}
{% node label="..." /%}
{% /node %}

{% node parent="requiredCollection" x="270" y="-9"  %}
{% node #collectionNftMint theme="blue" %}
Collection {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
Owner: Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="requiredCollection" to="collectionNftMint" /%}


{% edge from="collectionNftMint" to="mint-candy-guard" theme="indigo" dashed=true %}
このコレクションから

n個のアセットをバーン
{% /edge %}
{% node parent="candy-machine" x="600" %}
  {% node #mint-candy-guard theme="pink" %}
    _Candy Guard Program_

    からミント
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  アクセス制御
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-9" %}
  {% node theme="pink" %}
    _Candy Machine Program_

    からミント
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  ミントロジック
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="69" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}

{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## ガード設定

Asset Burnガードには以下の設定が含まれます:

- **Required Collection**: 必要なコレクションのアドレス。ミントに使用するアセットは、このコレクションの一部である必要があります。
- **Number**: 新しいアセットと交換にバーンする必要があるアセットの数。

{% dialect-switcher title="Asset Burn Multiガードを使用してCandy Machineをセットアップする" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    assetBurnMulti: some({
      requiredCollection: requiredCollection.publicKey,
      num: 2,
    }),
  },
});
```

APIリファレンス: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [AssetBurnMulti](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetBurnMulti.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ミント設定

Asset Burn Multiガードには以下のミント設定が含まれます:

- **Required Collection**: 必要なコレクションのミントアドレス。
- **[Address]**: バーンするアセットのアドレスの配列。これらは、必要なコレクションの一部であり、ミンターに属している必要があります。

SDKを使用せずに手動で命令を構築する場合は、これらのミント設定などを命令の引数と残りのアカウントの組み合わせとして提供する必要があることに注意してください。詳細については、[Candy Guardのプログラムドキュメント](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#asseturn)を参照してください。

{% dialect-switcher title="Asset Burn Multiガードを使用してミントする" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

Asset Burn MultiガードのMint Settingsは、次のように`mintArgs`引数を使用して渡すことができます。

```ts

mintV1(umi, {
  // ...
  mintArgs: {
    assetBurnMulti: some({
      requiredCollection: requiredCollection.publicKey,
      assets: [assetToBurn1.publicKey, assetToBurn2.publicKey],
    }),
  },
});
```

APIリファレンス: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [AssetBurnMultiMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetBurnMultiMintArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ルート命令

_Asset Burn Multiガードはルート命令をサポートしていません。_
