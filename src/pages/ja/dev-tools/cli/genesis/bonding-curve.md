---
title: ボンディングカーブ
metaTitle: ボンディングカーブ | Metaplex CLI
description: Metaplex CLIを使用して、ボンディングカーブのトークンローンチの作成、トークンの売買、カーブのステータス確認、ボンディングカーブバケットの検査を行います。
keywords:
  - genesis bonding curve
  - genesis swap
  - bonding curve
  - mplx genesis swap
  - token swap
  - buy tokens
  - sell tokens
  - Metaplex CLI
about:
  - Genesis bonding curve
  - token swap
  - constant product AMM
  - Metaplex CLI
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
created: '04-09-2026'
updated: '04-09-2026'
howToSteps:
  - Create a bonding curve launch with genesis launch create --launchType bonding-curve
  - Buy tokens with genesis swap --buyAmount or sell with --sellAmount
  - Use genesis swap --info to check curve status and get price quotes
  - Inspect the bucket with genesis bucket fetch --type bonding-curve
howToTools:
  - Metaplex CLI (mplx)
faqs:
  - q: ボンディングカーブはどの価格モデルを使用しますか？
    a: ボンディングカーブは定積公式（constant-product formula）を使用します。トークンが購入されるほど価格は上がり、売却されると下がります。
  - q: 購入前にSOLをラップする必要がありますか？
    a: いいえ。SOLで購入する場合、swapコマンドは必要に応じて自動的にSOLをWSOLにラップします。
  - q: スワップ前に価格を確認するにはどうすればよいですか？
    a: --infoフラグを使用してカーブのステータスを表示します。--infoと--buyAmountまたは--sellAmountを組み合わせると、スワップを実行せずに価格見積もりを取得できます。
  - q: カーブが完全に埋まったときどうなりますか？
    a: すべてのトークンが売却されると、ボンディングカーブはRaydium CPMMプールに自動的にグラデュエーションします。グラデュエーション後はRaydiumでの取引が継続されます。
  - q: 手動フローでボンディングカーブを作成できますか？
    a: いいえ。ボンディングカーブのローンチは、genesis launch create --launchType bonding-curveを通じたGenesis APIのみで利用可能です。
---

{% callout title="実行内容" %}
CLIからボンディングカーブのライフサイクル全体を実行します：
- Genesis APIを通じてボンディングカーブのトークンローンチを作成する
- カーブでトークンを売買する
- カーブのステータスを確認して価格見積もりを取得する
- ボンディングカーブバケットを検査する
{% /callout %}

## Summary

ボンディングカーブのローンチは、デポジットウィンドウなしで即座に取引が開始される定積AMMを作成します。SOLが流入するにつれて価格が上昇し、すべてのトークンが売却されるとRaydium CPMMプールに自動的にグラデュエーションします。このページではボンディングカーブのライフサイクル全体を説明します。

- **作成**: [`genesis launch create --launchType bonding-curve`](/dev-tools/cli/genesis/launch#bonding-curve)（APIのみ、手動フローなし）
- **取引**: `genesis swap --buyAmount` で購入、`--sellAmount` で売却
- **情報**: `genesis swap --info` で価格、リザーブ、埋め率を確認
- **検査**: `genesis bucket fetch --type bonding-curve` でバケット設定を表示
- **グラデュエーション**: 完全に埋まったときRaydium CPMMに自動グラデュエーション

**ジャンプ:** [ボンディングカーブの作成](#ボンディングカーブの作成) · [スワップ（売買）](#スワップ売買) · [カーブステータスの確認](#カーブステータスの確認) · [ボンディングカーブバケットの検査](#ボンディングカーブバケットの検査) · [完全なライフサイクルの例](#完全なライフサイクルの例) · [よくあるエラー](#よくあるエラー) · [FAQ](#faq)

## ボンディングカーブの作成

ボンディングカーブのローンチは[Genesis API](/dev-tools/cli/genesis/launch#bonding-curve)で作成します。必須なのは `--name`、`--symbol`、`--image` のみです：

```bash {% title="ボンディングカーブのローンチを作成する" %}
mplx genesis launch create --launchType bonding-curve \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123"
```

オプションでクリエイター手数料、ファーストバイ、または[エージェント](/agents)へのリンクを設定できます：

```bash {% title="クリエイター手数料とファーストバイを指定" %}
mplx genesis launch create --launchType bonding-curve \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --creatorFeeWallet <FEE_WALLET_ADDRESS> \
  --firstBuyAmount 0.1
```

```bash {% title="エージェントと一緒に" %}
mplx genesis launch create --launchType bonding-curve \
  --name "Agent Token" \
  --symbol "AGT" \
  --image "https://gateway.irys.xyz/abc123" \
  --agentMint <AGENT_CORE_ASSET_ADDRESS> \
  --agentSetToken
```

すべてのフラグと詳細は[ローンチ（API）](/dev-tools/cli/genesis/launch)を参照してください。

{% callout type="note" %}
ボンディングカーブはGenesis APIを通じてのみ利用可能です。手動の `bucket add-bonding-curve` コマンドはありません。
{% /callout %}

## スワップ（売買）

`mplx genesis swap` コマンドはボンディングカーブでトークンを売買します。

```bash {% title="トークンを購入する（0.05 SOLを使用）" %}
mplx genesis swap <GENESIS_ACCOUNT> --buyAmount 50000000
```

```bash {% title="トークンを売却する" %}
mplx genesis swap <GENESIS_ACCOUNT> --sellAmount 500000000000
```

### スワップオプション

| フラグ | Short | 説明 | 必須 | デフォルト |
|------|-------|-------------|----------|---------|
| `--buyAmount <string>` | | 使用するクォートトークンの量（例：SOLのラムポート） | いいえ | |
| `--sellAmount <string>` | | 売却するベーストークンの量 | いいえ | |
| `--slippage <integer>` | | 基準点（bps）単位のスリッページ許容範囲 | いいえ | `200`（2%） |
| `--bucketIndex <integer>` | `-b` | ボンディングカーブバケットのインデックス | いいえ | `0` |
| `--info` | | スワップせずにカーブのステータスと価格見積もりを表示する | いいえ | `false` |

{% callout type="note" title="1つの金額のみ必須" %}
スワップ時は `--buyAmount` または `--sellAmount` のいずれか1つのみを指定してください。スワップせずにカーブのステータスを確認するには `--info` を使用してください。
{% /callout %}

### スワップの例

カスタムスリッページ（1%）で購入する：

```bash {% title="1%スリッページで購入する" %}
mplx genesis swap <GENESIS_ACCOUNT> --buyAmount 50000000 --slippage 100
```

### スワップ出力

```text {% title="期待されるスワップ出力" %}
--------------------------------
  Direction: Buy
  Amount In: 50000000 (quote tokens)
  Amount Out: <base_tokens_received>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
--------------------------------
```

## カーブステータスの確認

`--info` フラグはスワップを実行せずに現在のカーブの状態を表示します：

```bash {% title="カーブステータスのみ" %}
mplx genesis swap <GENESIS_ACCOUNT> --info
```

`--info` と金額を組み合わせて価格見積もりを取得できます：

```bash {% title="購入見積もり（0.1 SOLで何トークン？）" %}
mplx genesis swap <GENESIS_ACCOUNT> --info --buyAmount 100000000
```

```bash {% title="売却見積もり（トークン売却でいくらのSOL？）" %}
mplx genesis swap <GENESIS_ACCOUNT> --info --sellAmount 1000000000
```

info出力には以下が含まれます：
- トークンあたりの現在の価格
- リザーブ残高（ベースとクォート）
- 埋め率
- カーブが現在スワップ可能かどうか
- 手数料と最低出力を含む価格見積もり（金額が指定された場合）

## ボンディングカーブバケットの検査

`--type bonding-curve` を指定した[`genesis bucket fetch`](/dev-tools/cli/genesis/manage#fetch-bucket)コマンドで、完全なバケット設定を取得します：

```bash {% title="ボンディングカーブバケットを取得する" %}
mplx genesis bucket fetch <GENESIS_ACCOUNT> --type bonding-curve
```

または、CLIにバケットタイプを自動検出させることもできます：

```bash {% title="バケットタイプを自動検出する" %}
mplx genesis bucket fetch <GENESIS_ACCOUNT>
```

## 完全なライフサイクルの例

```bash {% title="完全なボンディングカーブライフサイクル" %}
# 1. ボンディングカーブのローンチを作成する
mplx genesis launch create --launchType bonding-curve \
  --name "My Token" --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123"

# (出力からGENESIS_ACCOUNTをコピー)

# 2. カーブステータスを確認する
mplx genesis swap <GENESIS_ACCOUNT> --info

# 3. トークンを購入する（0.1 SOL）
mplx genesis swap <GENESIS_ACCOUNT> --buyAmount 100000000

# 4. 購入後の価格を確認する
mplx genesis swap <GENESIS_ACCOUNT> --info

# 5. トークンの一部を売却する
mplx genesis swap <GENESIS_ACCOUNT> --sellAmount 500000000000

# 6. バケットの状態を検査する
mplx genesis bucket fetch <GENESIS_ACCOUNT> --type bonding-curve
```

## よくあるエラー

| エラー | 原因 | 対処法 |
|-------|-------|-----|
| Either --buyAmount or --sellAmount is required | 金額が指定されておらず `--info` も使用していない | `--buyAmount`、`--sellAmount`、または `--info` を追加してください |
| Cannot specify both --buyAmount and --sellAmount | 両方の金額が指定された | スワップごとに1つの金額のみ使用してください |
| Curve is not swappable | カーブがまだ開始していないか売り切れた（グラデュエーション済み） | `--info` でステータスを確認 — カーブがRaydiumにグラデュエーションした可能性があります |
| Slippage exceeded | 許容範囲を超えて価格が変動した | `--slippage` を上げるか、より少ない金額で再試行してください |
| Insufficient funds | ウォレットのSOLまたはトークンが不足している | `mplx toolbox sol balance` で残高を確認してください |

## Notes

- すべての金額はベース単位です — SOLの場合、1 SOL = 1,000,000,000ラムポート
- SOLをクォートトークンとして購入する場合、swapコマンドは自動的にSOLをWSOLにラップします
- デフォルトのスリッページ200 bps（2%）は、見積もりと実行の間の価格変動から保護します
- クリエイター手数料はボンディングカーブで常に有効です — デフォルトはローンチウォレットで、取引中にバケットに蓄積されます
- カーブがRaydiumにグラデュエーションした後も、Raydium CPMMプールでの取引が継続されます

## FAQ

**ボンディングカーブはどの価格モデルを使用しますか？**
ボンディングカーブは定積公式（constant-product formula）を使用します。トークンが購入されるほど価格は上がり、売却されると下がります。

**購入前にSOLをラップする必要がありますか？**
いいえ。SOLで購入する場合、swapコマンドは必要に応じて自動的にSOLをWSOLにラップします。

**スワップ前に価格を確認するにはどうすればよいですか？**
`--info` フラグを使用してカーブのステータスを表示します。`--info` と `--buyAmount` または `--sellAmount` を組み合わせると、スワップを実行せずに価格見積もりを取得できます。

**カーブが完全に埋まったときどうなりますか？**
すべてのトークンが売却されると、ボンディングカーブはRaydium CPMMプールに自動的にグラデュエーションします。グラデュエーション後はRaydiumでの取引が継続されます。

**手動フローでボンディングカーブを作成できますか？**
いいえ。ボンディングカーブのローンチは、`genesis launch create --launchType bonding-curve` を通じたGenesis APIのみで利用可能です。

## 用語集

| 用語 | 定義 |
|------|------------|
| **ボンディングカーブ（Bonding Curve）** | 供給量に基づいてトークンを価格付けする定積AMM — トークンが購入されるほど価格が上がり、売却されると下がる |
| **グラデュエーション（Graduation）** | カーブのすべてのトークンが売却されると、流動性が自動的にRaydium CPMMプールに移行する |
| **クォートトークン（Quote Token）** | 購入時に使う通貨（通常はSOL）— 金額はベース単位（ラムポート）で指定する |
| **ベーストークン（Base Token）** | カーブでローンチされ取引されるトークン |
| **スリッページ（Slippage）** | 見積もりと実行の間に許容される最大価格偏差（基準点単位） |
| **埋め率（Fill Percentage）** | カーブの総容量のうち何%が埋まったか（100%でグラデュエーション） |
| **クリエイター手数料（Creator Fee）** | スワップごとにクリエイターウォレットに向けられる手数料。バケットに蓄積されグラデュエーション後に請求できる |
