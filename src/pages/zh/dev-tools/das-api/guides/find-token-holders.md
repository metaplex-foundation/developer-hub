---
title: 查找特定代币的持有者
metaTitle: 查找代币持有者 | DAS API 指南
description: 了解如何发现持有特定代币的所有钱包
---

本指南展示如何使用 DAS API 查找集合中持有特定 NFT 的所有钱包。这对于了解代币分布、查找巨鲸持有者或分析所有权模式非常有用。

## 方法 1：使用搜索资产（推荐）

`searchAssets` 方法是查找集合内所有 NFT 持有者的最有效方式。`getAssetsByGroup` 也是一个可行的选项，但它提供的过滤功能较少。

{% totem %}
{% totem-accordion title="UMI 示例" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(dasApi())

  // 查找集合中特定 NFT 的所有持有者
  const holders = await umi.rpc.searchAssets({
    grouping: {
      key: 'collection',
      value: 'YOUR_COLLECTION_ADDRESS'
    },
    limit: 1000,
    displayOptions: {
      showCollectionMetadata: true
    }
  })

  console.log(`找到 ${holders.items.length} 个持有者`)
  holders.items.forEach(asset => {
    console.log(`所有者: ${asset.ownership.owner}`)
    console.log(`代币 ID: ${asset.id}`)
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
        grouping: ['collection', 'YOUR_COLLECTION_ADDRESS'],
        limit: 1000,
        options: {
          showCollectionMetadata: true
        }
      }
    })
  })

  const data = await response.json()
  console.log(`在集合中找到 ${data.result.items.length} 个资产`)
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
      "grouping": ["collection", "YOUR_COLLECTION_ADDRESS"],
      "limit": 1000,
      "options": {
        "showCollectionMetadata": true
      }
    }
  }'
```

{% /totem-accordion %}
{% /totem %}

## 方法 2：使用按组获取资产

对于基于集合的 NFT，您也可以使用 `getAssetsByGroup` 来查找集合中的所有 NFT。它比 `searchAssets` 更易于使用，但提供的进一步过滤选项较少。

{% totem %}
{% totem-accordion title="UMI 示例" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi(
    "<<ENDPOINT>>"
  ).use(dasApi());

  // 获取集合中的所有资产
  const collectionAssets = await umi.rpc.getAssetsByGroup({
    grouping: ["collection", "COLLECTION_ADDRESS"],
  });

  // 提取唯一所有者
  const uniqueOwners = new Set();
  collectionAssets.items.forEach((asset) => {
    uniqueOwners.add(asset.ownership.owner);
  });

  console.log(`找到 ${uniqueOwners.size} 个唯一持有者`);
  console.log("持有者:", Array.from(uniqueOwners));
})();
```

{% /totem-accordion %}
{% totem-accordion title="JavaScript 示例" %}

```javascript
(async () => {
  const response = await fetch(
    "<ENDPOINT>",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getAssetsByGroup",
        params: {
          grouping: ["collection", "COLLECTION_ADDRESS"],
        },
      }),
    }
  );
  const collectionAssets = await response.json();

  // 提取唯一所有者
  const uniqueOwners = new Set();
  collectionAssets.result.items.forEach((asset) => {
    uniqueOwners.add(asset.ownership.owner);
  });

  console.log(`找到 ${uniqueOwners.size} 个唯一持有者`);
  console.log("持有者:", Array.from(uniqueOwners));
})();
```

{% /totem-accordion %}
{% /totem %}

## 方法 3：查找单个代币

如果您想查找特定单个 NFT（不属于集合）的持有者，您需要在 `getAsset` 中使用该 NFT 的特定地址。

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

  // 获取特定代币
  const token = await umi.rpc.getAsset({
    assetId: publicKey("SPECIFIC_TOKEN_ID")
  });

  console.log(`代币 ${token.id} 的所有者是: ${token.ownership.owner}`);
})();
```
{% /totem-accordion %}
{% totem-accordion title="JavaScript 示例" %}

```javascript
(async () => {
    const response = await fetch("<ENDPOINT>", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          "jsonrpc": "2.0",
          "id": 1,
          "method": "getAsset",
          "params": {
            "id": "SPECIFIC_TOKEN_ID"
          }
        })
    })
})();
```

{% /totem-accordion %}
{% /totem %}

## 提示和最佳实践

1. **处理[分页](/zh/dev-tools/das-api/guides/pagination)**：对于大型集合，始终实现分页以获取所有结果。

2. **使用[显示选项](/zh/dev-tools/das-api/display-options)**：启用 `showCollectionMetadata` 以获取额外的集合信息。

3. **缓存结果**：当 NFT 持有者数据不频繁变化时，考虑缓存结果以提高性能。

4. **速率限制**：在发起多个请求时注意 API 速率限制。

## 相关指南

- [获取集合中的所有代币](/zh/dev-tools/das-api/guides/get-collection-nfts)
- [分析集合统计数据](/zh/dev-tools/das-api/guides/collection-statistics)
