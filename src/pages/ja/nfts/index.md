---
title: NFT
metaTitle: NFT | Metaplex
description: Metaplex Coreを使用してSolana上でNFTを作成・管理する方法を学びます。
---

Metaplex Coreを使用して、Solana上でNFT（非代替性トークン）を作成・管理します。 {% .lead %}

## 概要

非代替性トークン（NFT）は、アート、コレクティブル、ゲーム内アイテムなどの所有権を表すユニークなデジタル資産です。Metaplex Coreは、単一アカウント設計によりコストを削減しパフォーマンスを向上させた、Solana上でNFTを作成・管理するための最新かつ効率的な方法を提供します。

## できること

このセクションでは、一般的なNFT操作について初心者向けのガイドを提供します：

- **[NFTを作成する](/ja/nfts/create-nft)** - カスタムメタデータを持つ新しいNFTを作成
- **[NFTを取得する](/ja/nfts/fetch-nft)** - ブロックチェーンからNFTデータを取得
- **[NFTを更新する](/ja/nfts/update-nft)** - NFTの名前やメタデータを更新
- **[NFTを転送する](/ja/nfts/transfer-nft)** - ウォレット間でNFTの所有権を転送
- **[NFTをバーンする](/ja/nfts/burn-nft)** - NFTを永久に破棄

## 前提条件

始める前に、以下を確認してください：

- Node.js 16以上がインストールされていること
- トランザクション手数料用のSOLを持つSolanaウォレット
- JavaScript/TypeScriptの基本的な知識

## クイックスタート

必要なパッケージをインストールします：

```bash
npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults
```

その後、[NFTを作成する](/ja/nfts/create-nft)ガイドに従って、Metaplex Coreで最初のNFTを作成してください。

## さらに詳しく

より高度なNFT機能については、以下をご覧ください：

- [Coreドキュメント](/ja/smart-contracts/core) - Metaplex Coreの完全なドキュメント
- [Coreプラグイン](/ja/smart-contracts/core/plugins) - プラグインでNFT機能を拡張
- [Coreコレクション](/ja/smart-contracts/core/collections) - NFTをコレクションに整理
