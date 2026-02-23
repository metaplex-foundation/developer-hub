---
title: 圧縮NFTのミント
metaTitle: 圧縮NFTのミント - Bubblegum V2
description: Bubblegum V2で圧縮NFTをミントする方法を学びます。
created: '01-15-2025'
updated: '02-24-2026'
keywords:
  - mint compressed NFT
  - mint cNFT
  - NFT minting
  - Bubblegum mint
  - collection mint
  - mintV2
  - MPL-Core collection
about:
  - Compressed NFTs
  - NFT minting
  - Solana transactions
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: How do I mint a compressed NFT to a collection?
    a: Use the mintV2 instruction with the coreCollection parameter set to your MPL-Core collection address. The collection must have the BubblegumV2 plugin enabled.
  - q: How do I get the asset ID after minting?
    a: Use the parseLeafFromMintV2Transaction helper after the transaction is finalized. It returns the leaf schema including the asset ID.
  - q: Can anyone mint from my tree?
    a: Only if the tree is set to public. For private trees, only the tree creator or tree delegate can mint.
  - q: What metadata fields are required for minting?
    a: The MetadataArgsV2 requires name, uri, sellerFeeBasisPoints, collection (or none), and creators array.
---

## Summary

**Minting compressed NFTs** adds new cNFTs to a Bubblegum Tree using the **mintV2** instruction. This page covers minting with and without MPL-Core collections, and retrieving the asset ID from mint transactions.

- Mint cNFTs to a Bubblegum Tree using the mintV2 instruction
- Mint directly into an MPL-Core collection with the BubblegumV2 plugin
- Retrieve the asset ID and leaf schema from the mint transaction
- Configure metadata including name, URI, creators, and royalties

## Out of Scope


[前のページ](/ja/smart-contracts/bubblegum-v2/create-trees)では、圧縮NFTをミントするためにBubblegumツリーが必要であることを確認し、その作成方法を見ました。今度は、与えられたBubblegumツリーから圧縮NFTをミントする方法を見てみましょう。 {% .lead %}

Bubblegumプログラムは、異なるリーフスキーマバージョン用の複数のミント命令を提供します。Bubblegum V2は、与えられたコレクションに、またはコレクションなしで圧縮NFTをミントするために使用される**mintV2**という新しいミント命令を導入しています。

## コレクションなしでのミント

Bubblegumプログラムは、Bubblegumツリーから圧縮NFTをミントすることを可能にする**mintV2**命令を提供します。Bubblegumツリーが公開されている場合、誰でもこの命令を使用できます。そうでなければ、ツリー作成者またはツリーデリゲートのみが使用できます。

**mintV2**命令の主要なパラメータは以下の通りです：

- **マークルツリー**: 圧縮NFTがミントされるマークルツリーのアドレス。
- **ツリー作成者またはデリゲート**: Bubblegumツリーからのミントを許可された権限 — これはツリーの作成者またはデリゲートのいずれかです。この権限はトランザクションに署名する必要があります。公開ツリーの場合、このパラメータは任意の権限にできますが、それでも署名者である必要があります。
- **リーフ所有者**: ミントされる圧縮NFTの所有者。デフォルトではトランザクションの支払者です。
- **リーフデリゲート**: ミント済みcNFTの管理を許可されたデリゲート権限（存在する場合）。そうでなければ、リーフ所有者に設定されます。
- **コレクション権限**: 与えられたコレクションの管理を許可された権限。
- **Coreコレクション**: 圧縮NFTが追加されるMPL-CoreコレクションNFT。
- **メタデータ**: ミントされる圧縮NFTのメタデータ。NFTの**名前**、**URI**、**コレクション**、**作成者**などの情報が含まれます。Bubblegum V2では、メタデータは`uses`やコレクションの`verified`フラグなど、不要なフィールドを除外した`MetadataArgsV2`を使用しています。

{% dialect-switcher title="コレクションなしで圧縮NFTをミント" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { none } from '@metaplex-foundation/umi';
import { mintV2 } from '@metaplex-foundation/mpl-bubblegum';

await mintV2(umi, {
  leafOwner: umi.identity.publicKey,
  merkleTree: merkleTree.publicKey,
  metadata: {
    name: 'My NFT',
    uri: 'https://example.com/my-nft.json',
    sellerFeeBasisPoints: 550, 
    collection: none(),
    creators: [],

## Notes

- The Bubblegum Tree must be created before minting. See [Creating Trees](/smart-contracts/bubblegum-v2/create-trees).
- For collection mints, the MPL-Core collection must have the `BubblegumV2` plugin enabled.
- The collection authority must sign the transaction when minting to a collection, regardless of whether the tree is public or private.
- Use `parseLeafFromMintV2Transaction` only after the transaction is **finalized**, not just confirmed.

## FAQ

#

## Glossary

| Term | Definition |
|------|------------|
| **mintV2** | The Bubblegum V2 instruction for minting compressed NFTs, replacing the V1 mint instructions |
| **MetadataArgsV2** | The metadata structure passed to mintV2, containing name, URI, royalties, collection, and creators |
| **Collection Authority** | The signer authorized to manage the MPL-Core collection — required when minting to a collection |
| **BubblegumV2 Plugin** | An MPL-Core collection plugin that enables Bubblegum V2 features (freeze, soulbound, royalties) |
| **Asset ID** | A PDA derived from the merkle tree address and leaf index, uniquely identifying a compressed NFT |
| **Leaf Schema** | The data structure stored as a leaf in the merkle tree, containing the cNFT's hashed metadata and ownership info |
