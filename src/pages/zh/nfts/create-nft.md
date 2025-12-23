---
title: 创建NFT
metaTitle: 创建NFT | NFT
description: 学习如何使用Metaplex Core在Solana上创建NFT
created: '03-12-2025'
updated: '03-12-2025'
---

使用Metaplex Core在Solana上创建NFT。 {% .lead %}

## 学习内容
本指南将向您展示如何创建具有以下要素的NFT：

- 自定义名称和元数据
- 图像和描述
- 可选属性

## 创建NFT

以下代码是一个完整可运行的示例。可自定义的参数如下所示。有关NFT创建的更多详情，请参阅[Core文档](/core)。

{% code-tabs-imported from="core/create-asset" frameworks="umi,cli" /%}

## 链上参数

根据您的NFT自定义以下参数：

| 参数 | 描述 |
|-----------|-------------|
| `name` | NFT名称（最多32个字符） |
| `uri` | 链接到链下元数据JSON |

## 元数据和图像

以下是上传所需的最少元数据。`external_url`、`attributes`、`properties`等附加字段是可选的，详细描述和示例可在[JSON模式](/core/json-schema)中找到。您需要将JSON和图像上传到可公开访问的位置。我们建议使用Web3存储提供商，如Arweave。如果您想在代码中完成此操作，请按照此[指南](/guides/general/create-deterministic-metadata-with-turbo)操作。

```json
{
  "name": "My NFT",
  "description": "An NFT on Solana",
  "image": "https://arweave.net/tx-hash",
  "attributes": []
}
```

## 插件
MPL Core资产支持在收藏集级别和资产级别使用插件。要创建带有插件的Core资产，请在创建时将插件类型及其参数传递给`plugins`数组参数。有关插件的更多信息，请参阅[插件概述](/core/plugins)页面。在NFT的上下文中，例如头像图片，[版税插件](/core/plugins/royalties)是一个常见的用例。
