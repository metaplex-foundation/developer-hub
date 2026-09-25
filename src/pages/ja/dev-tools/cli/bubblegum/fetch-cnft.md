---
title: 圧縮NFT取得
metaTitle: 圧縮NFT取得 | Metaplex CLI
description: 圧縮NFTのデータとマークルプルーフを取得する
---

`mplx bg nft fetch`コマンドは、DAS（Digital Asset Standard）APIを使用して圧縮NFTのアセットデータとマークルプルーフを取得します。

## 基本的な使い方

```bash
mplx bg nft fetch <assetId>
```

### ファイルにダウンロード

```bash
mplx bg nft fetch <assetId> --download --output ./nfts
```

### プルーフのみ取得

```bash
mplx bg nft fetch <assetId> --proof-only
```

## 引数

| 引数 | 説明 |
|----------|-------------|
| `ASSET_ID` | 圧縮NFTのアセットID（リーフアセットID） |

## オプション

| オプション | 説明 |
|--------|-------------|
| `--download` | アセットデータとプルーフをファイルにダウンロード |
| `--output <value>` | ダウンロードファイルのディレクトリパス（`--download`が必要） |
| `--proof-only` | マークルプルーフのみを取得して表示 |

## グローバルフラグ

| フラグ | 説明 |
|------|-------------|
| `-c, --config <value>` | 設定ファイルのパス。デフォルトは`~/.config/mplx/config.json` |
| `-r, --rpc <value>` | クラスターのRPC URL |
| `--json` | JSON形式で出力 |

## 例

1. NFT情報を取得して表示：

   ```bash
   mplx bg nft fetch CNFTAssetIdHere
   ```

1. アセットデータをファイルにダウンロード：

   ```bash
   mplx bg nft fetch CNFTAssetIdHere --download
   ```

1. 特定のディレクトリにダウンロード：

   ```bash
   mplx bg nft fetch CNFTAssetIdHere --download --output ./nft-data
   ```

1. マークルプルーフのみを取得：

   ```bash
   mplx bg nft fetch CNFTAssetIdHere --proof-only
   ```

1. JSON形式で出力：

   ```bash
   mplx bg nft fetch CNFTAssetIdHere --json
   ```

## 出力

```text
--------------------------------
Compressed NFT Details

Asset ID: CNFTAssetIdHere
Name: My Compressed NFT
Symbol: CNFT
Description: A beautiful compressed NFT

Compressed: true
Tree: 9hRvTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Leaf ID: 42
Owner: OwnerWalletAddressHere
Collection: CollectionAddressHere

Metadata URI: https://arweave.net/xxx
Image: https://arweave.net/yyy

Mutable: true
Burnt: false

Merkle Proof:
  Root: RootHashHere
  Node Index: 42
  Proof Length: 6 nodes
  Tree ID: 9hRvTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Royalty:
  Basis Points: 500 (5%)
  Inherited: Yes (leaf sentinel 65535)
  Primary Sale: No

Creators (display):
  CollectionCreatorAddress (100%) ✓

Creators (leaf / raw):
  (empty — typical when SFBP is inherited)

--------------------------------
```

## ダウンロードされるファイル

`--download`を使用すると、2つのファイルが作成されます：

- `<assetId>-asset.json` - メタデータ、所有権、圧縮情報を含む完全なアセットデータ
- `<assetId>-proof.json` - 書き込み操作（転送、バーン、更新）に必要なマークルプルーフ

## 注意事項

- RPCはDAS APIをサポートしている必要があります
- 標準のSolana RPCエンドポイントは「Asset not found or RPC does not support DAS API」で失敗します
- マークルプルーフは転送、バーン、更新操作に不可欠です
- `--json`フラグはスクリプト用の機械可読JSONを出力します
- 継承ロイヤリティでは `Royalty` / `Creators (display)` がコレクション解決値です。`Inherited` と `Creators (leaf / raw)` は診断用で、DAS が `_raw` / `inherited` を返す場合のみ表示されます。これらのフィールドが無いときにセンチネルを捏造しないでください。[継承ロイヤリティの読み取り](/smart-contracts/bubblegum-v2/reading-inherited-royalties)
