---
title: 更新NFT
metaTitle: 更新NFT | NFT
description: 学习如何使用Metaplex Core在Solana上更新NFT元数据
created: '03-12-2025'
updated: '03-12-2025'
---

作为更新权限者更新NFT的名称和元数据。 {% .lead %}

## 更新NFT

在以下部分，您可以看到完整的代码示例以及需要更改的参数。有关更新NFT的更多详情，请参阅[Core文档](/zh/smart-contracts/core/update)。

{% code-tabs-imported from="core/update-asset" frameworks="umi,cli" /%}

## 参数

根据您的更新需求自定义以下参数：

| 参数 | 描述 |
|-----------|-------------|
| `assetAddress` | 要更新的NFT的公钥 |
| `name` | NFT的新名称（可选） |
| `uri` | 新的元数据URI（可选） |

## 工作原理

更新过程涉及3个步骤：

1. **获取NFT** - 使用`fetchAsset`获取当前NFT数据
2. **准备更新** - 指定您想要更改的新名称或URI
3. **提交更新** - 执行更新交易

只有NFT的更新权限者才能修改NFT。如果NFT是收藏集的一部分并使用收藏集权限，您需要是收藏集的更新权限者。
