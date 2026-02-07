---
title: コレクションの作成
metaTitle: コレクションの作成 | Metaplex CLI
description: 異なる方法を使用してMPLコアコレクションを作成
---

`mplx core collection create`コマンドを使用すると、シンプルな作成、ファイルベースの作成、またはインタラクティブウィザードの3つの異なる方法でMPLコアコレクションを作成できます。このコマンドは、コレクション作成の方法において柔軟性を提供しながら、一貫した出力形式を維持します。

## 方法

### 1. シンプルな作成
コマンドライン引数を通じて、メタデータの名前とURIを直接提供して単一のコレクションを作成します。

```bash
mplx core collection create --name "My Collection" --uri "https://example.com/metadata.json"
```

### 2. ファイルベースの作成
画像ファイルとJSONメタデータファイルを提供して単一のコレクションを作成します。コマンドは両方のファイルのアップロードとコレクションの作成を処理します。

```bash
mplx core collection create --files --image "./my-collection.png" --json "./metadata.json"
```

### 3. インタラクティブウィザード
ファイルのアップロードとメタデータの作成を含む全プロセスをガイドするインタラクティブウィザードを使用してコレクションを作成します。

```bash
mplx core collection create --wizard
```

## オプション

### 基本オプション
- `--name <string>`: コレクション名（シンプルな作成に必須）
- `--uri <string>`: コレクションメタデータのURI（シンプルな作成に必須）

### ファイルベースオプション
- `--files`: ファイルベースの作成を示すフラグ
- `--image <path>`: アップロードしてコレクションに割り当てる画像ファイルへのパス
- `--json <path>`: JSONメタデータファイルへのパス

### プラグインオプション
- `--plugins`: インタラクティブなプラグイン選択を使用
- `--pluginsFile <path>`: プラグインデータを含むJSONファイルへのパス

## 例

1. インタラクティブウィザードを使用してコレクションを作成：
```bash
mplx core collection create --wizard
```

2. 名前とURIを使用してコレクションを作成：
```bash
mplx core collection create --name "My Collection" --uri "https://example.com/metadata.json"
```

3. ファイルからコレクションを作成：
```bash
mplx core collection create --files --image "./my-collection.png" --json "./metadata.json"
```

## 出力

コマンドは作成が成功すると以下の情報を出力します：
```
--------------------------------
  Collection: <collection_address>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
  Core Explorer: https://core.metaplex.com/explorer/<collection_address>
--------------------------------
```

## 注意事項

- ファイルベースの作成方法を使用する場合、`--image`と`--json`フラグの両方が必要です
- ウィザード方法は、ファイルのアップロードとメタデータの作成を含むガイド付きのコレクション作成体験を提供します
- プラグイン設定は、インタラクティブまたはJSONファイル経由で行えます
- JSONメタデータファイルには、コレクションの`name`フィールドが含まれている必要があります
- コマンドは、ファイルベースまたはウィザード方法を使用する際に、ファイルのアップロードとメタデータの作成を自動的に処理します
- コレクションメタデータは、コレクション固有のフィールドを持つ標準NFTメタデータ形式に従います
