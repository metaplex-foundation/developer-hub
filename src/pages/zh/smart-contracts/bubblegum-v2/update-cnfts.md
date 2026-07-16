---
title: 更新压缩NFT
metaTitle: 更新压缩NFT - Bubblegum V2
description: 了解如何在Bubblegum上更新压缩NFT。
created: '01-15-2025'
updated: '06-19-2026'
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
  - q: 如何更新从集合继承版税的cNFT？
    a: 将getAssetWithProof的叶子元数据作为updateMetadataV2的currentMetadata参数传入（IDL中表示现有叶子状态的名称）。继承版税时sellerFeeBasisPoints为链上哨兵。
---

## Summary

**Updating a compressed NFT** modifies its metadata using the **updateMetadataV2** instruction. This page covers update authority rules for collection-based and tree-based cNFTs.

- Update cNFT metadata (name, URI, creators, royalties) using updateMetadataV2
- Collection authority updates cNFTs that belong to a collection
- Tree authority updates cNFTs that do not belong to a collection
- Changes are reflected in the merkle tree and indexed by DAS API providers
- 将 `getAssetWithProof` 的叶子元数据作为 `updateMetadataV2` 的 `currentMetadata` 参数传入（IDL 中表示现有叶子状态的名称）

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
  currentMetadata: {
    name: assetWithProof.metadata.name,
    symbol: assetWithProof.metadata.symbol,
    uri: assetWithProof.metadata.uri,
    sellerFeeBasisPoints: assetWithProof.metadata.sellerFeeBasisPoints,
    primarySaleHappened: assetWithProof.metadata.primarySaleHappened,
    isMutable: assetWithProof.metadata.isMutable,
    tokenStandard: assetWithProof.metadata.tokenStandard,
    creators: assetWithProof.metadata.creators,
    collection: some(publicKey('22222222222222222222222222222222')),
  },
  updateArgs,
  // 可选参数。如果您的权限是与当前umi身份不同的签名者类型，
  // 在此处分配该签名者。
  authority: <Signer>,
  // 可选参数。如果cNFT属于集合，在此处传递。
  coreCollection: publicKey("22222222222222222222222222222222"),
}).sendAndConfirm(umi)
```

{% callout type="note" title="写入指令使用叶子元数据" %}
`getAssetWithProof.metadata` 始终是叶子规范值 — 继承版税时包括 `sellerFeeBasisPoints: 65535`。集合解析后的展示值位于 `rpcAsset.royalty.basis_points_inherited` 与 `rpcAsset.creators_inherited`。

`updateMetadataV2` 的 `currentMetadata` 参数是现有叶子元数据的 IDL 名称（V2 形态：`collection` 为公钥）。请从 `assetWithProof.metadata` 构建它。

读取资产时关于 DAS 响应字段的说明，请参阅[读取继承版税](/zh/smart-contracts/bubblegum-v2/reading-inherited-royalties)。
{% /callout %}

## 继承版税 {% #inherited-royalties %}

通过将 `updateArgs.sellerFeeBasisPoints` 设为 `some(SELLER_FEE_BASIS_POINTS_INHERIT)`，可将 cNFT **切换为**继承版税。集合必须具有 `Royalties` 插件，且更新后的元数据 `creators` 数组必须为空。

要从继承版税**切换回**明确百分比 — 例如在[从集合中移除 cNFT](/zh/smart-contracts/bubblegum-v2/collections#inherited-royalties)之前 — 请传入所需的 basis points：

{% code-tabs-imported from="bubblegum/update-inherit-royalties" frameworks="umi" /%}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Notes

- The update authority depends on whether the cNFT belongs to a collection. Collection cNFTs use the collection authority; standalone cNFTs use the tree authority.
- 将 `getAssetWithProof` 的叶子元数据作为 `updateMetadataV2` 的 `currentMetadata` 参数传入，以便程序在应用更新前验证当前叶子。
- Use `some()` for fields you want to update and omit fields you want to keep unchanged.
- Inherited seller fees require an empty leaf-level `creators` array and a collection with the `Royalties` plugin.

## FAQ

### 谁可以更新压缩 NFT 的元数据？

如果 cNFT 属于集合，只有集合权限可以更新。如果不属于集合，树权限（树创建者或委托人）可以更新。

### 可以在 cNFT 上更新哪些字段？

你可以更新 `UpdateArgsArgs` 中定义的名称、URI、seller fee basis points 及其他元数据字段。对要更改的字段使用 `some('newValue')`。

### 更新时需要传递集合吗？

是的，如果 cNFT 属于集合。请传递带有集合公钥的 `coreCollection` 参数。集合权限必须签署交易。

### 如何更新从集合继承版税的 cNFT？

将 `getAssetWithProof` 的叶子元数据作为 `updateMetadataV2` 的 `currentMetadata` 参数传入，以便使用链上哨兵进行验证。使用 `updateArgs.sellerFeeBasisPoints` 的 `some(SELLER_FEE_BASIS_POINTS_INHERIT)` 切换为继承版税，或使用明确数字切换离开继承版税。

## Glossary

| Term | Definition |
|------|------------|
| **updateMetadataV2** | The Bubblegum V2 instruction for modifying compressed NFT metadata |
| **Collection Authority** | The update authority of the MPL-Core collection, authorized to update cNFTs in that collection |
| **Tree Authority** | The tree creator or delegate, authorized to update cNFTs that do not belong to a collection |
| **UpdateArgsArgs** | The TypeScript type defining which metadata fields to update, using Option wrappers |
| **currentMetadata** | `updateMetadataV2` 上表示现有叶子元数据的 IDL 参数；请从 `getAssetWithProof.metadata` 构建 |
| **SELLER_FEE_BASIS_POINTS_INHERIT** | Sentinel value `65535` indicating royalties are inherited from the MPL-Core collection |
