---
title: 同质化代币
metaTitle: 同质化代币 | Metaplex
description: 学习如何使用Metaplex SDK在Solana上创建和管理同质化代币。
---

使用Metaplex SDK在Solana上创建和管理同质化代币（SPL代币）。 {% .lead %}

## 概述

同质化代币是可互换的数字资产，每个单位与其他单位相同。常见示例包括加密货币、忠诚度积分、游戏内货币等。在Solana上，同质化代币使用SPL Token程序创建，元数据由Token Metadata程序管理。

## 您可以做什么

本节提供常见代币操作的入门指南：

- **[发行代币](/zh/tokens/launch-token)** - 创建具有自定义元数据的新同质化代币
- **[创建代币](/zh/tokens/create-a-token)** - 创建具有自定义元数据的新同质化代币
- **[读取代币数据](/zh/tokens/read-token)** - 从区块链或DAS API获取代币信息
- **[铸造代币](/zh/tokens/mint-tokens)** - 铸造更多代币以增加供应量
- **[转移代币](/zh/tokens/transfer-a-token)** - 在钱包之间转移代币
- **[更新代币元数据](/zh/tokens/update-token)** - 更新代币的名称、符号或图像
- **[销毁代币](/zh/tokens/burn-tokens)** - 从流通中永久移除代币

## 前提条件

在开始之前，请确保您具备：

- 已安装Node.js 16或更高版本
- 具有用于交易费用的SOL的Solana钱包
- JavaScript/TypeScript基础知识

## 快速开始

### 使用CLI（推荐用于简单任务）

安装Metaplex CLI以快速创建和管理代币：

```bash
npm install -g @metaplex-foundation/cli
```

创建您的第一个代币：

```bash
mplx toolbox tm create --wizard --keypair <钱包文件路径> --rpc-url <RPC URL>
```

有关更多详情，请参阅[CLI文档](/zh/dev-tools/cli)。

### 使用JavaScript/TypeScript

安装所需的包：

```bash
npm install @metaplex-foundation/mpl-token-metadata @metaplex-foundation/mpl-toolbox @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults
```

然后按照[创建代币](/zh/tokens/create-a-token)指南创建您的第一个同质化代币。

## 深入了解

有关更高级的代币功能，请参阅：

- [Metaplex CLI](/zh/dev-tools/cli) - 代币操作的命令行工具
- [Token Metadata程序](/zh/smart-contracts/token-metadata) - Token Metadata程序完整文档
- [MPL Toolbox](https://github.com/metaplex-foundation/mpl-toolbox) - 低级代币操作
