---
title: 按所有者获取 NFT
metaTitle: 按所有者获取 NFT | DAS API 指南
description: 了解如何检索特定钱包拥有的所有非同质化代币
---

# 按所有者获取 NFT

本指南展示如何使用 DAS API 检索特定钱包地址拥有的所有非同质化代币（NFT）。这对于构建 NFT 画廊、投资组合追踪器或市场功能非常有用。

## 方法 1：使用带接口过滤器的按所有者获取资产（推荐）

`getAssetsByOwner` 方法结合接口过滤是获取特定钱包拥有的 NFT 的最有效方式，它只返回符合接口过滤器的 NFT，例如 `MplCoreAsset` 不会返回压缩 NFT。

{% totem %}
{% totem-accordion title="UMI 示例" %}

```typescript
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";

(async () => {
  const umi = createUmi(
    "<ENDPOINT>"
  ).use(dasApi());
  console.log("umi.rpc.getAssetsByOwner");
  // 获取特定钱包拥有的所有 NFT
  const ownerNfts = await umi.rpc.getAssetsByOwner({
    owner: publicKey("WALLET_ADDRESS"),
    interface: "MplCoreAsset", // 可选，不指定此参数将获取钱包拥有的所有资产
    displayOptions: {
      showCollectionMetadata: true,
      showFungible: false, // 排除同质化代币
    },
  });

  console.log(`找到此钱包拥有的 ${ownerNfts.items.length} 个 NFT`);
  console.log(`总资产数: ${ownerNfts.total}`);

  // 处理每个 NFT
  ownerNfts.items.forEach((nft) => {
    console.log(`NFT ID: ${nft.id}`);
    console.log(`名称: ${nft.content.metadata?.name || "未知"}`);
    console.log(
      `集合: ${
        nft.grouping?.find((g) => g.group_key === "collection")?.group_value ||
        "无"
      }`
    );
    console.log("---");
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
          showFungible: false, // 排除同质化代币
        },
      },
    }),
  });

  const data = await response.json();
  console.log(`找到 ${data.result.items.length} 个 NFT`);
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
        "showFungible": false
      }
    }
  }'
```
{% /totem-accordion %}
{% /totem %}

## 方法 2：使用带所有者和接口过滤器的搜索资产

您可以使用 `searchAssets` 通过接口等额外过滤器获取更具体的结果，例如只获取 `MplCoreAsset`。

{% totem %}
{% totem-accordion title="UMI 示例" %}
```typescript
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";

(async () => {
  const umi = createUmi(
    "<ENDPOINT>"
  ).use(dasApi());

  // 搜索特定钱包拥有的 NFT
  const ownerNfts = await umi.rpc.searchAssets({
    owner: publicKey("WALLET_ADDRESS"),
    limit: 1000,
    interface: "MplCoreAsset",
    displayOptions: {
      showCollectionMetadata: true,
    },
  });

  console.log(`找到 ${ownerNfts.items.length} 个 Core 资产`);
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
        interface: "MplCoreAsset",
        limit: 1000,
        options: {
          showCollectionMetadata: true,
        },
      },
    }),
  });

  const data = await response.json();
  console.log(`找到 ${data.result.items.length} 个 Core 资产`);
})();
```
{% /totem-accordion %}
{% /totem %}

## 方法 3：按集合过滤 NFT

除了钱包地址外，您还可以按特定集合过滤 NFT，例如在查找您自己集合中的 NFT 时。

{% totem %}
{% totem-accordion title="UMI 示例" %}
```typescript
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";

(async () => {
  const umi = createUmi(
    "<ENDPOINT>"
  ).use(dasApi());

  // 获取此钱包拥有的特定集合中的 NFT
  const collectionNfts = await umi.rpc.searchAssets({
    owner: publicKey("WALLET_ADDRESS"),
    grouping: ["collection", "COLLECTION_ADDRESS"],
    limit: 1000,
    displayOptions: {
      showCollectionMetadata: true,
      showFungible: false,
    },
  });

  console.log(`从此集合中找到 ${collectionNfts.items.length} 个 NFT`);
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "searchAssets",
        params: {
          ownerAddress: "WALLET_ADDRESS",
          grouping: [
            "collection",
            "COLLECTION_ADDRESS",
          ],
          options: {
            showCollectionMetadata: true,
          },
        },
      }),
    }
  );

  const data = await response.json();
  console.log(`在此钱包的此集合中找到 ${data.result.items.length} 个 NFT`);
})();

```
{% /totem-accordion %}
{% /totem %}

## 常见用例

- **NFT 画廊**：显示用户拥有的所有 NFT
- **投资组合追踪器**：监控 NFT 持有情况
- **市场集成**：显示用户的 NFT 库存
- **集合管理**：按集合组织 NFT
- **游戏应用**：加载用户的 NFT 游戏资产

## 提示和最佳实践

1. **使用接口过滤** 只获取 NFT（例如排除同质化代币）
2. **实现[分页](/zh/dev-tools/das-api/guides/pagination)** 处理拥有大量 NFT 的钱包
3. **缓存结果** 以提高频繁查询的性能
4. **包含[显示选项](/zh/dev-tools/das-api/guides/display-options)** 以获取额外的元数据
5. **对结果进行排序** 以有意义的方式呈现数据
6. **按集合过滤** 以关注特定 NFT 类型

## 延伸阅读

- [按创建者获取资产](/zh/dev-tools/das-api/methods/get-assets-by-creator) - 发现特定地址创建的所有代币
- [获取集合中的所有代币](/zh/dev-tools/das-api/guides/get-collection-nfts) - 从特定集合检索所有资产
- [按多条件搜索资产](/zh/dev-tools/das-api/guides/search-by-criteria) - 组合多个过滤器进行高级查询
