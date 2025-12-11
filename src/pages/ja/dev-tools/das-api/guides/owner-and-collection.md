---
title: オーナーとコレクション別のAsset取得
metaTitle: オーナーとコレクション別のAsset取得 | DAS APIガイド
description: 特定のコレクションに属し、特定のウォレットが所有するデジタルアセットを見つける方法を学びます
---

# オーナーとコレクション別のAsset取得

このガイドでは、特定のコレクションに属し、特定のウォレットアドレスが所有するデジタルアセットを見つける方法を説明します。これは、コレクション固有のポートフォリオビュー、マーケットプレイス機能、分析ツールの構築に役立ちます。

## オーナーとコレクショングループ化を使用したSearch Assets

`searchAssets`メソッドを使用すると、正確な結果を得るためにオーナーとコレクションのフィルターを組み合わせることができます。

{% totem %}
{% totem-accordion title="UMI例" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi(
    "<ENDPOINT>"
  ).use(dasApi());

  // ウォレットが所有する特定のコレクションのassetを検索
  const collectionAssets = await umi.rpc.searchAssets({
    owner: publicKey("WALLET_ADDRESS"),
    grouping: ["collection", "COLLECTION_ADDRESS"],
    limit: 1000,
    displayOptions: {
      showCollectionMetadata: true,
    }
  })

  console.log(`ウォレットが所有するコレクションから${collectionAssets.items.length}個のassetが見つかりました`)
  console.log(`利用可能な合計: ${collectionAssets.total}`)

  // 各assetを処理
  collectionAssets.items.forEach(asset => {
    console.log(`Asset ID: ${asset.id}`)
    console.log(`名前: ${asset.content.metadata?.name || '不明'}`)
    console.log(`インターフェース: ${asset.interface}`)
    console.log('---')
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
        grouping: ['collection', 'COLLECTION_ADDRESS'],
        limit: 1000,
        options: {
          showCollectionMetadata: true
        }
      }
    })
  })

  const data = await response.json()
  console.log(`ウォレットが所有するコレクションから${data.result.items.length}個のassetが見つかりました`)
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
      "grouping": ["collection", "COLLECTION_ADDRESS"],
      "limit": 1000,
      "options": {
        "showCollectionMetadata": true
      }
    }
  }'
```

{% /totem-accordion %}
{% /totem %}

## 一般的なユースケース

- **コレクションポートフォリオ**: ユーザーが所有する特定のコレクションのすべてのassetを表示
- **マーケットプレイス統合**: ユーザーのウォレット内のコレクションから利用可能なassetを表示
- **コレクション分析**: 特定のコレクション内の保有を分析
- **取引ツール**: 取引戦略のためにコレクション保有を追跡

## ヒントとベストプラクティス

1. **[ページネーション](/ja/das-api/guides/pagination)を使用する** 大規模なデータセット用
2. **[表示オプション](/ja/das-api/guides/display-options)を含める** 追加のメタデータを取得
3. **結果をソートする** 意味のある方法でデータを提示
4. **空の結果を適切に処理する** コレクションが空の場合
5. **コレクションアドレスを検証する** クエリ前に

## 関連情報

- [コレクション内のすべてのトークン取得](/ja/das-api/guides/get-collection-nfts) - 特定のコレクションからすべてのassetを取得
- [オーナー別のNFT取得](/ja/das-api/guides/get-nfts-by-owner) - ウォレットが所有するすべてのNFTを検索
- [複数の基準によるAsset検索](/ja/das-api/guides/search-by-criteria) - 高度なクエリのために複数のフィルターを組み合わせる
