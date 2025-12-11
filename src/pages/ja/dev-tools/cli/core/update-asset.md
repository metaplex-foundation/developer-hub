---
title: アセットの更新
description: MPLコアアセットのメタデータとプロパティの更新
---

`mplx core asset update`コマンドを使用すると、メタデータ、名前、URI、または画像を変更してMPLコアアセットを更新できます。単一のアセットまたは複数のアセットを一度に更新できます。

## 基本的な使用法

### 単一アセットの更新
```bash
mplx core asset update <assetId> [options]
```

### 更新オプション
- `--name <string>`: アセットの新しい名前
- `--uri <string>`: アセットメタデータの新しいURI
- `--image <path>`: 新しい画像ファイルへのパス
- `--json <path>`: 新しいメタデータを含むJSONファイルへのパス

## 更新方法

### 1. 名前とURIの更新
```bash
mplx core asset update <assetId> --name "Updated Asset" --uri "https://example.com/metadata.json"
```

### 2. JSONファイルで更新
```bash
mplx core asset update <assetId> --json ./asset/metadata.json
```

### 3. 画像で更新
```bash
mplx core asset update <assetId> --image ./asset/image.jpg
```

### 4. JSONと画像で更新
```bash
mplx core asset update <assetId> --json ./asset/metadata.json --image ./asset/image.jpg
```

## 例

### アセット名の更新
```bash
mplx core asset update 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa --name "New Asset Name"
```

### 新しい画像でアセットを更新
```bash
mplx core asset update 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa --image ./images/new-image.png
```

### 新しいメタデータでアセットを更新
```bash
mplx core asset update 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa --json ./metadata/new-metadata.json
```

## 出力

更新が成功した後、コマンドは以下を表示します：
```
--------------------------------
  Asset: <assetId>
  Signature: <transactionSignature>
  Explorer: <explorerUrl>
  Core Explorer: https://core.metaplex.com/explorer/<assetId>
--------------------------------
```

## 注意事項

- 少なくとも1つの更新フラグを提供する必要があります：`--name`、`--uri`、`--image`、`--json`、または`--edit`
- `--name`と`--uri`フラグは、`--json`または`--edit`と一緒に使用することはできません
- `--json`を使用する場合、メタデータファイルには有効な`name`フィールドが含まれている必要があります
- `--image`フラグは、メタデータ内の画像URIと画像ファイル参照の両方を更新します
- コマンドは以下を自動的に処理します：
  - 適切なストレージへのファイルアップロード
  - メタデータJSONの整形
  - 画像ファイルタイプの検出
  - コレクション権限の検証