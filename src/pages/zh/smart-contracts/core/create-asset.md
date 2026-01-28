---
title: 创建资产
metaTitle: 创建资产 | Metaplex Core
description: 了解如何使用 JavaScript 或 Rust 在 Solana 上创建 Core NFT Asset。包括上传元数据、铸造到集合和添加插件。
---

本指南展示如何使用 Metaplex Core SDK 在 Solana 上**创建 Core Asset**（NFT）。您将上传链外元数据、创建链上 Asset 账户，并可选择将其添加到 Collection 或附加插件。 {% .lead %}

{% callout title="您将构建" %}

一个包含以下内容的 Core Asset：
- 存储在 Arweave/IPFS 上的链外元数据（名称、图片、属性）
- 具有所有权和元数据 URI 的链上 Asset 账户
- 可选：Collection 成员资格
- 可选：插件（版税、冻结、属性）

{% /callout %}

## 摘要

通过将元数据 JSON 上传到去中心化存储，然后使用 URI 调用 `create()` 来创建 **Core Asset**。Asset 可以独立铸造或铸造到 Collections，并可以在创建时包含插件。

- 将元数据 JSON 上传到 Arweave/IPFS，获取 URI
- 使用名称、URI 和可选插件调用 `create()`
- 对于 Collections：传递 `collection` 参数
- 每个 Asset 大约花费 0.0029 SOL

## 范围外

Token Metadata NFT（使用 mpl-token-metadata）、压缩 NFT（使用 Bubblegum）、Fungible Token（使用 SPL Token）以及 NFT 迁移。

## 快速开始

**跳转到：** [上传元数据](#上传链外数据) · [创建 Asset](#创建资产) · [带 Collection](#将资产创建到集合) · [带插件](#创建带有插件的资产)

1. 安装：`npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. 上传元数据 JSON 以获取 URI
3. 调用 `create(umi, { asset, name, uri })`
4. 在 [core.metaplex.com](https://core.metaplex.com) 上验证

## 前提条件

- **Umi** - 配置了 signer 和 RPC 连接
- **SOL** - 用于交易费用（每个 Asset 约 0.003 SOL）
- **元数据 JSON** - 准备上传（名称、图片、属性）

## 创建过程

1. **上传链外数据。** 存储包含名称、描述、图片 URL 和属性的 JSON 文件。该文件必须通过公共 **URI** 可访问。
2. **创建链上 Asset 账户。** 使用元数据 URI 调用 `create` 指令来铸造 Asset。

## 上传链外数据

使用任何存储服务（Arweave、IPFS、AWS）上传您的元数据 JSON。Umi 为常见服务提供上传器插件。

```ts {% title="upload-metadata.ts" %}
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'

// 配置上传器（Irys、AWS 等）
umi.use(irysUploader())

// 首先上传图片
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

现在您有了 **URI**，可以创建 Asset 了。

## 创建资产

使用 `create` 指令铸造新的 Core Asset。

{% totem %}
{% totem-accordion title="技术指令详情" %}
**指令账户**

| 账户 | 描述 |
|---------|-------------|
| asset | 新 MPL Core Asset 的地址（signer） |
| collection | 要添加 Asset 的 Collection（可选） |
| authority | 新 Asset 的权限 |
| payer | 支付存储费用的账户 |
| owner | 将拥有 Asset 的钱包 |
| systemProgram | System Program 账户 |

**指令参数**

| 参数 | 描述 |
|----------|-------------|
| name | MPL Core Asset 的名称 |
| uri | 链外 JSON 元数据 URI |
| plugins | 创建时添加的插件（可选） |

完整指令详情：[GitHub](https://github.com/metaplex-foundation/mpl-core/blob/main/programs/mpl-core/src/instruction.rs)

{% /totem-accordion %}
{% /totem %}

{% code-tabs-imported from="core/create-asset" frameworks="umi" /%}

## 将资产创建到集合

要将 Asset 创建为 Collection 的一部分，请传递 `collection` 参数。Collection 必须已经存在。

{% code-tabs-imported from="core/create-asset-in-collection" frameworks="umi" /%}

有关创建 Collections，请参阅 [Collections](/zh/smart-contracts/core/collections)。

## 创建带有插件的资产

通过在 `plugins` 数组中传递插件，在创建时添加插件。此示例添加 Royalties 插件：

{% code-tabs-imported from="core/create-asset-with-plugins" frameworks="umi" /%}

### 可用插件

- [Royalties](/zh/smart-contracts/core/plugins/royalties) - 创作者版税强制
- [Freeze Delegate](/zh/smart-contracts/core/plugins/freeze-delegate) - 允许冻结/解冻
- [Burn Delegate](/zh/smart-contracts/core/plugins/burn-delegate) - 允许销毁
- [Transfer Delegate](/zh/smart-contracts/core/plugins/transfer-delegate) - 允许转移
- [Update Delegate](/zh/smart-contracts/core/plugins/update-delegate) - 允许元数据更新
- [Attributes](/zh/smart-contracts/core/plugins/attribute) - 链上键/值数据

完整列表请参阅[插件概述](/zh/smart-contracts/core/plugins)。

## 常见错误

### `Asset account already exists`

Asset 密钥对已被使用。生成新的 signer：

```ts
const assetSigner = generateSigner(umi) // 必须唯一
```

### `Collection not found`

Collection 地址不存在或不是有效的 Core Collection。验证地址并确认您已先创建 Collection。

### `Insufficient funds`

您的付款钱包需要约 0.003 SOL 用于租金。使用以下命令充值：

```bash
solana airdrop 1 <WALLET_ADDRESS> --url devnet
```

## 注意事项

- `asset` 参数必须是**新密钥对** - 不能重用现有账户
- 如果要铸造给不同的所有者，请传递 `owner` 参数
- 创建时添加插件比之后添加更便宜（一个交易 vs 两个）
- 在立即获取 Asset 的脚本中使用 `commitment: 'finalized'`

## 快速参考

### Program ID

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
| Asset 账户租金 | 约 0.0029 SOL |
| 交易费用 | 约 0.000005 SOL |
| **总计** | **约 0.003 SOL** |

## FAQ

### Core Asset 和 Token Metadata NFT 有什么区别？

Core Asset 使用单个账户，成本低约 80%。Token Metadata 使用 3 个以上的账户（mint、metadata、token）。新项目推荐使用 Core。

### 我可以在一个交易中创建多个 Asset 吗？

不可以。每个 `create` 指令创建一个 Asset。对于批量铸造，请使用 [Core Candy Machine](/zh/smart-contracts/core-candy-machine) 或批量交易。

### 我需要先创建 Collection 吗？

不需要。Asset 可以独立存在而没有 Collection。但是，Collections 可以启用集合级版税和操作。

### 如何铸造到不同的钱包？

传递 `owner` 参数：

```ts
await create(umi, { asset, name, uri, owner: recipientAddress })
```

### 我应该使用什么元数据格式？

使用标准 NFT 元数据格式，包含 `name`、`description`、`image` 和可选的 `attributes` 数组。请参阅 [JSON Schema](/zh/smart-contracts/core/json-schema)。

## 术语表

| 术语 | 定义 |
|------|------------|
| **Asset** | 代表 NFT 的 Core 链上账户 |
| **URI** | 指向链外元数据 JSON 的 URL |
| **Signer** | 签署交易的密钥对（Asset 在创建时必须是 signer） |
| **Collection** | 将相关 Asset 分组的 Core 账户 |
| **Plugin** | 向 Asset 添加行为的模块化扩展 |
| **Rent** | 在 Solana 上保持账户活跃所需的 SOL |

---

*由 Metaplex Foundation 维护 · 最后验证于 2026 年 1 月 · 适用于 @metaplex-foundation/mpl-core*
