---
title: 圧縮NFTを見つける
metaTitle: 圧縮NFTを見つける | DAS APIガイド
description: DAS APIを使用して圧縮NFTを発見し操作する方法を学習します
---

# 圧縮NFTを見つける

このガイドでは、DAS APIを使用して圧縮NFTを見つけて操作する方法を説明します。圧縮NFTは、BubblegumまたはBubblegum V2を使用してSolana上でNFTデータを保存する効率的な方法であり、DAS APIはそれらを処理するための特別なメソッドを提供します。

## 方法1：オーナー別に圧縮NFTを見つける

特定のウォレットが所有する圧縮NFTを発見します：

{% totem %}
{% totem-accordion title="UMI例" %}

```typescript
import { publicKey } from "@metaplex-foundation/umi"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api"

(async () => {
  const umi = createUmi("<ENDPOINT>").use(dasApi());

  // 特定のウォレットが所有するすべてのNFT（圧縮と通常の両方）を見つける
  const allOwnerNfts = await umi.rpc.searchAssets({
    owner: publicKey("WALLET_ADDRESS"),
    limit: 1000
  });

  // 圧縮状態でフィルタリング
  const compressedNfts = allOwnerNfts.items.filter(
    (nft) => nft.compression?.compressed === true
  );
  const regularNfts = allOwnerNfts.items.filter(
    (nft) => !nft.compression?.compressed
  );

  console.log(
    `ウォレットが所有する圧縮NFT ${compressedNfts.length}件を発見`
  );
  console.log(`通常のNFT: ${regularNfts.length}`);
  console.log(`圧縮NFT: ${compressedNfts.length}`);
  console.log(`総NFT数: ${allOwnerNfts.items.length}`);
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
        limit: 1000
      }
    })
  });

  const data = await response.json();
  const allOwnerNfts = data.result;

  // 圧縮状態でフィルタリング
  const compressedNfts = allOwnerNfts.items.filter(
    (nft) => nft.compression?.compressed === true
  );
  const regularNfts = allOwnerNfts.items.filter(
    (nft) => !nft.compression?.compressed
  );

  console.log(
    `ウォレットが所有する圧縮NFT ${compressedNfts.length}件を発見`
  );
  console.log(`通常のNFT: ${regularNfts.length}`);
  console.log(`圧縮NFT: ${compressedNfts.length}`);
  console.log(`総NFT数: ${allOwnerNfts.items.length}`);
})();

```

{% /totem-accordion %}
{% /totem %}

## 方法2：コレクション別に圧縮NFTを見つける

特定のコレクションから圧縮NFTを見つけます：

{% totem %}
{% totem-accordion title="UMI例" %}

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(dasApi())

  // 特定のコレクションからのすべてのNFT（圧縮と通常の両方）を見つける
  const allCollectionNfts = await umi.rpc.searchAssets({
    grouping: [
      'collection',
      '<COLLECTION_ADDRESS>'
    ],
    limit: 1000,
    // オプション：各アセットにコレクションメタデータを表示
    displayOptions: {
      showCollectionMetadata: true
    }
  });

  // 圧縮状態でフィルタリング
  const compressedNfts = allCollectionNfts.items.filter(
    (nft) => nft.compression?.compressed === true
  );
  const regularNfts = allCollectionNfts.items.filter(
    (nft) => !nft.compression?.compressed
  );

  console.log(
    `コレクション内の圧縮NFT ${compressedNfts.length}件を発見`
  );
  console.log(`通常のNFT: ${regularNfts.length}`);
  console.log(`圧縮NFT: ${compressedNfts.length}`);
  console.log(`総NFT数: ${allCollectionNfts.items.length}`);
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

  // 圧縮状態でフィルタリング
  const compressedNfts = allCollectionNfts.items.filter(
    (nft) => nft.compression?.compressed === true
  );
  const regularNfts = allCollectionNfts.items.filter(
    (nft) => !nft.compression?.compressed
  );

  console.log(
    `コレクション内の圧縮NFT ${compressedNfts.length}件を発見`
  );
  console.log(`通常のNFT: ${regularNfts.length}`);
  console.log(`圧縮NFT: ${compressedNfts.length}`);
  console.log(`総NFT数: ${allCollectionNfts.items.length}`);
})();

```

{% /totem-accordion %}
{% /totem %}

## 方法3：クリエイター別に圧縮NFTを見つける

特定のウォレットによって作成された圧縮NFTを発見します：

{% totem %}
{% totem-accordion title="UMI例" %}

```typescript
import { publicKey } from "@metaplex-foundation/umi"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api"

(async () => {
  const umi = createUmi("<ENDPOINT>").use(dasApi());

  // 特定のウォレットによって作成されたすべてのNFT（圧縮と通常の両方）を見つける
  const allCreatorNfts = await umi.rpc.searchAssets({
    creator: publicKey("CREATOR_ADDRESS"),
    displayOptions: {
      showCollectionMetadata: true,
    },
  });

  // 圧縮状態でフィルタリング
  const compressedNfts = allCreatorNfts.items.filter(
    (nft) => nft.compression?.compressed === true
  );
  const regularNfts = allCreatorNfts.items.filter(
    (nft) => !nft.compression?.compressed
  );

  console.log(
    `ウォレットによって作成された圧縮NFT ${compressedNfts.length}件を発見`
  );
  console.log(`クリエイターの通常のNFT: ${regularNfts.length}`);
  console.log(`クリエイターの圧縮NFT: ${compressedNfts.length}`);
  console.log(`クリエイターの総NFT数: ${allCreatorNfts.items.length}`);
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
        creatorAddress: 'CREATOR_ADDRESS',
        options: {
          showCollectionMetadata: true,
        }
      }
    })
  });

  const data = await response.json();
  const allCreatorNfts = data.result;

  // 圧縮状態でフィルタリング
  const compressedNfts = allCreatorNfts.items.filter(
    (nft) => nft.compression?.compressed === true
  );
  const regularNfts = allCreatorNfts.items.filter(
    (nft) => !nft.compression?.compressed
  );

  console.log(
    `ウォレットによって作成された圧縮NFT ${compressedNfts.length}件を発見`
  );
  console.log(`クリエイターの通常のNFT: ${regularNfts.length}`);
  console.log(`クリエイターの圧縮NFT: ${compressedNfts.length}`);
  console.log(`クリエイターの総NFT数: ${allCreatorNfts.items.length}`);
})();

```

{% /totem-accordion %}
{% /totem %}

## ヒントとベストプラクティス

1. **大きな圧縮NFTコレクションには[ページネーション](/ja/dev-tools/das-api/guides/pagination)を使用**
2. **証明が利用できない場合はエラーを適切に処理**
3. **圧縮NFTメタデータには適切な表示オプションを使用**

## さらなる学習

- [コレクション内のすべてのトークンを取得](/ja/dev-tools/das-api/guides/get-collection-nfts) - 特定のコレクションからすべてのアセットを取得
- [オーナー別にNFTを取得](/ja/dev-tools/das-api/guides/get-nfts-by-owner) - ウォレットが所有するすべてのNFTを見つける
- [複数の条件でアセットを検索](/ja/dev-tools/das-api/guides/search-by-criteria) - 高度なクエリのために複数のフィルターを組み合わせる
