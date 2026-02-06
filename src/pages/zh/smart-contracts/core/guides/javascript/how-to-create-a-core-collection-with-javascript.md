---
title: 使用Javascript创建Core Collection
metaTitle: 使用Javascript创建Core Collection | Core指南
description: 学习如何使用Metaplex Core JavaScript包在Solana上创建Core Collection。
created: '08-21-2024'
updated: '01-31-2026'
keywords:
  - create collection JavaScript
  - NFT collection tutorial
  - mpl-core collection
  - Solana collection
about:
  - Collection creation
  - JavaScript tutorial
  - Umi framework
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - 设置新的Node.js项目并安装依赖项
  - 使用钱包和RPC端点配置Umi
  - 上传收藏品图片和元数据
  - 使用createCollection()创建Collection
  - 验证Collection已成功创建
howToTools:
  - Node.js
  - Umi框架
  - mpl-core SDK
  - Irys或IPFS（用于存储）
---
本指南展示了如何使用`@metaplex-foundation/mpl-core` Javascript SDK包在Metaplex Core链上程序中创建**Core Collection**。
{% callout title="什么是Core？" %}
**Core**使用单账户设计，与替代方案相比降低了铸造成本并改善了Solana网络负载。它还具有灵活的插件系统，允许开发人员修改资产的行为和功能。
{% /callout %}
在开始之前，让我们谈谈Collection：
{% callout title="什么是Collection？" %}
Collection是属于同一系列或组的Asset的组。为了将Asset分组，我们必须首先创建一个Collection Asset，其目的是存储与该收藏品相关的任何元数据，如收藏品名称和收藏品图片。Collection Asset充当您收藏品的封面，还可以存储收藏品范围的插件。
{% /callout %}
## 前提条件
- 您选择的代码编辑器（推荐**Visual Studio Code**）
- Node **18.x.x**或更高版本。
## 初始设置
本指南将教您如何基于单文件脚本用Javascript创建Core Collection。您可能需要根据需要修改和移动函数。
### 初始化项目
使用您喜欢的包管理器（npm、yarn、pnpm、bun）初始化新项目（可选），并在提示时输入所需的详细信息。
```js
npm init
```
### 必需的包
安装本指南所需的包。
{% packagesUsed packages=["umi", "umiDefaults", "core", "@metaplex-foundation/umi-uploader-irys"] type="npm" /%}
```js
npm i @metaplex-foundation/umi
```
```js
npm i @metaplex-foundation/umi-bundle-defaults
```
```js
npm i @metaplex-foundation/mpl-core
```
```js
npm i @metaplex-foundation/umi-uploader-irys;
```
### 导入和包装函数
这里我们定义本指南所需的所有导入，并创建一个包装函数来运行所有代码。
```ts
import {
  createCollection,
  mplCore
} from '@metaplex-foundation/mpl-core'
import {
  createGenericFile,
  generateSigner,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import { base58 } from '@metaplex-foundation/umi/serializers'
import fs from 'fs'
import path from 'path'
// 创建包装函数
const createCollection = async () => {
  ///
  ///
  ///  所有代码都在这里
  ///
  ///
}
// 运行包装函数
createCollection()
```
## 设置Umi
设置Umi时，您可以从各种来源使用或生成密钥对/钱包。您可以创建新钱包进行测试，从文件系统导入现有钱包，或者如果您正在构建网站/dApp，可以使用`walletAdapter`。
详细的设置示例请参阅英文文档。
## 创建Collection的元数据
要在钱包和Explorer中显示Collection的可识别图像，您需要创建存储元数据的URI！
详细的上传过程请参阅英文文档。
### 铸造Core Collection
从这里，您可以使用`@metaplex-foundation/mpl-core`包中的`createCollection`函数来创建Core Collection。
```ts
const collection = generateSigner(umi)
const tx = await createCollection(umi, {
  collection,
  name: 'My Collection',
  uri: metadataUri,
}).sendAndConfirm(umi)
const signature = base58.deserialize(tx.signature)[0]
```
然后，记录详细信息如下：
```ts
// 记录签名和交易以及NFT的链接
console.log('\nCollection Created')
console.log('View Transaction on Solana Explorer')
console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`)
console.log('\n')
console.log('View Collection on Metaplex Explorer')
console.log(`https://core.metaplex.com/explorer/${collection.publicKey}?env=devnet`)
```
### 附加操作
在继续之前，如果您想创建已经包含插件或外部插件（如`FreezeDelegate`插件或`AppData`外部插件）的收藏品怎么办？以下是方法。
`createCollection()`指令通过`plugins`字段支持添加常规插件和外部插件。只需添加特定插件所需的所有字段，一切都将由指令处理。
**注意**：如果您不确定使用哪些字段和插件，请参阅[文档](/smart-contracts/core/plugins)！
