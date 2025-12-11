---
title: インターフェース実装
metaTitle: インターフェース実装 | Umi
description: 公開インターフェース実装の概要
---
このページは、[Umiによって定義されたインターフェース](interfaces)の利用可能なすべての実装をリストすることを目的としています。

## バンドル

| 説明 | メンテナー | リンク |
| --- | --- | --- |
| Umiのデフォルトバンドル | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-bundle-defaults) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-bundle-defaults) |
| Umiのテストバンドル | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-bundle-tests) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-bundle-tests) |

## 署名者

| 説明 | メンテナー | リンク |
| --- | --- | --- |
| 内部署名者プラグイン | Metaplex | [署名者ドキュメント](/ja/umi/public-keys-and-signers#signers) |
| SolanaのWallet Adaptersを使用 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-signer-wallet-adapters) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-signer-wallet-adapters) |
| メッセージ署名から新しい署名者を導出 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-signer-derived) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-signer-derived) |

## EdDSAインターフェース

| 説明 | メンテナー | リンク |
| --- | --- | --- |
| Solanaのweb3.jsを使用 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-eddsa-web3js) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-eddsa-web3js) |

## RPCインターフェース

| 説明 | メンテナー | リンク |
| --- | --- | --- |
| Solanaのweb3.jsを使用 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-rpc-web3js) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-rpc-web3js) |
| `getAccounts`リクエストを指定されたサイズのバッチにチャンクし、並列実行してAPIの制限をエンドユーザーに抽象化するRPCデコレーター。 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-rpc-chunk-get-accounts) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-rpc-chunk-get-accounts) |

## トランザクションファクトリーインターフェース

| 説明 | メンテナー | リンク |
| --- | --- | --- |
| Solanaのweb3.jsを使用 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-transaction-factory-web3js) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-transaction-factory-web3js) |

## アップローダーインターフェース

| 説明 | メンテナー | リンク |
| --- | --- | --- |
| AWSを使用 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-uploader-aws) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-uploader-aws) |
| Irys.xyzを使用 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-uploader-irys) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-uploader-irys) |
| NFT.Storageを使用 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-uploader-nft-storage) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-uploader-nft-storage) |
| アップロードとダウンロードをモックするためにローカルキャッシュを使用 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-storage-mock) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-storage-mock) |
| 4EVERLANDを使用 | 4EVERLAND | [GitHub](https://github.com/4everland/umi-uploader-4everland) / [NPM](https://www.npmjs.com/package/@4everland/umi-uploader-4everland) |
| Bundlr.networkを使用（非推奨 - `umi-uploader-irys`を使用してください） | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-uploader-bundlr) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-uploader-bundlr) |

## ダウンローダーインターフェース

| 説明 | メンテナー | リンク |
| --- | --- | --- |
| Httpインターフェースを使用 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-downloader-http) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-downloader-http) |
| アップロードとダウンロードをモックするためにローカルキャッシュを使用 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-storage-mock) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-storage-mock) |

## Httpインターフェース

| 説明 | メンテナー | リンク |
| --- | --- | --- |
| `node-fetch`ライブラリを介してfetch APIを使用 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-http-fetch) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-http-fetch) |

## プログラムリポジトリインターフェース

| 説明 | メンテナー | リンク |
| --- | --- | --- |
| 追加の依存関係のないデフォルト実装 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-program-repository) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-program-repository) |