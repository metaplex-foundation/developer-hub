---
title: Autograph 插件
metaTitle: Autograph 插件 | Metaplex Core
description: 允许任何人向 Core NFT Asset 添加签名和消息。创建来自创作者、艺术家或社区成员的可收藏签名。
updated: '01-31-2026'
keywords:
  - autograph NFT
  - NFT signature
  - collectible autograph
  - artist signature
about:
  - Digital autographs
  - Signature collection
  - Community interaction
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 这与 Verified Creators 有什么不同？
    a: Verified Creators 用于证明创作者身份，由更新权限者管理。Autograph 用于任何人的可收藏签名，就像在活动中获得签名一样。
  - q: 可以添加多个签名吗？
    a: 不可以。每个地址每个 Asset 只能添加一个签名。尝试从同一地址添加第二个签名将失败。
  - q: 我可以删除自己的签名吗？
    a: 不可以。只有所有者或签名委托人可以删除签名。这防止了有人签名后立即删除。
  - q: 添加签名需要所有者的许可吗？
    a: 不需要。一旦所有者启用了 Autograph 插件，任何人都可以添加他们的签名。所有者不需要批准单个签名。
  - q: Asset 转移后签名会怎样？
    a: 签名会保留在 Asset 上。它们是谁签名的永久记录，不受所有权变更的影响。
---
**Autograph 插件**允许任何人向 Asset 或 Collection 添加他们的签名和消息。非常适合艺术家、名人或社区成员的可收藏签名。{% .lead %}
{% callout title="学习内容" %}

- 在 Asset 和 Collection 上启用签名
- 向 Asset 添加您的签名
- 作为所有者删除签名
- 了解签名权限
{% /callout %}

## 摘要

**Autograph** 插件是一个所有者管理的插件，用于存储带消息的签名。一旦启用，任何人都可以添加他们的签名。所有者可以删除任何签名。

- 所有者添加插件（或在铸造时由更新权限者添加）
- 任何人都可以添加自己的签名
- 只有所有者/委托人可以删除签名
- 签名者无法删除自己的签名
- Asset 从其 Collection 继承签名

## 范围外

创作者验证（使用 [Verified Creators](/smart-contracts/core/plugins/verified-creators)）、版税和自动签名验证。

## 快速开始

**跳转至：** [添加插件](#向-asset-添加-autograph-插件代码示例) · [添加签名](#向-asset-添加-autograph-代码示例) · [删除签名](#从-asset-删除-autograph-代码示例)

1. 所有者添加 Autograph 插件以启用签名
2. 任何人都可以使用 `updatePlugin` 添加他们的签名
3. 所有者可以删除任何签名
{% callout type="note" title="Autograph vs Verified Creators" %}
| 功能 | Autograph | Verified Creators |
|---------|-----------|-------------------|
| 谁可以签名 | 任何人 | 仅列出的创作者 |
| 启用权限 | 所有者 | 更新权限者 |
| 自我删除 | ❌ 无法删除自己的 | ✅ 可以取消自己的验证 |
| 目的 | 可收藏的签名 | 证明创作者身份 |
| 最适合 | 粉丝互动、活动 | 团队归属 |
**使用 Autograph** 用于可收藏的签名（像签名纪念品一样）。
**使用 [Verified Creators](/smart-contracts/core/plugins/verified-creators)** 用于证明谁创建了 Asset。
{% /callout %}

## 常见用例

- **名人签名**：艺术家在活动中为 NFT 签名
- **粉丝互动**：社区成员为限量版作品签名
- **认证**：实物物品创作者为数字孪生签名
- **活动纪念品**：会议演讲者为活动 NFT 签名
- **慈善拍卖**：多位名人为慈善 NFT 签名
要添加签名，必须满足一些条件：
- 必须已添加 autograph 插件。
- 签名者只能添加自己的地址。
- 必须使用 `updatePlugin` 函数传递现有列表和添加的签名。
- 该签名者还没有现有的 Autograph。
{% callout type="note" %}
一旦所有者添加了 autograph 插件，任何人都可以添加他们的签名。所有者可以随时将其删除。
{% /callout %}

## 适用于

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |
Asset 从 Collection 继承 Autograph。

## 参数

`autograph` 插件在 `signatures` 数组中需要以下参数：

| 参数     | 值     |
| ------- | ------    |
| address | publicKey |
| message | string    |

## 向 Asset 添加 autograph 插件代码示例

{% dialect-switcher title="作为所有者向 MPL Core Asset 添加 autograph 插件" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  addPlugin,
} from '@metaplex-foundation/mpl-core'
await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Autograph',
    signatures: [
      {
        address: umi.identity.publicKey,
        message: 'Your Message',
      },
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 向 Asset 添加 Autograph 代码示例

{% dialect-switcher title="向 MPL Core Asset 添加 Autograph" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
// The new autograph that you want to add
const newAutograph = {
  address: umi.identity.publicKey,
  message: "your message"
}
// Add the new autograph to the existing signatures array
const updatedAutographs = [...asset.autograph.signatures, newAutograph]
await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Autograph',
    // This should contain all autographs that you do not want to remove
    signatures: updatedAutographs,
  },
  authority: umi.identity,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 从 Asset 删除 Autograph 代码示例

{% dialect-switcher title="从 MPL Core Asset 删除 Autograph" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
// The Publickey of the autograph that you want to remove
const publicKeyToRemove = publicKey("abc...")
const autographsToKeep = asset.autograph.signatures.filter(
  (autograph) => autograph.address !== publicKeyToRemove
);
await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Autograph',
    // This should contain all Autographs that you do not want to remove
    signatures: autographsToKeep,
  },
  authority: umi.identity, // Should be the owner of the asset
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 向 Collection 添加 autograph 插件代码示例

{% dialect-switcher title="向 Collection 添加 autograph 插件" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { addCollectionPlugin } from '@metaplex-foundation/mpl-core'
await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: 'Autograph',
        signatures: [
      {
        address: umi.identity.publicKey,
        message: 'Your Message',
      },
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 常见错误

### `Plugin not added`

在任何人可以添加签名之前，所有者必须先添加 Autograph 插件。

### `Autograph already exists`

此地址已经签署了此 Asset。每个地址只能添加一个签名。

### `Cannot remove own autograph`

签名者无法删除自己的签名（除非他们同时是所有者或签名委托人）。

## 注意事项

- 插件启用后，任何人都可以添加他们的签名
- 只有所有者或签名委托人可以删除签名
- 签名者无法删除自己的签名
- Asset 从其 Collection 继承签名
- 每个地址每个 Asset 只能签名一次

## 快速参考

### 权限矩阵

| 操作 | 所有者 | 任何人 | 签名者 |
|--------|-------|--------|-------------|
| 添加插件 | ✅ | ❌ | ❌ |
| 添加自己的签名 | ✅ | ✅ | ✅ |
| 删除任何签名 | ✅ | ❌ | ❌ |
| 删除自己的签名 | ✅（作为所有者） | ❌ | ❌ |

### Autograph 生命周期

| 步骤 | 操作 | 谁 |
|------|--------|-----|
| 1 | 添加 Autograph 插件 | 所有者 |
| 2 | 添加签名 | 任何人 |
| 3 | 删除签名（可选） | 仅所有者 |

## 常见问题

### 这与 Verified Creators 有什么不同？

Verified Creators 用于证明创作者身份，由更新权限者管理。Autograph 用于任何人的可收藏签名（就像在活动中获得签名一样）。

### 可以添加多个签名吗？

不可以。每个地址每个 Asset 只能添加一个签名。尝试从同一地址添加第二个签名将失败。

### 我可以删除自己的签名吗？

不可以。只有所有者或签名委托人可以删除签名。这防止了有人签名后立即删除。

### 添加签名需要所有者的许可吗？

不需要。一旦所有者启用了 Autograph 插件，任何人都可以添加他们的签名。所有者不需要批准单个签名。

### Asset 转移后签名会怎样？

签名会保留在 Asset 上。它们是谁签名的永久记录，不受所有权变更的影响。

## 术语表

| 术语 | 定义 |
|------|------------|
| **Autograph** | 添加到 Asset 的带可选消息的签名 |
| **签名者** | 添加了自己签名的地址 |
| **Autograph 委托人** | 有权删除签名的地址 |
| **Signatures 数组** | Asset 上所有签名的列表 |
| **所有者管理** | 所有者控制添加的插件类型 |

## 相关插件

- [Verified Creators](/smart-contracts/core/plugins/verified-creators) - 证明创作者身份（权限管理）
- [Attributes](/smart-contracts/core/plugins/attribute) - 存储链上数据
- [ImmutableMetadata](/smart-contracts/core/plugins/immutableMetadata) - 永久锁定元数据
