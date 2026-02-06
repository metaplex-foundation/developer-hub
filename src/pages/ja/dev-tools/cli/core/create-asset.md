---
title: アセットの作成
metaTitle: アセットの作成 | Metaplex CLI
description: 異なる方法を使用してMPLコアアセットを作成
---

`mplx core asset create`コマンドを使用すると、シンプルな作成、ファイルベースの作成、またはインタラクティブウィザードの3つの異なる方法でMPLコアアセットを作成できます。このコマンドは、アセット作成の方法において柔軟性を提供しながら、一貫した出力形式を維持します。

## 方法

### 1. シンプルな作成
コマンドライン引数を通じて、メタデータの名前とURIを直接提供して単一のアセットを作成します。

```bash
mplx core asset create --name "My NFT" --uri "https://example.com/metadata.json"
```

### 2. ファイルベースの作成
画像ファイルとJSONメタデータファイルを提供して単一のアセットを作成します。コマンドは両方のファイルのアップロードとアセットの作成を処理します。

```bash
mplx core asset create --files --image "./my-nft.png" --json "./metadata.json"
```

### 3. インタラクティブウィザード
ファイルのアップロードとメタデータの作成を含む全プロセスをガイドするインタラクティブウィザードを使用してアセットを作成します。

```bash
mplx core asset create --wizard
```

## オプション

### 基本オプション
- `--name <string>`: アセット名（シンプルな作成に必須）
- `--uri <string>`: アセットメタデータのURI（シンプルな作成に必須）
- `--collection <string>`: アセットのコレクションID

### ファイルベースオプション
- `--files`: ファイルベースの作成を示すフラグ
- `--image <path>`: アップロードしてアセットに割り当てる画像ファイルへのパス
- `--json <path>`: JSONメタデータファイルへのパス

### プラグインオプション
- `--plugins`: インタラクティブなプラグイン選択を使用
- `--pluginsFile <path>`: プラグインデータを含むJSONファイルへのパス

## 例

1. インタラクティブウィザードを使用してアセットを作成：
```bash
mplx core asset create --wizard
```

2. 名前とURIを使用してアセットを作成：
```bash
mplx core asset create --name "My NFT" --uri "https://example.com/metadata.json"
```

3. ファイルからアセットを作成：
```bash
mplx core asset create --files --image "./my-nft.png" --json "./metadata.json"
```

4. コレクション付きのアセットを作成：
```bash
mplx core asset create --name "My NFT" --uri "https://example.com/metadata.json" --collection "collection_id_here"
```

5. ファイルとコレクション付きのアセットを作成：
```bash
mplx core asset create --files --image "./my-nft.png" --json "./metadata.json" --collection "collection_id_here"
```

## 出力

コマンドは作成が成功すると以下の情報を出力します：
```
--------------------------------
  Asset: <asset_address>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
  Core Explorer: https://core.metaplex.com/explorer/<asset_address>
--------------------------------
```
