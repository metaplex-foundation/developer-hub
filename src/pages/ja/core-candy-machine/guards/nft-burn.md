---
title: "NFT Burnガード"
metaTitle: "NFT Burnガード  | Core Candy Machine"
description: "Core Candy Machineの「NFT Burn」ガードは、事前定義されたToken Metadata NFT/pNFTコレクションの保有者へのミントを制限し、購入中に保有者のNFTをバーンします。"
---

## 概要

**NFT Burn**ガードは、事前定義されたNFTコレクションの保有者へのミントを制限し、保有者のNFTをバーンします。したがって、バーンするNFTのミントアドレスは、ミント時に支払者によって提供される必要があります。

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
{% node #nftBurn label="nftBurn" /%}
{% node #requiredCollection label="- Required Collection" /%}
{% node label="..." /%}
{% /node %}

{% node parent="requiredCollection" x="270" y="-23"  %}
{% node #collectionNftMint theme="blue" %}
Collection NFT {% .whitespace-nowrap %}

Mint Account
{% /node %}
{% node theme="dimmed" %}
Owner: Token Metadata Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="requiredCollection" to="collectionNftMint" /%}


{% edge from="collectionNftMint" to="mint-candy-guard" theme="indigo" dashed=true %}
このコレクションから

1つのNFTをバーン
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

{% node #nft parent="mint-candy-machine" y="140" x="70" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}

{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## ガード設定

NFT Burnガードには以下の設定が含まれます:

- **Required Collection**: 必要なNFTコレクションのミントアドレス。ミントに使用するNFTは、このコレクションの一部である必要があります。

{% dialect-switcher title="NFT Burnガードを使用してCandy Machineをセットアップする" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    nftBurn: some({ requiredCollection: requiredCollectionNft.publicKey }),
  },
});
```

APIリファレンス: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [NftBurn](https://mpl-core-candy-machine.typedoc.metaplex.com/types/NftBurn.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ミント設定

NFT Burnガードには以下のミント設定が含まれます:

- **Required Collection**: 必要なNFTコレクションのミントアドレス。
- **Mint**: バーンするNFTのミントアドレス。これは、必要なコレクションの一部であり、ミンターに属している必要があります。
- **Token Standard**: バーンするNFTのトークン標準。
- **Token Account** (オプション): NFTとその所有者を明示的にリンクするトークンアカウントをオプションで提供できます。デフォルトでは、支払者の関連トークンアカウントが使用されます。

SDKを使用せずに手動で命令を構築する場合は、これらのミント設定などを命令の引数と残りのアカウントの組み合わせとして提供する必要があることに注意してください。詳細については、[Candy Guardのプログラムドキュメント](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#nftburn)を参照してください。

{% dialect-switcher title="NFT Burnガードを使用してミントする" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

NFT BurnガードのMint Settingsは、次のように`mintArgs`引数を使用して渡すことができます。

```ts
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";

mintV1(umi, {
  // ...
  mintArgs: {
    nftBurn: some({
      requiredCollection: requiredCollectionNft.publicKey,
      mint: nftToBurn.publicKey,
      tokenStandard: TokenStandard.NonFungible,
    }),
  },
});
```

APIリファレンス: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [NftBurnMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/NftBurnMintArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ルート命令

_NFT Burnガードはルート命令をサポートしていません。_
