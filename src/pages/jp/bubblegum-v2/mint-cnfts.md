---
title: 圧縮NFTのミント
metaTitle: 圧縮NFTのミント | Bubblegum V2
description: Bubblegum V2で圧縮NFTをミントする方法を学びます。
---

[前のページ](/jp/bubblegum-v2/create-trees)では、圧縮NFTをミントするためにBubblegumツリーが必要であることを確認し、その作成方法を見ました。今度は、与えられたBubblegumツリーから圧縮NFTをミントする方法を見てみましょう。 {% .lead %}

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