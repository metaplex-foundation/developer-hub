---
title: コレクションの検証
metaTitle: コレクションの検証 | Bubblegum
description: Bubblegumでコレクションの設定、検証、および検証解除の方法を学びます。
---

圧縮NFTにコレクションが設定されているときは常に、コレクションのupdate authority — または承認されたコレクションdelegate — はそのcNFT上でそのコレクションを検証および/または検証解除できます。 {% .lead %}

技術的には、これはcNFTの**Collection**オブジェクトの**Verified**ブール値を切り替えることになり、コレクションの権限がこの圧縮NFTをコレクションの一部として承認したことを誰もが知ることができます。

NFTに関するコレクションの概念に馴染みがない場合、それらは他のNFTをグループ化するために使用できる特別な非圧縮NFTです。**Collection NFT**のデータは、コレクション全体の名前とブランディングを記述するために使用されます。[Metaplex Verified Collectionsについて詳しく読むことができます](/jp/token-metadata/collections)。

**Mint to Collection V1**命令を使用して圧縮NFTを直接コレクションにミントすることが可能であることに注意してください（[ここに文書化されています](/jp/bubblegum/mint-cnfts#minting-to-a-collection)）。とはいえ、コレクションなしでcNFTを既にミントしている場合は、そのcNFTのコレクションを検証、検証解除、および設定する方法を見てみましょう。

## コレクションの検証

BubblegumプログラムのbusineCollectionV**Verify Collection**命令を使用して、圧縮NFTの**Verified**ブール値を`true`に設定できます。これが機能するためには、**Collection**オブジェクトがすでにcNFT上に設定されている必要があります — 例えば、ミント時に。

命令は以下のパラメータを受け取ります：

- **Collection Mint**: Collection NFTのmintアカウント。
- **Collection Authority**: Collection NFTのupdate authority — または承認されたコレクションdelegate — をSignerとして。コレクション権限がdelegate権限の場合、プログラムは新しい統合された**Metadata Delegate**システムとレガシーの**Collection Authority Records**アカウントの両方をサポートすることに注意してください。適切なPDAを**Collection Authority Record Pda**パラメータに渡すだけです。

さらに、この命令はBubblegum Tree上のリーフを置き換えることになるため、圧縮NFTの整合性を検証するためにより多くのパラメータを提供する必要があります。これらのパラメータはリーフを変更するすべての命令に共通であるため、[以下のFAQ](/jp/bubblegum/faq#replace-leaf-instruction-arguments)に文書化されています。幸い、Metaplex DAS APIを使用してこれらのパラメータを自動的に取得するヘルパーメソッドを使用できます。

{% dialect-switcher title="圧縮NFTのコレクションの検証" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  verifyCollection,
} from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await verifyCollection(umi, {
  ...assetWithProof,
  collectionMint,
  collectionAuthority,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## コレクションの設定と検証

**Collection**オブジェクトがまだ圧縮NFTに設定されていない場合、**Set and Verify Collection**命令を使用してそれを設定し、同時に検証できます。この命令は**Verify Collection**命令と同じパラメータを受け取りますが、コレクション権限と異なる場合は**Tree Creator Or Delegate**属性をSignerとして渡すことも必要です。

{% dialect-switcher title="圧縮NFTのコレクションの設定と検証" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  setAndVerifyCollection,
} from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await setAndVerifyCollection(umi, {
  ...assetWithProof,
  treeCreatorOrDelegate,
  collectionMint,
  collectionAuthority,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## コレクションの検証解除

コレクションのupdate authorityは、**Unverify Collection**命令を使用して圧縮NFTのコレクションを検証解除することもできます。この命令を送信するためには、cNFTの**Collection**オブジェクトがすでに設定され、検証されていることが期待されます。**Unverify Collection**命令で必要な属性は、**Verify Collection**命令で必要なものと同じです。

{% dialect-switcher title="圧縮NFTのコレクションの検証解除" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  unverifyCollection,
} from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await unverifyCollection(umi, {
  ...assetWithProof,
  collectionMint,
  collectionAuthority,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}