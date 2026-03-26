---
title: Execute
metaTitle: Execute | Metaplex CLI
description: Metaplex CLIを使用して、MPL CoreアセットのサイナーPDAアドレスとSOL残高を検査し、executeによるトランザクションラッピングの仕組みを理解します。
keywords:
  - mplx cli
  - core execute
  - asset signer PDA
  - MPL Core execute
  - metaplex cli execute
  - PDA wallet
  - execute info
about:
  - MPL Core Execute instruction
  - Asset-signer PDA
  - Metaplex CLI
proficiencyLevel: Intermediate
created: '03-19-2026'
updated: '03-20-2026'
---

## 概要

`mplx core asset execute info`コマンドは、任意の[MPL Coreアセット](/core)のサイナーPDAアドレスと現在のSOL残高を表示します。サイナーPDAは、アセットに代わってSOL、トークンを保持し、他のアセットを所有できる決定論的なプログラム派生アドレスです。

- 任意のCoreアセットのサイナーPDAアドレスを導出・表示
- 結果を返す前にアセットがオンチェーンに存在することを検証
- PDAの現在のSOL残高を表示
- 完全なPDAウォレット機能のために[アセット署名者ウォレット](/dev-tools/cli/config/asset-signer-wallets)と併用

## 基本的な使い方

```bash {% title="Get execute info for an asset" %}
mplx core asset execute info <assetId>
```

## 引数

| 引数 | 説明 |
|------|------|
| `ASSET_ID` | サイナーPDAを導出する[MPL Coreアセット](/core)のアドレス |

## グローバルフラグ

| フラグ | 説明 |
|--------|------|
| `-c, --config <value>` | 設定ファイルのパス。デフォルトは`~/.config/mplx/config.json` |
| `-k, --keypair <value>` | キーペアファイルまたはLedgerへのパス（例：`usb://ledger?key=0`） |
| `-p, --payer <value>` | 支払者キーペアファイルまたはLedgerへのパス |
| `-r, --rpc <value>` | クラスターのRPC URL |
| `--commitment <option>` | コミットメントレベル：`processed`、`confirmed`、または`finalized` |
| `--json` | 出力をJSON形式にフォーマット |
| `--log-level <option>` | ログレベル：`debug`、`warn`、`error`、`info`、または`trace`（デフォルト：`info`） |

## 使用例

### アセットのPDA情報を表示

```bash {% title="Get signer PDA info" %}
mplx core asset execute info 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa
```

出力：

``` {% title="execute info output" %}
--------------------------------
  Asset:         5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa
  Signer PDA:    7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
  SOL Balance:   0.1 SOL
--------------------------------
```

### 構造化JSON出力の取得

```bash {% title="Execute info with JSON output" %}
mplx core asset execute info <assetId> --json
```

戻り値：

```json {% title="JSON response" %}
{
  "asset": "<assetId>",
  "signerPda": "<pdaAddress>",
  "balance": 0.1
}
```

### 検査後にPDAへ資金を送金

PDAを検査してから資金を送金する一般的なワークフロー：

```bash {% title="Inspect and fund the PDA" %}
# 1. PDAアドレスを取得
mplx core asset execute info <assetId>

# 2. PDAにSOLを送信
mplx toolbox sol transfer 0.1 <signerPdaAddress>

# 3. 残高を確認
mplx core asset execute info <assetId>
```

## Executeの仕組み

すべての[MPL Core](/core)アセットには、`findAssetSignerPda`を使用してアドレスから導出される決定論的なサイナーPDAがあります。このPDAはウォレットとして機能し、SOLの保持、トークンの所有、オンチェーンの`execute`インストラクションによるインストラクションの署名が可能です。

一般的なワークフローは以下の通りです：

1. **PDAを導出** — `mplx core asset execute info <assetId>`でPDAアドレスを確認
2. **PDAに資金を送金** — `mplx toolbox sol transfer`でPDAアドレスにSOLを送信
3. **ウォレットとして登録** — `mplx config wallets add <name> --asset <assetId>`でアセットを[アセット署名者ウォレット](/dev-tools/cli/config/asset-signer-wallets)として追加
4. **通常通り使用** — アセット署名者ウォレットがアクティブな場合、すべてのCLIコマンドが自動的に`execute`インストラクションでラップされます

{% callout type="note" %}
`info`は唯一のexecuteサブコマンドです。PDAとして操作を実行するには、アセットを[アセット署名者ウォレット](/dev-tools/cli/config/asset-signer-wallets)として登録してください。すべての通常のCLIコマンドが自動的に`execute`でラップされます。
{% /callout %}

## クイックリファレンス

| 項目 | 値 |
|------|-----|
| コマンド | `mplx core asset execute info` |
| 対象 | [MPL Coreアセット](/core)のみ |
| 関連 | [アセット署名者ウォレット](/dev-tools/cli/config/asset-signer-wallets) |
| PDA導出 | `findAssetSignerPda(umi, { asset: assetPubkey })` |
| ソース | [GitHub — metaplex-foundation/cli](https://github.com/metaplex-foundation/cli) |

## 注意事項

- サイナーPDAは決定論的です — 同じアセットは常に同じPDAアドレスを生成します
- PDAはSOL、SPLトークンを保持し、他の[MPL Coreアセット](/core)を所有することもできます
- アセットの所有者（または承認されたデリゲート）のみが、そのアセットのPDAに対して`execute`インストラクションを呼び出すことができます
- コマンドはPDAを導出する前にアセットがオンチェーンに存在することを検証します。存在しないアセットはエラーになります
- 表示される残高はSOL残高のみです — トークン残高を確認するには、[アセット署名者ウォレット](/dev-tools/cli/config/asset-signer-wallets)をアクティブにして`mplx toolbox sol balance`を使用してください
- これは読み取り専用コマンドです — オンチェーンの状態を作成または変更しません
- Solana CPIの制約により、一部の操作は`execute`でラップできません — [CPI制限事項](/dev-tools/cli/config/asset-signer-wallets#cpi-limitations)を参照
