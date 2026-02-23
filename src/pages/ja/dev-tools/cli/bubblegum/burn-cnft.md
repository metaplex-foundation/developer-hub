---
title: 圧縮NFTバーン
metaTitle: 圧縮NFTバーン | Metaplex CLI
description: 圧縮NFTを完全に破棄する
---

`mplx bg nft burn`コマンドは、圧縮NFTを完全に破棄します。この操作は**元に戻せません**。

## 基本的な使い方

```bash
mplx bg nft burn <assetId>
```

## 引数

| 引数 | 説明 |
|----------|-------------|
| `ASSET_ID` | バーンする圧縮NFTのアセットID |

## グローバルフラグ

| フラグ | 説明 |
|------|-------------|
| `-c, --config <value>` | 設定ファイルのパス。デフォルトは`~/.config/mplx/config.json` |
| `-k, --keypair <value>` | キーペアファイルまたはレジャーへのパス（例：`usb://ledger?key=0`） |
| `-r, --rpc <value>` | クラスターのRPC URL |
| `--json` | JSON形式で出力 |

## 例

1. 圧縮NFTをバーン：

   ```bash
   mplx bg nft burn CNFTAssetIdHere
   ```

1. JSON出力でバーン：

   ```bash
   mplx bg nft burn CNFTAssetIdHere --json
   ```

## 出力

```text
Fetching asset and proof data... ✓
Verifying ownership... ✓
Burning compressed NFT... ✓
Compressed NFT burned successfully!

--------------------------------
Compressed NFT Burned!

Asset ID: CNFTAssetIdHere
Owner: YourWalletAddressHere
Tree: 9hRvTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Signature: 5xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Explorer: https://solscan.io/tx/5xxx...
--------------------------------
```

## 権限要件

圧縮NFTをバーンするには、以下のいずれかである必要があります：
- **現在のオーナー** - NFTを現在所有しているウォレット
- **デリゲート** - NFTに対する権限を委任されたウォレット

## 注意事項

- **警告**: バーンは永久的で元に戻せません
- RPCはDAS APIをサポートしている必要があります
- バーンしてもマークルツリーからレントは回収されません
- ツリーの容量は解放されません - スロットは占有されたまま（バーン済みとしてマーク）
- 関連するメタデータはストレージに残りますが、リンクされなくなります
