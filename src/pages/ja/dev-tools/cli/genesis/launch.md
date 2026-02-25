---
title: Launch (API)
metaTitle: Launchコマンド | Metaplex CLI
description: Metaplex CLI（mplx）を使用してGenesis API経由でトークンローンチを作成・登録します。
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
  - q: What is the difference between genesis launch create and the manual flow?
    a: genesis launch createコマンドは、Genesis APIを呼び出してトランザクションを構築し、署名・送信し、Metaplexプラットフォームにローンチを登録するオールインワンフローです。手動フローではcreate、bucket、finalize、registerを個別に実行する必要があります。
  - q: When should I use genesis launch register?
    a: 低レベルCLIコマンド（genesis create、bucket add-launch-poolなど）を使用してGenesisアカウントを既に作成しており、公開ローンチページを取得するためにMetaplexプラットフォームに登録したい場合に使用します。
  - q: What network does the launch command use?
    a: ネットワークは設定済みのRPCエンドポイントから自動検出されます。--networkフラグ（solana-mainnetまたはsolana-devnet）でオーバーライドできます。
---

{% callout title="実行内容" %}
Genesis APIを使用して単一のコマンドでトークンローンチを作成・登録:
- `genesis launch create`で完全なトークンローンチを作成
- `genesis launch register`で既存のGenesisアカウントを登録
{% /callout %}

## 概要

`genesis launch`コマンドは、Genesis APIを使用してトークンをローンチするための効率的な方法を提供します。手動でGenesisアカウントの作成、bucketの追加、ファイナライズ、登録を個別に行う代わりに、APIがフロー全体を処理します。

- **`genesis launch create`**: オールインワンコマンド — APIを通じてトランザクションを構築、署名・送信し、ローンチを登録
- **`genesis launch register`**: 既存のGenesisアカウントをMetaplexプラットフォームに登録して公開ローンチページを取得
- **metaplex.com対応**: APIを通じて作成または登録されたローンチは、公開ローンチページ付きで[metaplex.com](https://metaplex.com)に表示されます
- **総供給量**: 現在1,000,000,000トークンに固定
- **入金期間**: 現在48時間

## 対象範囲外

手動のGenesisアカウント作成、個別のbucket設定、Presaleセットアップ、フロントエンド開発。

**ジャンプ先:** [Launch Create](#launch-create) · [Launch Register](#launch-register) · [ロックされた割り当て](#locked-allocations) · [よくあるエラー](#common-errors) · [FAQ](#faq)

## Launch Create

`mplx genesis launch create`コマンドは、Genesis APIを通じて新しいトークンローンチを作成します。フロー全体を処理します:

1. Genesis APIを呼び出してオンチェーントランザクションを構築
2. トランザクションに署名してネットワークに送信
3. Metaplexプラットフォームにローンチを登録

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
|--------|------|
| `--name <string>` | トークン名（1〜32文字） |
| `--symbol <string>` | トークンシンボル（1〜10文字） |
| `--image <string>` | トークン画像URL（現在`https://gateway.irys.xyz/`で始まる必要あり） |
| `--tokenAllocation <integer>` | Launch Poolのトークン割り当て（総供給量10億の一部） |
| `--depositStartTime <string>` | 入金開始時刻（ISO日付文字列またはUnixタイムスタンプ） |
| `--raiseGoal <integer>` | 調達目標（整数単位、例: 200 SOLの場合は200） |
| `--raydiumLiquidityBps <integer>` | Raydium流動性（ベーシスポイント: 2000〜10000、つまり20%〜100%） |
| `--fundsRecipient <string>` | 資金受取ウォレットアドレス |

### オプションフラグ

| フラグ | 説明 | デフォルト |
|--------|------|-----------|
| `--description <string>` | トークンの説明（最大250文字） | — |
| `--website <string>` | プロジェクトのウェブサイトURL | — |
| `--twitter <string>` | プロジェクトのTwitter URL | — |
| `--telegram <string>` | プロジェクトのTelegram URL | — |
| `--lockedAllocations <path>` | ロックされた割り当て設定のJSONファイルパス | — |
| `--quoteMint <string>` | クォートミント（現在`SOL`または`USDC`に対応） | `SOL` |
| `--network <string>` | ネットワークオーバーライド: `solana-mainnet`または`solana-devnet` | 自動検出 |
| `--apiUrl <string>` | Genesis APIのベースURL | `https://api.metaplex.com` |

### 例

1. SOLでの基本的なローンチ:
```bash {% title="基本的なローンチ" %}
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

2. USDCをクォートミントとして使用:
```bash {% title="USDCでのローンチ" %}
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

3. メタデータとロックされた割り当て付き:
```bash {% title="メタデータと割り当て付きの完全なローンチ" %}
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

成功時、コマンドは以下を表示します:
- **Genesis Account**アドレス
- 新しいトークンの**Mint Address**
- Metaplexプラットフォームでの**Launch ID**と**Launch Link**
- **Token ID**
- エクスプローラーリンク付きのトランザクション署名

## Launch Register

`mplx genesis launch register`コマンドは、既存のGenesisアカウントをMetaplexプラットフォームに登録します。低レベルCLIコマンド（`genesis create`、`bucket add-launch-pool`など）でGenesisアカウントを作成し、公開ローンチページが必要な場合に使用します。

```bash {% title="Genesisアカウントの登録" %}
mplx genesis launch register <GENESIS_ACCOUNT> --launchConfig launch.json
```

### 引数

| 引数 | 説明 | 必須 |
|------|------|------|
| `genesisAccount` | 登録するGenesisアカウントアドレス | はい |

### フラグ

| フラグ | 説明 | 必須 | デフォルト |
|--------|------|------|-----------|
| `--launchConfig <path>` | ローンチ設定のJSONファイルパス | はい | — |
| `--network <string>` | ネットワークオーバーライド: `solana-mainnet`または`solana-devnet` | いいえ | 自動検出 |
| `--apiUrl <string>` | Genesis APIのベースURL | いいえ | `https://api.metaplex.com` |

### ローンチ設定の形式

ローンチ設定JSONファイルは`launch create`の入力と同じ形式を使用します:

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

1. デフォルトのネットワーク検出で登録:
```bash {% title="ローンチの登録" %}
mplx genesis launch register <GENESIS_ACCOUNT> --launchConfig launch.json
```

2. devnetで登録:
```bash {% title="devnetでの登録" %}
mplx genesis launch register <GENESIS_ACCOUNT> \
  --launchConfig launch.json \
  --network solana-devnet
```

### 出力

成功時、コマンドは以下を表示します:
- Metaplexプラットフォームでの**Launch ID**と**Launch Link**
- **Token ID**と**Mint Address**

アカウントが既に登録されている場合、その旨を報告し、既存のローンチ詳細を表示します。

## ロックされた割り当て

ロックされた割り当てを使用すると、ベスティングスケジュール付きでトークン供給の一部を確保できます。`--lockedAllocations`でJSON配列ファイルとして指定します。

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
| `vestingStartTime` | string | ベスティング開始のISO日付文字列 |
| `vestingDuration` | object | `value`（数値）と`unit`を持つ期間オブジェクト |
| `unlockSchedule` | string | トークンがアンロックされる頻度 |
| `cliff` | object | `duration`と`unlockAmount`を持つオプションのクリフ設定 |

### 有効な時間単位

`SECOND`、`MINUTE`、`HOUR`、`DAY`、`WEEK`、`TWO_WEEKS`、`MONTH`、`QUARTER`、`YEAR`

## よくあるエラー

| エラー | 原因 | 修正方法 |
|--------|------|----------|
| API request failed | ネットワークの問題または無効な入力 | エラーレスポンスの詳細を確認してください — バリデーションエラーの場合、コマンドはAPIレスポンス本文を表示します |
| Locked allocations file not found | ファイルパスが間違っている | 割り当てJSONファイルへのパスを確認してください |
| Must contain a JSON array | 割り当てファイルが配列でない | JSONファイルがオブジェクトではなく配列`[...]`を含むことを確認してください |
| raydiumLiquidityBps out of range | 値が2000〜10000の範囲外 | 2000（20%）から10000（100%）の間の値を使用してください |
| Launch config missing required fields | registerの設定が不完全 | ローンチ設定JSONに`token`、`launch`、`launchType: "project"`が含まれていることを確認してください |

## FAQ

**`genesis launch create`と手動フローの違いは何ですか？**
`genesis launch create`コマンドは、Genesis APIを呼び出してトランザクションを構築し、署名・送信し、Metaplexプラットフォームにローンチを登録するオールインワンフローです。手動フローでは`create`、`bucket add-launch-pool`、`finalize`、registerを個別に実行する必要があります。

**`genesis launch register`はいつ使用すべきですか？**
低レベルCLIコマンド（`genesis create`、`bucket add-launch-pool`など）を使用してGenesisアカウントを既に作成しており、公開ローンチページを取得するためにMetaplexプラットフォームに登録したい場合に使用します。

**launchコマンドはどのネットワークを使用しますか？**
ネットワークは設定済みのRPCエンドポイントから自動検出されます。`--network`フラグ（`solana-mainnet`または`solana-devnet`）でオーバーライドできます。

**カスタムのクォートミントを使用できますか？**
APIは現在`SOL`（デフォルト）と`USDC`に対応しています。USDCを使用するには`--quoteMint USDC`を指定してください。

**トークンの総供給量はいくつですか？**
APIフローを使用する場合、総供給量は現在1,000,000,000トークンに固定されています。
