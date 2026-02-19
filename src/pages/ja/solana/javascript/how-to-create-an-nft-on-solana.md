---
# remember to update dates also in /components/products/guides/index.js
title: SolanaでNFTを作成する方法
metaTitle: SolanaでNFTを作成する方法 | ガイド
description: MetaplexパッケージでSolanaブロックチェーン上でNFTを作成する方法を学習します。
created: '04-19-2024'
updated: '04-19-2025'
keywords:
  - create NFT Solana
  - Metaplex Core
  - Token Metadata
  - Bubblegum
  - compressed NFT
about:
  - NFT creation
  - Metaplex Core
  - Token Metadata
  - Bubblegum
  - NFT standards
proficiencyLevel: Beginner
faqs:
  - q: What are the different ways to create NFTs on Solana with Metaplex?
    a: Metaplex provides three standards - Core (newest, with plugins and optimized accounts), Token Metadata (the original Solana NFT standard), and Bubblegum (compressed NFTs using Merkle trees for mass minting).
  - q: Which Metaplex NFT standard should I use?
    a: Use Core for the newest features and cost efficiency, Token Metadata for broad ecosystem support and compatibility, or Bubblegum for creating millions of NFTs at minimal cost.
  - q: What are compressed NFTs (cNFTs)?
    a: Compressed NFTs use Bubblegum and Merkle tree technology to store NFT data efficiently, making it extremely cheap to mint large quantities of NFTs on Solana.
---

Metaplexは、**Core**、**Token Metadata**、**Bubblegum**を含む、Solanaブロックチェーン上でNFTを作成するための3つの異なる標準を提供しています。各標準とプロトコルは、プロジェクトに独自の利点を提供し、プロジェクトのミントとNFT要件の広いスペクトラムに広がっています。

## Core Asset（推奨）

CoreはMetaplexによって作成された最新で最も先進的なデジタル資産標準です。この標準は、強力なプラグインシステムを通じて最適化されたアカウント構造と拡張機能を提供します。

#### Coreを使用する理由：

- 最新標準：CoreはMetaplexが現在まで作成した最新で最も強力なデジタル資産標準です。
- シンプルさ：Coreは**シンプルさ第一のアプローチ**で一から設計されました。
- プラグイン：Coreは、Core AssetsとCollectionsが追加の状態を保存し、ライフサイクル検証を提供し、拡張された動的体験を提供することを可能にする先進的なプラグインシステムを提供します。ここでの可能性は無限です！
- コスト：Bubblegumほど安価ではありませんが、Coreは最適化されたアカウント構造のため、Token Metadataと比較して作成とミントが**大幅に安価**です。

[CoreでNFTを作成](/ja/smart-contracts/core/guides/javascript/how-to-create-a-core-nft-asset-with-javascript)

## Token Metadata NFT/pNFT

Token Metadataは、すべてを始めたSolana NFT標準です。2021年に作成されたToken Metadataは、最初の発足以来5億1200万のNFTがミントされた驚異的な数で、SolanaブロックチェーンでのNFTの道を開拓しました。

#### Token Metadataを使用する理由：

- 試され信頼されている：Token Metadataは、Solana Monkey Business、DeGods、Claynosaurusなどのプロジェクトから過去4年間Solanaの主要なNFTトークン標準として使用されています。
- エコシステムサポート：NFTとpNFTは、MagicEden、Tensor、Phantom、SolflareなどのマーケットプレイスとウォレットによってSolana全体でサポートされています。
- SPLトークンベース：Token Metadata NFTs/pNFTsは、SolanaのSPLトークンプログラムに基づいています。

[Token MetadataでNFT/pNFTを作成](/ja/smart-contracts/token-metadata/guides/javascript/create-an-nft)

## Bubblegum cNFT

大量に安価なNFTを作成する場合、Bubblegumが選択すべきプロトコルです。Bubblegumは、各個別のNFTにアカウントを作成する代わりにマークル木アプローチを適用することで、**圧縮NFT（cNFT）**の技術を使用しています。

#### Bubblegumを使用する理由：

- デプロイが安価：マークル木ベースの製品であるため、木のデプロイが安価で、必要に応じて数百万のNFTを保存できます。
- 大量エアドロップ：木が作成されると、木のストレージの代金は既に支払われているため、cNFTのエアドロップコストはほぼゼロに近くなります。

[BubblegumでSolanaに1,000,000個のNFTを作成](/ja/smart-contracts/bubblegum/guides/javascript/how-to-create-1000000-nfts-on-solana)
