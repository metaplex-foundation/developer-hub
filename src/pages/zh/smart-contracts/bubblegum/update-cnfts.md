---
title: 更新压缩NFT
metaTitle: 更新压缩NFT | Bubblegum
description: 了解如何在Bubblegum上更新压缩NFT
---

**Update**指令可用于修改压缩NFT的元数据。默克尔根会更新以反映数据的传播哈希，符合[Metaplex DAS API](https://github.com/metaplex-foundation/digital-asset-standard-api)的RPC提供商将更新其cNFT索引。

元数据可以由两个权限之一更新，具体取决于压缩NFT是否是集合中的已验证项目。

## 更新权限

cNFT有两种可能的更新权限，一种是树所有者，另一种是集合权限（如果cNFT属于集合）。

### 集合权限

如果您的cNFT属于集合，则该cNFT的更新权限将是集合的权限。更新cNFT时，您需要将`collectionMint`参数传递给更新函数。

权限将从当前umi身份推断。如果权限与当前umi身份不同，则需要将`authority`参数作为签名者类型传入，或创建'noopSigner'以便稍后签名。

```js
await updateMetadata(umi, {
  ...
  collectionMint: publicKey("11111111111111111111111111111111"),
}).sendAndConfirm(umi)
```

### 树权限

如果您的cNFT不属于集合，则cNFT的更新权限将是cNFT所属树的权限。在这种情况下，您应该**省略**更新函数中的`collectionMint`参数。

权限将从当前umi身份推断。如果权限与当前umi身份不同，则需要将`authority`参数作为签名者类型传入，或创建'noopSigner'以便稍后签名。

## 更新cNFT

{% dialect-switcher title="更新压缩NFT" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  updateMetadata,
  UpdateArgsArgs,
} from '@metaplex-foundation/mpl-bubblegum'

// 使用辅助函数获取资产和证明。
const assetWithProof = await getAssetWithProof(umi, assetId, {
  truncateCanopy: true,
})

// 然后我们可以用它来更新NFT的元数据。
const updateArgs: UpdateArgsArgs = {
  name: some('New name'),
  uri: some('https://updated-example.com/my-nft.json'),
}
await updateMetadata(umi, {
  ...assetWithProof,
  leafOwner,
  currentMetadata: assetWithProof.metadata,
  updateArgs,
  // 可选参数。如果您的权限是与当前umi身份不同的签名者类型，
  // 在此处分配该签名者。
  authority: <Signer>
  // 可选参数。如果cNFT属于集合，在此处传递。
  collectionMint: publicKey("22222222222222222222222222222222"),
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
