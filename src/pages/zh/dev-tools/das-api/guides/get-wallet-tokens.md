---
title: 获取钱包中的所有代币
metaTitle: 获取钱包代币 | DAS API 指南
description: 了解如何检索特定钱包拥有的所有代币
---

本指南展示如何使用 DAS API 检索特定钱包地址拥有的所有代币（NFT、同质化代币和其他数字资产）。

## 方法 1：使用按所有者获取资产（推荐）

`getAssetsByOwner` 方法是获取钱包拥有的所有代币的最直接方式。

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

  // 获取钱包拥有的所有代币
  const walletTokens = await umi.rpc.getAssetsByOwner({
    owner: publicKey("WALLET_ADDRESS"),
    displayOptions: {
      showCollectionMetadata: true,
      showFungible: true,
    },
  });

  console.log(`找到 ${walletTokens.items.length} 个代币`);
  walletTokens.items.forEach((token) => {
    console.log(`代币: ${token.id}`);
    console.log(`接口: ${token.interface}`);
    console.log(`名称: ${token.content.metadata?.name || "未知"}`);
  });
})();
```

{% /totem-accordion %}
{% totem-accordion title="JavaScript 示例" %}

```javascript
(async () => {
  const response = await fetch("<ENDPOINT>", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getAssetsByOwner",
      params: {
        ownerAddress: "WALLET_ADDRESS",
        options: {
          showCollectionMetadata: true,
          showFungible: true,
        },
      },
    }),
  });

  const data = await response.json();
  console.log(`找到 ${data.result.items.length} 个代币`);
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
    "method": "getAssetsByOwner",
    "params": {
      "ownerAddress": "WALLET_ADDRESS",
      "options": {
        "showCollectionMetadata": true,
        "showFungible": true
      }
    }
  }'
```

{% /totem-accordion %}
{% /totem %}

## 方法 2：使用带所有者过滤器的搜索资产

您也可以使用带有所有者过滤器的 `searchAssets` 进行更具体的查询。此方法并非所有 DAS API 提供商都支持。

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

  // 搜索特定钱包拥有的所有资产
  const walletAssets = await umi.rpc.searchAssets({
    owner: publicKey("WALLET_ADDRESS"),
    limit: 1000,
    displayOptions: {
      showCollectionMetadata: true,
      showFungible: true,
    },
  });

  console.log(`找到 ${walletAssets.items.length} 个资产`);
})();
```

{% /totem-accordion %}
{% totem-accordion title="JavaScript 示例" %}

```javascript
(async () => {
  const response = await fetch("<ENDPOINT>", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "searchAssets",
      params: {
        ownerAddress: "WALLET_ADDRESS",
        limit: 1000,
        options: {
          showCollectionMetadata: true,
          showFungible: true,
        },
      },
    }),
  });

  const data = await response.json();
  console.log(`找到 ${data.result.items.length} 个资产`);
})();
```

{% /totem-accordion %}
{% /totem %}

## 提示和最佳实践

1. **使用[显示选项](/zh/dev-tools/das-api/guides/display-options)**：启用 `showCollectionMetadata` 和 `showFungible` 或其他选项如 `showInscription` 以获取完整的代币信息。

2. **处理[分页](/zh/dev-tools/das-api/guides/pagination)**：对于拥有大量代币的钱包，始终实现分页。

3. **按接口过滤**：使用 `interface` 参数获取特定代币类型。

4. **缓存结果**：钱包内容不会频繁变化，因此考虑缓存以提高性能。

5. **速率限制**：在发起多个请求时注意 API 速率限制。

## 相关指南

- [按所有者获取同质化资产](/zh/dev-tools/das-api/guides/get-fungible-assets)
- [按所有者获取 NFT](/zh/dev-tools/das-api/guides/get-nfts-by-owner)
- [按所有者和集合获取资产](/zh/dev-tools/das-api/guides/owner-and-collection)
- [分析集合统计数据](/zh/dev-tools/das-api/guides/collection-statistics)
