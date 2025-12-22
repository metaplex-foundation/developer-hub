---
title: 读取代币数据
metaTitle: 读取代币数据 | 代币
description: 学习如何从Solana区块链获取同质化代币数据
created: '11-28-2025'
updated: '11-28-2025'
---

从Solana区块链获取同质化代币信息。 {% .lead %}

## 获取代币元数据

使用铸币地址获取代币的元数据。这将检索链上代币信息，包括名称、符号、小数位数和供应量。

{% code-tabs-imported from="token-metadata/fungibles/read" frameworks="umi,das,curl" /%}

## 参数

| 参数 | 描述 |
|-----------|-------------|
| `mintAddress` | 要获取的代币铸币地址 |

## 获取代币余额

使用关联代币账户或DAS API获取特定钱包的代币余额。

{% code-tabs-imported from="token-metadata/fungibles/read-balance" frameworks="umi,das,curl" /%}

## 按所有者获取所有代币

使用DAS API获取钱包地址拥有的所有同质化代币。

{% code-tabs-imported from="token-metadata/fungibles/read-all" frameworks="das,curl" /%}

## 方法比较

| 功能 | 直接RPC | DAS API |
|---------|-----------|---------|
| 速度 | 批量查询较慢 | 针对批量查询优化 |
| 数据新鲜度 | 实时 | 近实时（已索引） |
| 搜索功能 | 有限 | 高级过滤 |
| 用例 | 单个代币查找 | 投资组合视图、搜索 |

## 提示

- **投资组合视图使用DAS** - 当显示用户拥有的所有代币时，DAS API比多个RPC调用快得多
- **在DAS中设置showFungible** - 设置`showFungible: true`，否则某些RPC只返回NFT数据

## 相关指南

- [创建代币](/tokens/create-a-token)
- [DAS API概述](/das-api)
- [按所有者获取同质化资产](/das-api/guides/get-fungible-assets)
