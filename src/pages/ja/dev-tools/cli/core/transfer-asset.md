---
title: アセットを転送
metaTitle: アセットを転送 | Metaplex CLI
description: Metaplex CLIのmplx core asset transferコマンドを使用して、MPL CoreアセットのオーナーシップをNew walletに転送します。
keywords:
  - mplx cli
  - core asset transfer
  - MPL Core
  - transfer NFT
  - metaplex cli transfer
  - core transfer
about:
  - MPL Core Asset transfer
  - Metaplex CLI
proficiencyLevel: Beginner
created: '03-15-2026'
updated: '03-15-2026'
---

## 概要

`mplx core asset transfer`コマンドは、[MPL Coreアセット](/core)のオーナーシップを新しいウォレットに転送します。アセットがコレクションに属している場合、コレクションアカウントは自動的に解決されます — 追加フラグは不要です。

- 単一のCoreアセットを指定した公開鍵に転送
- アセットがコレクションに属している場合、自動的に検出して含める
- 呼び出し元が現在のオーナーまたは認可された転送デリゲートである必要がある
- フリーズされたアセットは転送前にサンを解除する必要がある

## 基本的な使い方

```bash {% title="アセットを転送" %}
mplx core asset transfer <assetId> <newOwner>
```

## 引数

| 引数 | 説明 |
|----------|-------------|
| `ASSET_ID` | 転送するアセットのアドレス |
| `NEW_OWNER` | 新しいオーナーのウォレットの公開鍵 |

## グローバルフラグ

| フラグ | 説明 |
|------|-------------|
| `-c, --config <value>` | 設定ファイルへのパス。デフォルトは `~/.config/mplx/config.json` |
| `-k, --keypair <value>` | キーペアファイルまたはLedgerへのパス（例：`usb://ledger?key=0`） |
| `-p, --payer <value>` | 支払者キーペアファイルまたはLedgerへのパス |
| `-r, --rpc <value>` | クラスターのRPC URL |
| `--commitment <option>` | コミットメントレベル：`processed`、`confirmed`、または `finalized` |
| `--json` | 出力をJSON形式でフォーマット |
| `--log-level <option>` | ログレベル：`debug`、`warn`、`error`、`info`、または `trace`（デフォルト：`info`） |

## 例

### スタンドアロンアセットを転送

```bash {% title="スタンドアロンアセットを転送" %}
mplx core asset transfer 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa \
  9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM
```

### コレクションに属するアセットを転送

コレクションアカウントはアセットから自動的に解決されます — `--collection`フラグは不要です。

```bash {% title="コレクションアセットを転送" %}
mplx core asset transfer BXBJbGGjMPBNKmRoUVGpMKFNMmvzfJTvEUqY1bBXqzNd \
  9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM
```

### 構造化されたJSON出力を取得

```bash {% title="JSON出力で転送" %}
mplx core asset transfer <assetId> <newOwner> --json
```

返り値：

```json {% title="JSONレスポンス" %}
{
  "asset": "<assetId>",
  "newOwner": "<newOwner>",
  "signature": "<transactionSignature>",
  "explorer": "<explorerUrl>"
}
```

## クイックリファレンス

| 項目 | 値 |
|------|-------|
| コマンド | `mplx core asset transfer` |
| 対象 | [MPL Coreアセット](/core)のみ — Token Metadata NFTには対応しない |
| ソース | [GitHub — metaplex-foundation/cli](https://github.com/metaplex-foundation/cli) |

## 注意事項

- このコマンドを実行するには、アセットの現在のオーナーまたは認可された[転送デリゲート](/core/plugins)である必要があります
- フリーズされたアセットは転送できません — フリーズ/サン解除[プラグイン](/core/plugins)を使用して先にサンを解除する必要があります
- コレクション内のアセットの場合、コレクションアカウントは自動的に取得されます — `--collection`フラグは不要です
- このコマンドは[MPL Coreアセット](/core)のみに適用されます — Token Metadata NFTには別の転送命令を使用してください

*Metaplex Foundationが管理 · 2026年3月最終確認 · MPLX CLI 0.x対応*
