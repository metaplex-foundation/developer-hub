---
title: "アセットをアップロード"
metaTitle: "MPLX CLI - アセットアップロードコマンド"
description: "MPLX CLIを使用してキャンディマシンアセットを分散型ストレージにアップロードします。インテリジェントキャッシング、進行状況追跡、包括的な検証。"
---

`mplx cm upload`コマンドは、アセットを分散型ストレージにアップロードし、アップロードURIとメタデータを含む`asset-cache.json`ファイルを生成します。このコマンドは、インテリジェントキャッシング、進行状況追跡、包括的な検証を提供します。

## 使用方法

```bash
# 現在のキャンディマシンディレクトリからアセットをアップロード
mplx cm upload

# 特定のキャンディマシンディレクトリからアセットをアップロード
mplx cm upload <directory>
```

### ディレクトリ構造

```text
my-candy-machine/
├── assets/
│   ├── 0.png              # 画像ファイル (PNG, JPG)
│   ├── 0.json             # メタデータファイル
│   ├── 1.png
│   ├── 1.json
│   ├── ...
│   ├── collection.png      # コレクション画像
│   └── collection.json     # コレクションメタデータ
└── asset-cache.json        # アップロード後に生成
```

## アップロードプロセス

1. アセット検出: コマンドは自動的に`assets/`ディレクトリをスキャンし、画像、メタデータ、コレクションファイルを識別します。
2. 検証フェーズ: ファイルの整合性を検証します。たとえば、すべての画像ファイルに一致するメタデータファイルがあり、メタデータが有効なjsonであることを確認します。
3. キャッシュチェック: すでにアップロードされたファイルを識別するために`asset-cache.json`ファイルが検証されます。
4. アップロード: 実際のアップロードが行われます。
5. キャッシュ生成: `asset-cache.json`ファイルが生成されます

## 生成されたアセットキャッシュ

`asset-cache.json`ファイルには、アップロードされたアセットに関する詳細情報が含まれています。手動で検査および使用することは上級ユーザーのみに推奨されます。

例:

```json
{
  "candyMachineId": null,
  "collection": null,
  "assetItems": {
    "0": {
      "name": "Asset #0",
      "image": "0.png",
      "imageUri": "https://gateway.irys.xyz/ABC123...",
      "imageType": "image/png",
      "json": "0.json",
      "jsonUri": "https://gateway.irys.xyz/DEF456...",
      "loaded": false
    },
    "1": {
      "name": "Asset #1",
      "image": "1.png",
      "imageUri": "https://gateway.irys.xyz/GHI789...",
      "imageType": "image/png",
      "json": "1.json",
      "jsonUri": "https://gateway.irys.xyz/JKL012...",
      "loaded": false
    }
  }
}
```

## 関連コマンド

- [`mplx cm create`](/ja/cli/cm/create) - キャンディマシンを作成 (自動的にアップロード可能)
- [`mplx cm validate`](/ja/cli/cm/validate) - アップロードされたアセットを検証
- [`mplx cm insert`](/ja/cli/cm/insert) - アップロードされたアセットをキャンディマシンに挿入
- [`mplx cm fetch`](/ja/cli/cm/fetch) - キャンディマシンとアセット情報を表示

## 次のステップ

1. すべてが正しくアップロードされたことを確認するために**[アップロードを検証](/ja/cli/cm/validate)**
2. アップロードされたアセットを使用して**[キャンディマシンを作成](/ja/cli/cm/create)**
3. アセットをキャンディマシンにロードするために**[アイテムを挿入](/ja/cli/cm/insert)**
4. すべてが機能していることを確認するために**[セットアップを監視](/ja/cli/cm/fetch)**
