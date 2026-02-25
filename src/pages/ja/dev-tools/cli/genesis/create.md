---
title: Genesisアカウントの作成
metaTitle: Genesisアカウントの作成 | Metaplex CLI
description: Metaplex CLIを使用して新しいGenesisアカウントとトークンミントを作成します。
keywords:
  - genesis create
  - create token launch
  - mplx genesis create
  - token mint CLI
  - Solana token creation
about:
  - Genesis account creation
  - token mint setup
  - Metaplex CLI
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
howToSteps:
  - mplx genesis createをname、symbol、totalSupply、decimalsで実行
  - 必要に応じてメタデータURIやカスタムクォートミントを指定
  - 後続のコマンドで使用するGenesisアカウントアドレスを出力から保存
howToTools:
  - Metaplex CLI (mplx)
  - Solana CLI
faqs:
  - q: What does mplx genesis create do?
    a: Solana上に新しいGenesisアカウントPDAとトークンミントを作成します。これはGenesisトークンローンチの最初のステップです。
  - q: How do I calculate totalSupply in base units?
    a: 希望するトークン数に10の小数点桁数乗を掛けます。小数点以下9桁で100万トークンの場合、totalSupply = 1000000 * 10^9 = 1000000000000000です。
---

{% callout title="実行内容" %}
Genesisアカウントとトークンミントの作成 — トークンローンチの最初のステップ:
- ローンチ全体を管理するGenesis PDAを初期化
- 新しいトークンミントを作成（または既存のものをリンク）
- トークン名、シンボル、小数点桁数、供給量を設定
{% /callout %}

## 概要

`mplx genesis create`コマンドは、新しいGenesisアカウントとトークンミントを作成します。これはトークンローンチの最初のステップです。

- **作成されるもの**: GenesisアカウントPDAとトークンミント
- **必須フラグ**: `--name`、`--symbol`、`--totalSupply`
- **デフォルトの小数点桁数**: 9（1トークン = 1,000,000,000基本単位）

## 対象範囲外

Bucket設定、入金/請求フロー、トークンメタデータホスティング、流動性プールのセットアップ。

**ジャンプ先:** [基本的な使用法](#basic-usage) · [オプション](#options) · [例](#examples) · [出力](#output) · [よくあるエラー](#common-errors) · [FAQ](#faq)

*Metaplex Foundationによる管理 · 最終検証 2026年2月 · Metaplex CLI（mplx）が必要*

## 基本的な使用法

```bash {% title="Genesisアカウントの作成" %}
mplx genesis create --name "My Token" --symbol "MTK" --totalSupply 1000000000000000 --decimals 9
```

## オプション

| フラグ | 短縮 | 説明 | 必須 |
|--------|------|------|------|
| `--name <string>` | `-n` | トークンの名前 | はい |
| `--symbol <string>` | `-s` | トークンのシンボル | はい |
| `--totalSupply <string>` | | 基本単位での総供給量 | はい |
| `--uri <string>` | `-u` | トークンメタデータJSONのURI | いいえ |
| `--decimals <integer>` | `-d` | 小数点桁数（デフォルト: 9） | いいえ |
| `--quoteMint <string>` | | クォートトークンのミントアドレス（デフォルト: Wrapped SOL） | いいえ |
| `--fundingMode <new-mint\|transfer>` | | 新しいミントを作成するか既存のものを使用（デフォルト: `new-mint`） | いいえ |
| `--baseMint <string>` | | ベーストークンのミントアドレス（`fundingMode`が`transfer`の場合に必須） | 条件付き |
| `--genesisIndex <integer>` | | 同一ミントで複数ローンチする場合のGenesisインデックス（デフォルト: 0） | いいえ |

## 例

1. 小数点以下9桁で100万トークンの総供給量でトークンを作成:
```bash {% title="基本的な作成" %}
mplx genesis create \
  --name "My Token" \
  --symbol "MTK" \
  --totalSupply 1000000000000000 \
  --decimals 9
```

2. メタデータURI付きでトークンを作成:
```bash {% title="メタデータURI付き" %}
mplx genesis create \
  --name "My Token" \
  --symbol "MTK" \
  --totalSupply 1000000000000000 \
  --decimals 9 \
  --uri "https://example.com/metadata.json"
```

3. 既存のトークンミントを使用:
```bash {% title="既存のミント" %}
mplx genesis create \
  --name "Existing Token" \
  --symbol "EXT" \
  --totalSupply 1000000000000000 \
  --fundingMode transfer \
  --baseMint <EXISTING_MINT_ADDRESS>
```

## 出力

```text {% title="期待される出力" %}
--------------------------------
  Genesis Account: <genesis_address>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
--------------------------------
```

`Genesis Account`アドレスを保存してください — 後続のすべてのコマンドで使用します。

## よくあるエラー

| エラー | 原因 | 修正方法 |
|--------|------|----------|
| Missing required flag | `--name`、`--symbol`、または`--totalSupply`が指定されていない | 3つの必須フラグをすべて追加してください |
| Invalid totalSupply | 数値以外またはゼロの値 | 基本単位で正の整数を指定してください |
| baseMint required | `--fundingMode transfer`で`--baseMint`が指定されていない | transferモード使用時は`--baseMint <address>`を追加してください |
| Insufficient SOL | トランザクション手数料のためのSOLが不足 | ウォレットに手数料用のSOLを追加してください |

## 注意事項

- `totalSupply`は基本単位です。小数点以下9桁の場合、`1000000000000000` = 1,000,000トークン
- デフォルトのクォートトークンはWrapped SOLです。別のSPLトークンを指定するには`--quoteMint`を使用してください
- `--fundingMode transfer`を使用する場合は、既存のトークンミントアドレスを`--baseMint`で指定する必要があります
- 同じトークンミントで複数のGenesisローンチを作成する必要がある場合は`--genesisIndex`を使用してください

## FAQ

**mplx genesis createは何をしますか？**
Solana上に新しいGenesisアカウントPDAとトークンミントを作成します。これはGenesisトークンローンチの最初のステップです — 後続のすべてのコマンドはこのステップで取得したGenesisアドレスを参照します。

**totalSupplyを基本単位でどのように計算しますか？**
希望するトークン数に10の小数点桁数乗を掛けます。小数点以下9桁で100万トークンの場合: `1,000,000 × 10^9 = 1,000,000,000,000,000`。

**新しいミントを作成する代わりに既存のトークンミントを使用できますか？**
はい。`--fundingMode transfer`を設定し、`--baseMint`で既存のミントアドレスを指定してください。既存ミントの権限がGenesisアカウントに移譲可能である必要があります。

**genesisIndexは何のためですか？**
同じトークンミントで複数のGenesisローンチを可能にします。各ローンチには一意のインデックスが必要です。デフォルトは0です。

## 用語集

| 用語 | 定義 |
|------|------|
| **Genesis Account** | このコマンドで作成されるトークンローンチを管理するPDA |
| **Base Units** | 最小単位 — 小数点以下9桁の場合、1トークン = 1,000,000,000基本単位 |
| **Quote Mint** | 入金時に受け付けるトークン（デフォルト: Wrapped SOL） |
| **Genesis Index** | 同じトークンミントで複数のローンチを可能にする数値インデックス |
