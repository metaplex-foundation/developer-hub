---
title: 圧縮NFT転送
metaTitle: 圧縮NFT転送 | Metaplex CLI
description: 圧縮NFTを新しいオーナーに転送する
---

`mplx bg nft transfer`コマンドは、圧縮NFTの所有権を新しいウォレットアドレスに転送します。

## 基本的な使い方

```bash
mplx bg nft transfer <assetId> <newOwner>
```

## 引数

| 引数 | 説明 |
|----------|-------------|
| `ASSET_ID` | 転送する圧縮NFTのアセットID |
| `NEW_OWNER` | 新しいオーナーの公開鍵 |

## グローバルフラグ

| フラグ | 説明 |
|------|-------------|
| `-c, --config <value>` | 設定ファイルのパス。デフォルトは`~/.config/mplx/config.json` |
| `-k, --keypair <value>` | キーペアファイルまたはレジャーへのパス（例：`usb://ledger?key=0`） |
| `-r, --rpc <value>` | クラスターのRPC URL |
| `--json` | JSON形式で出力 |

## 例

新しいオーナーに転送：
```bash
mplx bg nft transfer CNFTAssetIdHere RecipientWalletAddressHere
```


## 出力

```
Fetching asset and proof data... ✓
Verifying ownership... ✓
Executing transfer... ✓
Compressed NFT transferred successfully!

--------------------------------
Compressed NFT Transferred!

Asset ID: CNFTAssetIdHere
From: OriginalOwnerAddressHere
To: NewOwnerAddressHere
Tree: 9hRvTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Signature: 5xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Explorer: https://solscan.io/tx/5xxx...
--------------------------------
```

## 権限要件

圧縮NFTを転送するには、以下のいずれかである必要があります：
- **現在のオーナー** - NFTを現在所有しているウォレット
- **デリゲート** - NFTに対する権限を委任されたウォレット

## 注意事項

- RPCはDAS APIをサポートしている必要があります
- 転送はアトミックです - 完全に完了するか、完全に失敗します
- 新しいオーナーは即座に完全な所有権を取得します
- 従来のNFTとは異なり、圧縮NFTの転送では新しいトークンアカウントを作成しません
- アセットIDは転送後も同じままです（オーナーのみが変更されます）
