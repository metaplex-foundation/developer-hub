---
title: ローンチ作成
metaTitle: Genesis - ローンチ作成 | REST API | Metaplex
description: 新しい Genesis トークンローンチのためのオンチェーントランザクションを構築します。署名・送信可能な未署名トランザクションを返します。
method: POST
created: '02-19-2026'
updated: '02-19-2026'
keywords:
  - Genesis API
  - create launch
  - token launch
  - launch transactions
about:
  - API endpoint
  - Launch creation
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---

新しい Genesis トークンローンチのためのオンチェーントランザクションを構築します。[ローンチ登録](/smart-contracts/genesis/integration-apis/register)を呼び出す前に、署名して送信する必要がある未署名トランザクションを返します。 {% .lead %}

{% callout type="warning" title="SDK の使用を推奨" %}
ほとんどのインテグレーターには、SDK の [`createAndRegisterLaunch`](/smart-contracts/genesis/sdk/api-client) の使用を推奨します。この関数はトランザクションの作成、署名、送信、ローンチの登録を1回の呼び出しで処理します。このエンドポイントは、SDK を使用せずに直接 HTTP アクセスが必要な場合にのみ使用してください。
{% /callout %}

{% callout type="note" %}
Genesis プログラムの全機能セットは [metaplex.com](https://www.metaplex.com) ではまだサポートされていないため、Create API（または SDK）を使用してプログラムでローンチを構築することを推奨します。API を通じて作成されたメインネットのローンチは、[登録](/smart-contracts/genesis/integration-apis/register)後に metaplex.com に表示されます。
{% /callout %}

## エンドポイント

```
POST /v1/launches/create
```

## リクエストボディ

| フィールド | 型 | 必須 | 説明 |
|-------|------|----------|-------------|
| `wallet` | `string` | はい | 作成者のウォレット公開鍵 |
| `launch` | `object` | はい | ローンチの完全な設定（下記参照） |

### ローンチ設定

`launch` オブジェクトはトークンとローンチのセットアップ全体を記述します：

| フィールド | 型 | 必須 | 説明 |
|-------|------|----------|-------------|
| `name` | `string` | はい | トークン名、1〜32文字 |
| `symbol` | `string` | はい | トークンシンボル、1〜10文字 |
| `image` | `string` | はい | トークン画像 URL（Irys ゲートウェイ） |
| `description` | `string` | いいえ | トークンの説明、最大250文字 |
| `decimals` | `number` | いいえ | トークンのデシマル（デフォルトは6） |
| `supply` | `number` | いいえ | トークンの総供給量（デフォルトは1,000,000,000） |
| `network` | `string` | いいえ | `'solana-mainnet'`（デフォルト）または `'solana-devnet'` |
| `quoteMint` | `string` | いいえ | クォートトークンのミントアドレス（デフォルトはラップド SOL） |
| `type` | `string` | はい | `'project'` |
| `finalize` | `boolean` | いいえ | ローンチをファイナライズするかどうか（デフォルトは `true`） |
| `allocations` | `array` | はい | アロケーション設定の配列 |
| `externalLinks` | `object` | いいえ | ウェブサイト、Twitter、Telegram のリンク |
| `publicKey` | `string` | はい | `wallet` と同じ値 |

### アロケーションタイプ

`allocations` 配列の各アロケーションには `type` フィールドがあります：

- **`launchpoolV2`** — 比例配分プール
- **`raydiumV2`** — Raydium LP アロケーション
- **`unlockedV2`** — 受取先へのロック解除済みトークン
- **`lockedV2`** — Streamflow によるロック付きトークン
- **`presaleV2`** — 固定価格プレセール

{% callout type="note" %}
SDK の `buildCreateLaunchPayload` 関数は、簡略化された `CreateLaunchInput` をこの完全なペイロード形式に変換します。詳細は [API クライアント](/smart-contracts/genesis/sdk/api-client)のドキュメントを参照してください。
{% /callout %}

## リクエスト例

```bash
curl -X POST https://api.metaplex.com/v1/launches/create \
  -H "Content-Type: application/json" \
  -d '{
    "wallet": "YourWalletPublicKey...",
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
  "transactions": [
    "base64-encoded-transaction-1...",
    "base64-encoded-transaction-2..."
  ],
  "blockhash": {
    "blockhash": "...",
    "lastValidBlockHeight": 123456789
  },
  "mintAddress": "MintPublicKey...",
  "genesisAccount": "GenesisAccountPDA..."
}
```

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `success` | `boolean` | 成功時は `true` |
| `transactions` | `string[]` | Base64 エンコードされたシリアライズ済みトランザクション |
| `blockhash` | `object` | トランザクション確認用のブロックハッシュ |
| `mintAddress` | `string` | トークンミントの公開鍵 |
| `genesisAccount` | `string` | Genesis アカウント PDA の公開鍵 |

## エラーレスポンス

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [...]
}
```

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `success` | `boolean` | エラー時は `false` |
| `error` | `string` | エラーメッセージ |
| `details` | `array?` | バリデーションエラーの詳細（該当する場合） |

## エラーコード

| コード | 説明 |
|------|-------------|
| `400` | 無効な入力またはバリデーション失敗 |
| `500` | 内部サーバーエラー |

## 推奨：SDK の使用

このエンドポイントを直接呼び出す代わりに、[`createAndRegisterLaunch`](/smart-contracts/genesis/sdk/api-client) を使用することを推奨します。この関数はトランザクションの作成、署名、送信、登録のフロー全体を1回の呼び出しで処理します：

{% code-tabs-imported from="genesis/api_easy_mode" frameworks="umi" filename="createAndRegisterLaunch" /%}

SDK の全ドキュメント（3つの統合モードを含む）については、[API クライアント](/smart-contracts/genesis/sdk/api-client)を参照してください。
