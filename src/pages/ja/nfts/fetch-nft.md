---
title: NFTを取得する
metaTitle: NFTを取得する | NFT
description: Metaplex Coreを使用してSolana上でNFTを取得する方法を学びます
created: '03-12-2025'
updated: '03-12-2025'
---

Solanaブロックチェーンからnftデータを取得します。 {% .lead %}

## NFTまたはコレクションを取得する

以下のセクションでは、完全なコード例と変更が必要なパラメータを確認できます。NFTとコレクションの取得の詳細については、[Coreドキュメント](/core/fetch)をご覧ください。

{% code-tabs-imported from="core/fetch-asset" frameworks="umi,cli,das,curl" /%}

## パラメータ

取得に合わせて以下のパラメータをカスタマイズしてください：

| パラメータ | 説明 |
|-----------|-------------|
| `assetAddress` | NFTアセットの公開鍵 |
| `collectionAddress` | コレクションの公開鍵（オプション） |

## 仕組み

取得プロセスには以下の手順が含まれます：

1. **アドレスを取得** - 取得したいNFTアセットまたはコレクションの公開鍵が必要です
2. **アセットデータを取得** - `fetchAsset`を使用して、名前、URI、所有者、プラグインを含むNFT情報を取得します
3. **コレクションデータを取得** - `fetchCollection`を使用してコレクション情報を取得します（オプション）

## NFTとコレクションデータ

アセットを取得すると、すべてのデータが返されます：

- **Name** - NFTの名前
- **URI** - メタデータJSONへのリンク
- **Owner** - NFTを所有するウォレット
- **Update Authority** - NFTを変更できる人
- **Plugins** - ロイヤリティや属性などの添付プラグイン

コレクションを取得すると、以下が返されます：

- **Name** - コレクションの名前
- **URI** - コレクションメタデータJSONへのリンク
- **Update Authority** - コレクションを変更できる人
- **Num Minted** - コレクション内のアセット数
- **Plugins** - ロイヤリティや属性などの添付プラグイン

