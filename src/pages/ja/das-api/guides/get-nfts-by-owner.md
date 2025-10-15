---
title: オーナー別のNFT取得
metaTitle: オーナー別のNFT取得 | DAS APIガイド
description: 特定のウォレットが所有するすべてのnon-fungibleトークンを取得する方法を学びます
---

# オーナー別のNFT取得

このガイドでは、DAS APIを使用して、特定のウォレットアドレスが所有するすべてのnon-fungibleトークン(NFT)を取得する方法を説明します。これは、NFTギャラリー、ポートフォリオトラッカー、マーケットプレイス機能の構築に役立ちます。

## 方法1: インターフェースフィルターを使用したGet Assets By Owner(推奨)

`getAssetsByOwner`メソッドとインターフェースフィルタリングの組み合わせは、特定のウォレットが所有するNFTを取得する最も効率的な方法です。インターフェースフィルターに該当するNFTのみを返します。例えば、`MplCoreAsset`は圧縮NFTを返しません。

{% totem %}
{% totem-accordion title="UMI例" %}

```typescript
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";

(async () => {
  const umi = createUmi(
    "<ENDPOINT>"
  ).use(dasApi());
  console.log("umi.rpc.getAssetsByOwner");
  // 特定のウォレットが所有するすべてのNFTを取得
  const ownerNfts = await umi.rpc.getAssetsByOwner({
    owner: publicKey("WALLET_ADDRESS"),
    interface: "MplCoreAsset", //オプション、これがないとウォレットが所有するすべてのassetを取得します
    displayOptions: {
      showCollectionMetadata: true,
      showFungible: false, // fungibleトークンを除外
    },
  });

  console.log(`このウォレットが所有する${ownerNfts.items.length}個のNFTが見つかりました`);
  console.log(`合計asset数: ${ownerNfts.total}`);

  // 各NFTを処理
  ownerNfts.items.forEach((nft) => {
    console.log(`NFT ID: ${nft.id}`);
    console.log(`名前: ${nft.content.metadata?.name || "不明"}`);
    console.log(
      `コレクション: ${
        nft.grouping?.find((g) => g.group_key === "collection")?.group_value ||
        "なし"
      }`
    );
    console.log("---");
  });
})();
```

{% /totem-accordion %}
{% totem-accordion title="JavaScript例" %}

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
          showFungible: false, // fungibleトークンを除外
        },
      },
    }),
  });

  const data = await response.json();
  console.log(`${data.result.items.length}個のNFTが見つかりました`);
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

## 方法2: オーナーとインターフェースフィルターを使用したSearch Assets

`searchAssets`を使用して、`MplCoreAsset`のみを取得するようなインターフェースなどの追加フィルターでより具体的な結果を得ることができます。

{% totem %}
{% totem-accordion title="UMI例" %}
```typescript
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";

(async () => {
  const umi = createUmi(
    "<ENDPOINT>"
  ).use(dasApi());

  // 特定のウォレットが所有するNFTを検索
  const ownerNfts = await umi.rpc.searchAssets({
    owner: publicKey("WALLET_ADDRESS"),
    limit: 1000,
    interface: "MplCoreAsset",
    displayOptions: {
      showCollectionMetadata: true,
    },
  });

  console.log(`${ownerNfts.items.length}個のCore Assetが見つかりました`);
})();


```
{% /totem-accordion %}
{% totem-accordion title="JavaScript例" %}
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
  console.log(`${data.result.items.length}個のCore Assetが見つかりました`);
})();
```
{% /totem-accordion %}
{% /totem %}

## 方法3 – コレクション別のNFTフィルタリング

ウォレットアドレスに加えて、特定のコレクションでNFTをフィルタリングできます。例えば、自分のコレクションからNFTを探す場合などです。

{% totem %}
{% totem-accordion title="UMI例" %}
```typescript
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";

(async () => {
  const umi = createUmi(
    "<ENDPOINT>"
  ).use(dasApi());

  // このウォレットが所有する特定のコレクションのNFTを取得
  const collectionNfts = await umi.rpc.searchAssets({
    owner: publicKey("WALLET_ADDRESS"),
    grouping: ["collection", "COLLECTION_ADDRESS"],
    limit: 1000,
    displayOptions: {
      showCollectionMetadata: true,
      showFungible: false,
    },
  });

  console.log(`このコレクションから${collectionNfts.items.length}個のNFTが見つかりました`);
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
  console.log(`このウォレット内のこのコレクションから${data.result.items.length}個のNFTが見つかりました`);
})();

```
{% /totem-accordion %}
{% /totem %}

## 一般的なユースケース

- **NFTギャラリー**: ユーザーが所有するすべてのNFTを表示
- **ポートフォリオトラッカー**: NFT保有を監視
- **マーケットプレイス統合**: ユーザーのNFTインベントリを表示
- **コレクション管理**: コレクション別にNFTを整理
- **ゲームアプリケーション**: ユーザーのNFTゲームアセットを読み込む

## ヒントとベストプラクティス

1. **インターフェースフィルタリングを使用する** NFTのみを取得(例: fungibleトークンを除外)
2. **[ページネーション](/jp/das-api/guides/pagination)を実装する** 多数のNFTを持つウォレット用
3. **結果をキャッシュする** 頻繁なクエリのパフォーマンスを向上
4. **[表示オプション](/jp/das-api/guides/display-options)を含める** 追加のメタデータを取得
5. **結果をソートする** 意味のある方法でデータを提示
6. **コレクション別にフィルタリングする** 特定のNFTタイプに焦点を当てる

## 関連情報

- [クリエーター別のAsset取得](/jp/das-api/methods/get-assets-by-creator) - 特定のアドレスによって作成されたすべてのトークンを発見
- [コレクション内のすべてのトークン取得](/jp/das-api/guides/get-collection-nfts) - 特定のコレクションからすべてのassetを取得
- [複数の基準によるAsset検索](/jp/das-api/guides/search-by-criteria) - 高度なクエリのために複数のフィルターを組み合わせる
