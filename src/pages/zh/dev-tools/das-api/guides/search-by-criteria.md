---
title: 按多条件搜索资产
metaTitle: 按多条件搜索资产 | DAS API 指南
description: 了解如何组合多个过滤器来查找特定的数字资产
---

本指南展示如何使用 DAS API 的 `searchAssets` 方法通过多个过滤器和条件来查找数字资产。这个强大的方法允许您组合各种参数来创建复杂的查询以查找特定资产。

## 方法 1：基本多条件搜索

`searchAssets` 方法允许您组合多个过滤器——例如，查找特定钱包拥有且由特定创建者创建的资产。

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

  // 使用多个条件搜索资产
  const searchResults = await umi.rpc.searchAssets({
    owner: publicKey("WALLET_ADDRESS"),
    creator: publicKey("CREATOR_ADDRESS"),
    limit: 1000,
    displayOptions: {
      showCollectionMetadata: true,
    },
  });

  console.log(`找到 ${searchResults.items.length} 个符合条件的资产`);
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
          creatorAddress: 'CREATOR_ADDRESS',
          limit: 1000,
          options: {
            showCollectionMetadata: true,
          }
        },
      }),
    }
  );

  const data = await response.json();
  console.log(`找到 ${data.result.items.length} 个资产`);
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
      "creatorAddress": "CREATOR_ADDRESS",
      "limit": 1000,
      "options": {
        "showCollectionMetadata": true,
      }
    }
  }'
```

{% /totem-accordion %}
{% /totem %}

## 方法 2：集合和所有者搜索

查找特定钱包拥有的特定集合中的资产：

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
{% /totem %}

## 方法 3：带多条件的高级过滤

组合过滤器进行复杂查询。例如，查找符合以下条件的 NFT：
• 属于给定集合
• 由特定钱包拥有
• **未**冻结或压缩
• 有经过验证的创建者
• 按创建日期排序（降序）
并包含集合元数据：

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

    // 带多条件的复杂搜索
    const complexSearch = await umi.rpc.searchAssets({
      owner: publicKey('WALLET_ADDRESS'),
      creator: publicKey('CREATOR_ADDRESS'),
      grouping: ["collection", "COLLECTION_ADDRESS"],
      frozen: false,
      compressed: false,
      displayOptions: {
        showCollectionMetadata: true,
      }
    })

  console.log(
    `找到 ${complexSearch.items.length} 个符合复杂条件的资产`
  );
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
        creatorAddress: 'CREATOR_ADDRESS',
        grouping: ['collection', 'COLLECTION_ADDRESS'],
        frozen: false,
        compressed: false,
        options: {
          showCollectionMetadata: true,
        }
      }
    })
  })

  const data = await response.json()
  console.log(`找到 ${data.result.items.length} 个符合复杂条件的资产`)
})();
```

{% /totem-accordion %}
{% /totem %}

## 提示和最佳实践

1. **从简单开始**：从基本条件开始，逐步增加复杂性
2. **使用[分页](/zh/dev-tools/das-api/guides/pagination)**：对于大结果集，实现适当的分页
3. **缓存结果**：存储频繁访问的搜索结果
4. **明智地组合过滤器**：过多的过滤器可能导致没有结果
5. **处理空结果**：始终检查空结果集，但请记住某些资产可能被隐藏或尚未索引
6. **使用[显示选项](/zh/dev-tools/das-api/display-options)**：根据您的用例包含相关的显示选项
7. **对结果进行排序**：使用排序以有意义的方式呈现数据
8. **测试查询**：使用已知数据验证您的搜索条件

## 后续步骤

- [获取集合中的所有代币](/zh/dev-tools/das-api/guides/get-collection-nfts) - 从特定集合检索所有资产
- [按所有者获取 NFT](/zh/dev-tools/das-api/guides/get-nfts-by-owner) - 查找钱包拥有的所有 NFT
- [按创建者获取资产](/zh/dev-tools/das-api/methods/get-assets-by-creator) - 发现特定钱包创建的所有代币

## 延伸阅读

- [按创建者获取资产](/zh/dev-tools/das-api/methods/get-assets-by-creator) - 发现特定钱包创建的所有代币
- [获取集合中的所有代币](/zh/dev-tools/das-api/guides/get-collection-nfts) - 从特定集合检索所有资产
- [查找压缩 NFT](/zh/dev-tools/das-api/guides/find-compressed-nfts) - 发现和使用压缩 NFT
