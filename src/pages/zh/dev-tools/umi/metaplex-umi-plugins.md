---
title: Metaplex Umi 插件
metaTitle: Metaplex Umi 插件 | Umi
description: Metaplex 构建的 Umi 插件概述。
---

Metaplex 程序已通过 Kinobi 生成，可以作为 Umi 插件工作和运行。Metaplex 库中的每个程序在 Solana 生态系统中都有不同的用途和目的。您可以在[接口实现页面](/zh/dev-tools/umi/implementations)找到更多可与 Umi 一起使用的插件！

## [Bubblegum (cNFT)](/zh/smart-contracts/bubblegum)

Bubblegum 是一个 Metaplex 程序，用于处理 Solana 区块链上 cNFT（压缩 NFT）的创建和管理。与 Token Metadata 的传统 NFT 和 pNFT 相比，cNFT 的创建和铸造成本更低。

程序功能集包括：

- 铸造
- 更新
- 转移
- 销毁
- 委托
- 集合管理

## [Candy Machine](/zh/smart-contracts/candy-machine)

Candy Machine 是一个 Metaplex 程序，允许您设置"待售" NFT 和 pNFT 发放。用户可以从您的 candy machine 购买并获得一个随机的内部 NFT/pNFT。

程序功能集包括：

- 铸造 NFT
- 销售 NFT

## [Core](/zh/smart-contracts/core)

Core 是下一代 Solana NFT 标准，使用单账户设计，与其他方案相比，降低了铸造成本并改善了 Solana 网络负载。它还具有灵活的插件系统，允许开发者修改资产的行为和功能。

程序功能集包括：

- 铸造
- 更新
- 转移
- 销毁
- 委托
- 管理内部和外部插件
- 反序列化
- 集合管理

## [DAS API](/zh/dev-tools/das-api)

非压缩 NFT 的状态数据全部存储在链上账户中。这在规模上是昂贵的。压缩 NFT 通过将状态数据编码到链上 Merkle 树中来节省空间。详细的账户数据不存储在链上，而是存储在由 RPC 提供商管理的数据存储中。Metaplex 数字资产标准（DAS）API 代表了一个与 Solana 上数字资产交互的统一接口，同时支持标准（Token Metadata）和压缩（Bubblegum）资产。

程序功能集包括：

- 快速数据获取，包括压缩 NFT

## [Inscriptions](/zh/smart-contracts/inscription)

Metaplex Inscription 程序允许您将数据直接写入 Solana，使用区块链作为数据存储方法。Inscription 程序还允许此数据存储可选地链接到 NFT。在本概述中，我们从高层次解释此程序的工作原理以及如何利用其各种功能。

程序功能集包括：

- 将数据直接写入 Solana 区块链
- 从 Solana 区块链读取铭文数据

## [Token Metadata (NFT, pNFT)](/zh/smart-contracts/token-metadata)

Token Metadata 是一个 Metaplex 程序，用于处理 NFT 和 pNFT 的创建和管理。Token Metadata NFT 是 Solana 上的第一个 NFT 标准，而 pNFT 后来创建以包含版税强制执行。

程序功能集包括：

- 数据获取
- 铸造
- 更新
- 转移
- 销毁
- 委托
- 集合管理


## [Toolbox](/zh/toolbox)

Mpl Toolbox 包含一系列必要的 Solana 和 Metaplex 程序，帮助您快速启动去中心化应用程序。

- SOL 转账
- SPL 代币创建/管理
- LUT 创建/管理（地址查找表）
- 设置/修改计算单元和价格
