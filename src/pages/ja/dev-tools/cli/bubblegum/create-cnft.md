---
title: 圧縮NFT作成
metaTitle: 圧縮NFT作成 | Metaplex CLI
description: マークルツリーに圧縮NFTをミントする
---

`mplx bg nft create`コマンドは、既存のマークルツリーに圧縮NFTをミントします。まだマークルツリーがない場合は、まず[作成](/dev-tools/cli/bubblegum/create-tree)してください。

## 基本的な使い方

### インタラクティブウィザード（推奨）
```bash
mplx bg nft create --wizard
```

### 特定のツリーを指定
```bash
mplx bg nft create my-tree --wizard
```

### ファイルベースの作成
```bash
mplx bg nft create my-tree --image ./nft.png --json ./metadata.json
```

### URIベースの作成
```bash
mplx bg nft create my-tree --name "My NFT" --uri "https://example.com/metadata.json"
```

## 引数

| 引数 | 説明 |
|----------|-------------|
| `TREE` | ツリー名（保存済み）またはマークルツリーアドレス（ウィザードモードではオプション） |

## オプション

| オプション | 説明 |
|--------|-------------|
| `--wizard` | インタラクティブウィザードを使用 |
| `--name <value>` | NFT名 |
| `--uri <value>` | 既存のメタデータURI |
| `--json <value>` | JSONメタデータファイルへのパス（`--image`が必要） |
| `--image <value>` | 画像ファイルへのパス |
| `--description <value>` | NFTの説明 |
| `--attributes <value>` | "trait:value,trait:value"形式の属性 |
| `--animation <value>` | アニメーション/動画ファイルへのパス |
| `--project-url <value>` | 外部プロジェクトURL |
| `--symbol <value>` | オンチェーンシンボル |
| `--royalties <value>` | ロイヤリティパーセンテージ（0-100） |
| `--collection <value>` | コレクションミントアドレス（[Metaplex Coreコレクション](/smart-contracts/core/collections)） |
| `--owner <value>` | リーフオーナーの公開鍵（デフォルトは支払者） |

## グローバルフラグ

| フラグ | 説明 |
|------|-------------|
| `-c, --config <value>` | 設定ファイルのパス。デフォルトは`~/.config/mplx/config.json` |
| `-k, --keypair <value>` | キーペアファイルまたはレジャーへのパス（例：`usb://ledger?key=0`） |
| `-r, --rpc <value>` | クラスターのRPC URL |
| `--json` | JSON形式で出力 |

## 例

1. ウィザードを使用して作成：
```bash
mplx bg nft create --wizard
```

2. 特定のツリーでウィザードを使用して作成：
```bash
mplx bg nft create my-tree --wizard
```

3. 既存のメタデータURIで作成：
```bash
mplx bg nft create my-tree --name "My NFT" --uri "https://arweave.net/xxx"
```

4. ローカルファイルで作成：
```bash
mplx bg nft create my-tree --image ./artwork.png --json ./metadata.json
```

5. メタデータフラグで作成：
```bash
mplx bg nft create my-tree \
  --name "Cool NFT #1" \
  --image ./nft.png \
  --description "とてもクールな圧縮NFT" \
  --attributes "Background:Blue,Eyes:Laser,Hat:Crown" \
  --royalties 5
```

6. コレクションに作成：
```bash
mplx bg nft create my-tree \
  --name "Collection Item #1" \
  --image ./nft.png \
  --collection 7kPqYxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 出力

```
Uploading image... ✓
Uploading metadata... ✓
Creating compressed NFT... ✓

--------------------------------
Compressed NFT Created!

Tree: my-tree
Owner: YourWalletAddressHere
Asset ID: CNFTAssetIdHere

Signature: 5xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Explorer: https://solscan.io/tx/5xxx...
--------------------------------
```

## メタデータJSON形式

`--json`を使用する場合、メタデータファイルは以下の構造に従う必要があります：

```json
{
  "name": "My NFT",
  "symbol": "MNFT",
  "description": "NFTの説明",
  "seller_fee_basis_points": 500,
  "attributes": [
    { "trait_type": "Background", "value": "Blue" },
    { "trait_type": "Rarity", "value": "Rare" }
  ],
  "properties": {
    "files": [
      { "uri": "", "type": "image/png" }
    ]
  }
}
```

`image`フィールドはアップロードされた画像URIで自動的に入力されます。

## 注意事項

- ツリー引数は保存されたツリー名または公開鍵アドレスのいずれかを使用できます
- ツリーがプライベートの場合、ミントするにはツリー権限が必要です
- ツリーがパブリックの場合、誰でもNFTをミントできます
- RPCはDAS APIをサポートしている必要があります
- **Bubblegum V2のみ** - これらのコマンドはBubblegum V2ツリーで動作し、[Metaplex Coreコレクション](/smart-contracts/core/collections)を使用します（Token Metadataコレクションではありません）
- 属性形式：`"trait:value,trait:value"` - コロンでtraitとvalueを区切り、カンマでペアを区切ります
