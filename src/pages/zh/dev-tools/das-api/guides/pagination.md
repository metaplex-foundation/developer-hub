---
title: DAS API 请求分页
metaTitle: 分页 | DAS API
description: 了解如何高效地对 DAS API 请求进行分页
---

数字资产标准（DAS）API 通常每次请求限制为 10,000 条记录。当您需要检索更多数据时，分页变得至关重要。本指南涵盖了可用的分页方法以及高效实现它们的最佳实践。

## 理解排序选项

在深入了解分页之前，了解可用的排序选项很重要，因为它们会影响您如何对结果进行分页：

- `id`（默认）：按二进制 ID 对资产进行排序
- `created`：按创建时间戳排序
- `recentAction`：按最后更新时间戳排序
- `none`：不应用排序（不推荐用于分页）

除了排序选项，您还可以使用 `sortDirection` 参数 `asc` 或 `desc` 按升序或降序对结果进行排序。

## 分页方法

## 基于页码的分页（推荐初学者使用）

基于页码的分页是最容易实现和理解的方法。它非常适合初学者和大多数常见用例。

### 工作原理

- 指定页码和每页项目数
- 通过递增页码来浏览结果

### 关键参数

- `page`：当前页码（从 1 开始）
- `limit`：每页项目数（通常最大 10,000）
- `sortBy`：排序选项

### 注意事项

- 实现和理解简单
- 适用于大多数常见用例
- 大页码时性能可能会下降

{% totem %}
{% totem-accordion title="UMI 示例" %}

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

async function getAllAssetsByPage(collectionAddress: string) {
  const limit = 1000
  let page = 1
  let allAssets: any[] = []
  let hasMore = true

  while (hasMore) {
    console.log(`正在获取第 ${page} 页...`)

    const assets = await umi.rpc.getAssetsByGroup({
      groupKey: 'collection',
      groupValue: collectionAddress,
      limit: limit,
      page: page,
      sortBy: {
        sortBy: 'created',
        sortDirection: 'desc'
      }
    })

    if (assets.items.length === 0) {
      hasMore = false
    } else {
      allAssets = [...allAssets, ...assets.items]
      page++

      // 安全检查以防止无限循环
      if (page > 100) {
        console.log('达到最大页数限制')
        break
      }
    }
  }

  console.log(`检索到的总资产数: ${allAssets.length}`)
  return allAssets
}

// 使用示例
const collectionAssets = await getAllAssetsByPage('J1S9H3QjnRtBbbuD4HjPV6RpRhwuk4zKbxsnCHuTgh9w')
```

{% /totem-accordion %}
{% /totem %}

{% totem %}
{% totem-accordion title="JavaScript 示例" %}

```javascript
const url = '<ENDPOINT>'

async function getAllAssetsByPage(collectionAddress) {
  let page = 1
  let allAssets = []
  let hasMore = true

  while (hasMore) {
    console.log(`正在获取第 ${page} 页...`)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'my-id',
        method: 'getAssetsByGroup',
        params: {
          groupKey: 'collection',
          groupValue: collectionAddress,
          page: page,
          limit: 1000,
          sortBy: { sortBy: 'created', sortDirection: 'desc' },
        },
      }),
    })

    const { result } = await response.json()

    if (result.items.length === 0) {
      hasMore = false
    } else {
      allAssets = [...allAssets, ...result.items]
      page++

      // 安全检查
      if (page > 100) {
        console.log('达到最大页数限制')
        break
      }
    }
  }

  console.log(`检索到的总资产数: ${allAssets.length}`)
  return allAssets
}

// 使用示例
const collectionAssets = await getAllAssetsByPage('J1S9H3QjnRtBbbuD4HjPV6RpRhwuk4zKbxsnCHuTgh9w')
```

{% /totem-accordion %}
{% /totem %}

## 基于游标的分页（推荐高级用户使用）

对于更大的数据集或性能至关重要的场景，基于游标的分页提供更好的效率，是生产应用程序的推荐方法。

### 工作原理

- 使用游标字符串来跟踪位置
- 每个响应都会返回游标值
- 将游标传递给下一个请求以获取下一页
- 非常适合顺序数据遍历

### 关键参数

- `cursor`：下一组结果的位置标记
- `limit`：每页项目数（最大 10,000）
- `sortBy`：基于游标的分页必须设置为 `id`

{% totem %}
{% totem-accordion title="UMI 示例" %}

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

async function getAllAssetsByCursor(collectionAddress: string) {
  const limit = 1000
  let allAssets: any[] = []
  let cursor: string | undefined

  do {
    console.log(`使用游标获取批次: ${cursor || '初始'}`)

    const response = await umi.rpc.searchAssets({
      grouping: {
        key: 'collection',
        value: collectionAddress
      },
      limit: limit,
      cursor: cursor,
      sortBy: {
        sortBy: 'id',
        sortDirection: 'asc'
      }
    })

    allAssets = [...allAssets, ...response.items]
    cursor = response.cursor

    console.log(`获取了 ${response.items.length} 个项目，总计: ${allAssets.length}`)

  } while (cursor !== undefined)

  console.log(`检索到的总资产数: ${allAssets.length}`)
  return allAssets
}

// 使用示例
const collectionAssets = await getAllAssetsByCursor('COLLECTION_ADDRESS')
```

{% /totem-accordion %}
{% /totem %}

{% totem %}
{% totem-accordion title="JavaScript 示例" %}

```javascript
const url = '<ENDPOINT>'

async function getAllAssetsByCursor(collectionAddress) {
  let allAssets = []
  let cursor

  do {
    console.log(`使用游标获取批次: ${cursor || '初始'}`)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'my-id',
        method: 'searchAssets',
        params: {
          grouping: ['collection', collectionAddress],
          limit: 1000,
          cursor: cursor,
          sortBy: { sortBy: 'id', sortDirection: 'asc' },
        },
      }),
    })

    const { result } = await response.json()

    allAssets = [...allAssets, ...result.items]
    cursor = result.cursor

    console.log(`获取了 ${result.items.length} 个项目，总计: ${allAssets.length}`)

  } while (cursor !== undefined)

  console.log(`检索到的总资产数: ${allAssets.length}`)
  return allAssets
}

// 使用示例
const collectionAssets = await getAllAssetsByCursor('COLLECTION_ADDRESS')
```

{% /totem-accordion %}
{% /totem %}

## 性能比较

| 方法 | 复杂度 | 性能 | 用例 |
|--------|------------|-------------|----------|
| 基于页码 | 低 | 小数据集表现良好 | 初学者、简单应用 |
| 基于游标 | 中 | 优秀 | 生产应用、大数据集 |
| 基于范围 | 高 | 优秀 | 高级查询、并行处理 |

## 最佳实践

### 选择正确的方法
- **使用基于页码的分页** 用于简单用例和初学者
- **使用基于游标的分页** 用于生产应用和大型集合
- **使用基于范围的分页** 用于高级查询模式

### 错误处理
- 始终检查空结果集
- 为失败的请求实现重试逻辑
- 适当处理速率限制
- 添加安全检查以防止无限循环

### 性能优化
- 跟踪最后处理的项目
- 实现适当的缓存策略，但请记住数据（特别是证明）可能会快速变化
- 使用适当的排序方法
- 考虑为长时间运行的操作实现检查点

### 数据一致性
- 分页时始终使用排序
- 在请求之间保持一致的排序参数

## 结论

选择正确的分页策略取决于您的具体用例：

- **对于初学者和简单应用**：使用基于页码的分页
- **对于生产应用**：使用基于游标的分页
- **对于高级用例**：使用基于范围的分页

基于游标的分页通常是大多数应用程序的最佳选择，因为它提供出色的性能且实现相对简单。基于页码的分页非常适合学习和简单用例，而基于范围的分页为高级场景提供最大的灵活性。

## 延伸阅读

- [获取集合中的所有代币](/zh/dev-tools/das-api/guides/get-collection-nfts) - 从特定集合检索所有资产
- [按条件搜索资产](/zh/dev-tools/das-api/guides/search-by-criteria) - 高级搜索和过滤
- [查找压缩 NFT](/zh/dev-tools/das-api/guides/find-compressed-nfts) - 使用压缩 NFT
