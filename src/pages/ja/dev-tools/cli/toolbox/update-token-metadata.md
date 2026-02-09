---
title: トークンメタデータの更新
metaTitle: トークンメタデータの更新 | Metaplex CLI
description: 既存のトークンのメタデータを更新する
---

`mplx toolbox token update`コマンドは、既存のトークンのメタデータを更新します。個々のフィールドを更新するか、インタラクティブエディタを使用して完全なメタデータJSONを変更できます。

## 基本的な使い方

### 個別フィールドの更新
```bash
mplx toolbox token update <mint> --name "New Name"
```

### 複数フィールドの更新
```bash
mplx toolbox token update <mint> --name "New Name" --description "New Description" --image ./new-image.png
```

### インタラクティブエディタ
```bash
mplx toolbox token update <mint> --editor
```

## 引数

| 引数 | 説明 |
|----------|-------------|
| `MINT` | 更新するトークンのミントアドレス |

## オプション

| オプション | 説明 |
|--------|-------------|
| `--name <value>` | トークンの新しい名前 |
| `--symbol <value>` | トークンの新しいシンボル |
| `--description <value>` | トークンの新しい説明 |
| `--image <value>` | 新しい画像ファイルのパス |
| `-e, --editor` | デフォルトエディタでメタデータJSONを開く |

## グローバルフラグ

| フラグ | 説明 |
|------|-------------|
| `-c, --config <value>` | 設定ファイルのパス。デフォルトは`~/.config/mplx/config.json` |
| `-k, --keypair <value>` | キーペアファイルまたはレジャーへのパス（例: `usb://ledger?key=0`） |
| `-r, --rpc <value>` | クラスターのRPC URL |

## 例

1. 名前を更新:
```bash
mplx toolbox token update <mintAddress> --name "Updated Token Name"
```

2. 名前と説明を更新:
```bash
mplx toolbox token update <mintAddress> \
  --name "New Name" \
  --description "このトークンは更新されました"
```

3. 新しい画像で更新:
```bash
mplx toolbox token update <mintAddress> \
  --name "Refreshed Token" \
  --image ./new-logo.png
```

4. すべてのフィールドを更新:
```bash
mplx toolbox token update <mintAddress> \
  --name "New Name" \
  --symbol "NEW" \
  --description "更新された説明" \
  --image ./new-image.png
```

5. インタラクティブエディタを使用:
```bash
mplx toolbox token update <mintAddress> --editor
```

## 出力

```
--------------------------------

    Token Update

--------------------------------
Fetching token data... ✓
Token data fetched: My Token
Uploading Image... ✓
Uploading JSON file... ✓
Updating Token... ✓
Update transaction sent and confirmed.
Token successfully updated!
```

## インタラクティブエディタモード

`--editor`を使用すると、CLIは以下を行います:
1. トークンのURIから現在のメタデータJSONを取得
2. 一時ファイルに書き込む
3. デフォルトエディタでファイルを開く（`$EDITOR`環境変数、またはフォールバックとして`nano`/`notepad`）
4. 保存してエディタを閉じるのを待つ
5. 変更されたJSONを解析してアップロード
6. オンチェーンのメタデータを更新

これはメタデータ構造や属性に複雑な変更を加える場合に便利です。

## 注意事項

- 少なくとも1つの更新フラグ（`--name`、`--description`、`--symbol`、`--image`、または`--editor`）を指定する必要があります
- `--editor`フラグは他のすべての更新フラグと排他的です
- フィールドを更新する場合（エディタを使用しない場合）、既存のメタデータが取得され、変更とマージされます
- メタデータの取得に失敗した場合、新しいメタデータを作成するためにすべてのフィールドを提供する必要があります
- エディタは`$EDITOR`環境変数を使用するか、デフォルトで`nano`（Linux/macOS）または`notepad`（Windows）を使用します
- トークンのメタデータを更新するには、更新権限を持っている必要があります
