---
title: 圧縮NFTの転送
metaTitle: 圧縮NFTの転送 - Bubblegum v2
description: Bubblegum V2で圧縮NFTを転送する方法を学びます。
created: '01-15-2025'
updated: '02-24-2026'
keywords:
  - transfer compressed NFT
  - transfer cNFT
  - NFT transfer
  - Bubblegum transfer
  - transferV2
  - permanent transfer delegate
about:
  - Compressed NFTs
  - NFT transfers
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: フリーズされたcNFTを転送できますか？
    a: いいえ。フリーズされたcNFTは転送できません。適切なデリゲート権限を使用して先にcNFTを解凍する必要があります。
  - q: 転送後にデリゲートはどうなりますか？
    a: リーフデリゲートは転送成功後に自動的に新しい所有者にリセットされます。新しい所有者が必要であれば再デリゲートする必要があります。
  - q: cNFTが転送可能かどうかを確認するにはどうすればよいですか？
    a: canTransferヘルパー関数を使用します。cNFTがフリーズされておらず、転送不可（ソウルバウンド）としてマークされていない場合にtrueを返します。
---

## Summary

**圧縮NFTの転送**は、**transferV2**命令を使用して所有権を一つのウォレットから別のウォレットに移します。このページでは、所有者、デリゲート、永続転送デリゲートによる転送、および転送可否チェックについて説明します。

- transferV2を使用してcNFTを新しい所有者に転送する
- リーフ所有者、リーフデリゲート、または永続転送デリゲートを通じて転送を承認する
- canTransferヘルパーを使用してcNFTが転送可能かどうかを確認する
- cNFTがコレクションに属する場合はcoreCollectionパラメータを渡す

**transferV2**命令は、圧縮NFTをある所有者から別の所有者に転送するために使用できます。転送を認証するには、現在の所有者またはデリゲート権限（存在する場合）がトランザクションに署名する必要があります。デリゲート権限は、リーフデリゲートまたはコレクションの`permanentTransferDelegate`のいずれかです。

この命令は圧縮NFTを更新するため、Bubblegumツリー上のリーフを置き換えることに注意してください。これは、圧縮NFTの整合性を検証するために追加のパラメータを提供する必要があることを意味します。これらのパラメータはリーフを変更するすべての命令に共通であるため、[次のFAQ](/ja/smart-contracts/bubblegum-v2/faq#replace-leaf-instruction-arguments)でドキュメント化されています。幸いなことに、Metaplex DAS APIを使用してこれらのパラメータを自動的に取得するヘルパーメソッドを使用できます。

{% callout title="トランザクションサイズ" type="note" %}
トランザクションサイズエラーが発生した場合は、`getAssetWithProof`で`{ truncateCanopy: true }`の使用を検討してください。詳細については[FAQ](/ja/smart-contracts/bubblegum-v2/faq#replace-leaf-instruction-arguments)を参照してください。
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
  //coreCollection: coreCollection.publicKey,
}).sendAndConfirm(umi)
```

{% totem-accordion title="デリゲートを使用する場合" %}

```ts
import { getAssetWithProof, transferV2 } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {
  truncateCanopy: true,
})
await transferV2(umi, {
  ...assetWithProof,
  authority: delegateAuthority, // <- デリゲート権限がトランザクションに署名します。
  newLeafOwner: leafOwnerB.publicKey,
  //coreCollection: coreCollection.publicKey,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="永続転送デリゲートを使用する場合" %}

```ts
import { getAssetWithProof, transferV2 } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {
  truncateCanopy: true,
})
await transferV2(umi, {
  ...assetWithProof,
  authority: permanentTransferDelegate, // <- 永続デリゲート権限が署名します。
  newLeafOwner: leafOwnerB.publicKey,
  coreCollection: coreCollection.publicKey,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### 圧縮NFTの転送可否チェック

`canTransfer`関数を使用して圧縮NFTが転送可能かどうかを確認できます。NFTが転送可能な場合は`true`、そうでない場合は`false`を返します。フリーズされたcNFTと`NonTransferable`なcNFTは転送できません。

```ts
import { canTransfer } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {
  truncateCanopy: true,
})

const canBeTransferred = canTransfer(assetWithProof)
console.log("canBeTransferred", canBeTransferred ? "Yes" : "No")
```

## Notes

- 転送後、リーフデリゲートは自動的に新しい所有者にリセットされます。
- フリーズされたcNFTとソウルバウンド（転送不可）cNFTは転送できません。`canTransfer`を使用して確認してください。
- コレクションで`PermanentTransferDelegate`プラグインが有効になっている場合、永続転送デリゲートは所有者の署名なしに転送できます。

## Glossary

| 用語 | 定義 |
|------|------|
| **transferV2** | cNFTを一つの所有者から別の所有者に転送するBubblegum V2命令 |
| **永続転送デリゲート** | 所有者の同意なしに任意のcNFTを転送できるコレクションレベルの権限 |
| **canTransfer** | cNFTが転送可能かどうか（フリーズされていないか、ソウルバウンドでないか）を確認するヘルパー関数 |
| **リーフ所有者** | 圧縮NFTの現在の所有者 |
| **新しいリーフ所有者** | 転送後にcNFTの所有権を受け取るウォレットアドレス |
