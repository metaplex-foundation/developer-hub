---
title: コレクション統計の分析
metaTitle: コレクション統計の分析 | DAS APIガイド
description: DAS APIを使用してコレクションの分布と所有権についてのインサイトを取得する方法を学習します
---

# コレクション統計の分析

このガイドでは、DAS APIを使用してコレクション統計、分布、所有権パターンを分析する方法を説明します。これは分析ダッシュボード、マーケットプレイスのインサイト、コレクション管理ツールの構築に有用です。

## 基本的なコレクション統計

コレクションに関する基本的な統計情報（総アセット数、所有権分布を含む）を取得します。結果を創造的に活用し、データを使用して独自のインサイトを構築してください。

{% totem %}
{% totem-accordion title="UMI例" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(dasApi())

  async function getCollectionStatistics(collectionAddress) {
    // コレクション内のすべてのアセットを取得
    const collectionAssets = await umi.rpc.getAssetsByGroup({
      groupKey: 'collection',
      groupValue: collectionAddress,
      limit: 1000,
      displayOptions: {
        showCollectionMetadata: true
      }
    })

    const assets = collectionAssets.items
    
    // 基本統計
    const totalAssets = assets.length
    const uniqueOwners = new Set(assets.map(asset => asset.ownership.owner))
      
    // 所有権分布
    const ownershipCounts = {}
    assets.forEach(asset => {
      ownershipCounts[asset.ownership.owner] = (ownershipCounts[asset.ownership.owner] || 0) + 1
    })
    
    // トップオーナー
    const topOwners = Object.entries(ownershipCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
    
    console.log('コレクション統計:')
    console.log(`総アセット数: ${totalAssets}`)
    console.log(`ユニークオーナー数: ${uniqueOwners.size}`)
    console.log('トップ10オーナー:', topOwners)
    
    return {
      totalAssets,
      uniqueOwners: uniqueOwners.size,
      ownershipCounts,
      topOwners
    }
  }

  // 使用方法
  const stats = await getCollectionStatistics('COLLECTION_ADDRESS')
})();
```
{% /totem-accordion %}
{% totem-accordion title="JavaScript例" %}

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
    
    // 基本統計
    const totalAssets = assets.length
    const uniqueOwners = new Set(assets.map(asset => asset.ownership.owner))
      
    // 所有権分布
    const ownershipCounts = {}
    assets.forEach(asset => {
      ownershipCounts[asset.ownership.owner] = (ownershipCounts[asset.ownership.owner] || 0) + 1
    })
    
    // トップオーナー
    const topOwners = Object.entries(ownershipCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
    
    console.log('コレクション統計:')
    console.log(`総アセット数: ${totalAssets}`)
    console.log(`ユニークオーナー数: ${uniqueOwners.size}`)
    console.log('トップ10オーナー:', topOwners)
    
    return {
      totalAssets,
      uniqueOwners: uniqueOwners.size,
      ownershipCounts,
      topOwners
    }
  }

  // 使用方法
  const stats = await getCollectionStatistics('COLLECTION_ADDRESS')
})();
```
{% /totem-accordion %}
{% /totem %}

## 一般的な使用例

- **分析ダッシュボード**: コレクション統計とトレンドを表示
- **コレクション管理**: コレクションの健全性と成長を監視
- **投資家ツール**: コレクションのパフォーマンスと希少性を分析

## ヒントとベストプラクティス

1. **[ページネーションを使用](/ja/dev-tools/das-api/guides/pagination)** 大きなコレクションの完全なデータを取得するため
2. **結果をキャッシュ** 頻繁なクエリのパフォーマンスを向上させるため
3. **エッジケースを処理** メタデータや属性が欠落している場合に対処
4. **データを正規化** コレクション間での一貫した分析のため
5. **トレンドを追跡** 意味のあるインサイトのために時間の経過を追跡

## さらなる学習

- [コレクション内のすべてのトークンを取得](/ja/dev-tools/das-api/guides/get-collection-nfts) - 特定のコレクションからすべてのアセットを取得
- [圧縮NFTを見つける](/ja/dev-tools/das-api/guides/find-compressed-nfts) - 圧縮NFTを発見して操作
- [複数の条件でアセットを検索](/ja/dev-tools/das-api/guides/search-by-criteria) - 高度なクエリのために複数のフィルターを組み合わせ