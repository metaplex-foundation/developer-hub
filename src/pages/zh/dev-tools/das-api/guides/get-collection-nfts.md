---
title: 获取集合中的所有代币
metaTitle: 获取集合中的所有代币 | DAS API 指南
description: 了解如何检索属于特定集合的所有数字资产
---

本指南展示如何使用 DAS API 检索属于特定集合的所有数字资产（NFT、代币）。这对于构建集合浏览器、分析仪表板或市场功能非常有用。

## 方法 1：使用按组获取资产（推荐）

`getAssetsByGroup` 方法专为查找属于特定集合的资产而设计。

{% totem %}
{% totem-accordion title="UMI 示例" %}

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
const umi = createUmi('<ENDPOINT>').use(dasApi())

// 获取特定集合中的所有资产
const collectionAssets = await umi.rpc.getAssetsByGroup({
  groupKey: 'collection',
  groupValue: '<COLLECTION_ADDRESS>'
})

console.log(`在集合中找到 ${collectionAssets.items.length} 个资产`)
console.log(`总计: 可用 ${collectionAssets.total} 个资产`)

// 处理每个资产
collectionAssets.items.forEach(asset => {
  console.log(`资产 ID: ${asset.id}`)
  console.log(`名称: ${asset.content.metadata?.name || '未知'}`)
  console.log(`接口: ${asset.interface}`)
  console.log(`所有者: ${asset.ownership.owner}`)
  console.log('---')
})

})()
```

{% /totem-accordion %}
{% totem-accordion title="JavaScript 示例" %}

```javascript
(async () => {
const response = await fetch('<ENDPOINT>', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getAssetsByGroup',
      params: {
        groupKey: 'collection',
        groupValue: '<COLLECTION_ADDRESS>'
      }
    })
  })

  const data = await response.json()
  console.log(`在集合中找到 ${data.result.items.length} 个资产`)
})()
```
{% /totem-accordion %}
{% totem-accordion title="cURL 示例" %}
```bash
curl -X POST <ENDPOINT> \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getAssetsByGroup",
    "params": {
      "groupKey": "collection",
      "groupValue": "COLLECTION_ADDRESS"
    }
  }'
```

{% /totem-accordion %}
{% /totem %}

## 方法 2：使用带集合过滤器的搜索资产

您也可以使用带有集合分组的 `searchAssets` 进行更具体的查询。有关更多信息，请参阅[按条件搜索资产](/zh/dev-tools/das-api/guides/search-by-criteria)。

{% totem %}
{% totem-accordion title="UMI 示例" %}

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(dasApi())

  // 使用附加过滤器搜索集合中的所有资产
  const allCollectionNfts = await umi.rpc.searchAssets({
    grouping: ['collection', '<COLLECTION_ADDRESS>'],
    // 可选：DAS 通常返回 10,000 个资产
    limit: 1000,
    // 可选：在每个资产中显示集合元数据
    displayOptions: {
      showCollectionMetadata: true
    }
  });

  console.log(`找到 ${allCollectionNfts.items.length} 个资产`)
})();
```

{% /totem-accordion %}
{% totem-accordion title="JavaScript 示例" %}

```javascript
(async () => {
  const response = await fetch('<ENDPOINT>', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'searchAssets',
      params: {
        grouping: ['collection', '<COLLECTION_ADDRESS>'],
        limit: 1000,
        options: {
          showCollectionMetadata: true,
        }
      }
    })
  })

  const data = await response.json()
  console.log(`找到 ${data.result.items.length} 个资产`)
})();
```

{% /totem-accordion %}
{% /totem %}

## 方法 3：排序集合资产

您可以按各种条件对集合资产进行排序：

{% totem %}
{% totem-accordion title="UMI 示例" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(dasApi())

  // 按创建日期排序获取集合资产（最新优先）
  const newestAssets = await umi.rpc.getAssetsByGroup({
    groupKey: 'collection',
    groupValue: 'COLLECTION_ADDRESS',
    limit: 1000,
    sortBy: {
      sortBy: 'created',
      sortDirection: 'desc'
    },
    displayOptions: {
      showCollectionMetadata: true
    }
  })

  // 按名称排序获取集合资产
  const nameSortedAssets = await umi.rpc.getAssetsByGroup({
    groupKey: 'collection',
    groupValue: 'COLLECTION_ADDRESS',
    limit: 1000,
    sortBy: {
      sortBy: 'name',
      sortDirection: 'asc'
    },
    displayOptions: {
      showCollectionMetadata: true
    }
  })

  console.log('最新资产优先:')
  newestAssets.items.slice(0, 5).forEach(asset => {
    console.log(`${asset.content.metadata?.name} - ID: ${asset.id}`)
  })
})();
```
{% /totem-accordion %}
{% totem-accordion title="JavaScript 示例" %}

```javascript
(async () => {
  // 按创建日期排序获取集合资产（最新优先）
  const newestResponse = await fetch('<ENDPOINT>', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getAssetsByGroup',
      params: {
        groupKey: 'collection',
        groupValue: 'COLLECTION_ADDRESS',
        limit: 1000,
        sortBy: {
          sortBy: 'created',
          sortDirection: 'desc'
        },
        options: {
          showCollectionMetadata: true
        }
      }
    })
  })

  const newestData = await newestResponse.json()
  const newestAssets = newestData.result

  // 按名称排序获取集合资产
  const nameResponse = await fetch('<ENDPOINT>', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getAssetsByGroup',
      params: {
        groupKey: 'collection',
        groupValue: 'COLLECTION_ADDRESS',
        limit: 1000,
        sortBy: {
          sortBy: 'name',
          sortDirection: 'asc'
        },
        options: {
          showCollectionMetadata: true
        }
      }
    })
  })

  const nameData = await nameResponse.json()
  const nameSortedAssets = nameData.result

  console.log('最新资产优先:')
  newestAssets.items.slice(0, 5).forEach(asset => {
    console.log(`${asset.content.metadata?.name} - ID: ${asset.id}`)
  })
})();
```
{% /totem-accordion %}
{% /totem %}

## 常见用例

- **集合浏览器**：显示集合中的所有资产，支持过滤和排序。
- **市场集成**：显示特定集合中的可用资产。
- **分析仪表板**：追踪集合统计数据和所有权分布。
- **游戏应用**：加载游戏集合中的所有资产。

## 提示和最佳实践

1. **使用[分页](/zh/dev-tools/das-api/guides/pagination)** 处理大型集合以避免速率限制
2. **在可能时缓存结果** 以提高性能
3. **包含[显示选项](/zh/dev-tools/das-api/guides/display-options)** 以获取额外的元数据
4. **对结果进行排序** 以有意义的方式呈现数据
5. **优雅地处理错误** 当集合地址无效时

## 后续步骤

- [按创建者获取资产](/zh/dev-tools/das-api/methods/get-assets-by-creator) - 发现特定钱包创建的所有代币
- [获取钱包中的所有代币](/zh/dev-tools/das-api/guides/get-wallet-tokens) - 查看钱包拥有的所有内容
- [按多条件搜索资产](/zh/dev-tools/das-api/guides/search-by-criteria) - 组合多个过滤器进行高级查询
