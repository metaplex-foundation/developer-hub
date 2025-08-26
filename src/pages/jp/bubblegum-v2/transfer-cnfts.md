---
title: 圧縮NFTの転送
metaTitle: 圧縮NFTの転送 | Bubblegum v2
description: Bubblegumで圧縮NFTを転送する方法を学びます。
---

**transferV2**命令は、圧縮NFTをある所有者から別の所有者に転送するために使用できます。転送を認証するには、現在の所有者またはデリゲート権限（存在する場合）がトランザクションに署名する必要があります。デリゲート権限は、リーフデリゲートまたはコレクションの`permanentTransferDelegate`のいずれかです。

この命令は圧縮NFTを更新するため、Bubblegumツリー上のリーフを置き換えることに注意してください。これは、圧縮NFTの整合性を検証するために追加のパラメータを提供する必要があることを意味します。これらのパラメータはリーフを変更するすべての命令に共通であるため、[次のFAQ](/jp/bubblegum-v2/faq#replace-leaf-instruction-arguments)でドキュメント化されています。幸いなことに、Metaplex DAS APIを使用してこれらのパラメータを自動的に取得するヘルパーメソッドを使用できます。

{% callout title="トランザクションサイズ" type="note" %}
トランザクションサイズエラーが発生した場合は、`getAssetWithProof`で`{ truncateCanopy: true }`の使用を検討してください。詳細については[FAQ](/jp/bubblegum-v2/faq#replace-leaf-instruction-arguments)を参照してください。
{% /callout %}

## Bubblegum V2圧縮NFTの転送

命令は以下のパラメータを受け入れます：

- **リーフ所有者**: 圧縮NFTの現在の所有者。デフォルトではトランザクションの支払者です。
- **リーフデリゲート**: 圧縮NFTの現在の所有者とそのデリゲート権限（存在する場合）。これらのいずれかがトランザクションに署名する必要があります。
- **権限**: トランザクションに署名するオプションの権限。リーフ所有者または`permanentTransferDelegate`にすることができ、デフォルトではトランザクションの`payer`です。
- **新しいリーフ所有者**: 圧縮NFTの新しい所有者のアドレス
- **マークルツリー**: Bubblegumツリーのアドレス
- **ルート**: Bubblegumツリーの現在のルート
- **データハッシュ**: 圧縮NFTのメタデータのハッシュ
- **作成者ハッシュ**: 圧縮NFTの作成者のハッシュ
- **ノンス**: 圧縮NFTのノンス
- **インデックス**: 圧縮NFTのインデックス
- **コレクション**: 圧縮NFTのコアコレクション（cNFTがコレクションの一部である場合）

JavaScriptを使用する場合は、最初に`getAssetWithProof`関数を使用してパラメータを取得し、それらを`transferV2`命令に渡すことをお勧めします。

{% dialect-switcher title="圧縮NFTの転送" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, transferV2 } from '@metaplex-foundation/mpl-bubblegum';
const assetWithProof = await getAssetWithProof(umi, assetId, {
  truncateCanopy: true,
})

// その後、leafOwnerAはそれを使用してNFTをleafOwnerBに転送できます。
const leafOwnerB = generateSigner(umi)
await transferV2(umi, {
  // プルーフ付きアセットからのパラメータを渡します。
  ...assetWithProof,
  authority: leafOwnerA,
  newLeafOwner: leafOwnerB.publicKey,
  // cNFTがコレクションの一部である場合、コアコレクションを渡します。