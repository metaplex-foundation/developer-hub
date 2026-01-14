---
title: 销毁NFT
metaTitle: 销毁NFT | NFT
description: 学习如何使用Metaplex Core在Solana上销毁NFT
created: '03-12-2025'
updated: '03-12-2025'
---

永久销毁NFT并回收租金费用。 {% .lead %}

## 销毁NFT

在以下部分，您可以看到完整的代码示例以及需要更改的参数。有关销毁NFT的更多详情，请参阅[Core文档](/zh/smart-contracts/core/burn)。

{% code-tabs-imported from="core/burn-asset" frameworks="umi,cli" /%}

## 参数

根据您的销毁需求自定义以下参数：

| 参数 | 描述 |
|-----------|-------------|
| `assetAddress` | 要销毁的NFT的公钥 |

## 工作原理

销毁过程涉及3个步骤：

1. **获取NFT** - 使用`fetchAsset`获取NFT数据
2. **执行销毁** - 永久销毁NFT
3. **回收租金** - 大部分SOL将被退还（除约0.00089784 SOL外）

**警告**：销毁是永久性的，无法撤销。请在继续之前确认您确实要销毁该NFT。

## 租金回收

当您销毁NFT时：

- 大部分租金SOL将退还给NFT所有者
- 少量（约0.00089784 SOL）会被保留以防止账户重新激活
- 您必须是NFT的所有者才能销毁它
