---
title: ローンチ登録
metaTitle: Genesis - ローンチ登録 | REST API | Metaplex
description: オンチェーントランザクションの確認後に Genesis ローンチを登録します。オンチェーン状態を検証し、ローンチリスティングを作成します。
method: POST
created: '01-15-2025'
updated: '02-19-2026'
keywords:
  - Genesis API
  - register launch
  - submit launch
  - launch metadata
about:
  - API endpoint
  - Launch registration
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---

[ローンチ作成](/smart-contracts/genesis/integration-apis/create-launch)からのオンチェーントランザクションが確認された後、Genesis ローンチを登録します。このエンドポイントはオンチェーン状態を検証し、ローンチリスティングを作成して、ローンチページの URL を返します。 {% .lead %}

{% callout type="warning" title="SDK の使用を推奨" %}
ほとんどのインテグレーターには、SDK の [`createAndRegisterLaunch`](/smart-contracts/genesis/sdk/api-client) の使用を推奨します。この関数はトランザクションの作成、署名、送信、ローンチの登録を1回の呼び出しで処理します。このエンドポイントは、SDK を使用せずに直接 HTTP アクセスが必要な場合にのみ使用してください。
{% /callout %}

## エンドポイント

```
POST /v1/launches/register
```

## リクエストボディ

| フィールド | 型 | 必須 | 説明 |
|-------|------|----------|-------------|
| `genesisAccount` | `string` | はい | Genesis アカウントの公開鍵（ローンチ作成レスポンスから取得） |
| `network` | `string` | いいえ | `'solana-mainnet'`（デフォルト）または `'solana-devnet'` |
| `launch` | `object` | はい | ローンチ作成で使用したものと同じローンチ設定 |

`launch` オブジェクトは、API がオンチェーン状態と期待される設定の一致を検証できるように、ローンチ作成エンドポイントに送信したものと一致する必要があります。

## リクエスト例

```bash
curl -X POST https://api.metaplex.com/v1/launches/register \
  -H "Content-Type: application/json" \
  -d '{
    "genesisAccount": "GenesisAccountPDA...",
    "network": "solana-devnet",
    "launch": {
      "name": "My Token",
      "symbol": "MTK",
      "image": "https://gateway.irys.xyz/...",
      "decimals": 6,
      "supply": 1000000000,
      "network": "solana-devnet",
      "quoteMint": "So11111111111111111111111111111111111111112",
      "type": "project",
      "finalize": true,
      "publicKey": "YourWalletPublicKey...",
      "allocations": [...]
    }
  }'
```

## 成功レスポンス

```json
{
  "success": true,
  "launch": {
    "id": "uuid-launch-id",
    "link": "https://www.metaplex.com/token/MintPublicKey..."
  },
  "token": {
    "id": "uuid-token-id",
    "mintAddress": "MintPublicKey..."
  }
}
```

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `success` | `boolean` | 成功時は `true` |
| `existing` | `boolean?` | ローンチが既に登録されている場合は `true`（冪等） |
| `launch.id` | `string` | 一意のローンチ ID |
| `launch.link` | `string` | 公開ローンチページの URL |
| `token.id` | `string` | 一意のトークン ID |
| `token.mintAddress` | `string` | トークンミントの公開鍵 |

{% callout type="note" %}
ローンチが既に登録されている場合、エンドポイントは重複を作成せず、`existing: true` を付けて既存のレコードを返します。
{% /callout %}

{% callout type="note" %}
メインネットのローンチは登録後に [metaplex.com](https://www.metaplex.com) に表示されます。返される `launch.link` は公開ローンチページを指します。
{% /callout %}

## エラーレスポンス

```json
{
  "success": false,
  "error": "Genesis account not found on-chain",
  "details": [...]
}
```

## エラーコード

| コード | 説明 |
|------|-------------|
| `400` | 無効な入力、オンチェーン状態の不一致、または Genesis アカウントが見つからない |
| `500` | 内部サーバーエラー |

## バリデーション

登録エンドポイントは広範なオンチェーンバリデーションを実行します：

- Genesis V2 アカウントを取得し、存在することを確認します
- すべてのバケットアカウントが期待されるアロケーションと一致することを検証します
- トークンメタデータ（名前、シンボル、画像）が入力と一致することを確認します
- ミントのプロパティ（供給量、デシマル、権限）をチェックします

## 推奨：SDK の使用

このエンドポイントを直接呼び出す代わりに、[`createAndRegisterLaunch`](/smart-contracts/genesis/sdk/api-client) を使用することを推奨します。この関数はトランザクションの作成、署名、送信、登録のフロー全体を1回の呼び出しで処理します：

{% code-tabs-imported from="genesis/api_easy_mode" frameworks="umi" filename="createAndRegisterLaunch" /%}

SDK の全ドキュメント（3つの統合モードを含む）については、[API クライアント](/smart-contracts/genesis/sdk/api-client)を参照してください。
