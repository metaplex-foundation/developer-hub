---
title: 获取NFT
metaTitle: 获取NFT | NFT
description: 学习如何使用Metaplex Core在Solana上获取NFT
created: '03-12-2025'
updated: '03-12-2025'
---

从Solana区块链获取NFT数据。 {% .lead %}

## 获取NFT或收藏集

在以下部分，您可以看到完整的代码示例以及需要更改的参数。有关获取NFT和收藏集的更多详情，请参阅[Core文档](/zh/smart-contracts/core/fetch)。

{% code-tabs-imported from="core/fetch-asset" frameworks="umi,cli,das,curl" /%}

## 参数

根据您的获取需求自定义以下参数：

| 参数 | 描述 |
|-----------|-------------|
| `assetAddress` | NFT资产的公钥 |
| `collectionAddress` | 收藏集的公钥（可选） |

## 工作原理

获取过程涉及以下步骤：

1. **获取地址** - 您需要想要获取的NFT资产或收藏集的公钥
2. **获取资产数据** - 使用`fetchAsset`检索包括名称、URI、所有者和插件在内的NFT信息
3. **获取收藏集数据** - 使用`fetchCollection`检索收藏集信息（可选）

## NFT和收藏集数据

获取资产时，将返回所有数据：

- **Name** - NFT的名称
- **URI** - 元数据JSON的链接
- **Owner** - 拥有NFT的钱包
- **Update Authority** - 可以修改NFT的人
- **Plugins** - 附加的插件，如版税和属性

获取收藏集时，将返回：

- **Name** - 收藏集的名称
- **URI** - 收藏集元数据JSON的链接
- **Update Authority** - 可以修改收藏集的人
- **Num Minted** - 收藏集中的资产数量
- **Plugins** - 附加的插件，如版税和属性
