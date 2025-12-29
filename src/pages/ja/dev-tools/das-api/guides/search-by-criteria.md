---
title: 複数の条件によるアセット検索
metaTitle: 複数の条件によるアセット検索 | DAS API ガイド
description: 複数のフィルターを組み合わせて特定のデジタルアセットを見つける方法を学ぶ
---

このガイドでは、DAS API の `searchAssets` メソッドを使用して、複数のフィルターと条件を使ってデジタルアセットを見つける方法を説明します。この強力なメソッドにより、さまざまなパラメータを組み合わせて、特定のアセットを見つけるための複雑なクエリを作成できます。

## 方法 1: 基本的な複数条件検索

`searchAssets` メソッドを使用すると、複数のフィルターを組み合わせることができます。たとえば、特定のウォレットが所有し、特定のクリエイターによって作成されたアセットを見つけることができます。

{% totem %}
{% totem-accordion title="UMI の例" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi(
    "<ENDPOINT>"
  ).use(dasApi());

  // 複数の条件でアセットを検索
  const searchResults = await umi.rpc.searchAssets({
    owner: publicKey("WALLET_ADDRESS"),
    creator: publicKey("CREATOR_ADDRESS"),
    limit: 1000,
    displayOptions: {
      showCollectionMetadata: true,
    },
  });

  console.log(`Found ${searchResults.items.length} assets matching criteria`);
})();
```
{% /totem-accordion %}
{% totem-accordion title="JavaScript の例" %}

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
          creatorAddress: 'CREATOR_ADDRESS',
          limit: 1000,
          options: {
            showCollectionMetadata: true,
          }
        },
      }),
    }
  );

  const data = await response.json();
  console.log(`Found ${data.result.items.length} assets`);
})();
```
{% /totem-accordion %}
{% totem-accordion title="cURL の例" %}
```bash
curl -X POST <ENDPOINT> \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "searchAssets",
    "params": {
      "ownerAddress": "WALLET_ADDRESS",
      "creatorAddress": "CREATOR_ADDRESS",
      "limit": 1000,
      "options": {
        "showCollectionMetadata": true,
      }
    }
  }'
```
{% /totem-accordion %}
{% /totem %}

## 方法 2: コレクションとオーナーの検索

特定のコレクションから特定のウォレットが所有するアセットを検索します:

{% totem %}
{% totem-accordion title="UMI の例" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi(
    "<ENDPOINT>"
  ).use(dasApi());

  // ウォレットが所有する特定のコレクションからアセットを検索
  const collectionAssets = await umi.rpc.searchAssets({
    owner: publicKey("WALLET_ADDRESS"),
    grouping: ["collection", "COLLECTION_ADDRESS"],
    limit: 1000,
    displayOptions: {
      showCollectionMetadata: true,
    }
  })

  console.log(`Found ${collectionAssets.items.length} assets from collection owned by wallet`)
  console.log(`Total available: ${collectionAssets.total}`)

  // 各アセットを処理
  collectionAssets.items.forEach(asset => {
    console.log(`Asset ID: ${asset.id}`)
    console.log(`Name: ${asset.content.metadata?.name || 'Unknown'}`)
    console.log(`Interface: ${asset.interface}`)
    console.log('---')
  })
})();
```
{% /totem-accordion %}
{% totem-accordion title="JavaScript の例" %}

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
  console.log(`Found ${data.result.items.length} assets from collection owned by wallet`)
})();
```
{% /totem-accordion %}
{% /totem %}

## 方法 3: 複数条件による高度なフィルタリング

複雑なクエリのためにフィルターを組み合わせます。たとえば、次のような NFT を見つけます:
• 特定のコレクションに属している
• 特定のウォレットが所有している
• フリーズまたは圧縮されて**いない**
• 検証済みのクリエイターを持つ
• 作成日で並べ替えられている（降順）
そして、コレクションメタデータを含む:

{% totem %}
{% totem-accordion title="UMI の例" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
    const umi = createUmi(
        "<ENDPOINT>"
      ).use(dasApi());

    // 複数の条件で複雑な検索
    const complexSearch = await umi.rpc.searchAssets({
      owner: publicKey('WALLET_ADDRESS'),
      creator: publicKey('CREATOR_ADDRESS'),
      grouping: ["collection", "COLLECTION_ADDRESS"],
      frozen: false,
      compressed: false,
      displayOptions: {
        showCollectionMetadata: true,
      }
    })

  console.log(
    `Found ${complexSearch.items.length} assets matching complex criteria`
  );
})();
```
{% /totem-accordion %}
{% totem-accordion title="JavaScript の例" %}

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
        creatorAddress: 'CREATOR_ADDRESS',
        grouping: ['collection', 'COLLECTION_ADDRESS'],
        frozen: false,
        compressed: false,
        options: {
          showCollectionMetadata: true,
        }
      }
    })
  })

  const data = await response.json()
  console.log(`Found ${data.result.items.length} assets matching complex criteria`)
})();
```
{% /totem-accordion %}
{% /totem %}
## ヒントとベストプラクティス

1. **シンプルに始める**: 基本的な条件から始めて、徐々に複雑さを追加します
2. **[ページネーション](/das-api/guides/pagination)を使用する**: 大きな結果セットの場合は、適切なページネーションを実装します
3. **結果をキャッシュする**: 頻繁にアクセスされる検索結果を保存します
4. **フィルターを賢く組み合わせる**: フィルターが多すぎると結果が返されない場合があります
5. **空の結果を処理する**: 常に空の結果セットをチェックしますが、一部のアセットは非表示またはまだインデックス化されていない可能性があることに注意してください
6. **[表示オプション](/das-api/display-options)を使用する**: ユースケースに関連する表示オプションを含めます
7. **結果を並べ替える**: データを意味のある方法で表示するために並べ替えを使用します
8. **クエリをテストする**: 既知のデータで検索条件を検証します

## 次のステップ

- [コレクション内のすべてのトークンを取得する](/das-api/guides/get-collection-nfts) - 特定のコレクションからすべてのアセットを取得します
- [オーナーごとに NFT を取得する](/das-api/guides/get-nfts-by-owner) - ウォレットが所有するすべての NFT を検索します
- [クリエイターごとにアセットを取得する](/das-api/methods/get-assets-by-creator) - 特定のウォレットによって作成されたすべてのトークンを発見します

## さらに読む

- [クリエイターごとにアセットを取得する](/das-api/methods/get-assets-by-creator) - 特定のウォレットによって作成されたすべてのトークンを発見します
- [コレクション内のすべてのトークンを取得する](/das-api/guides/get-collection-nfts) - 特定のコレクションからすべてのアセットを取得します
- [圧縮された NFT を見つける](/das-api/guides/find-compressed-nfts) - 圧縮された NFT を発見して操作します
