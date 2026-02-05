---
title: Verified Creator 插件
metaTitle: Verified Creator 插件 | Metaplex Core
description: 为 Core NFT Asset 和 Collection 添加已验证创作者签名。证明创作者身份而不影响版税分配。
updated: '01-31-2026'
keywords:
  - verified creator
  - creator signature
  - prove authorship
  - creator verification
about:
  - Creator verification
  - Signature proof
  - Authorship
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 这与 Token Metadata 的创作者数组有什么不同？
    a: 在 Token Metadata 中，创作者数组用于版税分配。在 Core 中，Verified Creators 纯粹用于证明创作者身份——版税分配请使用 Royalties 插件。
  - q: Update authority 可以验证创作者吗？
    a: 不可以。每个创作者必须通过签署交易来验证自己。这确保了创作者身份证明的真实性。
  - q: 为什么我无法移除已验证的创作者？
    a: 要移除已验证的创作者，他们必须先取消验证自己。这可以防止未经授权移除已验证的创作者。
  - q: Asset 会自动获得 Collection 的已验证创作者吗？
    a: 是的。Asset 会从其 Collection 继承创作者数组。单个 Asset 也可以拥有自己的 Verified Creators 插件，包含不同的创作者。
  - q: 我可以用这个来标注联合创作者吗？
    a: 可以。这是一个常见用例——多个创作者都可以验证他们参与创建 Asset 或 Collection。
---
**Verified Creators Plugin** 在 Asset 或 Collection 上存储已验证创作者签名的列表。公开证明创作者身份而不影响版税分配。{% .lead %}
{% callout title="您将学到" %}
- 为 Asset 和 Collection 添加已验证创作者
- 验证创作者签名
- 从列表中移除创作者
- 了解验证工作流程
{% /callout %}
## 概述
**Verified Creators** 插件是一个由 Authority 管理的插件，用于存储带有验证状态的创作者地址。与 Token Metadata 不同，这些创作者不用于版税分配（版税分配请使用 Royalties 插件）。
- Update authority 添加未验证的创作者
- 创作者通过签名验证自己
- 已验证的创作者必须先取消验证才能被移除
- Asset 从其 Collection 继承创作者
## 不在范围内
版税分配（请使用 [Royalties 插件](/zh/smart-contracts/core/plugins/royalties)）、Token Metadata 创作者数组和自动验证。
## 快速开始
**跳转到：** [添加到 Asset](#adding-the-autograph-plugin-to-an-asset-code-example) · [添加创作者](#adding-a-different-creator-to-an-asset-code-example) · [移除创作者](#removing-a-creator-from-an-asset-code-example)
1. 添加带有初始创作者的 Verified Creators 插件
2. 创作者使用 `updatePlugin` 验证自己
3. 要移除：创作者先取消验证，然后 update authority 移除
{% callout type="note" title="Verified Creators 与 Autograph 对比" %}
| 功能 | Verified Creators | Autograph |
|---------|-------------------|-----------|
| 谁可以添加 | 仅 Update authority | 任何人（启用后） |
| 用途 | 证明创作者身份 | 收藏签名 |
| 验证 | 创作者自己验证 | 无需验证 |
| 移除 | 必须先取消验证 | 所有者可随时移除 |
| 用于版税 | 否 | 否 |
**使用 Verified Creators** 来证明真实的创作者身份。
**使用 [Autograph](/zh/smart-contracts/core/plugins/autograph)** 来收集粉丝/名人的签名。
{% /callout %}
## 常见用例
- **团队归属**：设计师、开发者和创始人各自验证他们的参与
- **联合创作证明**：多位艺术家验证合作创作
- **品牌验证**：官方品牌账户验证合作关系
- **真实性证明**：原创作者验证他们创建了该 Asset
- **历史记录**：记录谁参与了 Collection 的创建
`update authority` 可以：
- 添加插件
- 将未验证的创作者添加到创作者数组
- 移除未验证的创作者。要移除已验证的创作者，他们必须先取消验证自己
- 验证自己
要验证创作者，`updatePlugin` 指令必须由 update authority 添加到创作者数组中的公钥签名。
## 适用于
|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |
## 参数
`verifiedCreator` 插件需要在 `VerifiedCreatorsSignature` 数组中提供以下参数：
| 参数    | 值        |
| ------- | ------    |
| address | publicKey |
| message | string    |
Asset 从 Collection 继承创作者数组。
## 将 Verified Creators 插件添加到 Asset 的代码示例
{% dialect-switcher title="将 Verified Creators 插件添加到 MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}
此代码片段假设 umi identity 是 asset 的 update authority。
```ts
import {
  addPlugin,
} from '@metaplex-foundation/mpl-core'
await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: [
      {
        address: umi.identity.publicKey,
        verified: true,
      },
  },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% /dialect-switcher %}
## 将不同的创作者添加到 Asset 的代码示例
{% dialect-switcher title="将不同的创作者添加到 MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}
此代码片段假设 umi identity 是 asset 的 update authority，用于添加未验证的创作者。
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
const publicKeyToAdd = publicKey("abc...")
// The new autograph that you want to add
const newCreator = {
  address: publicKeyToAdd,
  verified: false,
}
// Add the new autograph to the existing signatures array
const updatedCreators = [...asset.verifiedCreators.signatures, newCreator]
await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: updatedCreators,
  },
  authority: umi.identity,
}).sendAndConfirm(umi)
```
添加未验证的创作者后，他们可以再次使用 `updatePlugin` 函数验证自己。
此代码片段假设 umi identity 是创作者。
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
const publicKeyToVerify = publicKey("abc...")
// The creator that you want to verify
const updatedCreators = asset.verifiedCreators.signatures.map(creator => {
  if (creator.address === publicKeyToVerify) {
    return { ...creator, verified: true };
  }
  return creator;
});
await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: updatedCreators,
  },
  authority: umi.identity,
}).sendAndConfirm(umi)
```
{% /dialect %}
{% /dialect-switcher %}
## 从 Asset 移除创作者的代码示例
{% dialect-switcher title="从 MPL Core Asset 移除创作者" %}
{% dialect title="JavaScript" id="js" %}
只有 update authority 可以移除创作者。要移除创作者，必须是 `verified:false` 或者是 update authority 本身。因此，更新将分两步完成。如果您能够同时使用 update authority 和创作者进行签名，这可以在一个交易中组合两个指令完成。
1. 设置 `verified:false`
此代码片段假设 `umi.identity` 是您要移除的创作者
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
// The Publickey of the creator that you want to remove
const publicKeyToRemove = publicKey("abc...")
const modifiedCreators = signatures.map(signature =>
  signature.address === creator.publicKey
    ? { ...signature, verified: false }
    : signature
);
await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: modifiedCreators,
  },
  authority: umi.identity, // Should be the creator
}).sendAndConfirm(umi)
```
2. 移除创作者
此代码片段假设 `umi.identity` 是 update authority
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
// The Publickey of the creator that you want to remove
const publicKeyToRemove = publicKey("abc...")
const creatorsToKeep = asset.verifiedCreators.signatures.filter(
  (creator) => creator.address !== publicKeyToRemove
);
await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: creatorsToKeep,
  },
  authority: umi.identity, // Should be the update authority
}).sendAndConfirm(umi)
```
{% /dialect %}
{% /dialect-switcher %}
## 将 Verified Creators 插件添加到 Collection 的代码示例
{% dialect-switcher title="将 Verified Creators 插件添加到 Collection" %}
{% dialect title="JavaScript" id="js" %}
此代码片段假设 `umi.identity` 是 update authority
```ts
import { addCollectionPlugin } from '@metaplex-foundation/mpl-core'
await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: 'VerifiedCreators',
        signatures: [
      {
        address: umi.identity.publicKey,
        verified: true,
      },
  },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% /dialect-switcher %}
## 常见错误
### `Authority mismatch`
只有 update authority 可以添加插件或添加新创作者。只有创作者本人可以验证自己的签名。
### `Creator already verified`
该创作者已经验证过自己。无需任何操作。
### `Cannot remove verified creator`
已验证的创作者必须先取消验证自己，然后 update authority 才能移除他们。
## 注意事项
- Verified Creators 不用于版税分配（请使用 Royalties 插件）
- 创作者必须自己验证——update authority 无法代替他们验证
- 创作者必须先取消验证才能被移除
- Asset 从其 Collection 继承创作者数组
## 快速参考
### 验证工作流程
| 步骤 | 操作 | 执行者 |
|------|--------|-----|
| 1 | 添加未验证的创作者 | Update Authority |
| 2 | 验证创作者 | 创作者签名 |
| 3 | 取消验证（可选） | 创作者签名 |
| 4 | 移除（可选） | Update Authority |
### 权限矩阵
| 操作 | Update Authority | 创作者 |
|--------|------------------|---------|
| 添加插件 | ✅ | 否 |
| 添加未验证的创作者 | ✅ | 否 |
| 验证创作者 | 否 | ✅（仅限本人） |
| 取消验证创作者 | 否 | ✅（仅限本人） |
| 移除未验证的创作者 | ✅ | 否 |
## 常见问题
### 这与 Token Metadata 的创作者数组有什么不同？
在 Token Metadata 中，创作者数组用于版税分配。在 Core 中，Verified Creators 纯粹用于证明创作者身份——版税分配请使用 Royalties 插件。
### Update authority 可以验证创作者吗？
不可以。每个创作者必须通过签署交易来验证自己。这确保了创作者身份证明的真实性。
### 为什么我无法移除已验证的创作者？
要移除已验证的创作者，他们必须先取消验证自己。这可以防止未经授权移除已验证的创作者。
### Asset 会自动获得 Collection 的已验证创作者吗？
是的。Asset 从其 Collection 继承创作者数组。单个 Asset 也可以拥有自己的 Verified Creators 插件，包含不同的创作者。
### 我可以用这个来标注联合创作者吗？
可以。这是一个常见用例——多个创作者（设计师、开发者、艺术家）都可以验证他们参与创建 Asset 或 Collection。
## 术语表
| 术语 | 定义 |
|------|------------|
| **Verified Creator** | 已签名确认参与的创作者 |
| **Unverified Creator** | 由 update authority 添加但尚未确认的创作者 |
| **Verification** | 创作者签名以证明真实创作者身份 |
| **Royalties Plugin** | 用于版税分配的独立插件（不是本插件） |
| **Creator Array** | 与 Asset/Collection 关联的地址列表 |
## 相关插件
- [Autograph](/zh/smart-contracts/core/plugins/autograph) - 收集任何人（粉丝、名人）的签名
- [Royalties](/zh/smart-contracts/core/plugins/royalties) - 设置版税分配（与已验证创作者分开）
- [ImmutableMetadata](/zh/smart-contracts/core/plugins/immutableMetadata) - 永久锁定元数据
