---
title: 查找压缩 NFT
metaTitle: 查找压缩 NFT | DAS API 指南
description: 了解如何使用 DAS API 发现和使用压缩 NFT
---

# 查找压缩 NFT

本指南展示如何使用 DAS API 查找和使用压缩 NFT。压缩 NFT 是在 Solana 上使用 Bubblegum 或 Bubblegum V2 存储 NFT 数据的一种高效方式，DAS API 提供了特殊的方法来处理它们。

## 方法 1：按所有者查找压缩 NFT

查找特定钱包拥有的压缩 NFT：

{% totem %}
{% totem-accordion title="UMI 示例" %}

```typescript
import { publicKey } from "@metaplex-foundation/umi"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api"

(async () => {
  const umi = createUmi("<ENDPOINT>").use(dasApi());

  // 查找特定钱包拥有的所有 NFT（包括压缩和常规 NFT）
  const allOwnerNfts = await umi.rpc.searchAssets({
    owner: publicKey("WALLET_ADDRESS"),
    limit: 1000
  });

  // 按压缩状态过滤
  const compressedNfts = allOwnerNfts.items.filter(
    (nft) => nft.compression?.compressed === true
  );
  const regularNfts = allOwnerNfts.items.filter(
    (nft) => !nft.compression?.compressed
  );

  console.log(
    `找到钱包拥有的 ${compressedNfts.length} 个压缩 NFT`
  );
  console.log(`常规 NFT: ${regularNfts.length}`);
  console.log(`压缩 NFT: ${compressedNfts.length}`);
  console.log(`总 NFT 数: ${allOwnerNfts.items.length}`);
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
        limit: 1000
      }
    })
  });

  const data = await response.json();
  const allOwnerNfts = data.result;

  // 按压缩状态过滤
  const compressedNfts = allOwnerNfts.items.filter(
    (nft) => nft.compression?.compressed === true
  );
  const regularNfts = allOwnerNfts.items.filter(
    (nft) => !nft.compression?.compressed
  );

  console.log(
    `找到钱包拥有的 ${compressedNfts.length} 个压缩 NFT`
  );
  console.log(`常规 NFT: ${regularNfts.length}`);
  console.log(`压缩 NFT: ${compressedNfts.length}`);
  console.log(`总 NFT 数: ${allOwnerNfts.items.length}`);
})();

```
{% /totem-accordion %}
{% /totem %}

## 方法 2：按集合查找压缩 NFT

从特定集合中查找压缩 NFT：

{% totem %}
{% totem-accordion title="UMI 示例" %}

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(dasApi())

  // 从特定集合中查找所有 NFT（包括压缩和常规 NFT）
  const allCollectionNfts = await umi.rpc.searchAssets({
    grouping: [
      'collection',
      '<COLLECTION_ADDRESS>'
    ],
    limit: 1000,
    // 可选：在每个资产中显示集合元数据
    displayOptions: {
      showCollectionMetadata: true
    }
  });

  // 按压缩状态过滤
  const compressedNfts = allCollectionNfts.items.filter(
    (nft) => nft.compression?.compressed === true
  );
  const regularNfts = allCollectionNfts.items.filter(
    (nft) => !nft.compression?.compressed
  );

  console.log(
    `在集合中找到 ${compressedNfts.length} 个压缩 NFT`
  );
  console.log(`常规 NFT: ${regularNfts.length}`);
  console.log(`压缩 NFT: ${compressedNfts.length}`);
  console.log(`总 NFT 数: ${allCollectionNfts.items.length}`);
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
        grouping: [
          'collection',
          '<COLLECTION_ADDRESS>'
        ],
        limit: 1000,
        options: {
          showCollectionMetadata: true
        }
      }
    })
  });

  const data = await response.json();
  const allCollectionNfts = data.result;

  // 按压缩状态过滤
  const compressedNfts = allCollectionNfts.items.filter(
    (nft) => nft.compression?.compressed === true
  );
  const regularNfts = allCollectionNfts.items.filter(
    (nft) => !nft.compression?.compressed
  );

  console.log(
    `在集合中找到 ${compressedNfts.length} 个压缩 NFT`
  );
  console.log(`常规 NFT: ${regularNfts.length}`);
  console.log(`压缩 NFT: ${compressedNfts.length}`);
  console.log(`总 NFT 数: ${allCollectionNfts.items.length}`);
})();

```
{% /totem-accordion %}
{% /totem %}

## 方法 3：按创建者查找压缩 NFT

查找特定钱包创建的压缩 NFT：

{% totem %}
{% totem-accordion title="UMI 示例" %}

```typescript
import { publicKey } from "@metaplex-foundation/umi"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api"

(async () => {
  const umi = createUmi("<ENDPOINT>").use(dasApi());

  // 查找特定钱包创建的所有 NFT（包括压缩和常规 NFT）
  const allCreatorNfts = await umi.rpc.searchAssets({
    creator: publicKey("CREATOR_ADDRESS"),
    displayOptions: {
      showCollectionMetadata: true,
    },
  });

  // 按压缩状态过滤
  const compressedNfts = allCreatorNfts.items.filter(
    (nft) => nft.compression?.compressed === true
  );
  const regularNfts = allCreatorNfts.items.filter(
    (nft) => !nft.compression?.compressed
  );

  console.log(
    `找到创建者创建的 ${compressedNfts.length} 个压缩 NFT`
  );
  console.log(`创建者的常规 NFT: ${regularNfts.length}`);
  console.log(`创建者的压缩 NFT: ${compressedNfts.length}`);
  console.log(`创建者的总 NFT 数: ${allCreatorNfts.items.length}`);
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
        creatorAddress: 'CREATOR_ADDRESS',
        options: {
          showCollectionMetadata: true,
        }
      }
    })
  });

  const data = await response.json();
  const allCreatorNfts = data.result;

  // 按压缩状态过滤
  const compressedNfts = allCreatorNfts.items.filter(
    (nft) => nft.compression?.compressed === true
  );
  const regularNfts = allCreatorNfts.items.filter(
    (nft) => !nft.compression?.compressed
  );

  console.log(
    `找到创建者创建的 ${compressedNfts.length} 个压缩 NFT`
  );
  console.log(`创建者的常规 NFT: ${regularNfts.length}`);
  console.log(`创建者的压缩 NFT: ${compressedNfts.length}`);
  console.log(`创建者的总 NFT 数: ${allCreatorNfts.items.length}`);
})();

```
{% /totem-accordion %}
{% /totem %}

## 提示和最佳实践

1. **使用[分页](/zh/dev-tools/das-api/guides/pagination)** 处理大型压缩 NFT 集合
2. **优雅地处理错误** 当证明不可用时
3. **使用适当的显示选项** 获取压缩 NFT 元数据

## 延伸阅读

- [获取集合中的所有代币](/zh/dev-tools/das-api/guides/get-collection-nfts) - 从特定集合检索所有资产
- [按所有者获取 NFT](/zh/dev-tools/das-api/guides/get-nfts-by-owner) - 查找钱包拥有的所有 NFT
- [按多条件搜索资产](/zh/dev-tools/das-api/guides/search-by-criteria) - 组合多个过滤器进行高级查询
