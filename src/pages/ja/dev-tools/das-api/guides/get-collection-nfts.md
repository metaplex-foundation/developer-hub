---
title: コレクション内のすべてのトークンを取得
metaTitle: コレクション内のすべてのトークンを取得 | DAS APIガイド
description: 特定のコレクションに属するすべてのデジタルアセットを取得する方法を学習します
---

このガイドでは、DAS APIを使用して特定のコレクションに属するすべてのデジタルアセット（NFT、トークン）を取得する方法を説明します。これは、コレクションエクスプローラー、分析ダッシュボード、マーケットプレイス機能の構築に役立ちます。

## 方法1：Get Assets By Groupを使用（推奨）

`getAssetsByGroup`メソッドは、特定のコレクションに属するアセットを見つけるために特別に設計されています。

{% totem %}
{% totem-accordion title="UMI例" %}

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
const umi = createUmi('<ENDPOINT>').use(dasApi())

// 特定のコレクション内のすべてのアセットを取得
const collectionAssets = await umi.rpc.getAssetsByGroup({
  groupKey: 'collection',
  groupValue: '<COLLECTION_ADDRESS>'
})

console.log(`コレクション内で${collectionAssets.items.length}個のアセットを発見`)
console.log(`合計: ${collectionAssets.total}個のアセットが利用可能`)

// 各アセットを処理
collectionAssets.items.forEach(asset => {
  console.log(`アセットID: ${asset.id}`)
  console.log(`名前: ${asset.content.metadata?.name || '不明'}`)
  console.log(`インターフェース: ${asset.interface}`)
  console.log(`オーナー: ${asset.ownership.owner}`)
  console.log('---')
})

})()
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
      method: 'getAssetsByGroup',
      params: {
        groupKey: 'collection',
        groupValue: '<COLLECTION_ADDRESS>'
      }
    })
  })
  
  const data = await response.json()
  console.log(`コレクション内で${data.result.items.length}個のアセットを発見`)
})()
```
{% /totem-accordion %}
{% /totem %}

## 一般的な使用例

- **コレクションエクスプローラー**: フィルタリングとソート機能付きでコレクション内のすべてのアセットを表示
- **マーケットプレイス統合**: 特定のコレクションから利用可能なアセットを表示
- **分析ダッシュボード**: コレクションの統計と所有権分布を追跡
- **ゲームアプリケーション**: ゲームのコレクションからすべてのアセットを読み込み

## ヒントとベストプラクティス

1. **大きなコレクションには[ページネーション](/ja/das-api/guides/pagination)を使用**してレート制限を回避
2. **可能な場合は結果をキャッシュ**してパフォーマンスを向上
3. **追加のメタデータを取得するために[表示オプション](/ja/das-api/guides/display-options)を含める**
4. **意味のある方法でデータを表示するため結果をソート**
5. **コレクションアドレスが無効な場合はエラーを適切に処理**

## 次のステップ

- [クリエイター別にアセットを取得](/ja/das-api/methods/get-assets-by-creator) - 特定のウォレットによって作成されたすべてのトークンを発見
- [ウォレット内のすべてのトークンを取得](/ja/das-api/guides/get-wallet-tokens) - ウォレットが所有するすべてを確認
- [複数の条件でアセットを検索](/ja/das-api/guides/search-by-criteria) - 高度なクエリのために複数のフィルターを組み合わせる