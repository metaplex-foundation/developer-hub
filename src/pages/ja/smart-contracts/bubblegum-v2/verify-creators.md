---
title: 作成者の検証
metaTitle: 作成者の検証 | Bubblegum V2
description: Bubblegumで作成者の検証と検証解除を行う方法を学びます。
---

圧縮NFTのメタデータに作成者のリストが設定されている場合、これらの作成者は特別な命令を使用してcNFT上で自分自身を検証・検証解除できます。 {% .lead %}

これらの命令は、cNFTの**作成者**配列の適切な項目で**検証済み**ブール値を切り替えます。このブール値は、ウォレットやマーケットプレイスなどのアプリがどの作成者が本物でどの作成者がそうでないかを知ることができるため重要です。

作成者は、ミントトランザクションに署名することで、[圧縮NFTをミント](/ja/smart-contracts/bubblegum-v2/mint-cnfts)する際に直接自分自身を検証できることに注目する価値があります。とはいえ、今度は作成者が既存の圧縮NFTで自分自身を検証または検証解除する方法を見てみましょう。

## 作成者の検証

Bubblegumプログラムは、検証しようとしている作成者によって署名される必要がある**verifyCreatorV2**命令を提供します。作成者は既に圧縮NFTの**作成者**配列の一部である必要があります。まだ配列の一部でない場合は、最初に[`updateMetadataV2`](/ja/smart-contracts/bubblegum-v2/update-cnfts)命令を使用して**作成者**配列に作成者を追加してください。

さらに、この命令はBubblegumツリー上のリーフを置き換えるため、圧縮NFTの整合性を検証するためにより多くのパラメータを提供する必要があります。これらのパラメータはリーフを変更するすべての命令に共通であるため、[次のFAQ](/ja/smart-contracts/bubblegum-v2/faq#replace-leaf-instruction-arguments)でドキュメント化されています。幸いなことに、Metaplex DAS APIを使用してこれらのパラメータを自動的に取得するヘルパーメソッドを使用できます。

{% dialect-switcher title="圧縮NFTの作成者の検証" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  verifyCreatorV2,
  MetadataArgsV2Args
} from '@metaplex-foundation/mpl-bubblegum';
import {
  unwrapOption,
  none,
} from '@metaplex-foundation/umi';

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
const collectionOption = unwrapOption(assetWithProof.metadata.collection);
const metadata: MetadataArgsV2Args = {
  name: assetWithProof.metadata.name,
  uri: assetWithProof.metadata.uri,
  sellerFeeBasisPoints: assetWithProof.metadata.sellerFeeBasisPoints,
  collection: collectionOption
    ? collectionOption.key
    : none(),
  creators: assetWithProof.metadata.creators,
};
await verifyCreatorV2(umi, {
  ...assetWithProof,
  metadata,
  creator: umi.identity, // またはumiアイデンティティとは異なる署名者
}).sendAndConfirm(umi);
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 作成者の検証解除

**verifyCreatorV2**命令と同様に、**unverifyCreatorV2**命令は作成者によって署名される必要があり、圧縮NFT上でそれらを検証解除します。

{% dialect-switcher title="圧縮NFTの作成者の検証解除" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  unverifyCreatorV2,
  MetadataArgsV2Args
} from '@metaplex-foundation/mpl-bubblegum'
import {
  unwrapOption,
  none,
} from '@metaplex-foundation/umi';

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
const metadata: MetadataArgsV2Args = {
  name: assetWithProof.metadata.name,
  uri: assetWithProof.metadata.uri,
  sellerFeeBasisPoints: assetWithProof.metadata.sellerFeeBasisPoints,
  collection: unwrapOption(assetWithProof.metadata.collection)
    ? unwrapOption(assetWithProof.metadata.collection)!.key
    : none(),
  creators: assetWithProof.metadata.creators,
};
await unverifyCreatorV2(umi, {
  ...assetWithProof,
  metadata,
  creator: umi.identity, // またはumiアイデンティティとは異なる署名者
}).sendAndConfirm(umi);
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}