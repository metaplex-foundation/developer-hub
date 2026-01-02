---
title: 转移NFT
metaTitle: 转移NFT | NFT
description: 学习如何使用Metaplex Core在Solana上的钱包之间转移NFT
created: '03-12-2025'
updated: '03-12-2025'
---

在Solana上的钱包之间转移NFT所有权。 {% .lead %}

## 转移NFT

在以下部分，您可以看到完整的代码示例以及需要更改的参数。有关转移NFT的更多详情，请参阅[Core文档](/zh/smart-contracts/core/transfer)。

{% code-tabs-imported from="core/transfer-asset" frameworks="umi" /%}

## 参数

根据您的转移需求自定义以下参数：

| 参数 | 描述 |
|-----------|-------------|
| `assetAddress` | 要转移的NFT的公钥 |
| `newOwner` | 接收者的钱包地址 |

## 工作原理

转移过程涉及3个步骤：

1. **验证所有权** - 您必须是NFT的当前所有者
2. **指定接收者** - 提供新所有者的钱包地址
3. **执行转移** - NFT所有权立即转移

## NFT转移

与SPL/同质化代币不同，Core NFT不需要接收者预先创建代币账户。所有权直接记录在NFT上，使转移更简单、更便宜。
