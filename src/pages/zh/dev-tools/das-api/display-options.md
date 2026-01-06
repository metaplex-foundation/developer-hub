---
title: 显示选项
metaTitle: 显示选项 | DAS API
description: 了解 DAS API 方法中可用的显示选项
---

DAS API 提供显示选项，允许您控制响应中包含哪些附加信息。这些选项作为 `options` 对象参数在多个 API 方法中可用。

## 可用的显示选项

| 选项 | 类型 | 描述 | 默认值 |
|--------|------|-------------|---------|
| `showCollectionMetadata` | boolean | 当为 `true` 时，在响应中包含集合元数据。这提供有关资产所属集合的信息。 | `false` |
| `showFungible` | boolean | 当为 `true` 时，在响应中包含同质化代币信息。这对于表示同质化代币的资产或如果您想要 `getAssetsByOwner` 并实际查看所有资产非常有用。 | `false` |
| `showInscription` | boolean | 当为 `true` 时，在响应中包含铭文数据。这提供有关与所包含资产相关的任何铭文的信息。 | `false` |
| `showUnverifiedCollections` | boolean | 当为 `true` 时，在响应中包含未验证的集合。默认情况下，仅显示已验证的集合。 | `false` |
| `showZeroBalance` | boolean | 当为 `true` 时，在响应中包含余额为零的代币账户。默认情况下，仅显示余额非零的账户。 | `false` |

## 使用示例

### 基本用法

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

// 获取带有集合元数据的资产
const asset = await umi.rpc.getAsset({
  id: publicKey('your-asset-id'),
  displayOptions: {
    showCollectionMetadata: true
  }
})
```

### 多个选项

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

// 获取启用多个显示选项的资产
const assets = await umi.rpc.getAssetsByOwner({
  owner: publicKey('owner-address'),
  displayOptions: {
    showCollectionMetadata: true,
    showFungible: true,
    showInscription: true
  }
})
```

### 启用所有选项

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

// 启用所有显示选项
const assets = await umi.rpc.searchAssets({
  owner: publicKey('owner-address'),
  displayOptions: {
    showCollectionMetadata: true,
    showFungible: true,
    showInscription: true,
    showUnverifiedCollections: true,
    showZeroBalance: true
  }
})
```

## 支持显示选项的方法

以下 DAS API 方法支持带有显示选项的 `options` 参数：

- [获取资产](/zh/dev-tools/das-api/methods/get-asset)
- [获取资产列表](/zh/dev-tools/das-api/methods/get-assets)
- [按所有者获取资产](/zh/dev-tools/das-api/methods/get-assets-by-owner)
- [按创建者获取资产](/zh/dev-tools/das-api/methods/get-assets-by-creator)
- [按权限获取资产](/zh/dev-tools/das-api/methods/get-assets-by-authority)
- [按组获取资产](/zh/dev-tools/das-api/methods/get-assets-by-group)
- [搜索资产](/zh/dev-tools/das-api/methods/search-assets)

## 性能考虑

启用显示选项可能会增加响应大小和处理时间。仅启用您特定用例所需的选项以优化性能。
