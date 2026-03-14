---
title: "NFT Gateガード"
metaTitle: "NFT Gateガード - トークンゲート付きミント | Core Candy Machine"
description: "Core Candy MachineのNFT Gateガードは、指定されたNFTコレクションの保有者へのミントを制限し、NFTのバーンや転送なしに所有権の証明を要求します。"
keywords:
  - NFT Gate guard
  - Core Candy Machine
  - candy guard
  - token gated minting
  - NFT collection verification
  - proof of ownership
  - Solana NFT
  - minting restriction
about:
  - Candy Machine guards
  - NFT-gated access control
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
---

**NFT Gate**ガードは、指定されたNFTコレクションの保有者へのミントを制限し、NFTのバーンや転送なしに所有権を検証します。 {% .lead %}

## 概要

**NFT Gate**ガードは、指定されたNFTコレクションの保有者へのミントを制限します。

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
{% node label="nftGate" /%}
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
支払者がこのコレクション

から1つのNFTを

持っていることを確認
{% /edge %}
{% node parent="candy-machine" #mint-candy-guard x="600" %}
  {% node theme="pink" %}
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

{% node #nft parent="mint-candy-machine" y="140" x="71" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}

{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## ガード設定

NFT Gateガードには以下の設定が含まれます:

- **Required Collection**: 必要なNFTコレクションのミントアドレス。ミント時に証明として提供するNFTは、このコレクションの一部である必要があります。

{% dialect-switcher title="NFT Gateガードを使用してCandy Machineをセットアップする" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    nftGate: some({
      requiredCollection: requiredCollectionNft.publicKey,
    }),
  },
});
```

APIリファレンス: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [NftGate](https://mpl-core-candy-machine.typedoc.metaplex.com/types/NftGate.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ミント設定

NFT Gateガードには以下のミント設定が含まれます:

- **Mint**: 支払者が必要なコレクションからNFTを所有していることを証明するために提供するNFTのミントアドレス。
- **Token Account** (オプション): NFTとその所有者を明示的にリンクするトークンアカウントをオプションで提供できます。デフォルトでは、支払者の関連トークンアカウントが使用されます。

SDKを使用せずに手動で命令を構築する場合は、これらのミント設定などを命令の引数と残りのアカウントの組み合わせとして提供する必要があることに注意してください。詳細については、[Candy Guardのプログラムドキュメント](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#nftgate)を参照してください。

{% dialect-switcher title="NFT Gateガードを使用してCandy Machineをセットアップする" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

Umiライブラリを介してミントする場合は、次のように`mint`属性を介して所有権の証明として使用するNFTのミントアドレスを提供するだけです。

```ts
mintV1(umi, {
  // ...
  mintArgs: {
    nftGate: some({ mint: nftToBurn.publicKey }),
  },
});
```

APIリファレンス: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [NftGateMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/NftGateMintArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ルート命令

_NFT Gateガードはルート命令をサポートしていません。_

## 注意事項

- 所有権の証明として使用するNFTはバーンも転送もされません -- ミント後も支払者がNFTを保持します。
- [NFT Burn](/smart-contracts/core-candy-machine/guards/nft-burn)ガードとは異なり、このガードは所有権の確認のみを行い、NFTを消費しません。
- 必須コレクションからの単一のNFTは、[NFT Mint Limit](/smart-contracts/core-candy-machine/guards/nft-mint-limit)ガードと組み合わせない限り、複数回ミントに使用できます。
- このガードはコレクション検証にToken Metadata NFT（Core Assetsではない）を使用します。

