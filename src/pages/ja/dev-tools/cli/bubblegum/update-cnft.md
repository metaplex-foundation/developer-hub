---
title: 圧縮NFT更新
metaTitle: 圧縮NFT更新 | Metaplex CLI
description: 圧縮NFTのメタデータを更新する
---

`mplx bg nft update`コマンドは、圧縮NFTのオフチェーンメタデータを更新します。個々のフィールドを更新するか、インタラクティブエディタを使用して完全なメタデータJSONを変更できます。

## 基本的な使い方

### 個別フィールドの更新

```bash
mplx bg nft update <assetId> --name "New Name"
```

### 複数フィールドの更新

```bash
mplx bg nft update <assetId> --name "New Name" --description "New Description" --image ./new-image.png
```

### インタラクティブエディタ

```bash
mplx bg nft update <assetId> --editor
```

## 引数

| 引数 | 説明 |
|----------|-------------|
| `ASSET_ID` | 更新する圧縮NFTのアセットID |

## オプション

| オプション | 説明 |
|--------|-------------|
| `--name <value>` | NFTの新しい名前 |
| `--symbol <value>` | NFTの新しいシンボル |
| `--description <value>` | NFTの新しい説明 |
| `--image <value>` | 新しい画像ファイルへのパス |
| `--uri <value>` | 新しいメタデータURI（フィールド更新の代替） |
| `-e, --editor` | デフォルトエディタでメタデータJSONを開く |

## グローバルフラグ

| フラグ | 説明 |
|------|-------------|
| `-c, --config <value>` | 設定ファイルのパス。デフォルトは`~/.config/mplx/config.json` |
| `-k, --keypair <value>` | キーペアファイルまたはレジャーへのパス（例：`usb://ledger?key=0`） |
| `-r, --rpc <value>` | クラスターのRPC URL |
| `--json` | JSON形式で出力 |

## 例

1. 名前を更新：

   ```bash
   mplx bg nft update CNFTAssetIdHere --name "Updated NFT Name"
   ```

1. 名前と説明を更新：

   ```bash
   mplx bg nft update CNFTAssetIdHere \
     --name "New Name" \
     --description "このNFTは更新されました"
   ```

1. 新しい画像で更新：

   ```bash
   mplx bg nft update CNFTAssetIdHere \
     --name "Refreshed NFT" \
     --image ./new-artwork.png
   ```

1. メタデータURI全体を置換：

   ```bash
   mplx bg nft update CNFTAssetIdHere --uri "https://arweave.net/xxx"
   ```

1. インタラクティブエディタを使用：

   ```bash
   mplx bg nft update CNFTAssetIdHere --editor
   ```

## 出力

```text
--------------------------------

  Compressed NFT Update

--------------------------------
Fetching asset and proof data... ✓
Uploading Image... ✓
Uploading JSON file... ✓
Updating compressed NFT... ✓

--------------------------------
  Compressed NFT: Updated NFT Name
  Asset ID: CNFTAssetIdHere
  Signature: 5xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  Explorer: https://solscan.io/tx/5xxx...
--------------------------------
```

## 権限要件

圧縮NFTを更新するには、以下のいずれかである必要があります：
- **ツリー権限** - NFTがコレクションに属していない場合
- **コレクション更新権限** - NFTが[Metaplex Coreコレクション](/smart-contracts/core/collections)に属している場合

**注意**: NFTのオーナーは更新できません - これは従来のNFTとは異なります。

## 注意事項

- RPCはDAS APIをサポートしている必要があります
- フィールドを更新する場合（URIではない場合）、既存のメタデータが取得され、変更とマージされます
- メタデータの取得に失敗した場合、新しいメタデータを作成するためにすべてのフィールドを提供する必要があります
- `--uri`フラグは`--image`、`--description`、`--editor`と排他的です
- `--editor`フラグは他のすべての更新フラグと排他的です
- エディタは`$EDITOR`環境変数を使用するか、デフォルトでnano/notepadを使用します
