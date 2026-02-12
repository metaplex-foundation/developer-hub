---
# remember to update dates also in /components/guides/index.js
title: 如何在 Solana 上创建 NFT
metaTitle: 如何在 Solana 上创建 NFT | 指南
description: 了解如何使用 Metaplex 包在 Solana 区块链上创建 NFT。
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

Metaplex 提供 3 种不同的标准在 Solana 区块链上创建 NFT，包括 **Core**、**Token Metadata** 和 **Bubblegum**。每个标准和协议为项目提供独特的优势，并跨越项目的铸造和 NFT 需求的广泛范围。

## Core 资产（推荐）

Core 是 Metaplex 创建的最新最先进的数字资产标准。该标准通过强大的插件系统提供优化的账户结构和增强的功能。

#### 为什么使用 Core：

- 最新标准：Core 是 Metaplex 迄今为止创建的最新最强大的数字资产标准。
- 简单性：Core 从一开始就采用**简单优先的方法**进行设计。
- 插件：Core 提供了一个先进的插件系统，允许 Core 资产和集合存储额外的状态、提供生命周期验证和增强的动态体验。这里的可能性是无穷无尽的！
- 成本：虽然不如 Bubblegum 便宜，但由于优化的账户结构，Core 的创建和铸造成本**明显低于** Token Metadata。

[使用 Core 创建 NFT](/zh/smart-contracts/core/guides/javascript/how-to-create-a-core-nft-asset-with-javascript)

## Token Metadata NFT/pNFT

Token Metadata 是开启一切的 Solana NFT 标准。Token Metadata 于 2021 年创建，为 Solana 区块链上的 NFT 铺平了道路，自首次推出以来已铸造了惊人的 5.12 亿个 NFT。

#### 为什么使用 Token Metadata：

- 久经考验值得信赖：Token Metadata 在过去 4 年中一直被用作 Solana 的主要 NFT 代币标准，来自 Solana Monkey Business、DeGods、Claynosaurus 等项目。
- 生态系统支持：NFT 和 pNFT 受到 Solana 范围内的市场和钱包的支持，例如 MagicEden、Tensor、Phantom、Solflare 等等。
- 基于 SPL 代币：Token Metadata NFT/pNFT 基于 Solana 的 SPL 代币程序。

[使用 Token Metadata 创建 NFT/pNFT](/zh/smart-contracts/token-metadata/guides/javascript/create-an-nft)

## Bubblegum cNFT

当涉及大量创建便宜的 NFT 时，Bubblegum 是要选择的协议。Bubblegum 使用**压缩 NFT（cNFT）** 的技术，通过应用 Merkle 树方法而不是为每个单独的 NFT 创建账户。

#### 为什么使用 Bubblegum：

- 部署便宜：作为基于 Merkle 树的产品，树的部署成本很低，如果需要可以存储数百万个 NFT。
- 大规模空投：一旦创建了树，空投 cNFT 的成本接近不存在，因为树的存储已经支付。

[使用 Bubblegum 在 Solana 上创建 1,000,000 个 NFT](/zh/smart-contracts/bubblegum/guides/javascript/how-to-create-1000000-nfts-on-solana)
