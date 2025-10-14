---
title: "NFT Burn Guard"
metaTitle: NFT Burn Guard | Candy Machine
description: "NFT Burnガードは、事前定義されたNFTコレクションの保有者にミントを制限し、保有者のNFTをバーンします。"
---

## 概要

**NFT Burn**ガードは、事前定義されたNFTコレクションの保有者にミントを制限し、保有者のNFTをバーンします。したがって、ミント時に支払者はバーンするNFTのミントアドレスを提供する必要があります。

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
Burn 1 NFT 

from this collection
{% /edge %}
{% node parent="candy-machine" x="600" %}
  {% node #mint-candy-guard theme="pink" %}
    Mint from

    _Candy Guard Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  Access Control
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-9" %}
  {% node theme="pink" %}
    Mint from 
    
    _Candy Machine Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="70" theme="blue" %}
  NFT
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}

{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## ガード設定

NFT Burnガードには以下の設定が含まれます：

- **Required Collection**: 必要なNFTコレクションのミントアドレス。ミントに使用するNFTは、このコレクションの一部である必要があります。

{% dialect-switcher title="NFT Burnガードを使用してCandy Machineを設定する" %}
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

APIリファレンス: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [NftBurn](https://mpl-candy-machine.typedoc.metaplex.com/types/NftBurn.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

config.jsonファイルのガードセクションに以下のオブジェクトを追加してください：

```json
"nftBurn" : {
    "requiredCollection": "<PUBKEY>",
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ミント設定

NFT Burnガードには以下のミント設定が含まれます：

- **Required Collection**: 必要なNFTコレクションのミントアドレス。
- **Mint**: バーンするNFTのミントアドレス。これは必要なコレクションの一部である必要があり、ミンターに属している必要があります。
- **Token Standard**: バーンするNFTのトークン標準。
- **Token Account** (オプション): NFTとその所有者を明示的にリンクするトークンアカウントをオプションで提供できます。デフォルトでは、支払者の関連トークンアカウントが使用されます。

注意：SDK の助けなしで命令を構築する予定の場合、これらのミント設定およびそれ以外を命令引数と残りのアカウントの組み合わせとして提供する必要があります。詳細については、[Candy GuardのプログラムドキュメントAtion](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#nftburn)を参照してください。

{% dialect-switcher title="NFT Burnガードでミントする" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

次のように`mintArgs`引数を使用してNFT Burnガードのミント設定を渡すことができます。

```ts
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";

mintV2(umi, {
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

APIリファレンス: [mintV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/mintV2.html), [NftBurnMintArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/NftBurnMintArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_ガードが割り当てられるとすぐに、sugarを使用してミントすることはできません - したがって、特定のミント設定はありません。_

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ルート命令

_NFT Burnガードはルート命令をサポートしません。_