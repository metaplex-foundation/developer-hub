---
title: ウォレット内のすべてのトークンを取得
metaTitle: ウォレットトークンを取得 | DAS APIガイド
description: 特定のウォレットが所有するすべてのトークンを取得する方法を学習します
---

このガイドでは、DAS APIを使用して特定のウォレットアドレスが所有するすべてのトークン（NFT、ファンジブルトークン、その他のデジタルアセット）を取得する方法を説明します。

## 方法1：Get Assets By Ownerを使用（推奨）

`getAssetsByOwner`メソッドは、ウォレットが所有するすべてのトークンを取得する最も直接的な方法です。

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

  // ウォレットが所有するすべてのトークンを取得
  const walletTokens = await umi.rpc.getAssetsByOwner({
    owner: publicKey("WALLET_ADDRESS"),
    displayOptions: {
      showCollectionMetadata: true,
      showFungible: true,
    },
  });

  console.log(`${walletTokens.items.length}個のトークンを発見`);
  walletTokens.items.forEach((token) => {
    console.log(`トークン: ${token.id}`);
    console.log(`インターフェース: ${token.interface}`);
    console.log(`名前: ${token.content.metadata?.name || "不明"}`);
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
          showFungible: true,
        },
      },
    }),
  });

  const data = await response.json();
  console.log(`${data.result.items.length}個のトークンを発見`);
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
        "showFungible": true
      }
    }
  }'
```

{% /totem-accordion %}
{% /totem %}

## 方法2：オーナーフィルター付きSearch Assetsを使用

より具体的なクエリの場合、オーナーフィルター付きの`searchAssets`を使用することもできます。この方法はすべてのDAS APIプロバイダーでサポートされているわけではありません。

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

  // 特定のウォレットが所有するすべてのアセットを検索
  const walletAssets = await umi.rpc.searchAssets({
    owner: publicKey("WALLET_ADDRESS"),
    limit: 1000,
    displayOptions: {
      showCollectionMetadata: true,
      showFungible: true,
    },
  });

  console.log(`${walletAssets.items.length}個のアセットを発見`);
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
        limit: 1000,
        options: {
          showCollectionMetadata: true,
          showFungible: true,
        },
      },
    }),
  });

  const data = await response.json();
  console.log(`${data.result.items.length}個のアセットを発見`);
})();
```

{% /totem-accordion %}
{% /totem %}

## ヒントとベストプラクティス

1. **[表示オプション](/jp/das-api/guides/display-options)を使用**: `showCollectionMetadata`と`showFungible`や`showInscription`などの他のオプションを有効にして、完全なトークン情報を取得してください。

2. **[ページネーション](/jp/das-api/guides/pagination)を処理**: 多くのトークンを持つウォレットの場合、常にページネーションを実装してください。

3. **インターフェースでフィルタ**: `interface`パラメーターを使用して特定のトークンタイプを取得してください。

4. **結果をキャッシュ**: ウォレットのコンテンツは頻繁に変更されないため、パフォーマンス向上のためにキャッシュを検討してください。

5. **レート制限**: 複数のリクエストを行う際は、APIのレート制限に注意してください。

## 関連ガイド

- [オーナー別にファンジブルアセットを取得](/jp/das-api/guides/get-fungible-assets)
- [オーナー別にNFTを取得](/jp/das-api/guides/get-nfts-by-owner)
- [オーナーとコレクションでアセットを取得](/jp/das-api/guides/owner-and-collection)
- [コレクション統計の分析](/jp/das-api/guides/collection-statistics)