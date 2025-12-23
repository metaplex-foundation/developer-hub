---
title: NFT
metaTitle: NFT | Metaplex
description: 学习如何使用Metaplex Core在Solana上创建和管理NFT。
---

使用Metaplex Core在Solana上创建和管理NFT（非同质化代币）。 {% .lead %}

## 概述

非同质化代币（NFT）是代表艺术品、收藏品、游戏内物品等所有权的独特数字资产。Metaplex Core通过单账户设计降低成本并提高性能，为在Solana上创建和管理NFT提供了最新、最高效的方式。

## 您可以做什么

本节提供常见NFT操作的入门指南：

- **[创建NFT](/nfts/create-nft)** - 创建具有自定义元数据的新NFT
- **[获取NFT](/nfts/fetch-nft)** - 从区块链检索NFT数据
- **[更新NFT](/nfts/update-nft)** - 更新NFT的名称和元数据
- **[转移NFT](/nfts/transfer-nft)** - 在钱包之间转移NFT所有权
- **[销毁NFT](/nfts/burn-nft)** - 永久销毁NFT

## 前提条件

在开始之前，请确保您具备：

- 已安装Node.js 16或更高版本
- 具有用于交易费用的SOL的Solana钱包
- JavaScript/TypeScript基础知识

## 快速开始

安装所需的包：

```bash
npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults
```

然后按照[创建NFT](/nfts/create-nft)指南使用Metaplex Core创建您的第一个NFT。

## 深入了解

有关更高级的NFT功能，请参阅：

- [Core文档](/core) - Metaplex Core完整文档
- [Core插件](/core/plugins) - 使用插件扩展NFT功能
- [Core收藏集](/core/collections) - 将NFT组织成收藏集
