---
title: アセットまたはコレクションの取得
metaTitle: アセットまたはコレクションの取得 | Metaplex CLI
description: ミントアドレスによるMPLコアアセットまたはコレクションの取得
---

`mplx core fetch`コマンドを使用すると、ミントアドレスによってMPLコアアセットまたはコレクションを取得できます。メタデータを表示し、オプションで関連ファイルをダウンロードすることができます。

## アセットの取得

### 基本的な使用法
```bash
mplx core fetch asset <assetId>
```

### ダウンロードオプション
```bash
mplx core fetch asset <assetId> --download --output ./assets
mplx core fetch asset <assetId> --download --image
mplx core fetch asset <assetId> --download --metadata
```

### アセット取得オプション
- `--download`: アセットファイルをディスクにダウンロード（追加フラグで個別ファイルも選択可能）
- `--output <path>`: ダウンロードしたアセットを保存するディレクトリパス（--downloadが必要）
- `--image`: 画像ファイルをダウンロード（--downloadが必要）
- `--metadata`: メタデータファイルをダウンロード（--downloadが必要）
- `--asset`: アセットデータファイルをダウンロード（--downloadが必要）

## コレクションの取得

### 基本的な使用法
```bash
mplx core fetch collection <collectionId>
```

### ダウンロードオプション
```bash
mplx core fetch collection <collectionId> --output ./collections
```

### コレクション取得オプション
- `-o, --output <path>`: ダウンロードしたコレクションファイルの出力ディレクトリ。指定されない場合は、現在のフォルダが使用されます。

## 例

### アセット取得の例
1. 単一アセットを取得：
```bash
mplx core fetch asset 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa
```

2. アセットファイルを特定のディレクトリにダウンロード：
```bash
mplx core fetch asset 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa --download --output ./assets
```

3. 画像のみをダウンロード：
```bash
mplx core fetch asset 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa --download --image
```

### コレクション取得の例
1. コレクションを取得：
```bash
mplx core fetch collection HaKyubAWuTS9AZkpUHtFkTKAHs1KKAJ3onZPmaP9zBpe
```

2. コレクションファイルを特定のディレクトリにダウンロード：
```bash
mplx core fetch collection HaKyubAWuTS9AZkpUHtFkTKAHs1KKAJ3onZPmaP9zBpe --output ./collections
```

## 出力

### アセット取得の出力
ファイルをダウンロードする際は、以下の構造が作成されます：
```
<output_directory>/
  <assetId>/
    metadata.json
    image.<extension>
    asset.json
```

### コレクション取得の出力
ファイルをダウンロードする際は、以下の構造が作成されます：
```
<output_directory>/
  <collectionId>/
    metadata.json
    image.<extension>
    collection.json
```

## 注意事項

- 取得コマンドは、ファイルタイプを自動的に検出し、適切な拡張子を使用します
- コレクションで出力ディレクトリが指定されない場合、ファイルは現在のディレクトリに保存されます
- メタデータJSONファイルは、読みやすさのためにきれいに整形されます
- 画像ファイルは、元の形式と品質を保持します
- コマンドは、存在しない場合は必要なディレクトリを作成します
- コレクションの場合、メタデータファイルと画像ファイルが一緒にダウンロードされます
- アセットの場合、特定のコンポーネント（画像、メタデータ、またはアセットデータ）をダウンロードすることを選択できます