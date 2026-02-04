---
title: トークンにメタデータを追加
metaTitle: トークンにメタデータを追加 | Metaplex CLI
description: メタデータアカウントを持たない既存のトークンにメタデータを追加する
---

`mplx toolbox token add-metadata`コマンドは、メタデータアカウントなしで作成された既存のトークンにメタデータを追加します。これは`spl-token` CLIや、Token Metadataアカウントを自動的に作成しない他のツールで作成されたトークンに便利です。

## 基本的な使い方

```bash
mplx toolbox token add-metadata <mint> --name "My Token" --symbol "MTK"
```

## 引数

| 引数 | 説明 |
|----------|-------------|
| `MINT` | トークンのミントアドレス |

## オプション

| オプション | 説明 |
|--------|-------------|
| `--name <value>` | トークンの名前（必須） |
| `--symbol <value>` | トークンシンボル、2-6文字（必須） |
| `--uri <value>` | メタデータJSONを指すURI（--image、--descriptionと排他的） |
| `--description <value>` | トークンの説明（メタデータアップロード時に使用） |
| `--image <value>` | トークン画像ファイルのパス（メタデータアップロード時に使用） |
| `--is-mutable` | メタデータを後で更新可能にするかどうか（デフォルト: true） |
| `--no-is-mutable` | メタデータを不変にする |

## グローバルフラグ

| フラグ | 説明 |
|------|-------------|
| `-c, --config <value>` | 設定ファイルのパス。デフォルトは`~/.config/mplx/config.json` |
| `-k, --keypair <value>` | キーペアファイルまたはレジャーへのパス（例: `usb://ledger?key=0`） |
| `-r, --rpc <value>` | クラスターのRPC URL |

## 例

1. 基本的なメタデータを追加:
```bash
mplx toolbox token add-metadata <mintAddress> --name "My Token" --symbol "MTK"
```

2. 既存のURIでメタデータを追加:
```bash
mplx toolbox token add-metadata <mintAddress> --name "My Token" --symbol "MTK" --uri "https://example.com/metadata.json"
```

3. 画像と説明でメタデータを追加（自動的にアップロード）:
```bash
mplx toolbox token add-metadata <mintAddress> \
  --name "My Token" \
  --symbol "MTK" \
  --description "素晴らしいトークン" \
  --image ./logo.png
```

4. 不変のメタデータを追加。これは元に戻せないので注意！
```bash
mplx toolbox token add-metadata <mintAddress> --name "My Token" --symbol "MTK" --no-is-mutable
```

## 出力

```
--------------------------------

    Add Token Metadata

--------------------------------
Checking for existing metadata... ✓
No existing metadata found
Verifying mint authority... ✓
Mint authority verified
Uploading image... ✓
Uploading metadata JSON... ✓
Creating metadata account... ✓

--------------------------------
Metadata created successfully!

Token Details:
Name: My Token
Symbol: MTK

Mint Address: <mintAddress>
Explorer: https://solscan.io/account/<mintAddress>

Transaction Signature: <signature>
Explorer: https://solscan.io/tx/<signature>
--------------------------------
```

## 要件

- **ミント権限が必要**: メタデータを追加するには、トークンのミント権限を持っている必要があります
- **既存のメタデータがないこと**: トークンにはまだメタデータアカウントがない必要があります。既存のメタデータを変更するには`mplx toolbox token update`を使用してください

## 注意事項

- トークンに既にメタデータがある場合、コマンドは既存のメタデータを表示し、updateコマンドの使用を提案します
- ミント権限が取り消されている場合、メタデータを追加できません
- `--uri`なしで`--image`や`--description`を指定すると、CLIは自動的にメタデータをストレージにアップロードします
- `--uri`フラグは`--image`および`--description`と排他的です
- `--no-is-mutable`フラグには注意してください。元に戻すことができません
