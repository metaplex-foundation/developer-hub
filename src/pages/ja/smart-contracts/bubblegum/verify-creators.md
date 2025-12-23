---
title: 作成者の検証
metaTitle: 作成者の検証 | Bubblegum
description: Bubblegumで作成者を検証および検証解除する方法を学びます。
---

圧縮NFTのメタデータに作成者のリストが設定されている場合、これらの作成者は特別な命令を使用してcNFT上で自分自身を検証および検証解除できます。 {% .lead %}

これらの命令は、cNFTの**Creators**配列の適切なアイテムの**Verified**ブール値を切り替えます。そのブール値は、ウォレットやマーケットプレイスなどのアプリがどの作成者が本物でどの作成者がそうでないかを知ることができるため重要です。

作成者は[圧縮NFTをミント](/ja/smart-contracts/bubblegum/mint-cnfts)するときに、ミントトランザクションに署名することで直接自分自身を検証できることに注目する価値があります。とはいえ、既存の圧縮NFT上で作成者が自分自身を検証または検証解除する方法を見てみましょう。

## 作成者の検証

Bubblegumプログラムは、検証しようとしている作成者によって署名される必要がある**Verify Creator**命令を提供します。

さらに、この命令はBubblegum Tree上のリーフを置き換えることになるため、圧縮NFTの整合性を検証するためにより多くのパラメータを提供する必要があります。これらのパラメータはリーフを変更するすべての命令に共通であるため、[以下のFAQ](/ja/smart-contracts/bubblegum/faq#replace-leaf-instruction-arguments)に文書化されています。幸い、Metaplex DAS APIを使用してこれらのパラメータを自動的に取得するヘルパーメソッドを使用できます。

{% dialect-switcher title="圧縮NFTの作成者の検証" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  verifyCreator,
} from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await verifyCreator(umi, { ...assetWithProof, creator }).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 作成者の検証解除

**Verify Creator**命令と同様に、**Unverify Creator**命令は作成者によって署名される必要があり、圧縮NFT上で彼らを検証解除します。

{% dialect-switcher title="圧縮NFTの作成者の検証解除" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  unverifyCreator,
} from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await unverifyCreator(umi, { ...assetWithProof, creator }).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}