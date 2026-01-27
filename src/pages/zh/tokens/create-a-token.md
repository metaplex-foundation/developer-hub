---
title: 创建同质化代币
metaTitle: 创建同质化代币 | 代币
description: 学习如何在Solana上创建带元数据的同质化SPL代币
created: '11-25-2025'
updated: '11-25-2025'
---

使用Token Metadata程序在Solana上创建带元数据的同质化代币。 {% .lead %}

## 学习内容
本指南将向您展示如何创建和铸造具有以下要素的同质化代币：

- 自定义名称、符号和元数据
- 代币图像和描述
- 可配置的小数位数（可分割性）
- 初始代币供应量

## 创建代币

以下代码是一个完整可运行的示例。可自定义的参数如下所示。有关代币创建的更多详情，请参阅[Token Metadata程序](/zh/smart-contracts/token-metadata/mint#minting-tokens)页面。

{% code-tabs-imported from="token-metadata/fungibles/create" frameworks="umi,kit,cli" /%}

## 参数

根据您的代币自定义以下参数：

| 参数 | 描述 |
|-----------|-------------|
| `name` | 代币名称（最多32个字符） |
| `symbol`| 代币缩写（最多6个字符） |
| `uri` | 链接到链下元数据JSON |
| `sellerFeeBasisPoints` | 版税百分比（550 = 5.5%） |
| `decimals` | 小数位数（`some(9)`是标准） |
| `amount` | 要铸造的代币数量 |

## 元数据和图像

`uri`必须指向至少包含以下信息的JSON文件。更多详情可在[Token Metadata标准页面](/zh/smart-contracts/token-metadata/token-standard#the-fungible-standard)找到。您需要将JSON和图像URL上传到可公开访问的位置。我们建议使用Web3存储提供商，如Arweave。如果您想在代码中完成此操作，请按照此[指南](/zh/guides/general/create-deterministic-metadata-with-turbo)操作。

```json
{
  "name": "My Fungible Token",
  "symbol": "MFT",
  "description": "A fungible token on Solana",
  "image": "https://arweave.net/tx-hash"
}
```
