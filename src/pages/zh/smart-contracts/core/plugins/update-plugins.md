---
title: 更新插件
metaTitle: 更新插件 | Core
description: 了解如何使用 updatePlugin 函数更新 MPL Core 资产和集合上的现有插件。
---

MPL Core 资产和集合上的许多插件可以在添加后进行更新。`updatePlugin` 函数允许您修改插件数据，例如更改属性、更新版税或修改冻结状态。

{% totem %}
{% totem-accordion title="技术指令详情" %}

**指令账户列表**

| 账户           | 描述                                     |
| ------------- | ----------------------------------------------- |
| asset         | MPL Core 资产的地址。              |
| collection    | Core 资产所属的集合。 |
| payer         | 支付存储费用的账户。        |
| authority     | 具有更新权限的所有者或委托。  |
| systemProgram | System Program 账户。                     |
| logWrapper    | SPL Noop Program。                           |

**指令参数**

| 参数   | 描述                            |
| ------ | -------------------------------------- |
| plugin | 要更新的插件类型和数据。 |

在我们的 SDK 中，某些账户/参数可能会被抽象化和/或设为可选，以便于使用。
有关详细的 TypeDoc 文档，请参阅：
- [updatePlugin](https://mpl-core.typedoc.metaplex.com/functions/updatePlugin.html)
- [updateCollectionPlugin](https://mpl-core.typedoc.metaplex.com/functions/updateCollectionPlugin.html)

注意：在 JavaScript SDK 中，updatePlugin 期望插件数据没有 data 包装器（例如，`{ type: 'FreezeDelegate', frozen: true }`）。相比之下，addPlugin 将数据包装在 `data` 下（例如，`{ type: 'FreezeDelegate', data: { frozen: true } }`）。这与 createAsset/createCollection 插件列表中使用的形状相对应。

{% /totem-accordion %}
{% /totem %}

## 更新资产上的插件

### 基本插件更新示例

以下是如何使用 Attributes 插件作为示例更新 MPL Core 资产上的插件：

{% dialect-switcher title="更新资产上的插件" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

(async () => {
  const assetAddress = publicKey('11111111111111111111111111111111')

  // 获取当前资产以查看现有插件数据
  const asset = await fetchAsset(umi, assetAddress, {
    skipDerivePlugins: false,
  })

  // 使用新数据更新 Attributes 插件
  await updatePlugin(umi, {
    asset: assetAddress,
    plugin: {
      type: 'Attributes',
      attributeList: [
        { key: 'level', value: '5' },        // 更新的值
        { key: 'rarity', value: 'legendary' }, // 新属性
        { key: 'power', value: '150' },      // 新属性
      ],
    },
  }).sendAndConfirm(umi)
})();
```

{% /dialect %}
{% /dialect-switcher %}

### 更新版税插件

{% dialect-switcher title="更新版税插件" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, ruleSet } from '@metaplex-foundation/mpl-core'

(async () => {
  const assetAddress = publicKey('11111111111111111111111111111111')
  const creator1 = publicKey('22222222222222222222222222222222')
  const creator2 = publicKey('33333333333333333333333333333333')

  await updatePlugin(umi, {
    asset: assetAddress,
    plugin: {
      type: 'Royalties',
      basisPoints: 750, // 从 500 更新到 750 (7.5%)
      creators: [
        { address: creator1, percentage: 70 }, // 更新的分配
        { address: creator2, percentage: 30 },
      ],
      ruleSet: ruleSet('ProgramAllowList', [
        [
          publicKey('44444444444444444444444444444444'),
          publicKey('55555555555555555555555555555555'),
        ],
      ]),
    },
  }).sendAndConfirm(umi)
})();
```

{% /dialect %}
{% /dialect-switcher %}

### 更新基于状态的插件

一些插件存储可以切换的简单状态，例如冻结委托插件：

{% dialect-switcher title="更新冻结状态" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin } from '@metaplex-foundation/mpl-core'

(async () => {
  const assetAddress = publicKey('11111111111111111111111111111111')

  // 冻结资产
  await updatePlugin(umi, {
    asset: assetAddress,
    plugin: {
      type: 'FreezeDelegate',
      frozen: true, // 设置为 true 冻结，false 解冻
    },
  }).sendAndConfirm(umi)

  // 稍后，解冻资产
  await updatePlugin(umi, {
    asset: assetAddress,
    plugin: {
      type: 'FreezeDelegate',
      frozen: false, // 解冻资产
    },
  }).sendAndConfirm(umi)
})();
```

{% /dialect %}
{% /dialect-switcher %}

## 更新集合上的插件

集合插件的工作方式与资产插件类似，但使用 `updateCollectionPlugin` 函数：

{% dialect-switcher title="更新集合上的插件" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updateCollectionPlugin, ruleSet } from '@metaplex-foundation/mpl-core'

(async () => {
  const collectionAddress = publicKey('11111111111111111111111111111111')
  const creator1 = publicKey('22222222222222222222222222222222')
  const creator2 = publicKey('33333333333333333333333333333333')

  // 更新集合范围的版税
  await updateCollectionPlugin(umi, {
    collection: collectionAddress,
    plugin: {
      type: 'Royalties',
      basisPoints: 600, // 集合的 6% 版税
      creators: [
        { address: creator1, percentage: 80 },
        { address: creator2, percentage: 20 },
      ],
      ruleSet: ruleSet('None'),
    },
  }).sendAndConfirm(umi)
})();
```

{% /dialect %}
{% /dialect-switcher %}

## 处理复杂的插件数据

### 管理插件中的列表

一些插件如 Autograph 和 Verified Creators 维护数据列表。更新这些插件时，您需要传递要保留的完整列表：

{% dialect-switcher title="更新基于列表的插件" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

(async () => {
  const assetAddress = publicKey('11111111111111111111111111111111')

  // 首先，获取当前资产以查看现有签名
  const asset = await fetchAsset(umi, assetAddress, {
    skipDerivePlugins: false,
  })

  // 添加新签名同时保留现有签名
  const newAutograph = {
    address: umi.identity.publicKey,
    message: "Amazing NFT! Signed by collector."
  }

  // 包含所有现有签名加上新签名
  const updatedAutographs = [...asset.autograph.signatures, newAutograph]

  await updatePlugin(umi, {
    asset: assetAddress,
    plugin: {
      type: 'Autograph',
      signatures: updatedAutographs, // 包含新添加的完整列表
    },
    authority: umi.identity,
  }).sendAndConfirm(umi)
})();
```

{% /dialect %}
{% /dialect-switcher %}

### 从列表中移除项目

{% dialect-switcher title="从插件列表中移除项目" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

(async () => {
  const assetAddress = publicKey('11111111111111111111111111111111')
  const autographToRemove = publicKey('44444444444444444444444444444444')

  // 获取当前资产数据
  const asset = await fetchAsset(umi, assetAddress, {
    skipDerivePlugins: false,
  })

  // 过滤掉我们要移除的签名
  const filteredAutographs = asset.autograph.signatures.filter(
    (autograph) => autograph.address !== autographToRemove
  )

  await updatePlugin(umi, {
    asset: assetAddress,
    plugin: {
      type: 'Autograph',
      signatures: filteredAutographs, // 不包含已移除项目的列表
    },
    authority: umi.identity,
  }).sendAndConfirm(umi)
})();
```

{% /dialect %}
{% /dialect-switcher %}

## 权限要求

不同的插件需要不同的权限来更新：

- **权限管理的插件**（Royalties、Attributes、Update Delegate）：需要资产或集合的**权限**
- **所有者管理的插件**（Autograph、Freeze Delegate）：需要资产的**所有者**或插件的特定权限
- **Verified Creators 插件**：需要**更新权限**来添加/移除创作者，但单个**创作者可以自行验证**

## 错误处理

更新插件时的常见错误：

- **权限不匹配**：确保您使用正确的权限为插件类型签名
- **找不到插件**：插件必须在资产/集合上存在才能更新
- **无效数据**：插件数据必须符合预期的结构和约束
- **集合不匹配**：如果资产是集合的一部分，您可能需要在更新中包含集合

## 最佳实践

1. **更新前获取**：始终获取当前资产/集合状态以查看现有插件数据
2. **保留现有数据**：更新基于列表的插件时，包含您要保留的现有数据
3. **使用正确的权限**：确保您为每种插件类型使用正确的签名权限
4. **批量更新**：如果更新多个插件，请考虑批处理操作以提高效率
5. **验证数据**：确保您的更新数据满足插件的要求（例如，创作者百分比总和为 100%）

## 后续步骤

- 在单个插件文档中了解特定的插件更新
- 探索[插件概述](/zh/smart-contracts/core/plugins)了解所有可用的插件
- 查看[添加插件](/zh/smart-contracts/core/plugins/adding-plugins)和[移除插件](/zh/smart-contracts/core/plugins/removing-plugins)
- 访问 [MPL Core TypeDoc](https://mpl-core.typedoc.metaplex.com) 获取详细的 API 文档。
