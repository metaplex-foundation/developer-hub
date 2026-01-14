---
title: 按所有者获取同质化资产
metaTitle: 获取同质化资产 | DAS API 指南
description: 了解如何检索特定钱包拥有的所有同质化代币
---

本指南展示如何使用 DAS API 检索特定钱包地址拥有的所有同质化代币（如 SPL 代币、SOL 等）。

## 方法 1：使用带接口过滤器的搜索资产（推荐）

获取同质化资产最有效的方式是使用带有 `FungibleToken` 接口过滤器的 `searchAssets`。它只返回同质化资产，因此您无需对其进行过滤。

虽然这种方法最有效，但目前并非所有 DAS API 提供商都支持。

{% totem %}
{% totem-accordion title="UMI 示例" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(dasApi())

  // 获取钱包拥有的所有同质化资产
  const fungibleTokens = await umi.rpc.searchAssets({
    owner: publicKey('WALLET_ADDRESS'),
    interface: 'FungibleToken',
    limit: 1000,
    displayOptions: {
      showFungible: true
    }
  })

  console.log(`找到 ${fungibleTokens.items.length} 个同质化资产`)
  fungibleTokens.items.forEach(asset => {
    console.log(`代币: ${asset.id}`)
    console.log(`供应量: ${asset.supply}`)
    console.log(`名称: ${asset.content.metadata?.name || '未知'}`)
    console.log(`符号: ${asset.content.metadata?.symbol || '未知'}`)
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
        interface: 'FungibleToken',
        limit: 10000,
        options: {
          showFungible: true
        }
      }
    })
  })

  const data = await response.json()
  console.log(`找到 ${data.result.items.length} 个同质化资产`)
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
      "interface": "FungibleToken",
      "limit": 10000,
      "options": {
        "showFungible": true
      }
    }
  }'
```
{% /totem-accordion %}
{% /totem %}

## 方法 2：使用按所有者获取资产并过滤

您也可以使用 `getAssetsByOwner` 并在客户端过滤结果：

{% totem %}
{% totem-accordion title="UMI 示例" %}
```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(dasApi())

  // 获取所有资产并过滤同质化资产
  const allAssets = await umi.rpc.getAssetsByOwner({
    owner: publicKey('WALLET_ADDRESS'),
    limit: 10000,
    displayOptions: {
      showFungible: true
    }
  })

  // 过滤同质化资产
  const fungibleTokens = allAssets.items.filter(
    (asset) => asset.interface === 'FungibleToken',
  )

  console.log(
    `在 ${allAssets.items.length} 个总资产中找到 ${fungibleTokens.length} 个同质化资产`,
  )
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
      method: 'getAssetsByOwner',
      params: {
        ownerAddress: 'WALLET_ADDRESS',
        options: {
          showFungible: true
        }
      }
    })
  })

  const data = await response.json()
  const allAssets = data.result

  // 过滤同质化资产
  const FungibleTokens = allAssets.items.filter(asset =>
    asset.interface === 'FungibleToken'
  )

  console.log(`在 ${allAssets.items.length} 个总资产中找到 ${FungibleTokens.length} 个同质化资产`)
})();
```
{% /totem-accordion %}
{% /totem %}

## 方法 3：按代币属性过滤

您可以按各种属性过滤同质化代币：

{% totem %}
{% totem-accordion title="UMI 示例" %}
```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

// 获取具有特定供应量范围的代币
const tokensBySupply = await umi.rpc.searchAssets({
  owner: publicKey('WALLET_ADDRESS'),
  interface: 'FungibleToken',
  supply: 1000000, // 供应量 >= 1M 的代币
  limit: 1000,
  displayOptions: {
    showFungible: true
  }
})

// 按创建者获取代币
const creatorTokens = await umi.rpc.searchAssets({
  owner: publicKey('WALLET_ADDRESS'),
  interface: 'FungibleToken',
  creatorAddress: 'CREATOR_ADDRESS',
  limit: 1000,
  displayOptions: {
    showFungible: true
  }
})

console.log(`按供应量筛选的代币: ${tokensBySupply.items.length}`)
console.log(`创建者代币: ${creatorTokens.items.length}`)
```
{% /totem-accordion %}
{% totem-accordion title="JavaScript 示例" %}
```javascript
(async () => {
  // 获取具有特定供应量范围的代币
  const tokensBySupplyResponse = await fetch('<ENDPOINT>', {
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
        interface: 'FungibleToken',
        supply: 1000000, // 供应量 >= 1M 的代币
        limit: 1000,
        options: {
          showFungible: true
        }
      }
    })
  })

  const tokensBySupplyData = await tokensBySupplyResponse.json()
  const tokensBySupply = tokensBySupplyData.result

  // 按创建者获取代币
  const creatorResponse = await fetch('<ENDPOINT>', {
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
        interface: 'FungibleToken',
        creatorAddress: 'CREATOR_ADDRESS',
        limit: 1000,
        options: {
          showFungible: true
        }
      }
    })
  })

  const creatorData = await creatorResponse.json()
  const creatorTokens = creatorData.result

  console.log(`按供应量筛选的代币: ${tokensBySupply.items.length}`)
  console.log(`创建者代币: ${creatorTokens.items.length}`)
})();
```
{% /totem-accordion %}
{% /totem %}

## 提示和最佳实践

1. **使用接口过滤器**：有关更多信息，请参阅[按条件搜索资产](/zh/dev-tools/das-api/guides/search-by-criteria)。
2. **启用显示同质化选项**：在显示选项中使用 `showFungible: true` 以获取完整的代币信息，如[显示选项](/zh/dev-tools/das-api/display-options)所示。
3. **考虑小数位**：检查 `decimals` 字段以正确格式化代币金额。
4. **缓存结果**：代币余额经常变化，但代币元数据相对稳定。

## 相关指南

- [获取钱包中的所有代币](/zh/dev-tools/das-api/guides/get-wallet-tokens)
- [按所有者获取 NFT](/zh/dev-tools/das-api/guides/get-nfts-by-owner)
- [按多条件搜索资产](/zh/dev-tools/das-api/guides/search-by-criteria)
- [分析集合统计数据](/zh/dev-tools/das-api/guides/collection-statistics)
