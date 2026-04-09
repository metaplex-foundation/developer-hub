---
title: Launch（API）
metaTitle: Launch コマンド | Metaplex CLI
description: Metaplex CLI（mplx）を使用して Genesis API 経由でトークンローンチを作成・登録します — launchpool と bonding curve、オプションの agent 統合に対応。
keywords:
  - Genesis launch
  - token launch CLI
  - mplx genesis launch
  - Genesis API
  - Metaplex CLI
  - bonding curve
  - agent token
about:
  - Genesis API token launches
  - one-command token launch
  - launch registration
  - bonding curve launch
  - agent token launch
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
  - q: launchpool と bonding-curve の違いは何ですか？
    a: launchpool には 48 時間の入金ウィンドウがあり、ユーザーは SOL を入金してトークンを比例配分で受け取ります。bonding curve は constant product AMM で即座に取引が開始され、SOL が流入するにつれて価格が上昇し、すべてのトークンが売却されると Raydium CPMM に自動卒業します。
  - q: agent をトークンローンチにリンクできますか？
    a: はい。--agentMint に agent の Core asset アドレスを渡します。これにより agent の PDA からクリエイターフィーウォレットが自動導出されます。--agentSetToken を追加すると、トークンが agent に永久的にリンクされます（不可逆）。
---

{% callout title="このページで行うこと" %}
Genesis API を使用してトークンローンチを単一コマンドで作成・登録：
- **launchpool** を作成（48 時間の入金ウィンドウ、比例配分）
- **bonding curve** を作成（即時取引、Raydium に自動卒業）
- オプションで `--agentMint` を使用してローンチを [agent](/ja/agents/mint-agent) にリンク
- `genesis launch register` で既存の genesis アカウントを登録
{% /callout %}

## 概要

`genesis launch` コマンドは、Genesis API を使用してトークンをローンチするための合理化された方法を提供します。genesis アカウントの作成、bucket の追加、ファイナライズ、登録を個別に行う代わりに、API がフロー全体を処理します。

- **`genesis launch create`**: オールインワンコマンド — API 経由でトランザクションを構築、署名・送信、ローンチを登録
- **`genesis launch register`**: 既存の genesis アカウントを Metaplex プラットフォームに登録して公開ローンチページを取得
- **2 つのローンチタイプ**: `launchpool`（デフォルト、48 時間入金、設定可能な割り当て）と `bonding-curve`（即時 bonding curve、入金ウィンドウなし）
- **Agent サポート**: `--agentMint` と任意の `--agentSetToken` でローンチを登録済み agent にリンク
- **metaplex.com 対応**: API を通じて作成または登録されたローンチは [metaplex.com](https://metaplex.com) に公開ローンチページとして表示されます
- **総供給量**: 現在 1,000,000,000 トークンで固定

**ジャンプ先:** [Launch Create](#launch-create) · [Bonding Curve](#bonding-curve) · [Agent ローンチ](#agent-launches) · [Launch Register](#launch-register) · [ロック付き割り当て](#locked-allocations) · [一般的なエラー](#common-errors) · [FAQ](#faq)

## Launch Create

`mplx genesis launch create` コマンドは、Genesis API を使用して新しいトークンローンチを作成します。フロー全体を処理します：

1. Genesis API を呼び出してオンチェーントランザクションを構築
2. 署名してネットワークに送信
3. Metaplex プラットフォームにローンチを登録

2 つのローンチタイプが利用可能です：

- **`launchpool`**（デフォルト）: 48 時間の入金ウィンドウ、比例的なトークン配布、設定可能な割り当て。`--tokenAllocation`、`--depositStartTime`、`--raiseGoal`、`--raydiumLiquidityBps`、`--fundsRecipient` が必要です。
- **`bonding-curve`**: 即時 bonding curve（constant product AMM）。取引は即座に開始 — 入金ウィンドウなし。すべてのトークンが売却されると Raydium CPMM に自動卒業します。`--name`、`--symbol`、`--image` のみ必要です。

### Launchpool の例

```bash {% title="launchpool ローンチの作成" %}
mplx genesis launch create \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --tokenAllocation 500000000 \
  --depositStartTime 2025-03-01T00:00:00Z \
  --raiseGoal 250 \
  --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS>
```

### 全フラグ

| フラグ | 説明 | 必須 | デフォルト |
|-------|------|------|-----------|
| `--launchType <string>` | `launchpool` または `bonding-curve` | いいえ | `launchpool` |
| `--name <string>` | トークン名（1〜32文字） | はい | — |
| `--symbol <string>` | トークンシンボル（1〜10文字） | はい | — |
| `--image <string>` | トークン画像の URL（`https://gateway.irys.xyz/` で始まる必要があります） | はい | — |
| `--tokenAllocation <integer>` | Launch Pool のトークン割り当て（総供給量10億のうちの一部） | Launchpool のみ | — |
| `--depositStartTime <string>` | 入金開始時刻（ISO 日付文字列または Unix タイムスタンプ） | Launchpool のみ | — |
| `--raiseGoal <integer>` | 調達目標（整数単位、例: 250 = 250 SOL） | Launchpool のみ | — |
| `--raydiumLiquidityBps <integer>` | Raydium 流動性（basis points、2000〜10000、つまり 20%〜100%） | Launchpool のみ | — |
| `--fundsRecipient <string>` | 調達資金のロック解除分を受け取るウォレット | Launchpool のみ | — |
| `--creatorFeeWallet <string>` | クリエイターフィーを受け取るウォレット（常に有効、フィーは蓄積され卒業後に請求） | いいえ（bonding-curve のみ） | ローンチウォレット |
| `--firstBuyAmount <number>` | ローンチ時の手数料無料の初回購入の SOL 金額 | いいえ（bonding-curve のみ） | — |
| `--agentMint <string>` | agent の Core asset アドレス — agent PDA からクリエイターフィーウォレットを自動導出 | いいえ | — |
| `--agentSetToken` | ローンチされたトークンを agent に永久的にリンク（**不可逆**）。`--agentMint` が必要 | いいえ | `false` |
| `--description <string>` | トークンの説明（最大 250 文字） | いいえ | — |
| `--website <string>` | プロジェクトのウェブサイト URL | いいえ | — |
| `--twitter <string>` | プロジェクトの Twitter URL | いいえ | — |
| `--telegram <string>` | プロジェクトの Telegram URL | いいえ | — |
| `--lockedAllocations <path>` | ロック付き割り当て設定の JSON ファイルパス（launchpool のみ） | いいえ | — |
| `--quoteMint <string>` | Quote mint（`SOL` または `USDC`） | いいえ | `SOL` |
| `--network <string>` | ネットワークのオーバーライド: `solana-mainnet` または `solana-devnet` | いいえ | 自動検出 |
| `--apiUrl <string>` | Genesis API のベース URL | いいえ | `https://api.metaplex.com` |

### Launchpool の例

1. SOL での基本的なローンチ：
```bash {% title="Basic launch" %}
mplx genesis launch create \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --tokenAllocation 500000000 \
  --depositStartTime 2025-03-01T00:00:00Z \
  --raiseGoal 250 \
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
  --raiseGoal 5000 \
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
  --raiseGoal 250 \
  --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS> \
  --lockedAllocations allocations.json
```

## Bonding Curve

bonding curve ローンチは、取引が即座に開始される constant product AMM を作成します。SOL がカーブに流入するにつれて価格が上昇します。すべてのトークンが売却されると、カーブは Raydium CPMM プールに自動卒業します。

```bash {% title="Basic bonding curve launch" %}
mplx genesis launch create --launchType bonding-curve \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123"
```

`--name`、`--symbol`、`--image` のみ必要です — すべてのプロトコルパラメータはデフォルト値を使用します。

{% callout type="note" %}
bonding curve ローンチではクリエイターフィーが常に有効です — デフォルトではローンチウォレットに設定されます。フィーは取引中に bucket に蓄積され、カーブが Raydium に卒業した後に別途請求する必要があります。
{% /callout %}

### クリエイターフィー付き

スワップフィーの一部を特定のウォレットに振り向けます：

```bash {% title="Bonding curve with creator fee" %}
mplx genesis launch create --launchType bonding-curve \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --creatorFeeWallet <FEE_WALLET_ADDRESS>
```

### 初回購入付き

ローンチウォレット用の手数料無料の初回購入を予約します：

```bash {% title="Bonding curve with first buy" %}
mplx genesis launch create --launchType bonding-curve \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --firstBuyAmount 0.1
```

初回購入金額は SOL 単位です（例: `0.1` = 0.1 SOL）。初回購入にはプロトコルフィーもクリエイターフィーも課されません。

## Agent ローンチ

`--agentMint` を渡すことで、トークンローンチを登録済みの [agent](/ja/agents/mint-agent) にリンクします。launchpool と bonding curve の両方のローンチタイプで動作します。

`--agentMint` が指定された場合：
- **クリエイターフィーウォレット** が agent の Core asset signer PDA から自動導出されます
- bonding curve の場合、**初回購入の購入者** はデフォルトで agent PDA になります（`--firstBuyAmount` が設定されている場合）

```bash {% title="Bonding curve with agent" %}
mplx genesis launch create --launchType bonding-curve \
  --name "Agent Token" \
  --symbol "AGT" \
  --image "https://gateway.irys.xyz/abc123" \
  --agentMint <AGENT_CORE_ASSET_ADDRESS> \
  --agentSetToken
```

{% callout title="agentSetToken は不可逆です" type="warning" %}
`--agentSetToken` はローンチされたトークンを agent に永久的にリンクします。この操作は取り消せません。リンクせずにローンチするにはこのフラグを省略し、後から `mplx agents set-agent-token` でリンクしてください。
{% /callout %}

### エンドツーエンド: Agent 登録 + トークンローンチ

```bash {% title="Register agent then launch token" %}
# 1. 新しい agent を登録
mplx agents register --name "My Agent" \
  --description "An autonomous trading agent" \
  --image "./avatar.png"
# 出力の asset アドレスをメモします（例: 7BQj...）

# 2. agent にリンクした bonding curve トークンをローンチ
mplx genesis launch create --launchType bonding-curve \
  --name "Agent Token" --symbol "AGT" \
  --image "https://gateway.irys.xyz/abc123" \
  --agentMint <ASSET_ADDRESS> --agentSetToken

# 3. (オプション) agent にトークンがリンクされたことを確認
mplx agents fetch <ASSET_ADDRESS>
```

{% callout title="RPC 伝播遅延" type="note" %}
ステップ 2 で「Agent is not owned by the connected wallet」エラーが発生した場合、API バックエンドが新しく登録された agent をまだインデックスしていません。オンチェーンのトークン作成は成功している可能性があります — `mplx agents fetch <ASSET>` で確認してください。agent に既にトークンが設定されている場合、プラットフォーム登録のみ失敗しています。`mplx genesis launch register` で完了してください。両方のステップをスクリプト化する場合、agent 登録とローンチコマンドの間に約 30 秒の遅延を追加してください。
{% /callout %}

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

ローンチ設定の JSON ファイルは `launch create` の入力と同じ形式を使用します。

**Launchpool 設定：**

```json {% title="launch-launchpool.json" %}
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
  "launchType": "launchpool",
  "launch": {
    "launchpool": {
      "tokenAllocation": 500000000,
      "depositStartTime": "2025-03-01T00:00:00Z",
      "raiseGoal": 250,
      "raydiumLiquidityBps": 5000,
      "fundsRecipient": "<WALLET_ADDRESS>"
    }
  },
  "quoteMint": "SOL"
}
```

**Bonding curve 設定：**

```json {% title="launch-bonding-curve.json" %}
{
  "wallet": "<WALLET_ADDRESS>",
  "token": {
    "name": "My Token",
    "symbol": "MTK",
    "image": "https://gateway.irys.xyz/abc123"
  },
  "launchType": "bondingCurve",
  "launch": {
    "creatorFeeWallet": "<FEE_WALLET_ADDRESS>",
    "firstBuyAmount": 0.1
  },
  "quoteMint": "SOL"
}
```

**Agent 付き bonding curve 設定：**

```json {% title="launch-agent.json" %}
{
  "wallet": "<WALLET_ADDRESS>",
  "token": {
    "name": "Agent Token",
    "symbol": "AGT",
    "image": "https://gateway.irys.xyz/abc123"
  },
  "launchType": "bondingCurve",
  "agent": {
    "mint": "<AGENT_CORE_ASSET_ADDRESS>",
    "setToken": true
  },
  "launch": {},
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

ロック付き割り当てにより、ベスティングスケジュール付きでトークン供給量の一部を予約できます。`--lockedAllocations` で JSON 配列ファイルとして指定します。

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
| `vestingStartTime` | string | ベスティング開始の ISO 日付文字列 |
| `vestingDuration` | object | `value`（数値）と `unit` を持つ期間 |
| `unlockSchedule` | string | トークンのアンロック頻度 |
| `cliff` | object | オプションのクリフ。`duration` と `unlockAmount` を持つ |

### 有効な時間単位

`SECOND`, `MINUTE`, `HOUR`, `DAY`, `WEEK`, `TWO_WEEKS`, `MONTH`, `QUARTER`, `YEAR`

## 一般的なエラー

| エラー | 原因 | 対処法 |
|-------|------|--------|
| API request failed | ネットワークの問題または無効な入力 | エラーレスポンスの詳細を確認してください — バリデーションエラー時にはコマンドが API レスポンスボディを表示します |
| Agent is not owned by the connected wallet | API バックエンドが新しく登録された agent をまだインデックスしていない | 約 30 秒待って再試行するか、`mplx agents fetch` で確認してください — 登録が失敗してもオンチェーンのローンチは成功している可能性があります |
| Agent already has a different agent token set | この agent に対して以前のローンチで `--agentSetToken` が使用された | agent のトークンリンクは不可逆で一度限りです。`--agentSetToken` なしでローンチするか、別の agent を使用してください |
| Locked allocations file not found | ファイルパスが間違っている | 割り当て JSON ファイルのパスを確認してください |
| Must contain a JSON array | 割り当てファイルが配列でない | JSON ファイルがオブジェクトではなく配列 `[...]` を含むことを確認してください |
| raydiumLiquidityBps out of range | 値が 2000〜10000 の範囲外 | 2000（20%）から 10000（100%）の間の値を使用してください |
| Launch config missing required fields | register 用の設定が不完全 | ローンチ設定 JSON に `token`、`launch`、有効な `launchType` が含まれていることを確認してください |

## FAQ

**`genesis launch create` と手動フローの違いは何ですか？**
`genesis launch create` コマンドは、Genesis API を呼び出してトランザクションを構築し、署名・送信し、Metaplex プラットフォームにローンチを登録する、オールインワンのフローです。手動フローでは `create`、`bucket add-launch-pool`、`finalize`、register のステップを個別に実行する必要があります。

**launchpool と bonding-curve の違いは何ですか？**
launchpool には 48 時間の入金ウィンドウがあり、ユーザーは SOL を入金してトークンを比例配分で受け取ります。bonding curve は constant product AMM で即座に取引が開始され、SOL が流入するにつれて価格が上昇し、すべてのトークンが売却されると Raydium CPMM に自動卒業します。

**agent をトークンローンチにリンクできますか？**
はい。`--agentMint` に agent の Core asset アドレスを渡します。これにより agent の PDA からクリエイターフィーウォレットが自動導出されます。`--agentSetToken` を追加すると、トークンが agent に永久的にリンクされます（不可逆）。launchpool と bonding curve の両方で動作します。

**`genesis launch register` はいつ使用すべきですか？**
低レベルの CLI コマンド（`genesis create`、`bucket add-launch-pool` など）を使用して genesis アカウントを作成済みで、Metaplex プラットフォームに登録して公開ローンチページを取得したい場合に使用します。

**launch コマンドはどのネットワークを使用しますか？**
ネットワークは設定された RPC エンドポイントから自動検出されます。`--network` フラグ（`solana-mainnet` または `solana-devnet`）でオーバーライドできます。

**カスタム quote mint を使用できますか？**
API は現在 `SOL`（デフォルト）と `USDC` に対応しています。USDC を使用するには `--quoteMint USDC` を渡してください。

**トークンの総供給量はいくつですか？**
API フローを使用する場合、総供給量は現在 1,000,000,000 トークンで固定されています。
