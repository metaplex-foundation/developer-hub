---
title: SolanaでNFTを作成する方法
metaTitle: SolanaでNFTを作成する方法 | Token Metadata ガイド
description: MetaplexでSolanaブロックチェーンでNFTを作成する方法を学びましょう。
# remember to update dates also in /components/guides/index.js
created: '06-16-2024'
updated: '06-18-2024'
---

これは、Metaplex Token Metadataプロトコルを使用してSolanaブロックチェーンでNFTを作成する方法の初期ガイドです。

## 前提条件

- お好みのコードエディタ（Visual Studio Codeを推奨）
- Node 18.x.x以上

## 初期セットアップ

このガイドでは、単一ファイルスクリプトに基づいたJavaScriptを使用してNFTを作成する方法を説明します。ニーズに合わせて関数を変更および移動する必要があるかもしれません。

### 初期化

お好みのパッケージマネージャー（npm、yarn、pnpm、bun）で新しいプロジェクトを初期化し（オプション）、プロンプトが表示されたら必要な詳細を入力することから始めます。

```js
npm init
```

### 必要なパッケージ

このガイドに必要なパッケージをインストールします。

{% code-tabs-imported from="token-metadata/getting-started" frameworks="umi,kit" /%}

## SDKのセットアップ

{% code-tabs-imported from="token-metadata/getting-started" frameworks="umi,kit" /%}

## NFTの作成

### 画像のアップロード

最初に行う必要があるのは、NFTを表す画像をアップロードすることです。これはjpeg、png、またはgifの形式で行うことができます。

Umiには、Arweave、NftStorage、AWS、ShdwDriveなどのストレージソリューションにアップロードできるダウンロード可能なストレージプラグインが付属しています。このガイドの冒頭で、Arweaveブロックチェーンにコンテンツを保存する`irysUploader()`プラグインをインストールしました。

{% callout title="ローカルスクリプト/Node.js" %}
この例では、Irysを使用してArweaveにアップロードするローカルスクリプト/node.jsアプローチを使用しています。別のストレージプロバイダーにファイルをアップロードしたい場合やブラウザからアップロードしたい場合は、別のアプローチを取る必要があります。ブラウザシナリオでは`fs`のインポートと使用は機能しません。
{% /callout %}

{% code-tabs-imported from="token-metadata/upload-assets" frameworks="umi" /%}

### メタデータのアップロード

有効で動作する画像URIを取得したら、NFTのメタデータの作成を開始できます。

オフチェーンメタデータの標準は以下の通りです：

```json
{
  "name": "My NFT",
  "description": "This is an NFT on Solana",
  "image": "https://arweave.net/my-image",
  "external_url": "https://example.com/my-nft.json",
  "attributes": [
    {
      "trait_type": "trait1",
      "value": "value1"
    },
    {
      "trait_type": "trait2",
      "value": "value2"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://arweave.net/my-image",
        "type": "image/png"
      }
    ],
    "category": "image"
  }
}
```

フィールドの説明：

#### name

トークンの名前。

#### symbol

トークンの略称。Solanaの略称は`SOL`です。

#### description

トークンの説明。

#### image

以前アップロードしたimageUri（または画像のオンラインロケーション）に設定されます。

### NFT vs pNFT

Token Metadataプログラムは、通常のNFTとpNFT（プログラマブルNon-Fungible Asset）の2種類のNFTをミントできます。
2つのタイプのNFTの主な違いは、一方はロイヤリティが強制され（pNFT）、もう一方はされない（NFT）ことです。

#### NFT

- ロイヤリティ強制なし
- 初期セットアップがより簡単で、将来的に作業しやすい

#### pNFT

- 将来の開発に関してより多くのアカウントを扱う必要がある
- ロイヤリティ強制
- プログラマブル - プログラムが転送を行うことをブロックできるルールセットがある

### NFTのミント

ここから、使用したいNFTミント命令のタイプ（`NFT`または`pNFT`）を選択できます。

#### NFT

{% code-tabs-imported from="token-metadata/create-nft" frameworks="umi,kit" /%}

#### pNFT

{% code-tabs-imported from="token-metadata/create-pnft" frameworks="umi,kit" /%}

## 次のステップ

このガイドでは、基本的なNFTの作成方法を学びました。ここから[Token Metadataプログラム](/smart-contracts/token-metadata)に進んで、コレクションの作成、新しいNFTをコレクションに追加すること、そしてNFTで実行できるさまざまな操作を確認できます。
