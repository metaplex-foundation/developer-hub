---
title: 如何在 Solana 上创建 NFT
metaTitle: 如何在 Solana 上创建 NFT | Token Metadata 指南
description: 学习如何使用 Metaplex 在 Solana 区块链上创建 NFT。
# 记得同时更新 /components/products/guides/index.js 中的日期
created: '06-16-2024'
updated: '06-18-2024'
---

这是关于如何使用 Metaplex Token Metadata 协议在 Solana 区块链上创建 NFT 的入门指南。

## 前提条件

- 您选择的代码编辑器（推荐 Visual Studio Code）
- Node 18.x.x 或更高版本。

## 初始设置

本指南将介绍基于单文件脚本使用 Javascript 创建 NFT。您可能需要修改和移动函数以适应您的需求。

### 初始化

首先使用您选择的包管理器（npm、yarn、pnpm、bun）初始化一个新项目（可选），并在提示时填写所需的详细信息。

```js
npm init
```

### 所需包

安装本指南所需的包。

{% code-tabs-imported from="token-metadata/getting-started" frameworks="umi,kit" /%}

## 设置 SDK

{% code-tabs-imported from="token-metadata/getting-started" frameworks="umi,kit" /%}

## 创建 NFT

### 上传图像

首先需要做的是上传一个代表 NFT 并使其可识别的图像。这可以是 jpeg、png 或 gif 格式。

Umi 附带可下载的存储插件，允许您上传到 Arweave、NftStorage、AWS 和 ShdwDrive 等存储解决方案。在本指南开始时，我们安装了 `irysUploader()` 插件，它将内容存储在 Arweave 区块链上。

{% callout title="本地脚本/Node.js" %}
此示例使用本地脚本/node.js 方法，使用 Irys 上传到 Arweave。如果您希望将文件上传到其他存储提供商或从浏览器上传，则需要采用不同的方法。在浏览器场景中，导入和使用 `fs` 将不起作用。
{% /callout %}

{% code-tabs-imported from="token-metadata/upload-assets" frameworks="umi" /%}

### 上传元数据

一旦我们有了有效且可用的图像 URI，就可以开始处理 NFT 的元数据了。

链下元数据的标准如下：

```json
{
  "name": "My NFT",
  "description": "This is an NFT on Solana",
  "image": "https://arweave.net/my-image",
  "external_url": "https://example.com/my-nft.json",
  "attributes": [
    {
      "trait_type": "trait1",
      "value": "value1"
    },
    {
      "trait_type": "trait2",
      "value": "value2"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://arweave.net/my-image",
        "type": "image/png"
      }
    ],
    "category": "image"
  }
}
```

字段说明：

#### name

代币的名称。

#### symbol

代币的缩写。Solana 的缩写是 `SOL`。

#### description

代币的描述。

#### image

这将设置为我们之前上传的 imageUri（或图像的任何在线位置）。

### NFT vs pNFT

Token Metadata 程序可以铸造 2 种 NFT，普通 NFT 和 pNFT（可编程非同质化资产）。
这两种类型 NFT 的主要区别是一种强制执行版税（pNFT），另一种不执行（NFT）。

#### NFT

- 无版税强制执行
- 初始设置更简单，将来更容易使用

#### pNFT

- 在未来开发方面需要处理更多账户
- 版税强制执行
- 可编程 - 我们有规则集可以阻止程序进行转移

### 铸造 NFT

从这里您可以选择要使用的 NFT 铸造指令类型，`NFT` 或 `pNFT`。

#### NFT

{% code-tabs-imported from="token-metadata/create-nft" frameworks="umi,kit" /%}

#### pNFT

{% code-tabs-imported from="token-metadata/create-pnft" frameworks="umi,kit" /%}

## 下一步

本指南帮助您创建了一个基本的 NFT，从这里您可以前往 [Token Metadata 程序](/smart-contracts/token-metadata) 查看创建集合、将新 NFT 添加到集合以及您可以对 NFT 执行的各种其他交互。
