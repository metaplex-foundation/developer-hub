---
title: Autograph 插件
metaTitle: Autograph 插件 | Metaplex Core
description: 了解如何向 Core NFT 资产添加签名和消息。创建来自艺术家、名人或社区成员的可收藏签名。
---

**Autograph 插件**允许任何人向资产或集合添加他们的签名和消息。非常适合来自艺术家、名人或社区成员的可收藏签名。 {% .lead %}

{% callout title="您将学到" %}

- 在资产和集合上启用签名
- 向资产添加您的签名
- 作为所有者移除签名
- 了解签名权限

{% /callout %}

## 概述

**Autograph** 插件是一个所有者管理的插件，存储带有消息的签名。一旦启用，任何人都可以添加他们的签名。所有者可以移除任何签名。

- 所有者添加插件（或在铸造时由 update authority 添加）
- 任何人都可以添加自己的签名
- 只有所有者/委托可以移除签名
- 签名者不能移除自己的签名
- 资产从集合继承签名

## 范围之外

创作者验证（使用 [Verified Creators](/zh/smart-contracts/core/plugins/verified-creators)）、版税和自动签名验证。

## 快速开始

**跳转到：** [添加插件](#向资产添加-autograph-插件代码示例) · [添加签名](#向资产添加签名代码示例) · [移除签名](#从资产移除签名代码示例)

1. 所有者添加 Autograph 插件以启用签名
2. 任何人都可以使用 `updatePlugin` 添加他们的签名
3. 所有者可以移除任何签名

{% callout type="note" title="Autograph vs Verified Creators" %}

| 功能 | Autograph | Verified Creators |
|------|-----------|-------------------|
| 谁可以签名 | 任何人 | 仅列出的创作者 |
| 启用权限 | 所有者 | Update authority |
| 自我移除 | 不能 | 可以取消验证自己 |
| 目的 | 可收藏的签名 | 证明创作者身份 |
| 最适合 | 粉丝互动、活动 | 团队归属 |

**使用 Autograph** 用于可收藏的签名（如签名纪念品）。
**使用 [Verified Creators](/zh/smart-contracts/core/plugins/verified-creators)** 用于证明谁创建了资产。

{% /callout %}

## 常见用例

- **名人签名**：艺术家在活动中签署 NFT
- **粉丝互动**：社区成员签署限量版
- **认证**：实物物品创作者签署数字孪生
- **活动纪念品**：会议演讲者签署活动 NFT
- **慈善拍卖**：多位名人签署慈善 NFT

要添加签名，必须满足一些条件：

- autograph 插件必须已经添加
- 签名者只能添加自己的地址
- 必须使用 `updatePlugin` 函数传递现有列表以及添加的签名
- 该签名者尚未有现有的签名

{% callout type="note" %}
一旦所有者添加了 autograph 插件，每个人都可以添加他们的签名。所有者可以随时将其移除。
{% /callout %}

## 适用于

|                     |     |
| ------------------- | --- |
| MPL Core 资产       | ✅  |
| MPL Core 集合       | ✅  |

资产从集合继承 Autograph。

## 参数

`autograph` 插件在 `signatures` 数组中需要以下参数：

| 参数     | 值        |
| ------- | --------- |
| address | publicKey |
| message | string    |

## 向资产添加 autograph 插件代码示例

{% dialect-switcher title="作为所有者向 MPL Core 资产添加 Autograph 插件" %}
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

## 向资产添加签名代码示例

{% dialect-switcher title="向 MPL Core 资产添加 Autograph" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

// 您要添加的新签名
const newAutograph = {
  address: umi.identity.publicKey,
  message: "your message"
}

// 将新签名添加到现有 signatures 数组
const updatedAutographs = [...asset.autograph.signatures, newAutograph]

await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Autograph',
    // 这应该包含您不想移除的所有签名
    signatures: updatedAutographs,
  },
  authority: umi.identity,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 从资产移除签名代码示例

{% dialect-switcher title="从 MPL Core 资产移除 Autograph" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

// 您要移除的签名的公钥
const publicKeyToRemove = publicKey("abc...")

const autographsToKeep = asset.autograph.signatures.filter(
  (autograph) => autograph.address !== publicKeyToRemove
);

await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Autograph',
    // 这应该包含您不想移除的所有签名
    signatures: autographsToKeep,
  },
  authority: umi.identity, // 应该是资产的所有者
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 向集合添加 autograph 插件代码示例

{% dialect-switcher title="向集合添加 autograph 插件" %}
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

所有者必须先添加 Autograph 插件，然后任何人才能添加签名。

### `Autograph already exists`

此地址已经签署了此资产。每个地址只能添加一个签名。

### `Cannot remove own autograph`

签名者不能移除自己的签名（除非他们也是所有者或 autograph 委托）。

## 注意事项

- 插件启用后任何人都可以添加他们的签名
- 只有所有者或 autograph 委托可以移除签名
- 签名者不能移除自己的签名
- 资产从集合继承签名
- 每个地址每个资产只能签名一次

## 快速参考

### 权限矩阵

| 操作 | 所有者 | 任何人 | 签名者 |
|------|--------|--------|--------|
| 添加插件 | ✅ | ❌ | ❌ |
| 添加自己的签名 | ✅ | ✅ | ✅ |
| 移除任何签名 | ✅ | ❌ | ❌ |
| 移除自己的签名 | ✅（作为所有者） | ❌ | ❌ |

### 签名生命周期

| 步骤 | 操作 | 谁 |
|------|------|-----|
| 1 | 添加 Autograph 插件 | 所有者 |
| 2 | 添加签名 | 任何人 |
| 3 | 移除签名（可选） | 仅所有者 |

## 常见问题

### 这与 Verified Creators 有什么不同？

Verified Creators 用于证明创作者身份，由 update authority 管理。Autograph 用于从任何人那里收集可收藏的签名（就像在活动中获得签名一样）。

### 我可以添加多个签名吗？

不可以。每个地址每个资产只能添加一个签名。尝试从同一地址添加第二个签名将失败。

### 我可以移除自己的签名吗？

不可以。只有所有者或 autograph 委托可以移除签名。这可以防止有人签名后立即将其移除。

### 添加签名需要所有者的许可吗？

不需要。一旦所有者启用了 Autograph 插件，任何人都可以添加他们的签名。所有者不需要批准单独的签名。

### 资产转移后签名会怎样？

签名保留在资产上。它们是谁签名的永久记录，不受所有权变更的影响。

## 术语表

| 术语 | 定义 |
|------|------|
| **Autograph** | 添加到资产的带有可选消息的签名 |
| **Autographer** | 添加了签名的地址 |
| **Autograph Delegate** | 有权移除签名的地址 |
| **Signatures Array** | 资产上所有签名的列表 |
| **Owner Managed** | 所有者控制添加的插件类型 |

## 相关插件

- [Verified Creators](/zh/smart-contracts/core/plugins/verified-creators) - 证明创作者身份（authority 管理）
- [Attributes](/zh/smart-contracts/core/plugins/attribute) - 存储链上数据
- [ImmutableMetadata](/zh/smart-contracts/core/plugins/immutableMetadata) - 永久锁定元数据

---

*由 Metaplex Foundation 维护 · 最后验证于 2026 年 1 月 · 适用于 @metaplex-foundation/mpl-core*
