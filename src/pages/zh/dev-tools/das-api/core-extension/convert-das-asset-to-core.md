---
title: 从标准 DAS Asset 转换为 Core Asset 或 Collection 类型
metaTitle: 将标准 DAS 转换为 Core 类型 | DAS API Core 扩展
description: 将 DAS Assets 转换为 Core Asset 或 Collection
---

如果您不仅使用 Core 资产，还使用其他资产如 Token Metadata，在使用 `@metaplex-foundation/digital-asset-standard-api` 获取数据时，直接访问转换助手以及其他 DAS 资产类型可能会很有用。

## 转换为 Asset 示例

以下示例展示：
1. 如何使用标准 DAS API 包获取 DAS Assets。
2. 过滤 Assets 以仅保留 Core Assets
3. 将所有标准 Assets 转换为 Core Assets

```js
// ... @metaplex-foundation/digital-asset-standard-api 的标准设置

const dasAssets = await umi.rpc.getAssetsByOwner({ owner: publicKey('<pubkey>') });

// 仅过滤出 core assets
const dasCoreAssets = assets.items.filter((a) => a.interface === 'MplCoreAsset')

// 将它们转换为 AssetV1 类型（实际上是 AssetResult 类型，它还将从 DAS 填充 content 字段）
const coreAssets = await das.dasAssetsToCoreAssets(umi, dasCoreAssets)
```

## 转换为 Collection 示例

以下示例展示：
1. 如何使用标准 DAS API 包获取 DAS Collections。
2. 过滤 Assets 以仅保留 Core Assets
3. 将所有标准 Assets 转换为 Core Assets

```js
// ... @metaplex-foundation/digital-asset-standard-api 的标准设置

const dasAssets = await umi.rpc.getAssetsByOwner({ owner: publicKey('<pubkey>') });

// 仅过滤出 core assets
const dasCoreAssets = assets.items.filter((a) => a.interface === 'MplCoreCollection')

// 将它们转换为 AssetV1 类型（实际上是 AssetResult 类型，它还将从 DAS 填充 content 字段）
const coreAssets = await das.dasAssetsToCoreAssets(umi, dasCoreAssets)
```
