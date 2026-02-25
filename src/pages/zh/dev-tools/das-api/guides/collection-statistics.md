---
title: 分析集合统计数据
metaTitle: 分析集合统计数据 | DAS API 指南
description: 了解如何使用 DAS API 获取集合分布和所有权信息
---

本指南展示如何使用 DAS API 分析集合统计数据、分布情况和所有权模式。这对于构建分析仪表板、市场洞察或集合管理工具非常有用。

## 基本集合统计

获取集合的基本统计信息，包括总资产数量和所有权分布。发挥创意利用结果数据来构建您自己的洞察。

{% totem %}
{% totem-accordion title="UMI 示例" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(dasApi())

  async function getCollectionStatistics(collectionAddress) {
    // 获取集合中的所有资产
    const collectionAssets = await umi.rpc.getAssetsByGroup({
      groupKey: 'collection',
      groupValue: collectionAddress,
      limit: 1000,
      displayOptions: {
        showCollectionMetadata: true
      }
    })

    const assets = collectionAssets.items

    // 基本统计
    const totalAssets = assets.length
    const uniqueOwners = new Set(assets.map(asset => asset.ownership.owner))

    // 所有权分布
    const ownershipCounts = {}
    assets.forEach(asset => {
      ownershipCounts[asset.ownership.owner] = (ownershipCounts[asset.ownership.owner] || 0) + 1
    })

    // 前十大持有者
    const topOwners = Object.entries(ownershipCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)

    console.log('集合统计数据:')
    console.log(`总资产数: ${totalAssets}`)
    console.log(`唯一持有者数: ${uniqueOwners.size}`)
    console.log('前10名持有者:', topOwners)

    return {
      totalAssets,
      uniqueOwners: uniqueOwners.size,
      ownershipCounts,
      topOwners
    }
  }

  // 使用示例
  const stats = await getCollectionStatistics('COLLECTION_ADDRESS')
})();
```
{% /totem-accordion %}
{% totem-accordion title="JavaScript 示例" %}

```javascript
(async () => {
  async function getCollectionStatistics(collectionAddress) {
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
          groupValue: collectionAddress,
          limit: 1000,
          options: {
            showCollectionMetadata: true,
          }
        }
      })
    })

    const data = await response.json()
    const assets = data.result.items

    // 基本统计
    const totalAssets = assets.length
    const uniqueOwners = new Set(assets.map(asset => asset.ownership.owner))

    // 所有权分布
    const ownershipCounts = {}
    assets.forEach(asset => {
      ownershipCounts[asset.ownership.owner] = (ownershipCounts[asset.ownership.owner] || 0) + 1
    })

    // 前十大持有者
    const topOwners = Object.entries(ownershipCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)

    console.log('集合统计数据:')
    console.log(`总资产数: ${totalAssets}`)
    console.log(`唯一持有者数: ${uniqueOwners.size}`)
    console.log('前10名持有者:', topOwners)

    return {
      totalAssets,
      uniqueOwners: uniqueOwners.size,
      ownershipCounts,
      topOwners
    }
  }

  // 使用示例
  const stats = await getCollectionStatistics('COLLECTION_ADDRESS')
})();
```
{% /totem-accordion %}
{% /totem %}

## 常见用例

- **分析仪表板**: 显示集合统计数据和趋势
- **集合管理**: 监控集合健康状况和增长
- **投资工具**: 分析集合表现和稀有度

## 提示和最佳实践

1. **[使用分页](/zh/dev-tools/das-api/guides/pagination)** 来获取大型集合的完整数据
2. **缓存结果** 以提高频繁查询的性能
3. **处理边缘情况** 如缺失的元数据或属性
4. **标准化数据** 以实现跨集合的一致分析
5. **追踪趋势** 以获取有意义的洞察

## 延伸阅读

- [获取集合中的所有代币](/zh/dev-tools/das-api/guides/get-collection-nfts) - 从特定集合检索所有资产
- [查找压缩 NFT](/zh/dev-tools/das-api/guides/find-compressed-nfts) - 发现和使用压缩 NFT
- [按多条件搜索资产](/zh/dev-tools/das-api/guides/search-by-criteria) - 组合多个过滤器进行高级查询
