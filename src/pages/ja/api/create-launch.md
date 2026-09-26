---
title: ローンチ作成
metaTitle: Metaplex API - ローンチ作成 | REST API | Metaplex
description: 新しい Genesis トークンローンチのためのオンチェーントランザクションを構築します。署名・送信可能な未署名トランザクションを返します。
method: POST
created: '02-19-2026'
updated: '09-26-2026'
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

新しい Genesis トークンローンチのためのオンチェーントランザクションを構築します。[ローンチ登録](/ja/api/register)を呼び出す前に、署名して送信する必要がある未署名トランザクションを返します。 {% .lead %}

{% callout type="warning" title="SDK の使用を推奨" %}
ほとんどのインテグレーターには、SDK の [`createAndRegisterLaunch`](/ja/smart-contracts/genesis/sdk/api-client) の使用を推奨します。この関数はトランザクションの作成、署名、送信、ローンチの登録を1回の呼び出しで処理します。このエンドポイントは、SDK を使用せずに直接 HTTP アクセスが必要な場合にのみ使用してください。
{% /callout %}

{% callout type="note" %}
Genesis プログラムの全機能セットは [metaplex.com](https://www.metaplex.com) ではまだサポートされていないため、Create API（または SDK）を使用してプログラムでローンチを構築することを推奨します。API を通じて作成されたメインネットのローンチは、[登録](/ja/api/register)後に metaplex.com に表示されます。
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
| `agent` | `object` | いいえ | 登録済みの[エージェント](/ja/agents)に代わってローンチします（[エージェントローンチ](#agent-launches)を参照） |

リクエストボディは `includeBackendSigner`、`derivedSignerPublicKey`、`nonce`、`buildAllTxs` も受け付けます。これらは [metaplex.com](https://www.metaplex.com) 自身の署名フローで使用されるものです。API を直接呼び出す場合は指定しないでください。

### ローンチ設定

`launch` オブジェクトはトークンとローンチのセットアップ全体を記述します：

| フィールド | 型 | 必須 | 説明 |
|-------|------|----------|-------------|
| `name` | `string` | はい | トークン名、1〜32文字 |
| `symbol` | `string` | はい | トークンシンボル、1〜10文字 |
| `image` | `string` | はい | トークン画像 URL（Irys ゲートウェイ） |
| `description` | `string` | いいえ | トークンの説明、最大250文字 |
| `decimals` | `number` | いいえ | トークンのデシマル、1〜9（デフォルトは6）。新規トークンの `launchpool` は6である必要があり、既存トークンはオンチェーンのミントと一致する必要があります |
| `supply` | `number` | いいえ | トークンの総供給量（デフォルトは1,000,000,000） |
| `network` | `string` | いいえ | `'solana-mainnet'`（デフォルト）または `'solana-devnet'` |
| `quoteMint` | `string` | いいえ | クォートトークンのミントアドレス（デフォルトはラップド SOL） |
| `type` | `string` | はい | ローンチタイプ（[ローンチタイプ](#launch-types)を参照） |
| `finalize` | `boolean` | いいえ | ローンチをファイナライズするかどうか（デフォルトは `true`） |
| `allocations` | `array` | はい | アロケーション設定の配列 |
| `externalLinks` | `object` | いいえ | ウェブサイト、Twitter、Telegram のリンク |
| `publicKey` | `string` | はい | 作成者のウォレット公開鍵（トップレベルの `wallet` フィールドと一致する必要があります） |
| `useExistingToken` | `boolean` | いいえ | 新しいトークンをミントする代わりに既存の SPL トークンをローンチします（[既存トークン](#existing-tokens)を参照） |
| `mintAddress` | `string` | いいえ | 既存トークンのミント。`useExistingToken` が `true` の場合は必須 |
| `isMutable` | `boolean` | いいえ | トークンのメタデータを変更可能なままにするかどうか（デフォルトは `true`） |

新規トークンの場合、アロケーションの供給量の合計は `supply` と正確に一致する必要があります。デフォルトの 1,000,000,000 以外の `supply` を持つ新規トークンは、アカウントでカスタム供給量が有効になっていない限り `403` を返します。

### ローンチタイプ {% #launch-types %}

| `type` | 説明 |
|--------|-------------|
| `launchpool` | 比例配分プール。アロケーション：`launchpoolV2` と、任意の数の `unlockedV2` および `claimScheduleV2` |
| `presale` | 固定価格プレセール。アロケーション（順序どおり）：`presaleV2`、`unlockedV2`、その後に任意の数の `claimScheduleV2` |
| `bondingCurve` | ボンディングカーブによるローンチ。アロケーション：`bondingCurveV2`。供給量 1,000,000,000、デシマル6、SOL クォートに固定されます |

スキーマには `auction` と `custom` も定義されています。`auction` は未実装のプレースホルダーで、`custom` はパブリック API で `400` として拒否されます。

### アロケーションタイプ {% #allocation-types %}

`allocations` 配列の各アロケーションには `type` フィールド、`name`、`supply`、および同じタイプ名をキーとする設定オブジェクトがあります：

- **`launchpoolV2`** — 比例配分プール
- **`presaleV2`** — 固定価格プレセール
- **`bondingCurveV2`** — ボンディングカーブによる販売
- **`unlockedV2`** — 受取先へのロック解除済みトークン
- **`claimScheduleV2`** — ベスティングスケジュールに従って受取先にリリースされるトークン（クリフは任意）

Raydium の流動性は独立したアロケーションではなく、販売アロケーションのファンドフローとして設定します。`RaydiumLP` フローは Raydium CPMM プールを作成し、`RaydiumClmmLP` フローは Raydium CLMM（集中流動性）ポジションを作成します。CLMM ローンチは、アカウントで有効になっていない限り `403` を返します。

{% callout type="warning" title="Streamflow アロケーションは廃止されました" %}
以前の `lockedV2`（Streamflow）アロケーションタイプは受け付けられなくなりました。ロックおよびベスティングのアロケーションには `claimScheduleV2` を使用してください。
{% /callout %}

### 既存トークン {% #existing-tokens %}

すでにミント済みのトークンをローンチするには、`useExistingToken: true` を設定し、トークンの `mintAddress` を渡します。`decimals` はオンチェーンのミントと一致する必要があります。新規トークンとは異なり、アロケーションは供給量の一部のみを賄うことができます。合計は0より大きく `supply` 以下である必要があり、残りは作成者のウォレットに残ります。既存トークンのローンチは、アカウントで有効になっていない限り `403` を返し、`bondingCurve` タイプでは使用できません。

### エージェントローンチ {% #agent-launches %}

登録済みの[エージェント](/ja/agents)を作成者としてローンチを作成するには、`agent` を渡します：

| フィールド | 型 | 必須 | 説明 |
|-------|------|----------|-------------|
| `agent.mint` | `string` | はい | エージェントの Core アセットアドレス。`wallet` が所有している必要があります |
| `agent.setToken` | `boolean` | はい | ローンチしたトークンをエージェントのトークンとして設定するかどうか |

エージェントのアセットサイナーウォレットがローンチの作成者になります。[ローンチの登録](/ja/api/register)にも同じ `agent.mint` を渡してください。

{% callout type="note" %}
SDK の `buildCreateLaunchPayload` 関数は、簡略化された `CreateLaunchInput` をこの完全なペイロード形式に変換します。詳細は [API クライアント](/ja/smart-contracts/genesis/sdk/api-client)のドキュメントを参照してください。
{% /callout %}

## リクエスト例 — Launch Pool タイプ

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
      "type": "launchpool",
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

このエンドポイントを直接呼び出す代わりに、[`createAndRegisterLaunch`](/ja/smart-contracts/genesis/sdk/api-client) を使用することを推奨します。この関数はトランザクションの作成、署名、送信、登録のフロー全体を1回の呼び出しで処理します：

{% code-tabs-imported from="genesis/api_easy_mode" frameworks="umi" filename="createAndRegisterLaunch" /%}

SDK の全ドキュメント（3つの統合モードを含む）については、[API クライアント](/ja/smart-contracts/genesis/sdk/api-client)を参照してください。
