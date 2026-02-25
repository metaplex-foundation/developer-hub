---
title: Genesis アカウントの作成
metaTitle: Genesis アカウントの作成 | Metaplex CLI
description: Metaplex CLI を使用して新しい Genesis アカウントとトークン mint を作成します。
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
  - Run mplx genesis create with name, symbol, totalSupply, and decimals
  - Optionally provide a metadata URI and custom quote mint
  - Save the Genesis Account address from the output for subsequent commands
howToTools:
  - Metaplex CLI (mplx)
  - Solana CLI
faqs:
  - q: mplx genesis create は何をしますか？
    a: Solana 上に新しい Genesis アカウント PDA とトークン mint を作成します。これは Genesis トークンローンチの最初のステップです。
  - q: totalSupply を base units でどのように計算しますか？
    a: 希望するトークン数に 10 の小数点桁数乗を掛けます。小数点以下9桁で100万トークンの場合、totalSupply = 1000000 * 10^9 = 1000000000000000 です。
---

{% callout title="このページで行うこと" %}
Genesis アカウントとトークン mint を作成します — トークンローンチの最初のステップ：
- ローンチ全体を管理する Genesis PDA を初期化
- 新しいトークン mint を作成（または既存のものをリンク）
- トークンの名前、シンボル、小数点桁数、供給量を設定
{% /callout %}

## 概要

`mplx genesis create` コマンドは、新しい Genesis アカウントとトークン mint を作成します。これはトークンローンチの最初のステップです。

- **作成されるもの**: Genesis アカウント PDA とトークン mint
- **必須フラグ**: `--name`、`--symbol`、`--totalSupply`
- **デフォルトの小数点桁数**: 9（1 トークン = 1,000,000,000 base units）

## 対象外

bucket の設定、入金/請求フロー、トークンメタデータのホスティング、流動性プールのセットアップ。

**移動先:** [基本的な使い方](#basic-usage) · [オプション](#options) · [例](#examples) · [出力](#output) · [一般的なエラー](#common-errors) · [FAQ](#faq)

*Metaplex Foundation によるメンテナンス · 最終確認 2026年2月 · Metaplex CLI（mplx）が必要*

## 基本的な使い方

```bash {% title="Genesis アカウントの作成" %}
mplx genesis create --name "My Token" --symbol "MTK" --totalSupply 1000000000000000 --decimals 9
```

## オプション

| フラグ | 短縮形 | 説明 | 必須 |
|-------|--------|------|------|
| `--name <string>` | `-n` | トークンの名前 | はい |
| `--symbol <string>` | `-s` | トークンのシンボル | はい |
| `--totalSupply <string>` | | base units での総供給量 | はい |
| `--uri <string>` | `-u` | トークンメタデータ JSON の URI | いいえ |
| `--decimals <integer>` | `-d` | 小数点桁数（デフォルト: 9） | いいえ |
| `--quoteMint <string>` | | quote token の mint アドレス（デフォルト: Wrapped SOL） | いいえ |
| `--fundingMode <new-mint\|transfer>` | | 新しい mint を作成するか既存のものを使用（デフォルト: `new-mint`） | いいえ |
| `--baseMint <string>` | | base token の mint アドレス（`fundingMode` が `transfer` の場合に必須） | 条件付き |
| `--genesisIndex <integer>` | | 同じ mint で複数ローンチする場合の Genesis インデックス（デフォルト: 0） | いいえ |

## 例

1. 小数点以下9桁、総供給量100万トークンでトークンを作成：
```bash {% title="基本的な作成" %}
mplx genesis create \
  --name "My Token" \
  --symbol "MTK" \
  --totalSupply 1000000000000000 \
  --decimals 9
```

2. メタデータ URI 付きでトークンを作成：
```bash {% title="メタデータ URI 付き" %}
mplx genesis create \
  --name "My Token" \
  --symbol "MTK" \
  --totalSupply 1000000000000000 \
  --decimals 9 \
  --uri "https://example.com/metadata.json"
```

3. 既存のトークン mint を使用：
```bash {% title="既存の mint" %}
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

`Genesis Account` アドレスを保存してください — 以降のすべてのコマンドで使用します。

## 一般的なエラー

| エラー | 原因 | 対処法 |
|-------|------|--------|
| Missing required flag | `--name`、`--symbol`、または `--totalSupply` が指定されていない | 3つの必須フラグをすべて追加してください |
| Invalid totalSupply | 数値でないかゼロの値 | base units で正の整数を指定してください |
| baseMint required | `--fundingMode transfer` に `--baseMint` が指定されていない | transfer モードを使用する場合は `--baseMint <address>` を追加してください |
| Insufficient SOL | トランザクション手数料に十分な SOL がない | ウォレットに手数料用の SOL を追加してください |

## 注意事項

- `totalSupply` は base units で指定します。小数点以下9桁の場合、`1000000000000000` = 1,000,000 トークン
- デフォルトの quote token は Wrapped SOL です。別の SPL token を指定するには `--quoteMint` を使用してください
- `--fundingMode transfer` を使用する場合、既存のトークン mint アドレスを `--baseMint` で指定する必要があります
- 同じトークン mint で複数の Genesis ローンチを作成する必要がある場合は `--genesisIndex` を使用してください

## FAQ

**mplx genesis create は何をしますか？**
Solana 上に新しい Genesis アカウント PDA とトークン mint を作成します。これは Genesis トークンローンチの最初のステップであり、以降のすべてのコマンドはこのステップの Genesis アドレスを参照します。

**totalSupply を base units でどのように計算しますか？**
希望するトークン数に 10 の小数点桁数乗を掛けます。小数点以下9桁で100万トークンの場合: `1,000,000 × 10^9 = 1,000,000,000,000,000`。

**新しい mint を作成する代わりに既存のトークン mint を使用できますか？**
はい。`--fundingMode transfer` を設定し、`--baseMint` で既存の mint アドレスを指定してください。既存の mint の権限は Genesis アカウントに移譲可能である必要があります。

**genesisIndex は何に使用しますか？**
同じトークン mint で複数の Genesis ローンチを可能にします。各ローンチには一意のインデックスが必要です。デフォルトは 0 です。

## 用語集

| 用語 | 定義 |
|------|------|
| **Genesis Account** | このコマンドで作成される、トークンローンチを管理する PDA |
| **Base Units** | トークンの最小単位 — 小数点以下9桁の場合、1 トークン = 1,000,000,000 base units |
| **Quote Mint** | 入金時に受け入れられるトークン（デフォルト: Wrapped SOL） |
| **Genesis Index** | 同じトークン mint で複数のローンチを可能にする数値インデックス |
