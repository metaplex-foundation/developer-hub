---
title: "NFT Mint Limitガード"
metaTitle: "NFT Mint Limitガード - NFTごとのミント上限 | Core Candy Machine"
description: "Core Candy MachineのNFT Mint Limitガードは、指定されたNFTコレクションの保有者へのミントを制限し、オンチェーンカウンターPDAを使用して各NFTがミントできるアセット数を制限します。"
keywords:
  - NFT Mint Limit guard
  - Core Candy Machine
  - candy guard
  - per-NFT mint cap
  - mint counter PDA
  - token gated minting
  - rate limiting
  - Solana NFT
  - minting restriction
about:
  - Candy Machine guards
  - per-NFT mint rate limiting
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
---

**NFT Mint Limit**ガードは、指定されたNFTコレクションの保有者へのミントを制限し、オンチェーンカウンターPDAを使用して各NFTがミントできるアセット数に上限を設けます。 {% .lead %}

## 概要

NFT Mint Limitガードは、指定されたNFTコレクションの保有者へのミントを制限し、提供されたToken Metadata NFTに対して実行できるミントの量を制限します。これは、ウォレットの代わりにNFTアドレスに基づいた[NFT Gate](/ja/smart-contracts/core-candy-machine/guards/nft-gate)と[Mint Limit](/ja/smart-contracts/core-candy-machine/guards/mint-limit)ガードの組み合わせと考えることができます。

制限は、NFTコレクションごと、Candy Machineごと、設定で提供される識別子ごとに設定され、同じCore Candy Machine内で複数のNFTミント制限を許可します。

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
{% node #mintLimit label="NftMintLimit" /%}
{% node #limit label="- Limit" /%}
{% node #id label="- ID" /%}
{% node label="- Required Collection" /%}
{% node label="..." /%}
{% /node %}

{% node parent="id" x="270" y="-9"  %}
{% node #nftMintCounterPda %}
NFT Mint Counter PDA {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="id" to="nftMintCounterPda" /%}

{% node #nft parent="nftMintCounterPda" x="0" y="40"  label="Seeds: candyGuard, candyMachine, id, mint" theme="transparent"  /%}

{% edge from="mintLimit" to="mint-candy-guard" theme="indigo" dashed=true/%}
{% node parent="candy-machine" x="600" %}
  {% node #mint-candy-guard theme="pink" %}
    _Candy Guard Program_

    からミント
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  アクセス制御
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-30" %}
  {% node  theme="pink" %}
    _Core Candy Machine Program_

    からミント
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  ミントロジック
{% /node %}

{% node #asset parent="mint-candy-machine" y="140" x="90" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="asset" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}

{% edge from="mint-candy-guard" to="mint-candy-machine" /%}

{% /diagram %}

## ガード設定

Mint Limitガードには以下の設定が含まれます:

- **ID**: このガードの一意の識別子。異なる識別子は、特定のNFTを提供することでミントされたアイテムの数を追跡するために異なるカウンターを使用します。これは、ガードのグループを使用する場合に特に便利で、それぞれに異なるミント制限を持たせることができます。
- **Limit**: その識別子のNFTごとに許可される最大ミント数。
- **Required Collection**: 必要なNFTコレクションのミントアドレス。ミント時に証明として提供するNFTは、このコレクションの一部である必要があります。

{% dialect-switcher title="NFT Mint Limitガードを使用してCandy Machineをセットアップする" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    nftMintLimit: some({
      id: 1,
      limit: 5,
      requiredCollection: requiredCollectionNft.publicKey,
    }),
  },
});
```

APIリファレンス: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [MintLimit](https://mpl-core-candy-machine.typedoc.metaplex.com/types/NftMintLimit.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ミント設定

NFT Mint Limitガードには以下のミント設定が含まれます:

- **ID**: このガードの一意の識別子。
- **Mint**: 支払者が必要なコレクションからNFTを所有していることを証明するために提供するNFTのミントアドレス。

SDKを使用せずに手動で命令を構築する場合は、これらのミント設定などを命令の引数と残りのアカウントの組み合わせとして提供する必要があることに注意してください。詳細については、[Core Candy Guardのプログラムドキュメント](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#nftmintlimit)を参照してください。

{% dialect-switcher title="NFT Mint Limitガードを使用してミントする" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

Mint LimitガードのMint Settingsは、次のように`mintArgs`引数を使用して渡すことができます。

```ts
mintV1(umi, {
  // ...
  mintArgs: {
    nftMintLimit: some({ id: 1, mint: nftToVerify.publicKey }),
  },
});
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ルート命令

_NFT Mint Limitガードはルート命令をサポートしていません。_

## NftMintLimitアカウント
`NftMintLimit`ガードを使用すると、各NFT、CandyMachine、および`id`の組み合わせに対して`NftMintCounter`アカウントが作成されます。検証目的で次のようにフェッチできます:

```js
import {
  findNftMintCounterPda,
  fetchNftMintCounter
 } from "@metaplex-foundation/mpl-core-candy-machine";

const pda = findNftMintCounterPda(umi, {
  id: 1, // ガード設定で設定したnftMintLimitのid
  mint: asset.publicKey, // ユーザーが所有するNFTのアドレス
  candyMachine: candyMachine.publicKey,
  // または candyMachine: publicKey("Address") でCMアドレスを指定
  candyGuard: candyMachine.mintAuthority
  // または candyGuard: publicKey("Address") でcandyGuardアドレスを指定
});

const nftMintCounter = fetchNftMintCounter(umi, pda)
```

## 注意事項

- ミントカウンターはNFTアドレスごと、Candy Machineごと、ガードIDごとに追跡されます -- ウォレットごとではありません。同じコレクションの異なるNFTはそれぞれ独立したカウンターを持ちます。
- 異なるガードIDを使用することで、同じCandy Machine内で複数の独立したミント制限を設定できます（例: ガードグループごとに異なる制限）。
- `NftMintCounter` PDAは`[candyGuard, candyMachine, id, mint]`から導出され、NFTが既に使用したミント数を確認するためにフェッチできます。
- このガードはコレクション検証にToken Metadata NFT（Core Assetsではない）を使用します。

