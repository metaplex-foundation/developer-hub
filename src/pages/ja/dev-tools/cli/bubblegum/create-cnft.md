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
| `--royalties <value>` | 明示的なリーフロイヤリティ%（0–100、小数可 例: `7.5`）。コレクション継承をオプトアウト |
| `--inherit-royalties` | 継承センチネル `65535` と空のリーフクリエイターを保存。Royaltiesプラグイン付きの `--collection` が必要。コレクションにRoyaltiesがあり `--royalties`、`--creator`、JSON の `seller_fee_basis_points` を省略した場合のデフォルト |
| `--creator <address>:<share>` | リーフの分配（繰り返し可。シェア合計は100）。明示的リーフミントではデフォルトは支払者 100%。`--royalties` がなくても継承をオプトアウト。`--inherit-royalties` とは併用不可 |
| `--collection <value>` | Coreコレクションアドレス（BubblegumV2必須）。[Metaplex Coreコレクション](/smart-contracts/core/collections) |
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

1. 特定のツリーでウィザードを使用して作成：

   ```bash
   mplx bg nft create my-tree --wizard
   ```

1. 既存のメタデータURIで作成：

   ```bash
   mplx bg nft create my-tree --name "My NFT" --uri "https://arweave.net/xxx"
   ```

1. ローカルファイルで作成：

   ```bash
   mplx bg nft create my-tree --image ./artwork.png --json ./metadata.json
   ```

1. メタデータフラグで作成：

   ```bash
   mplx bg nft create my-tree \
     --name "Cool NFT #1" \
     --image ./nft.png \
     --description "とてもクールな圧縮NFT" \
     --attributes "Background:Blue,Eyes:Laser,Hat:Crown" \
     --royalties 5
   ```

1. コレクションに作成（Royaltiesプラグインがある場合は自動継承）：

   ```bash
   mplx bg nft create my-tree \
     --name "Collection Item #1" \
     --image ./nft.png \
     --collection 7kPqYxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

1. コレクションのRoyaltiesプラグインから継承を強制：

   ```bash
   mplx bg nft create my-tree \
     --name "Inherited cNFT" \
     --uri "https://arweave.net/xxx" \
     --collection 7kPqYxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx \
     --inherit-royalties
   ```

1. 明示的なリーフロイヤリティとクリエイター分配（継承をオプトアウト）：

   ```bash
   mplx bg nft create my-tree \
     --name "Split cNFT" \
     --uri "https://arweave.net/xxx" \
     --collection 7kPqYxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx \
     --royalties 7.5 \
     --creator Addr111111111111111111111111111111111111111:60 \
     --creator Addr222222222222222222222222222222222222222:40
   ```

## 出力

```text
Uploading image... ✓
Uploading metadata... ✓
Creating compressed NFT... ✓

--------------------------------
Compressed NFT Created!

Tree: my-tree
Owner: YourWalletAddressHere
Asset ID: CNFTAssetIdHere
Royalties: inherited (leaf sentinel 65535)

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

`seller_fee_basis_points` が設定されている場合、CLIは明示的なリーフ料率として扱い、コレクションからは**継承しません**。

## 継承ロイヤリティ

[Royaltiesプラグイン](/smart-contracts/core/plugins/royalties)を持つ Core コレクションへミントする場合、CLIはコレクション料率を各cNFTにコピーする代わりに、継承センチネル（`65535`）と空のリーフクリエイターを保存できます。DASは表示用にコレクション料率を解決します。[継承ロイヤリティの読み取り](/smart-contracts/bubblegum-v2/reading-inherited-royalties)を参照してください。

```bash
mplx bg collection create \
  --name "My Compressed Collection" \
  --uri "https://example.com/collection.json" \
  --royalties 5
```

| 意図 | フラグ |
|--------|--------|
| 自動継承 | `--collection <COL>` かつ `--royalties`、`--creator`、JSON の `seller_fee_basis_points` を省略 |
| 継承を強制 | `--collection <COL> --inherit-royalties` |
| 明示的なリーフ料率 | `--royalties <0-100>`（小数可）。継承をオプトアウト |
| 明示的な分配 | `--creator <ADDR>:<share>`（繰り返し可。合計100）。`--royalties` がなくても継承をオプトアウト（リーフ料率は `0%`） |

`--inherit-royalties` には Royalties プラグイン付きの `--collection` が必要で、`--royalties`、`--creator`、JSON の `seller_fee_basis_points` と併用できません。`mplx core collection create` だけでは不十分です。コレクションには `BubblegumV2`（継承する場合は Royalties）が必要です。

## 注意事項

- ツリー引数は保存されたツリー名または公開鍵アドレスのいずれかを使用できます
- ツリーがプライベートの場合、ミントするにはツリー権限が必要です
- ツリーがパブリックの場合、誰でもNFTをミントできます
- RPCはDAS APIをサポートしている必要があります
- **Bubblegum V2のみ** - これらのコマンドはBubblegum V2ツリーで動作し、[Metaplex Coreコレクション](/smart-contracts/core/collections)を使用します（Token Metadataコレクションではありません）
- 属性形式：`"trait:value,trait:value"` - コロンでtraitとvalueを区切り、カンマでペアを区切ります
- 選択したコレクションにRoyaltiesプラグインがある場合、ウィザードは継承と明示的ロイヤリティを選択できます
