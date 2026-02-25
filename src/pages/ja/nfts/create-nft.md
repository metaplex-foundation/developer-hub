---
title: NFTを作成する
metaTitle: NFTを作成する | NFT
description: Metaplex Coreを使用してSolana上でNFTを作成する方法を学びます
created: '03-12-2025'
updated: '03-12-2025'
---

Metaplex Coreを使用して、Solana上でNFTを作成します。 {% .lead %}

## 学習内容
このガイドでは、以下の要素を持つNFTの作成方法を説明します：

- カスタム名とメタデータ
- 画像と説明
- オプションの属性

## NFTを作成する

以下のコードは完全に実行可能な例です。カスタマイズ可能なパラメータを以下に示します。NFT作成の詳細については、[Coreドキュメント](/smart-contracts/core)をご覧ください。

{% code-tabs-imported from="core/create-asset" frameworks="umi,cli" /%}

## オンチェーンパラメータ

NFTに合わせて以下のパラメータをカスタマイズしてください：

| パラメータ | 説明 |
|-----------|-------------|
| `name` | NFT名（最大32文字） |
| `uri` | オフチェーンメタデータJSONへのリンク |

## メタデータと画像

以下は、アップロードに必要な最小限のメタデータです。`external_url`、`attributes`、`properties`などの追加フィールドはオプションで、詳細な説明と例は[JSONスキーマ](/smart-contracts/core/json-schema)で確認できます。JSONと画像をどこからでもアクセスできるようにアップロードする必要があります。ArweaveなどのWeb3ストレージプロバイダーの使用をお勧めします。コードで行う場合は、この[ガイド](/guides/general/create-deterministic-metadata-with-turbo)に従ってください。

```json
{
  "name": "My NFT",
  "description": "An NFT on Solana",
  "image": "https://arweave.net/tx-hash",
  "attributes": []
}
```

## プラグイン
MPL Coreアセットは、コレクションレベルとアセットレベルの両方でプラグインの使用をサポートしています。プラグインを持つCore Assetを作成するには、作成時に`plugins`配列引数にプラグインタイプとそのパラメータを渡します。プラグインの詳細については、[プラグイン概要](/smart-contracts/core/plugins)ページをご覧ください。プロフィール画像などのNFTの文脈では、[ロイヤリティプラグイン](/smart-contracts/core/plugins/royalties)が一般的なユースケースです。
