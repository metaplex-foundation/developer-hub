---
title: 更新压缩NFT
metaTitle: 更新压缩NFT - Bubblegum V2
description: 了解如何在Bubblegum上更新压缩NFT。
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
faqs:
  - q: 谁可以更新压缩NFT的元数据？
    a: 如果cNFT属于集合，只有集合权限可以更新。如果不属于集合，树权限（树创建者或委托人）可以更新。
  - q: 可以在cNFT上更新哪些字段？
    a: 您可以更新UpdateArgsArgs中定义的名称、URI、卖家费用基准点及其他元数据字段。对于要更改的字段使用some('newValue')。
  - q: 更新时需要传递集合吗？
    a: 是的，如果cNFT属于集合。请传递带有集合公钥的coreCollection参数。集合权限必须签署交易。
---

## Summary

**Updating a compressed NFT** modifies its metadata using the **updateMetadataV2** instruction. This page covers update authority rules for collection-based and tree-based cNFTs.

- Update cNFT metadata (name, URI, creators, royalties) using updateMetadataV2
- Collection authority updates cNFTs that belong to a collection
- Tree authority updates cNFTs that do not belong to a collection
- Changes are reflected in the merkle tree and indexed by DAS API providers

**updateMetadataV2**指令可用于修改压缩NFT的元数据。默克尔根会更新以反映数据的传播哈希，符合[Metaplex DAS API](https://github.com/metaplex-foundation/digital-asset-standard-api)的RPC提供商将更新其cNFT索引。

元数据可以由两个权限之一更新，具体取决于压缩NFT是否是集合中的已验证项目。

## 更新权限

cNFT有两个可能的更新权限：树所有者，或（如果属于集合）集合权限。

### 集合权限

如果您的cNFT属于某个集合，那么该cNFT的更新权限将是集合的权限。更新cNFT时，您需要向更新函数传递`coreCollection`参数。

权限将从当前umi身份推断。如果权限与当前umi身份不同，则您需要将`authority`参数作为签名者类型传入，或创建一个`noopSigner`以便稍后签名。

```js
await updateMetadataV2(umi, {
  ...
  authority: collectionAuthority,
  coreCollection: publicKey("11111111111111111111111111111111"),
}).sendAndConfirm(umi)
```

### 树权限

如果您的cNFT不属于集合，那么cNFT的更新权限将是cNFT所属树的权限。在这种情况下，您应该从更新函数中**省略**`coreCollection`参数。

权限将从当前umi身份推断。如果权限与当前umi身份不同，则您需要将`authority`参数作为签名者类型传入，或创建一个`noopSigner`以便稍后签名。

## 更新cNFT

{% dialect-switcher title="更新压缩NFT" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  updateMetadataV2,
  UpdateArgsArgs,
} from '@metaplex-foundation/mpl-bubblegum'
import { some } from '@metaplex-foundation/umi'

// 使用辅助函数获取资产和证明。
const assetWithProof = await getAssetWithProof(umi, assetId, {
  truncateCanopy: true,
})

// 然后我们可以用它来更新NFT的元数据。
const updateArgs: UpdateArgsArgs = {
  name: some('New name'),
  uri: some('https://updated-example.com/my-nft.json'),
}
await updateMetadataV2(umi, {
  ...assetWithProof,
  leafOwner,
  currentMetadata: assetWithProof.metadata,
  updateArgs,
  // 可选参数。如果您的权限是与当前umi身份不同的签名者类型，
  // 在此处分配该签名者。
  authority: <Signer>,
  // 可选参数。如果cNFT属于集合，在此处传递。
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
