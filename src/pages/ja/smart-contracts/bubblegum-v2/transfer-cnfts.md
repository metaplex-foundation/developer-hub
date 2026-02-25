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

**Transferring a compressed NFT** moves ownership from one wallet to another using the **transferV2** instruction. This page covers transfers by owner, delegate, permanent transfer delegate, and transferability checks.

- Transfer a cNFT to a new owner using transferV2
- Authorize transfers via leaf owner, leaf delegate, or permanent transfer delegate
- Check if a cNFT can be transferred using the canTransfer helper
- Pass the coreCollection parameter when the cNFT belongs to a collection

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

## Notes

- After a transfer, the leaf delegate is automatically reset to the new owner.
- Frozen cNFTs and soulbound (non-transferable) cNFTs cannot be transferred. Use `canTransfer` to check.
- The permanent transfer delegate can transfer without the owner's signature if the `PermanentTransferDelegate` plugin is enabled on the collection.

## FAQ

#

## Glossary

| Term | Definition |
|------|------------|
| **transferV2** | The Bubblegum V2 instruction that transfers a cNFT from one owner to another |
| **Permanent Transfer Delegate** | A collection-level authority that can transfer any cNFT without owner consent |
| **canTransfer** | A helper function that checks whether a cNFT can be transferred (not frozen or soulbound) |
| **Leaf Owner** | The current owner of the compressed NFT |
| **New Leaf Owner** | The wallet address that will receive ownership of the cNFT after transfer |
