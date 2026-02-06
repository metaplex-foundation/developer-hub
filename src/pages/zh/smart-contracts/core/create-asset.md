---
title: 创建 Asset
metaTitle: 创建 Asset | Metaplex Core
description: 了解如何使用 JavaScript 或 Rust 在 Solana 上创建 Core NFT Asset。包括上传元数据、铸造到收藏和添加插件。
updated: '01-31-2026'
keywords:
  - create NFT
  - mint NFT
  - Solana NFT
  - mpl-core create
  - upload metadata
about:
  - NFT minting
  - Metadata upload
  - Asset creation
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
howToSteps:
  - 使用 npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi 安装 SDK
  - 将元数据 JSON 上传到 Arweave 或 IPFS 以获取 URI
  - 使用元数据 URI 调用 create(umi, { asset, name, uri })
  - 在 core.metaplex.com 验证 Asset
howToTools:
  - Node.js
  - Umi framework
  - mpl-core SDK
  - Arweave or IPFS for storage
faqs:
  - q: Core Asset 和 Token Metadata NFT 有什么区别？
    a: Core Asset 使用单个账户，成本降低约 80%。Token Metadata 使用 3 个以上账户（mint、metadata、token）。新项目推荐使用 Core。
  - q: 可以在一个交易中创建多个资产吗？
    a: 不可以。每个 create 指令创建一个资产。大量铸造请使用 Core Candy Machine 或批量交易。
  - q: 需要先创建 Collection 吗？
    a: 不需要。Asset 可以不属于 Collection 而存在。但是，Collection 可以启用收藏级别的版税和操作。
  - q: 如何铸造到不同的钱包？
    a: 在 create 函数中传递 owner 参数，使用接收者的地址。
  - q: 应该使用什么元数据格式？
    a: 使用标准 NFT 元数据格式，包含 name、description、image 和可选的 attributes 数组。请参阅 JSON Schema 文档。
---
本指南展示如何使用 Metaplex Core SDK 在 Solana 上创建 **Core Asset**（NFT）。您将上传链下元数据，创建链上 Asset 账户，并可选择将其添加到 Collection 或附加插件。 {% .lead %}
{% callout title="您将构建" %}
包含以下内容的 Core Asset：
- 存储在 Arweave 上的链下元数据（名称、图像、属性）
- 具有所有权和元数据 URI 的链上 Asset 账户
- 可选：Collection 成员资格
- 可选：插件（版税、冻结、属性）
{% /callout %}
## 摘要
通过将元数据 JSON 上传到去中心化存储，然后使用 URI 调用 `create()` 来创建 **Core Asset**。Asset 可以独立铸造或铸造到 Collection 中，并且可以在创建时包含插件。
- 将元数据 JSON 上传到 Arweave/IPFS，获取 URI
- 使用 name、URI 和可选插件调用 `create()`
- 对于收藏：传递 `collection` 参数
- 每个资产成本约 0.0029 SOL
## 范围外
Token Metadata NFT（使用 mpl-token-metadata）、压缩 NFT（使用 Bubblegum）、同质化代币（使用 SPL Token）和 NFT 迁移。
## 快速开始
**跳转至：** [上传元数据](#uploading-off-chain-data) · [创建 Asset](#create-an-asset) · [带 Collection](#create-an-asset-into-a-collection) · [带插件](#create-an-asset-with-plugins)
1. 安装：`npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. 上传元数据 JSON 以获取 URI
3. 调用 `create(umi, { asset, name, uri })`
4. 在 [core.metaplex.com](https://core.metaplex.com) 验证
## 前提条件
- 配置了签名者和 RPC 连接的 **Umi**
- 用于交易费用的 **SOL**（每个资产约 0.003 SOL）
- 准备上传的 **元数据 JSON**（名称、图像、属性）
## 创建流程
1. **上传链下数据。** 存储包含名称、描述、图像 URL 和属性的 JSON 文件。文件必须通过公共 **URI** 可访问。
2. **创建链上 Asset 账户。** 使用元数据 URI 调用 `create` 指令来铸造 Asset。
## 上传链下数据
使用任何存储服务（Arweave、IPFS、AWS）上传您的元数据 JSON。Umi 为常见服务提供上传器插件。有关所有可用元数据字段，请参阅 [JSON Schema](/smart-contracts/core/json-schema)。
```ts {% title="upload-metadata.ts" %}
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
// 配置上传器（Irys、AWS 等）
umi.use(irysUploader())
// 首先上传图像
const [imageUri] = await umi.uploader.upload([imageFile])
// 上传元数据 JSON
const uri = await umi.uploader.uploadJson({
  name: 'My NFT',
  description: 'This is my NFT',
  image: imageUri,
  attributes: [
    { trait_type: 'Background', value: 'Blue' },
  ],
})
```
获得 **URI** 后，您可以创建 Asset。
## 创建 Asset
使用 `create` 指令铸造新的 Core Asset。
{% totem %}
{% totem-accordion title="技术指令详情" %}
**指令账户**
| 账户 | 描述 |
|---------|-------------|
| asset | 新 MPL Core Asset 的地址（签名者） |
| collection | 要将 Asset 添加到的收藏（可选） |
| authority | 新资产的权限 |
| payer | 支付存储费用的账户 |
| owner | 将拥有资产的钱包 |
| systemProgram | System Program 账户 |
**指令参数**
| 参数 | 描述 |
|----------|-------------|
| name | MPL Core Asset 的名称 |
| uri | 链下 JSON 元数据 URI |
| plugins | 创建时添加的插件（可选） |
完整指令详情：[GitHub](https://github.com/metaplex-foundation/mpl-core/blob/main/programs/mpl-core/src/instruction.rs)
{% /totem-accordion %}
{% /totem %}
{% code-tabs-imported from="core/create-asset" frameworks="umi" /%}
## 将 Asset 创建到 Collection 中
要将 Asset 作为 Collection 的一部分创建，请传递 `collection` 参数。Collection 必须已经存在。
{% code-tabs-imported from="core/create-asset-in-collection" frameworks="umi" /%}
有关创建 Collection，请参阅 [Collection](/zh/smart-contracts/core/collections)。
## 使用插件创建 Asset
通过在 `plugins` 数组中传递来在创建时添加插件。此示例添加 Royalties 插件：
{% code-tabs-imported from="core/create-asset-with-plugins" frameworks="umi" /%}
### 常用插件
以下是一些常用的插件。完整列表请参阅 [插件概述](/zh/smart-contracts/core/plugins)。
- [Royalties](/zh/smart-contracts/core/plugins/royalties) - 创作者版税强制
- [Freeze Delegate](/zh/smart-contracts/core/plugins/freeze-delegate) - 允许冻结/解冻
- [Burn Delegate](/zh/smart-contracts/core/plugins/burn-delegate) - 允许销毁
- [Transfer Delegate](/zh/smart-contracts/core/plugins/transfer-delegate) - 允许转移
- [Update Delegate](/zh/smart-contracts/core/plugins/update-delegate) - 允许元数据更新
- [Attributes](/zh/smart-contracts/core/plugins/attribute) - 链上键/值数据
完整列表请参阅 [插件概述](/zh/smart-contracts/core/plugins)。
## 常见错误
### `Asset account already exists`
资产密钥对已被使用。生成新的签名者：
```ts
const assetSigner = generateSigner(umi) // 必须唯一
```
### `Collection not found`
收藏地址不存在或不是有效的 Core Collection。验证地址并确保您已先创建 Collection。
### `Insufficient funds`
您的付款钱包需要约 0.003 SOL 用于租金。使用以下命令添加资金：
```bash
solana airdrop 1 <WALLET_ADDRESS> --url devnet
```
## 注意事项
- `asset` 参数必须是 **新密钥对** - 不能重用现有账户
- 如果铸造给不同的所有者，请传递 `owner` 参数
- 创建时添加的插件比之后添加更便宜（一个交易 vs 两个）
- 在立即获取资产的脚本中创建资产时使用 `commitment: 'finalized'`
## 快速参考
### 程序 ID
| 网络 | 地址 |
|---------|---------|
| Mainnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
| Devnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
### 最小代码
```ts {% title="minimal-create.ts" %}
import { generateSigner } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'
const asset = generateSigner(umi)
await create(umi, { asset, name: 'My NFT', uri: 'https://...' }).sendAndConfirm(umi)
```
### 成本明细
| 项目 | 成本 |
|------|------|
| Asset 账户租金 | ~0.0029 SOL |
| 交易费用 | ~0.000005 SOL |
| **总计** | **~0.003 SOL** |
## FAQ
### Core Asset 和 Token Metadata NFT 有什么区别？
Core Asset 使用单个账户，成本降低约 80%。Token Metadata 使用 3 个以上账户（mint、metadata、token）。新项目推荐使用 Core。
### 可以在一个交易中创建多个资产吗？
不可以。每个 `create` 指令创建一个资产。大量铸造请使用 [Core Candy Machine](/smart-contracts/core-candy-machine) 或批量交易。
### 需要先创建 Collection 吗？
不需要。Asset 可以不属于 Collection 而存在。但是，Collection 可以启用收藏级别的版税和操作。
### 如何铸造到不同的钱包？
传递 `owner` 参数：
```ts
await create(umi, { asset, name, uri, owner: recipientAddress })
```
### 应该使用什么元数据格式？
使用标准 NFT 元数据格式，包含 `name`、`description`、`image` 和可选的 `attributes` 数组。请参阅 [JSON Schema](/smart-contracts/core/json-schema)。
## 术语表
| 术语 | 定义 |
|------|------------|
| **Asset** | 代表 NFT 的 Core 链上账户 |
| **URI** | 指向链下元数据 JSON 的 URL |
| **签名者** | 签署交易的密钥对（资产在创建时必须是签名者） |
| **Collection** | 将相关 Asset 分组的 Core 账户 |
| **Plugin** | 为 Asset 添加行为的模块化扩展 |
| **租金** | 在 Solana 上保持账户活跃所需的 SOL |
