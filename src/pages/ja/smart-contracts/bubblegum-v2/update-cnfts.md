---
title: 圧縮NFTの更新
metaTitle: 圧縮NFTの更新 - Bubblegum V2
description: Bubblegum V2で圧縮NFTを更新する方法を学びます。
created: '01-15-2025'
updated: '02-24-2026'
keywords:
  - update compressed NFT
  - update cNFT
  - NFT metadata update
  - Bubblegum update
  - updateMetadataV2
about:
  - Compressed NFTs
  - NFT metadata
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---

## Summary

**Updating a compressed NFT** modifies its metadata using the **updateMetadataV2** instruction. This page covers update authority rules for collection-based and tree-based cNFTs.

- Update cNFT metadata (name, URI, creators, royalties) using updateMetadataV2
- Collection authority updates cNFTs that belong to a collection
- Tree authority updates cNFTs that do not belong to a collection
- Changes are reflected in the merkle tree and indexed by DAS API providers

## Out of Scope


**updateMetadataV2**命令は、圧縮NFTのメタデータを変更するために使用できます。マークルルートは、データの伝播されたハッシュを反映するように更新され、[Metaplex DAS API](https://github.com/metaplex-foundation/digital-asset-standard-api)に準拠するRPCプロバイダーは、cNFTのインデックスを更新します。

メタデータは、圧縮NFTがコレクション内の検証されたアイテムかどうかによって、2つの権限のうちの1つによって更新できます。

## 更新権限

cNFTには2つの可能な更新権限があります：ツリー所有者、または（コレクションに属している場合）コレクション権限です。

### コレクション権限

cNFTがコレクションに属している場合、そのcNFTの更新権限はコレクションの権限になります。cNFTを更新する際は、更新関数に`coreCollection`引数を渡す必要があります。

権限は現在のumiアイデンティティから推測されます。権限が現在のumiアイデンティティと異なる場合は、`authority`引数をsigner型として渡すか、後で署名するための`noopSigner`を作成する必要があります。

```js
await updateMetadataV2(umi, {
  ...
  authority: collectionAuthority,
  coreCollection: publicKey("11111111111111111111111111111111"),
}).sendAndConfirm(umi)
```

### ツリー権限

cNFTがコレクションに属していない場合、cNFTの更新権限は、cNFTが属するツリーの権限になります。この場合、更新関数から`coreCollection`引数を**省略**します。

権限は現在のumiアイデンティティから推測されます。権限が現在のumiアイデンティティと異なる場合は、`authority`引数をsigner型として渡すか、後で署名するための`noopSigner`を作成する必要があります。

## cNFTの更新

{% dialect-switcher title="圧縮NFTの更新" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  updateMetadataV2,
  UpdateArgsArgs,
} from '@metaplex-foundation/mpl-bubblegum'
import { some } from '@metaplex-foundation/umi'

// ヘルパーを使用してアセットと証明を取得します。
const assetWithProof = await getAssetWithProof(umi, assetId, {
  truncateCanopy: true,
})

// その後、NFTのメタデータを更新するために使用できます。
const updateArgs: UpdateArgsArgs = {
  name: some('新しい名前'),
  uri: some('https://updated-example.com/my-nft.json'),
}
await updateMetadataV2(umi, {
  ...assetWithProof,
  leafOwner,
  currentMetadata: assetWithProof.metadata,
  updateArgs,
  // オプションパラメータ。権限が現在のumiアイデンティティと
  // 異なる署名者型の場合、ここでその署名者を割り当てます。
  authority: <Signer>,
  // オプションパラメータ。cNFTがコレクションに属している場合はここで渡します。
  coreCollection: publicKey("22222222222222222222222222222222"),
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Notes

- The update authority depends on whether the cNFT belongs to a collection. Collection cNFTs use the collection authority; standalone cNFTs use the tree authority.
- You must pass `currentMetadata` from `getAssetWithProof` so the program can verify the current leaf before applying updates.
- Use `some()` for fields you want to update and omit fields you want to keep unchanged.

## FAQ

#

## Glossary

| Term | Definition |
|------|------------|
| **updateMetadataV2** | The Bubblegum V2 instruction for modifying compressed NFT metadata |
| **Collection Authority** | The update authority of the MPL-Core collection, authorized to update cNFTs in that collection |
| **Tree Authority** | The tree creator or delegate, authorized to update cNFTs that do not belong to a collection |
| **UpdateArgsArgs** | The TypeScript type defining which metadata fields to update, using Option wrappers |
| **currentMetadata** | The existing metadata of the cNFT, fetched via getAssetWithProof and required for verification |
