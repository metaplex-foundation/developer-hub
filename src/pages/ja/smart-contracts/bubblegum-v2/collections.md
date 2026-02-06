---
title: コレクションの検証
metaTitle: コレクションの検証 | Bubblegum V2
description: Bubblegumでコレクションの設定、検証、検証解除を行う方法を学びます。
---

cNFTは、ミント時または後でMPL-Coreコレクションに追加できます。 {% .lead %}

NFTに関するコレクションの概念に馴染みがない場合、これらは他のNFTをグループ化するために使用できる特別な非圧縮NFTです。したがって、**コレクション**のデータは、コレクション全体の名前とブランディングを説明するために使用されます。Bubblegum V2以降、リーフ所有者による相互作用の必要なしに、デリゲートがcNFTを凍結・解凍できるなど、コレクションレベルでの追加機能も可能になります。[MPL-Coreコレクションについてはこちらで詳しく読むことができます](/ja/smart-contracts/core/collections)。
[ここでドキュメント化されている](/ja/smart-contracts/bubblegum-v2/mint-cnfts#minting-to-a-collection)**MintV2**命令を使用して、圧縮NFTを直接コレクションにミントすることが可能であることに注意してください。とはいえ、コレクションなしでcNFTをすでにミントしている場合、そのcNFTにコレクションを設定する方法を見てみましょう。「verified」ブール値を持つMetaplex Token Metadataコレクションを使用するBubblegum v1とは異なり、Bubblegum V2はそのブール値を持たないMPL-Coreコレクションを使用します。

MPL-Coreコレクションは[`BubblegumV2`プラグイン](/ja/smart-contracts/core/plugins/bubblegum)を含む必要があります。

以下のセクションでは、単一ステップトランザクションでcNFTからコレクションを設定・削除する方法を示します。`coreCollection`と`newCoreCollection`パラメータを追加する際に、単一の命令で両方の操作を行うことも可能です。両方のコレクション権限が同じウォレットでない場合、両方が署名する必要があります。

## 圧縮NFTのコレクションの設定

**setCollectionV2**命令は、cNFTのコレクションを設定するために使用できます。cNFTからコレクションを削除したり、cNFTのコレクションを変更したりするためにも使用できます。

{% dialect-switcher title="圧縮NFTのコレクションの設定" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  setCollectionV2,
  MetadataArgsV2Args
} from '@metaplex-foundation/mpl-bubblegum';
import {
  unwrapOption,
  none,
} from '@metaplex-foundation/umi';

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});

const collection = unwrapOption(assetWithProof.metadata.collection)

const metadata: MetadataArgsV2Args = {
  ...assetWithProof.metadata,
  collection: collection?.key ?? null,
};

const signature = await setCollectionV2(umi, {
  ...assetWithProof,
  newCollectionAuthority: newCollectionUpdateAuthority,
  metadata,
  newCoreCollection: newCoreCollection.publicKey,
}).sendAndConfirm(umi);
```
