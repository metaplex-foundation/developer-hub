---
title: 按所有者和集合获取资产
metaTitle: 按所有者和集合获取资产 | DAS API 指南
description: 了解如何查找特定钱包拥有的特定集合中的数字资产
---

# 按所有者和集合获取资产

本指南展示如何查找属于特定集合并由特定钱包地址拥有的数字资产。这对于构建特定集合的投资组合视图、市场功能或分析工具非常有用。

## 使用带所有者和集合分组的搜索资产

`searchAssets` 方法允许您组合所有者和集合过滤器以获得精确的结果。

{% totem %}
{% totem-accordion title="UMI 示例" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi(
    "<ENDPOINT>"
  ).use(dasApi());

  // 查找钱包拥有的特定集合中的资产
  const collectionAssets = await umi.rpc.searchAssets({
    owner: publicKey("WALLET_ADDRESS"),
    grouping: ["collection", "COLLECTION_ADDRESS"],
    limit: 1000,
    displayOptions: {
      showCollectionMetadata: true,
    }
  })

  console.log(`找到钱包拥有的集合中 ${collectionAssets.items.length} 个资产`)
  console.log(`可用总数: ${collectionAssets.total}`)

  // 处理每个资产
  collectionAssets.items.forEach(asset => {
    console.log(`资产 ID: ${asset.id}`)
    console.log(`名称: ${asset.content.metadata?.name || '未知'}`)
    console.log(`接口: ${asset.interface}`)
    console.log('---')
  })
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
        ownerAddress: 'WALLET_ADDRESS',
        grouping: ['collection', 'COLLECTION_ADDRESS'],
        limit: 1000,
        options: {
          showCollectionMetadata: true
        }
      }
    })
  })

  const data = await response.json()
  console.log(`找到钱包拥有的集合中 ${data.result.items.length} 个资产`)
})();
```

{% /totem-accordion %}
{% totem-accordion title="cURL 示例" %}

```bash
curl -X POST <ENDPOINT> \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "searchAssets",
    "params": {
      "ownerAddress": "WALLET_ADDRESS",
      "grouping": ["collection", "COLLECTION_ADDRESS"],
      "limit": 1000,
      "options": {
        "showCollectionMetadata": true
      }
    }
  }'
```

{% /totem-accordion %}
{% /totem %}

## 常见用例

- **集合投资组合**：显示用户拥有的特定集合中的所有资产
- **市场集成**：显示用户钱包中特定集合的可用资产
- **集合分析**：分析特定集合内的持有情况
- **交易工具**：追踪用于交易策略的集合持有情况

## 提示和最佳实践

1. **使用[分页](/zh/dev-tools/das-api/guides/pagination)** 处理大型数据集
2. **包含[显示选项](/zh/dev-tools/das-api/guides/display-options)** 以获取额外的元数据
3. **对结果进行排序** 以有意义的方式呈现数据
4. **优雅地处理空结果** 当集合为空时
5. **在查询前验证集合地址**

## 延伸阅读

- [获取集合中的所有代币](/zh/dev-tools/das-api/guides/get-collection-nfts) - 从特定集合检索所有资产
- [按所有者获取 NFT](/zh/dev-tools/das-api/guides/get-nfts-by-owner) - 查找钱包拥有的所有 NFT
- [按多条件搜索资产](/zh/dev-tools/das-api/guides/search-by-criteria) - 组合多个过滤器进行高级查询
