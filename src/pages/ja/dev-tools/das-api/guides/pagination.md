---
title: DAS APIリクエストのページネーション
metaTitle: ページネーション | DAS API
description: DAS APIリクエストを効率的にページネーションする方法を学習します
---

Digital Asset Standard (DAS) APIは通常、リクエストあたり10,000レコードの制限があります。より多くのデータを取得する必要がある場合、ページネーションが不可欠になります。このガイドでは、利用可能なページネーション方法と効率的に実装するためのベストプラクティスを説明します。

## ソートオプションの理解

ページネーションの詳細に入る前に、利用可能なソートオプションを理解することが重要です。これらはページネーションの方法に影響するためです：

- `id`（デフォルト）：バイナリIDでアセットをソート
- `created`：作成タイムスタンプでソート
- `recentAction`：最後の更新タイムスタンプでソート
- `none`：ソートを適用しない（ページネーションには推奨されません）

ソートオプションに加えて、`sortDirection`パラメーター`asc`または`desc`を使用して、結果を昇順または降順でソートできます。

## ページネーション方法

## ページベースページネーション（初心者向け推奨）

ページベースページネーションは実装と理解が最も簡単な方法です。初心者と最も一般的な使用例に最適です。

### 動作方法

- ページ番号と1ページあたりのアイテム数を指定
- ページ番号を増加させて結果をナビゲート

### 主要パラメーター

- `page`：現在のページ番号（1から開始）
- `limit`：1ページあたりのアイテム数（通常最大10,000）
- `sortBy`：ソートオプション

### 考慮事項

- 実装と理解が簡単
- 最も一般的な使用例で正常に動作
- 大きなページ番号でパフォーマンスが低下する場合があります

{% totem %}
{% totem-accordion title="UMI例" %}

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

async function getAllAssetsByPage(collectionAddress: string) {
  const limit = 1000
  let page = 1
  let allAssets: any[] = []
  let hasMore = true

  while (hasMore) {
    console.log(`ページ ${page}を取得中...`)
    
    const assets = await umi.rpc.getAssetsByGroup({
      groupKey: 'collection',
      groupValue: collectionAddress,
      limit: limit,
      page: page,
      sortBy: {
        sortBy: 'created',
        sortDirection: 'desc'
      }
    })

    if (assets.items.length === 0) {
      hasMore = false
    } else {
      allAssets = [...allAssets, ...assets.items]
      page++
      
      // 無限ループを防ぐ安全チェック
      if (page > 100) {
        console.log('最大ページ制限に到達')
        break
      }
    }
  }

  console.log(`取得した総アセット数: ${allAssets.length}`)
  return allAssets
}

// 使用方法
const collectionAssets = await getAllAssetsByPage('J1S9H3QjnRtBbbuD4HjPV6RpRhwuk4zKbxsnCHuTgh9w')
```

{% /totem-accordion %}
{% /totem %}

## カーソルベースページネーション（上級ユーザー推奨）

より大きなデータセットやパフォーマンスが重要な場合、カーソルベースページネーションは優れた効率性を提供し、本番アプリケーションに推奨されるアプローチです。

### 動作方法

- カーソル文字列を使用して位置を追跡
- 各レスポンスでカーソル値が返される
- 次のページを取得するため次のリクエストにカーソルを渡す
- シーケンシャルなデータトラバーサルに最適

### 主要パラメーター

- `cursor`：次の結果セットの位置マーカー
- `limit`：1ページあたりのアイテム数（最大10,000）
- `sortBy`：カーソルベースページネーションでは`id`に設定する必要があります

{% totem %}
{% totem-accordion title="UMI例" %}

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

async function getAllAssetsByCursor(collectionAddress: string) {
  const limit = 1000
  let allAssets: any[] = []
  let cursor: string | undefined

  do {
    console.log(`カーソーでバッチを取得中: ${cursor || 'initial'}`)
    
    const response = await umi.rpc.searchAssets({
      grouping: {
        key: 'collection',
        value: collectionAddress
      },
      limit: limit,
      cursor: cursor,
      sortBy: {
        sortBy: 'id',
        sortDirection: 'asc'
      }
    })

    allAssets = [...allAssets, ...response.items]
    cursor = response.cursor
    
    console.log(`${response.items.length}アイテムを取得、合計: ${allAssets.length}`)
    
  } while (cursor !== undefined)

  console.log(`取得した総アセット数: ${allAssets.length}`)
  return allAssets
}

// 使用方法
const collectionAssets = await getAllAssetsByCursor('COLLECTION_ADDRESS')
```

{% /totem-accordion %}
{% /totem %}

## パフォーマンス比較

| 方法 | 複雑さ | パフォーマンス | 使用例 |
|--------|------------|-------------|----------|
| ページベース | 低 | 小さなデータセットに適している | 初心者、シンプルなアプリケーション |
| カーソルベース | 中 | 優秀 | 本番アプリケーション、大きなデータセット |
| レンジベース | 高 | 優秀 | 高度なクエリ、並列処理 |

## ベストプラクティス

### 適切な方法を選択

- **ページベースページネーションを使用** シンプルな使用例と初心者向け
- **カーソルベースページネーションを使用** 本番アプリケーションと大きなコレクション向け
- **レンジベースページネーションを使用** 高度なクエリパターン向け

### エラー処理
- 常に空の結果セットをチェック
- 失敗したリクエストのためのリトライロジックを実装
- レート制限を適切に処理
- 無限ループを防ぐ安全チェックを追加

### パフォーマンス最適化
- 最後に処理されたアイテムを追跡
- 適切なキャッシュ戦略を実装（ただし、データ特に証明は迅速に変更される可能性があることに留意）
- 適切なソート方法を使用
- 長時間実行される操作にはチェックポイントの実装を検討

### データ一貫性
- ページネーション時は常にソートを使用
- リクエスト間で一貫したソートパラメーターを維持

## まとめ

適切なページネーション戦略の選択は、特定の使用例によって異なります：

- **初心者とシンプルなアプリケーション向け**: ページベースページネーションを使用
- **本番アプリケーション向け**: カーソルベースページネーションを使用
- **高度な使用例向け**: レンジベースページネーションを使用

カーソルベースページネーションは、優れたパフォーマンスを提供し、実装が比較的簡単なため、通常ほとんどのアプリケーションにとって最良の選択です。ページベースページネーションは学習とシンプルな使用例に最適で、レンジベースページネーションは高度なシナリオで最大限の柔軟性を提供します。

## さらなる学習

- [コレクション内のすべてのトークンを取得](/ja/dev-tools/das-api/guides/get-collection-nfts) - 特定のコレクションからすべてのアセットを取得
- [条件でアセットを検索](/ja/dev-tools/das-api/guides/search-by-criteria) - 高度な検索とフィルタリング
- [圧縮NFTを見つける](/ja/dev-tools/das-api/guides/find-compressed-nfts) - 圧縮NFTの操作
