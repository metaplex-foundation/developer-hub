---
title: 圧縮NFTのバーン
metaTitle: 圧縮NFTのバーン - Bubblegum V2
description: Bubblegum V2で圧縮NFTをバーンする方法を学びます。
created: '01-15-2025'
updated: '02-24-2026'
keywords:
  - burn compressed NFT
  - burn cNFT
  - delete NFT
  - Bubblegum burn
  - burnV2
  - permanent burn delegate
about:
  - Compressed NFTs
  - NFT lifecycle
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---

## Summary

**Burning a compressed NFT** permanently removes it from the Bubblegum Tree using the **burnV2** instruction. This page covers burning by owner, leaf delegate, and permanent burn delegate.

- Burn a cNFT using the burnV2 instruction
- Authorize burns via the leaf owner, leaf delegate, or permanent burn delegate
- Pass the coreCollection parameter when the cNFT belongs to a collection

## Out of Scope


**burnV2**命令は、圧縮NFTをバーンし、Bubblegumツリーから永続的に削除するために使用できます。この操作を認証するには、現在の所有者またはデリゲート権限（存在する場合）がトランザクションに署名する必要があります。命令は以下のパラメータを受け入れます：

- **リーフ所有者**、**リーフデリゲート**、または**永続バーンデリゲート**: 圧縮NFTの現在の所有者、そのデリゲート権限（存在する場合）、またはコレクションの永続バーンデリゲート。アセットがコレクションの一部である場合、`coreCollection`パラメータを渡す必要があります。これらのいずれかがトランザクションに署名する必要があります。

この命令はBubblegumツリー上のリーフを置き換えるため、バーンする前に圧縮NFTの整合性を検証するために追加のパラメータを提供する必要があります。これらのパラメータはリーフを変更するすべての命令に共通であるため、[次のFAQ](/ja/smart-contracts/bubblegum-v2/faq#replace-leaf-instruction-arguments)でドキュメント化されています。幸いなことに、Metaplex DAS APIを使用してこれらのパラメータを自動的に取得するヘルパーメソッドを使用できます。

{% callout title="トランザクションサイズ" type="note" %}
トランザクションサイズエラーが発生した場合は、`getAssetWithProof`で`{ truncateCanopy: true }`の使用を検討してください。詳細については[FAQ](/ja/smart-contracts/bubblegum-v2/faq#replace-leaf-instruction-arguments)を参照してください。
{% /callout %}

{% callout title="コレクション" type="note" %}
cNFTがコレクションの一部である場合、`coreCollection`パラメータを渡す必要があります。
{% /callout %}

{% dialect-switcher title="圧縮NFTのバーン" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, burnV2 } from '@metaplex-foundation/mpl-bubblegum';

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await burnV2(umi, {
  ...assetWithProof,
  leafOwner: currentLeafOwner,
}).sendAndConfirm(umi)
```

{% totem-accordion title="デリゲートの使用" %}

```ts
import { getAssetWithProof, burnV2 } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await burnV2(umi, {
  ...assetWithProof,
  leafDelegate: currentLeafDelegate,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="永続バーンデリゲートの使用" %}

## Notes

- Burning is **irreversible** — the cNFT is permanently removed from the merkle tree.
- If the cNFT belongs to a collection, you must pass the `coreCollection` parameter.
- The permanent burn delegate can burn any cNFT in the collection without the owner's signature, if the `PermanentBurnDelegate` plugin is enabled on the collection.

## FAQ

#

## Glossary

| Term | Definition |
|------|------------|
| **burnV2** | The Bubblegum V2 instruction that permanently removes a cNFT from the merkle tree |
| **Permanent Burn Delegate** | A collection-level authority that can burn any cNFT in the collection without owner consent |
| **Leaf Delegate** | An account authorized by the cNFT owner to perform actions (transfer, burn, freeze) on their behalf |
| **getAssetWithProof** | A helper function that fetches all required parameters (proof, hashes, nonce, index) from the DAS API |
