---
title: ファンジブルトークンを作成する
metaTitle: ファンジブルトークンを作成する | トークン
description: Solana上でメタデータ付きのファンジブルSPLトークンを作成する方法を学びます
created: '11-25-2025'
updated: '11-25-2025'
---

Token Metadataプログラムを使用して、Solana上でメタデータ付きのファンジブルトークンを作成します。 {% .lead %}

## 学習内容
このガイドでは、以下の要素を持つファンジブルトークンの作成とミント方法を説明します：

- カスタム名、シンボル、メタデータ
- トークン画像と説明
- 設定可能な小数点以下桁数（分割可能性）
- 初期トークン供給量

## トークンを作成する

以下のコードは完全に実行可能な例です。カスタマイズ可能なパラメータを以下に示します。トークン作成の詳細については、[Token Metadataプログラム](/token-metadata/mint#minting-tokens)ページをご覧ください。

{% code-tabs-imported from="token-metadata/fungibles/create" frameworks="umi" /%}

## パラメータ

トークンに合わせて以下のパラメータをカスタマイズしてください：

| パラメータ | 説明 |
|-----------|-------------|
| `name` | トークン名（最大32文字） |
| `symbol`| トークンの略称（最大6文字） |
| `uri` | オフチェーンメタデータJSONへのリンク |
| `sellerFeeBasisPoints` | ロイヤリティ率（550 = 5.5%） |
| `decimals` | 小数点以下桁数（`some(9)`が標準） |
| `amount` | ミントするトークン数 |

## メタデータと画像

`uri`は少なくとも以下の情報を含むJSONファイルを指す必要があります。詳細は[Token Metadata標準ページ](/token-metadata/token-standard#the-fungible-standard)で確認できます。JSONと画像URLをどこからでもアクセスできるようにアップロードする必要があります。ArweaveなどのWeb3ストレージプロバイダーの使用をお勧めします。コードで行う場合は、この[ガイド](/guides/general/create-deterministic-metadata-with-turbo)に従ってください。

```json
{
  "name": "My Fungible Token",
  "symbol": "MFT",
  "description": "A fungible token on Solana",
  "image": "https://arweave.net/tx-hash"
}
```
