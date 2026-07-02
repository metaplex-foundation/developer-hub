---
title: コレクションの管理
metaTitle: コレクションの管理 - Bubblegum V2
description: Bubblegumでコレクションの設定、検証、検証解除を行う方法を学びます。
created: '01-15-2025'
updated: '06-19-2026'
keywords:
  - NFT collection
  - verify collection
  - cNFT collection
  - MPL-Core collection
  - setCollectionV2
  - BubblegumV2 plugin
about:
  - Compressed NFTs
  - NFT collections
  - MPL-Core
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: ミント後にcNFTをコレクションに追加するにはどうすればよいですか？
    a: newCoreCollectionパラメータを指定してsetCollectionV2命令を使用します。コレクションにはBubblegumV2プラグインが有効になっている必要があります。
  - q: cNFTのコレクションを変更できますか？
    a: はい。coreCollection（現在）とnewCoreCollection（新規）の両方のパラメータを指定してsetCollectionV2を使用します。両方のコレクション権限が署名する必要があります。
  - q: BubblegumV2プラグインとは何ですか？
    a: コレクション上でフリーズ/解凍、ソウルバウンドcNFT、ロイヤリティ強制などのBubblegum V2機能を有効にするMPL-Coreコレクションプラグインです。
  - q: ロイヤリティを継承しているcNFTをコレクションから削除できますか？
    a: いいえ。まずsellerFeeBasisPointsを明示的な値に更新してから、setCollectionV2でコレクションを削除してください。
---

## Summary

**Managing collections** for compressed NFTs uses the **setCollectionV2** instruction to add, change, or remove MPL-Core collections on existing cNFTs. This page covers setting and removing collections after minting.

- Set an MPL-Core collection on an existing cNFT using setCollectionV2
- Remove a collection from a cNFT
- Change between collections (both authorities must sign)
- Collections must have the BubblegumV2 plugin enabled

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

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 圧縮NFTのコレクションの削除
**setCollectionV2**命令は、cNFTからコレクションを削除するためにも使用できます。

{% dialect-switcher title="圧縮NFTのコレクションの削除" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  setCollectionV2,
  MetadataArgsV2Args
} from '@metaplex-foundation/mpl-bubblegum'
import {
  unwrapOption,
  none,
} from '@metaplex-foundation/umi';

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});

const collection = unwrapOption(assetWithProof.metadata.collection)

const signature = await setCollectionV2(umi, {
  ...assetWithProof,
  authority: collectionAuthoritySigner,
  coreCollection: collection!.key
}).sendAndConfirm(umi);
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 継承されたロイヤリティ {% #inherited-royalties %}

[コレクションからセラーフィーベーシスポイントを継承](/ja/smart-contracts/bubblegum-v2/mint-cnfts#inheriting-royalties-from-the-collection)してミントされたcNFTは、リーフにセンチネル値 `65535` を保存します。これはコレクション管理に影響します：

- **コレクションの削除** — リーフがまだ継承センチネルを使用している間、`setCollectionV2` は操作を拒否します。まず [`updateMetadataV2`](/ja/smart-contracts/bubblegum-v2/update-cnfts#inherited-royalties) でcNFTの `sellerFeeBasisPoints` を明示的な値に更新してください。
- **別のコレクションへの移動** — 移行先コレクションに `Royalties` プラグインがある場合は許可されます。cNFTは継承センチネルを保持し、新しいコレクションからロイヤリティを解決します。
- **ロイヤリティのないコレクションへの移動** — `CollectionMustHaveRoyaltiesPlugin` で拒否されます。

## Notes

- The MPL-Core collection must have the `BubblegumV2` plugin enabled before cNFTs can be added to it.
- Unlike Bubblegum V1 (which uses Token Metadata collections with a "verified" boolean), V2 uses MPL-Core collections without verification flags.
- When changing between collections, both the old and new collection authorities must sign the transaction.
- 継承されたセラーフィーを持つcNFTは、リーフでロイヤリティが明示的な値に設定されるまでコレクションから削除できません。

## FAQ

### ミント後にcNFTをコレクションに追加するにはどうすればよいですか？

`newCoreCollection` パラメータをコレクションの公開鍵に設定して `setCollectionV2` 命令を使用します。コレクション権限が署名する必要があります。

### cNFTのコレクションを変更できますか？

はい。`coreCollection`（現在）と `newCoreCollection`（新規）の両方を指定して `setCollectionV2` を使用します。権限が異なるアカウントの場合、両方のコレクション権限が署名する必要があります。

### BubblegumV2プラグインとは何ですか？

フリーズ/解凍、ソウルバウンドcNFT、ロイヤリティ強制、コレクションレベルのパーマネントデリゲートなど、Bubblegum V2機能を有効にするMPL-Coreコレクションプラグインです。

### ロイヤリティを継承しているcNFTをコレクションから削除できますか？

いいえ。プログラムは `CannotRemoveFromCollectionWithInheritedSellerFee` を返します。まず `updateMetadataV2` で `sellerFeeBasisPoints` を明示的な値に設定し、その後 `setCollectionV2` を呼び出してコレクションを削除してください。

## Glossary

| Term | Definition |
|------|------------|
| **setCollectionV2** | The Bubblegum V2 instruction for setting, changing, or removing the collection of a cNFT |
| **MPL-Core Collection** | A Core standard collection account used to group cNFTs in Bubblegum V2 |
| **BubblegumV2 Plugin** | An MPL-Core plugin that enables V2 features on a collection (freeze, soulbound, royalties) |
| **Collection Authority** | The update authority of the MPL-Core collection |
