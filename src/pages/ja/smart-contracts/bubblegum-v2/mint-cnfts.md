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
  - q: 圧縮NFTをコレクションにミントするにはどうすればよいですか？
    a: coreCollectionパラメータをMPL-Coreコレクションアドレスに設定してmintV2命令を使用します。コレクションにはBubblegumV2プラグインが有効になっている必要があります。
  - q: ミント後にアセットIDを取得するにはどうすればよいですか？
    a: トランザクション確定後にparseLeafFromMintV2Transactionヘルパーを使用します。アセットIDを含むリーフスキーマを返します。
  - q: 誰でも私のツリーからミントできますか？
    a: ツリーがパブリックに設定されている場合のみです。プライベートツリーでは、ツリー作成者またはツリーデリゲートのみがミントできます。
  - q: ミントに必要なメタデータフィールドは何ですか？
    a: MetadataArgsV2にはname、uri、sellerFeeBasisPoints、collection（またはnone）、そしてcreatorsの配列が必要です。
---

## Summary

**Minting compressed NFTs** adds new cNFTs to a Bubblegum Tree using the **mintV2** instruction. This page covers minting with and without MPL-Core collections, and retrieving the asset ID from mint transactions.

- Mint cNFTs to a Bubblegum Tree using the mintV2 instruction
- Mint directly into an MPL-Core collection with the BubblegumV2 plugin
- Retrieve the asset ID and leaf schema from the mint transaction
- Configure metadata including name, URI, creators, and royalties

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
  },
}).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}

## コレクションへのミント

圧縮NFTがミントされた _後に_ コレクションを設定して確認することも可能ですが、Bubblegum V2は圧縮NFTを指定されたコレクションに直接ミントできるようにします。Bubblegum V2は圧縮NFTをグループ化するためにMPL-Coreコレクションを使用します。同じ **mintV2** 命令がこのために使用されます。上記のパラメータに加えて、Coreコレクションを渡し、コレクション権限またはデリゲートとして署名する必要があります：

- **Coreコレクション**: `coreCollection`パラメータに渡されるMPL-CoreコレクションNFTのミントアドレス。
- **コレクション権限**: 指定されたコレクションNFTを管理できる権限。これはコレクションNFTの更新権限または委任されたコレクション権限のいずれかになります。この権限は、Bubblegumツリーが公開されているかどうかに関係なく、トランザクションに署名する必要があります。

**メタデータ**パラメータには**コレクション**の公開鍵を含める必要があります。

{% dialect-switcher title="コレクションに圧縮NFTをミント" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { some } from '@metaplex-foundation/umi';
import { mintV2 } from '@metaplex-foundation/mpl-bubblegum';

await mintV2(umi, {
  collectionAuthority: umi.identity,
  leafOwner: umi.identity.publicKey,
  merkleTree: merkleTree.publicKey,
  coreCollection: collectionSigner.publicKey,
  metadata: {
    name: 'My NFT',
    uri: 'https://example.com/my-nft.json',
    sellerFeeBasisPoints: 550, // 5.5%
    collection: some(collectionSigner.publicKey),
    creators: [],
  },
}).sendAndConfirm(umi);
```

{% totem-accordion title="MPL-Coreコレクションの作成" %}

まだコレクションがない場合は、[`@metaplex-foundation/mpl-core`ライブラリ](/ja/smart-contracts/core/collections#collectionとは)を使用して作成できます。コレクションに`BubblegumV2`プラグインも追加する必要があることに注意してください。
npm install @metaplex-foundation/mpl-core
次のようにコレクションを作成します：

```ts
import { generateSigner } from '@metaplex-foundation/umi';
import { createCollection } from '@metaplex-foundation/mpl-core';

const collectionSigner = generateSigner(umi);
await createCollection(umi, {
    collection: collectionSigner,
    name: "My Collection",
    uri: "https://example.com/my-nft.json",
    plugins: [
      {
        type: "BubblegumV2",
      },
    ],
  }).sendAndConfirm(umi);
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### ミントトランザクションからアセットIDとリーフスキーマを取得する {% #get-leaf-schema-from-mint-transaction %}

`parseLeafFromMintV2Transaction`ヘルパーを使用して、`mintV2`トランザクションからリーフを取得し、アセットIDを特定できます。この関数はトランザクションを解析するため、`parseLeafFromMintV2Transaction`を呼び出す前にトランザクションが完了していることを確認してください。

{% callout type="note" title="トランザクションの完了" %}
`parseLeafFromMintV2Transaction`を呼び出す前に、トランザクションが完了していることを確認してください。
{% /callout %}

{% dialect-switcher title="ミントトランザクションからリーフスキーマを取得する" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  mintV2,
  parseLeafFromMintV2Transaction,
} from '@metaplex-foundation/mpl-bubblegum';

const { signature } = await mintV2(umi, {
  // ... 上記の詳細を参照
}).sendAndConfirm(umi);

const leaf = await parseLeafFromMintV2Transaction(umi, signature);
const assetId = leaf.id;
```

{% /dialect %}
{% /dialect-switcher %}

## Notes

- The Bubblegum Tree must be created before minting. See [Creating Trees](/smart-contracts/bubblegum-v2/create-trees).
- For collection mints, the MPL-Core collection must have the `BubblegumV2` plugin enabled.
- The collection authority must sign the transaction when minting to a collection, regardless of whether the tree is public or private.
- Use `parseLeafFromMintV2Transaction` only after the transaction is **finalized**, not just confirmed.

## FAQ

### コレクションに圧縮NFTをミントするにはどうすればよいですか？

MPL-Coreコレクションアドレスに設定された`coreCollection`パラメータを使用して`mintV2`命令を使用します。コレクションには`BubblegumV2`プラグインが有効になっている必要があります。

### ミント後にアセットIDを取得するにはどうすればよいですか？

トランザクションが完了した後、`parseLeafFromMintV2Transaction`ヘルパーを使用します。アセットIDを含むリーフスキーマを返します。

### 誰でも私のツリーからミントできますか？

ツリーが公開に設定されている場合のみです。プライベートツリーの場合、ツリー作成者またはツリーデリゲートのみがミントできます。

### ミントに必要なメタデータフィールドは何ですか？

`MetadataArgsV2`には、name、uri、sellerFeeBasisPoints、collection（またはnone）、およびcreatorsの配列が必要です。

## Glossary

| Term | Definition |
|------|------------|
| **mintV2** | The Bubblegum V2 instruction for minting compressed NFTs, replacing the V1 mint instructions |
| **MetadataArgsV2** | The metadata structure passed to mintV2, containing name, URI, royalties, collection, and creators |
| **Collection Authority** | The signer authorized to manage the MPL-Core collection — required when minting to a collection |
| **BubblegumV2 Plugin** | An MPL-Core collection plugin that enables Bubblegum V2 features (freeze, soulbound, royalties) |
| **Asset ID** | A PDA derived from the merkle tree address and leaf index, uniquely identifying a compressed NFT |
| **Leaf Schema** | The data structure stored as a leaf in the merkle tree, containing the cNFT's hashed metadata and ownership info |
