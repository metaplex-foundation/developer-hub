---
title: "NFT Paymentガード"
metaTitle: "NFT Paymentガード | Core Candy Machine"
description: "Core Candy Machineの「NFT Payment」ガードは、支払者に指定されたNFTコレクションからNFT/pNFTを請求することでミントを許可します。支払いとして使用されるNFT/pNFTは、事前定義された宛先に転送されます。"
---

## 概要

**NFT Payment**ガードは、支払者に指定されたNFTコレクションからNFTを請求することでミントを許可します。NFTは事前定義された宛先に転送されます。

支払者が必要なコレクションからNFTを所有していない場合、ミントは失敗します。

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
{% node label="nftPayment" /%}
{% node #guardRequiredCollection label="- Required Collection" /%}
{% node #guardDestinationWallet label="- Destination Wallet" /%}
{% node label="..." /%}
{% /node %}

{% node parent="guardRequiredCollection" #collectionNftMint x="270" y="-100"  %}
{% node theme="blue" %}
Collection NFT {% .whitespace-nowrap %}

Mint Account
{% /node %}
{% node theme="dimmed" %}
Owner: Token Metadata Program {% .whitespace-nowrap %}
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


{% edge from="collectionNftMint" to="mint-candy-guard" theme="indigo" dashed=true arrow="none" %}
このコレクションから

1つのNFTを転送
{% /edge %}

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

NFT Paymentガードには以下の設定が含まれます:

- **Required Collection**: 必要なNFTコレクションのミントアドレス。支払いに使用するNFTは、このコレクションの一部である必要があります。
- **Destination**: すべてのNFTを受け取るウォレットのアドレス。

{% dialect-switcher title="NFT Paymentガードを使用してCandy Machineをセットアップする" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    nftPayment: some({
      requiredCollection: requiredCollectionNft.publicKey,
      destination: umi.identity.publicKey,
    }),
  },
});
```

APIリファレンス: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [NftPayment](https://mpl-core-candy-machine.typedoc.metaplex.com/types/NftPayment.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ミント設定

NFT Paymentガードには以下のミント設定が含まれます:

- **Destination**: すべてのNFTを受け取るウォレットのアドレス。
- **Mint**: 支払いに使用するNFTのミントアドレス。これは、必要なコレクションの一部であり、ミンターに属している必要があります。
- **Token Standard**: 支払いに使用するNFTのトークン標準。
- **Token Account** (オプション): NFTとその所有者を明示的にリンクするトークンアカウントをオプションで提供できます。デフォルトでは、支払者の関連トークンアカウントが使用されます。
- **Rule Set** (オプション): Rule Setを持つProgrammable NFTで支払う場合の、支払いに使用するNFTのRule Set。

SDKを使用せずに手動で命令を構築する場合は、これらのミント設定などを命令の引数と残りのアカウントの組み合わせとして提供する必要があることに注意してください。詳細については、[Core Candy Guardのプログラムドキュメント](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#nftpayment)を参照してください。

{% dialect-switcher title="NFT Paymentガードを使用してCandy Machineをセットアップする" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

NFT PaymentガードのMint Settingsは、次のように`mintArgs`引数を使用して渡すことができます。

```ts
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";

mintV1(umi, {
  // ...
  mintArgs: {
    nftPayment: some({
      destination,
      mint: nftToPayWith.publicKey,
      tokenStandard: TokenStandard.NonFungible,
    }),
  },
});
```

APIリファレンス: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [NftPaymentMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/NftPaymentMintArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ルート命令

_NFT Paymentガードはルート命令をサポートしていません。_
