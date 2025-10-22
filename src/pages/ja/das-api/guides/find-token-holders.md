---
title: 特定のトークンの保有者を見つける
metaTitle: トークン保有者を見つける | DAS APIガイド
description: 特定のトークンを保有するすべてのウォレットを発見する方法を学習します
---

このガイドでは、DAS APIを使用してコレクション内の特定のNFTを保有するすべてのウォレットを見つける方法を説明します。これは、トークン配布の理解、クジラ保有者の発見、所有権パターンの分析に役立ちます。

## 方法1：Search Assetsを使用（推奨）

`searchAssets`メソッドは、コレクション内のNFTのすべての保有者を見つける最も効率的な方法です。`getAssetsByGroup`も実行可能なオプションですが、フィルタリング機能が少なくなります。

{% totem %}
{% totem-accordion title="UMI例" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(dasApi())

  // コレクション内の特定のNFTのすべての保有者を見つける
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

  console.log(`${holders.items.length}名の保有者を発見`)
  holders.items.forEach(asset => {
    console.log(`オーナー: ${asset.ownership.owner}`)
    console.log(`トークンID: ${asset.id}`)
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
        grouping: ['collection', 'YOUR_COLLECTION_ADDRESS'],
        limit: 1000,
        options: {
          showCollectionMetadata: true
        }
      }
    })
  })

  const data = await response.json()
  console.log(`コレクション内の${data.result.items.length}個のアセットを発見`)
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

## 方法2：Get Assets By Groupを使用

コレクションベースのNFTには、`getAssetsByGroup`を使用してコレクション内のすべてのNFTを見つけることもできます。これは`searchAssets`より使いやすいですが、さらなるフィルタリングのオプションは少なくなります。

{% totem %}
{% totem-accordion title="UMI例" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi(
    "<<ENDPOINT>>"
  ).use(dasApi());

  // コレクション内のすべてのアセットを取得
  const collectionAssets = await umi.rpc.getAssetsByGroup({
    grouping: ["collection", "COLLECTION_ADDRESS"],
  });

  // ユニークオーナーを抽出
  const uniqueOwners = new Set();
  collectionAssets.items.forEach((asset) => {
    uniqueOwners.add(asset.ownership.owner);
  });

  console.log(`${uniqueOwners.size}名のユニーク保有者を発見`);
  console.log("保有者:", Array.from(uniqueOwners));
})();
```

{% /totem-accordion %}
{% totem-accordion title="JavaScript例" %}

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

  // ユニークオーナーを抽出
  const uniqueOwners = new Set();
  collectionAssets.result.items.forEach((asset) => {
    uniqueOwners.add(asset.ownership.owner);
  });

  console.log(`${uniqueOwners.size}名のユニーク保有者を発見`);
  console.log("保有者:", Array.from(uniqueOwners));
})();
```

{% /totem-accordion %}
{% /totem %}

## 方法3：個別トークンの場合
コレクションの一部ではない特定の個別NFTの保有者を見つけたい場合は、`getAsset`でNFTの特定のアドレスを使用する必要があります。

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

  // 特定のトークンを取得
  const token = await umi.rpc.getAsset({
    assetId: publicKey("SPECIFIC_TOKEN_ID")
  });

  console.log(`トークン ${token.id} は次の所有者が保有: ${token.ownership.owner}`);
})();
```
{% /totem-accordion %}
{% totem-accordion title="JavaScript例" %}

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

## ヒントとベストプラクティス

1. **[ページネーション](/ja/das-api/guides/pagination)を処理**: 大きなコレクションの場合、すべての結果を取得するために常にページネーションを実装してください。

2. **[表示オプション](/ja/das-api/guides/display-options)を使用**: `showCollectionMetadata`を有効にして追加のコレクション情報を取得してください。

3. **結果をキャッシュ**: NFT保有者データが頻繁に変更されない場合は、パフォーマンス向上のために結果をキャッシュすることを検討してください。

4. **レート制限**: 複数のリクエストを行う際は、APIのレート制限に注意してください。

## 関連ガイド

- [コレクション内のすべてのトークンを取得](/ja/das-api/guides/get-collection-nfts)
- [コレクション統計の分析](/ja/das-api/guides/collection-statistics)
- [アセット転送の追跡](/ja/das-api/guides/track-transfers)