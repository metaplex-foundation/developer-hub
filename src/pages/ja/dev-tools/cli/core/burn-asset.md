---
title: アセットをバーン
metaTitle: アセットをバーン | Metaplex CLI
description: Metaplex CLIを使用してMPL Coreアセットをバーンする
---

`mplx core asset burn`コマンドを使用すると、MPL Coreアセットを永久に破棄し、レント手数料を回収できます。単一のアセットをバーンすることも、JSONリストファイルを使用して複数のアセットを一度にバーンすることもできます。

## 基本的な使い方

### 単一アセットをバーン

```bash
mplx core asset burn <assetId>
```

### コレクションからアセットをバーン

```bash
mplx core asset burn <assetId> --collection <collectionId>
```

### 複数アセットをバーン

```bash
mplx core asset burn --list ./assets-to-burn.json
```

## 引数

| 引数 | 説明 |
|----------|-------------|
| `ASSET` | バーンするアセットのミントアドレス |

## オプション

| オプション | 説明 |
|--------|-------------|
| `--collection <value>` | アセットをバーンするコレクションID |
| `--list <value>` | バーンするアセットのJSONリストファイルパス（例：`["asset1", "asset2"]`） |

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

### 単一アセットをバーン

```bash
mplx core asset burn 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa
```

### コレクションからアセットをバーン

```bash
mplx core asset burn 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa --collection HaKyubAWuTS9AZkpUHtFkTKAHs1KKAJ3onZPmaP9zBpe
```

### リストから複数アセットをバーン

JSONファイル `assets-to-burn.json` を作成：

```json
[
  "5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa",
  "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
]
```

次に実行：

```bash
mplx core asset burn --list ./assets-to-burn.json
```

## 注意事項

- **警告**：バーンは永久的で元に戻すことはできません
- アセットをバーンするには、そのアセットの所有者である必要があります
- アセットをバーンすると、ほとんどのレントSOLが所有者に返金されます
- アカウントの再利用を防ぐため、少額（約0.00089784 SOL）が残ります
- コレクションに属するアセットをバーンする場合は、`--collection`フラグを使用してください
