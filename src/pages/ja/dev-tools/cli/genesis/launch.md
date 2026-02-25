---
title: Launch（API）
metaTitle: Launch コマンド | Metaplex CLI
description: Metaplex CLI（mplx）を使用して Genesis API 経由でトークンローンチを作成・登録します。
keywords:
  - Genesis launch
  - token launch CLI
  - mplx genesis launch
  - Genesis API
  - Metaplex CLI
about:
  - Genesis API token launches
  - one-command token launch
  - launch registration
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
faqs:
  - q: genesis launch create と手動フローの違いは何ですか？
    a: genesis launch create コマンドは、Genesis API を呼び出してトランザクションを構築し、署名・送信し、Metaplex プラットフォームにローンチを登録する、オールインワンのフローです。手動フローでは create、bucket、finalize、register のステップを個別に実行する必要があります。
  - q: genesis launch register はいつ使用すべきですか？
    a: 低レベルの CLI コマンド（genesis create、bucket add-launch-pool など）を使用して genesis アカウントを作成済みで、Metaplex プラットフォームに登録して公開ローンチページを取得したい場合に使用します。
  - q: launch コマンドはどのネットワークを使用しますか？
    a: ネットワークは設定された RPC エンドポイントから自動検出されます。--network フラグ（solana-mainnet または solana-devnet）でオーバーライドできます。
---

{% callout title="このページで行うこと" %}
Genesis API を使用してトークンローンチを単一コマンドで作成・登録：
- `genesis launch create` で完全なトークンローンチを作成
- `genesis launch register` で既存の genesis アカウントを登録
{% /callout %}

## 概要

`genesis launch` コマンドは、Genesis API を使用してトークンをローンチするための合理化された方法を提供します。genesis アカウントの作成、bucket の追加、ファイナライズ、登録を個別に行う代わりに、API がフロー全体を処理します。

- **`genesis launch create`**: オールインワンコマンド — API 経由でトランザクションを構築、署名・送信、ローンチを登録
- **`genesis launch register`**: 既存の genesis アカウントを Metaplex プラットフォームに登録して公開ローンチページを取得
- **metaplex.com 対応**: API を通じて作成または登録されたローンチは [metaplex.com](https://metaplex.com) に公開ローンチページとして表示されます
- **総供給量**: 現在 1,000,000,000 トークンで固定
- **入金期間**: 現在 48 時間

## 対象外

手動の genesis アカウント作成、個別の bucket 設定、Presale のセットアップ、フロントエンド開発。

**移動先:** [Launch Create](#launch-create) · [Launch Register](#launch-register) · [ロック付き割り当て](#locked-allocations) · [一般的なエラー](#common-errors) · [FAQ](#faq)

## Launch Create

`mplx genesis launch create` コマンドは、Genesis API を使用して新しいトークンローンチを作成します。フロー全体を処理します：

1. Genesis API を呼び出してオンチェーントランザクションを構築
2. 署名してネットワークに送信
3. Metaplex プラットフォームにローンチを登録

```bash {% title="トークンローンチの作成" %}
mplx genesis launch create \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --tokenAllocation 500000000 \
  --depositStartTime 2025-03-01T00:00:00Z \
  --raiseGoal 200 \
  --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS>
```

### 必須フラグ

| フラグ | 説明 |
|-------|------|
| `--name <string>` | トークン名（1〜32文字） |
| `--symbol <string>` | トークンシンボル（1〜10文字） |
| `--image <string>` | トークン画像の URL（現在 `https://gateway.irys.xyz/` で始まる必要があります） |
| `--tokenAllocation <integer>` | Launch Pool のトークン割り当て（総供給量10億のうちの一部） |
| `--depositStartTime <string>` | 入金開始時刻（ISO 日付文字列または Unix タイムスタンプ） |
| `--raiseGoal <integer>` | 調達目標（整数単位、例: 200 SOL の場合は 200） |
| `--raydiumLiquidityBps <integer>` | Raydium 流動性（basis points、2000〜10000、つまり 20%〜100%） |
| `--fundsRecipient <string>` | 資金受取人のウォレットアドレス |

### オプションフラグ

| フラグ | 説明 | デフォルト |
|-------|------|-----------|
| `--description <string>` | トークンの説明（最大250文字） | — |
| `--website <string>` | プロジェクトのウェブサイト URL | — |
| `--twitter <string>` | プロジェクトの Twitter URL | — |
| `--telegram <string>` | プロジェクトの Telegram URL | — |
| `--lockedAllocations <path>` | ロック付き割り当て設定の JSON ファイルパス | — |
| `--quoteMint <string>` | Quote mint（現在 `SOL` または `USDC` に対応） | `SOL` |
| `--network <string>` | ネットワークのオーバーライド: `solana-mainnet` または `solana-devnet` | 自動検出 |
| `--apiUrl <string>` | Genesis API のベース URL | `https://api.metaplex.com` |

### 例

1. SOL での基本的なローンチ：
```bash {% title="Basic launch" %}
mplx genesis launch create \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --tokenAllocation 500000000 \
  --depositStartTime 2025-03-01T00:00:00Z \
  --raiseGoal 200 \
  --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS>
```

2. USDC を quote mint として使用：
```bash {% title="Launch with USDC" %}
mplx genesis launch create \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --tokenAllocation 500000000 \
  --depositStartTime 1709251200 \
  --raiseGoal 200 \
  --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS> \
  --quoteMint USDC
```

3. メタデータとロック付き割り当て付き：
```bash {% title="Full launch with metadata and allocations" %}
mplx genesis launch create \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --description "A community token for builders" \
  --website "https://example.com" \
  --twitter "https://x.com/myproject" \
  --telegram "https://t.me/myproject" \
  --tokenAllocation 500000000 \
  --depositStartTime 2025-03-01T00:00:00Z \
  --raiseGoal 200 \
  --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS> \
  --lockedAllocations allocations.json
```

### 出力

成功すると、コマンドは以下を表示します：
- **Genesis Account** アドレス
- 新しいトークンの **Mint Address**
- Metaplex プラットフォーム上の **Launch ID** と **Launch Link**
- **Token ID**
- エクスプローラーリンク付きのトランザクション署名

## Launch Register

`mplx genesis launch register` コマンドは、既存の genesis アカウントを Metaplex プラットフォームに登録します。低レベルの CLI コマンド（`genesis create`、`bucket add-launch-pool` など）を使用して genesis アカウントを作成し、公開ローンチページが必要な場合に使用します。

```bash {% title="genesis アカウントの登録" %}
mplx genesis launch register <GENESIS_ACCOUNT> --launchConfig launch.json
```

### 引数

| 引数 | 説明 | 必須 |
|------|------|------|
| `genesisAccount` | 登録する Genesis アカウントアドレス | はい |

### フラグ

| フラグ | 説明 | 必須 | デフォルト |
|-------|------|------|-----------|
| `--launchConfig <path>` | ローンチ設定の JSON ファイルパス | はい | — |
| `--network <string>` | ネットワークのオーバーライド: `solana-mainnet` または `solana-devnet` | いいえ | 自動検出 |
| `--apiUrl <string>` | Genesis API のベース URL | いいえ | `https://api.metaplex.com` |

### Launch Config の形式

ローンチ設定の JSON ファイルは `launch create` の入力と同じ形式を使用します：

```json {% title="launch.json" %}
{
  "wallet": "<WALLET_ADDRESS>",
  "token": {
    "name": "My Token",
    "symbol": "MTK",
    "image": "https://gateway.irys.xyz/abc123",
    "description": "Optional description",
    "externalLinks": {
      "website": "https://example.com",
      "twitter": "https://x.com/myproject"
    }
  },
  "launchType": "project",
  "launch": {
    "launchpool": {
      "tokenAllocation": 500000000,
      "depositStartTime": "2025-03-01T00:00:00Z",
      "raiseGoal": 200,
      "raydiumLiquidityBps": 5000,
      "fundsRecipient": "<WALLET_ADDRESS>"
    }
  },
  "quoteMint": "SOL"
}
```

### 例

1. デフォルトのネットワーク検出で登録：
```bash {% title="Register launch" %}
mplx genesis launch register <GENESIS_ACCOUNT> --launchConfig launch.json
```

2. devnet で登録：
```bash {% title="Register on devnet" %}
mplx genesis launch register <GENESIS_ACCOUNT> \
  --launchConfig launch.json \
  --network solana-devnet
```

### 出力

成功すると、コマンドは以下を表示します：
- Metaplex プラットフォーム上の **Launch ID** と **Launch Link**
- **Token ID** と **Mint Address**

アカウントが既に登録されている場合、コマンドはその旨を報告し、既存のローンチ詳細を表示します。

## ロック付き割り当て

ロック付き割り当てにより、べスティングスケジュール付きでトークン供給量の一部を予約できます。`--lockedAllocations` で JSON 配列ファイルとして指定します。

```json {% title="allocations.json" %}
[
  {
    "name": "Team",
    "recipient": "<WALLET_ADDRESS>",
    "tokenAmount": 200000000,
    "vestingStartTime": "2025-04-01T00:00:00Z",
    "vestingDuration": { "value": 1, "unit": "YEAR" },
    "unlockSchedule": "MONTH",
    "cliff": {
      "duration": { "value": 3, "unit": "MONTH" },
      "unlockAmount": 50000000
    }
  }
]
```

### フィールド

| フィールド | 型 | 説明 |
|-----------|------|------|
| `name` | string | この割り当ての名前 |
| `recipient` | string | 受取人のウォレットアドレス |
| `tokenAmount` | number | 割り当てるトークン数 |
| `vestingStartTime` | string | べスティング開始の ISO 日付文字列 |
| `vestingDuration` | object | `value`（数値）と `unit` を持つ期間 |
| `unlockSchedule` | string | トークンのアンロック頻度 |
| `cliff` | object | オプションのクリフ。`duration` と `unlockAmount` を持つ |

### 有効な時間単位

`SECOND`, `MINUTE`, `HOUR`, `DAY`, `WEEK`, `TWO_WEEKS`, `MONTH`, `QUARTER`, `YEAR`

## 一般的なエラー

| エラー | 原因 | 対処法 |
|-------|------|--------|
| API request failed | ネットワークの問題または無効な入力 | エラーレスポンスの詳細を確認してください — バリデーションエラー時にはコマンドが API レスポンスボディを表示します |
| Locked allocations file not found | ファイルパスが間違っている | 割り当て JSON ファイルのパスを確認してください |
| Must contain a JSON array | 割り当てファイルが配列でない | JSON ファイルがオブジェクトではなく配列 `[...]` を含むことを確認してください |
| raydiumLiquidityBps out of range | 値が 2000〜10000 の範囲外 | 2000（20%）から 10000（100%）の間の値を使用してください |
| Launch config missing required fields | register 用の設定が不完全 | ローンチ設定 JSON に `token`、`launch`、`launchType: "project"` が含まれていることを確認してください |

## FAQ

**`genesis launch create` と手動フローの違いは何ですか？**
`genesis launch create` コマンドは、Genesis API を呼び出してトランザクションを構築し、署名・送信し、Metaplex プラットフォームにローンチを登録する、オールインワンのフローです。手動フローでは `create`、`bucket add-launch-pool`、`finalize`、register のステップを個別に実行する必要があります。

**`genesis launch register` はいつ使用すべきですか？**
低レベルの CLI コマンド（`genesis create`、`bucket add-launch-pool` など）を使用して genesis アカウントを作成済みで、Metaplex プラットフォームに登録して公開ローンチページを取得したい場合に使用します。

**launch コマンドはどのネットワークを使用しますか？**
ネットワークは設定された RPC エンドポイントから自動検出されます。`--network` フラグ（`solana-mainnet` または `solana-devnet`）でオーバーライドできます。

**カスタム quote mint を使用できますか？**
API は現在 `SOL`（デフォルト）と `USDC` に対応しています。USDC を使用するには `--quoteMint USDC` を渡してください。

**トークンの総供給量はいくつですか？**
API フローを使用する場合、総供給量は現在 1,000,000,000 トークンで固定されています。
