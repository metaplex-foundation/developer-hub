---
title: オーナー別のFungible Asset取得
metaTitle: Fungible Asset取得 | DAS APIガイド
description: 特定のウォレットが所有するすべてのfungibleトークンを取得する方法を学びます
---

このガイドでは、DAS APIを使用して、特定のウォレットアドレスが所有するすべてのfungibleトークン(SPLトークン、SOLなど)を取得する方法を説明します。

## 方法1: インターフェースフィルターを使用したSearch Assets(推奨)

fungible assetを取得する最も効果的な方法は、`FungibleToken`インターフェースフィルターを使用した`searchAssets`です。これはfungible assetのみを返すため、フィルタリングの必要がありません。

この方法は最も効果的ですが、現在すべてのDAS APIプロバイダーでサポートされているわけではありません。

{% totem %}
{% totem-accordion title="UMI例" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(dasApi())

  // ウォレットが所有するすべてのfungible assetを取得
  const fungibleTokens = await umi.rpc.searchAssets({
    owner: publicKey('WALLET_ADDRESS'),
    interface: 'FungibleToken',
    limit: 1000,
    displayOptions: {
      showFungible: true
    }
  })

  console.log(`${fungibleTokens.items.length}個のfungible assetが見つかりました`)
  fungibleTokens.items.forEach(asset => {
    console.log(`トークン: ${asset.id}`)
    console.log(`供給量: ${asset.supply}`)
    console.log(`名前: ${asset.content.metadata?.name || '不明'}`)
    console.log(`シンボル: ${asset.content.metadata?.symbol || '不明'}`)
  })
})();
```
{% /totem-accordion %}
{% totem-accordion title="JavaScript例" %}

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
  console.log(`${data.result.items.length}個のfungible assetが見つかりました`)
})();
```
{% /totem-accordion %}
{% totem-accordion title="cURL例" %}
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

## 方法2: フィルタリングを使用したGet Assets By Owner

`getAssetsByOwner`を使用して、クライアント側で結果をフィルタリングすることもできます:

{% totem %}
{% totem-accordion title="UMI例" %}
```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(dasApi())

  // すべてのassetを取得してfungibleなものをフィルタリング
  const allAssets = await umi.rpc.getAssetsByOwner({
    owner: publicKey('WALLET_ADDRESS'),
    limit: 10000,
    displayOptions: {
      showFungible: true
    }
  })

  // fungible assetをフィルタリング
  const fungibleTokens = allAssets.items.filter(
    (asset) => asset.interface === 'FungibleToken',
  )

  console.log(
    `全${allAssets.items.length}個のassetのうち${fungibleTokens.length}個のfungible assetが見つかりました`,
  )
})();
```
{% /totem-accordion %}
{% totem-accordion title="JavaScript例" %}
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

  // fungible assetをフィルタリング
  const FungibleTokens = allAssets.items.filter(asset =>
    asset.interface === 'FungibleToken'
  )

  console.log(`全${allAssets.items.length}個のassetのうち${FungibleTokens.length}個のfungible assetが見つかりました`)
})();
```
{% /totem-accordion %}
{% /totem %}

## 方法3: トークンプロパティによるフィルタリング

様々なプロパティでfungibleトークンをフィルタリングできます:

{% totem %}
{% totem-accordion title="UMI例" %}
```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

// 特定の供給量範囲のトークンを取得
const tokensBySupply = await umi.rpc.searchAssets({
  owner: publicKey('WALLET_ADDRESS'),
  interface: 'FungibleToken',
  supply: 1000000, // 供給量 >= 100万のトークン
  limit: 1000,
  displayOptions: {
    showFungible: true
  }
})

// クリエーター別にトークンを取得
const creatorTokens = await umi.rpc.searchAssets({
  owner: publicKey('WALLET_ADDRESS'),
  interface: 'FungibleToken',
  creatorAddress: 'CREATOR_ADDRESS',
  limit: 1000,
  displayOptions: {
    showFungible: true
  }
})

console.log(`供給量別トークン: ${tokensBySupply.items.length}`)
console.log(`クリエータートークン: ${creatorTokens.items.length}`)
```
{% /totem-accordion %}
{% totem-accordion title="JavaScript例" %}
```javascript
(async () => {
  // 特定の供給量範囲のトークンを取得
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
        supply: 1000000, // 供給量 >= 100万のトークン
        limit: 1000,
        options: {
          showFungible: true
        }
      }
    })
  })

  const tokensBySupplyData = await tokensBySupplyResponse.json()
  const tokensBySupply = tokensBySupplyData.result

  // クリエーター別にトークンを取得
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

  console.log(`供給量別トークン: ${tokensBySupply.items.length}`)
  console.log(`クリエータートークン: ${creatorTokens.items.length}`)
})();
```
{% /totem-accordion %}
{% /totem %}

## ヒントとベストプラクティス

1. **インターフェースフィルターを使用する**: 詳細については[基準によるAsset検索](/jp/das-api/guides/search-by-criteria)を参照してください。
2. **Show Fungibleを有効化する**: [表示オプション](/jp/das-api/guides/display-options)に示されているように、display optionsで`showFungible: true`を使用して完全なトークン情報を取得します。
3. **小数点を考慮する**: トークン量を適切にフォーマットするために`decimals`フィールドを確認してください。
4. **結果をキャッシュする**: トークン残高は頻繁に変更されますが、トークンメタデータは比較的安定しています。

## 関連ガイド

- [ウォレット内のすべてのトークンを取得](/jp/das-api/guides/get-wallet-tokens)
- [オーナー別のNFT取得](/jp/das-api/guides/get-nfts-by-owner)
- [複数の基準によるAsset検索](/jp/das-api/guides/search-by-criteria)
- [コレクション統計の分析](/jp/das-api/guides/collection-statistics)
