---
title: 概述
metaTitle: Metaplex Core | Solana 下一代 NFT 标准
description: Metaplex Core 是 Solana 上的下一代 NFT 标准，采用单账户设计、强制版税和灵活的插件系统。更低成本、更低计算量、更好性能。
---

Metaplex Core（"Core"）是 Solana 上的**下一代 NFT 标准**。它采用**单账户设计**，与其他方案相比将铸造成本降低 80% 以上，同时提供**强制版税**、**集合级操作**以及用于自定义行为的**灵活插件系统**。 {% .lead %}

{% callout title="您将学到什么" %}

本概述涵盖：
- Metaplex Core 是什么以及为什么存在
- 相比 Token Metadata 和其他标准的主要优势
- 核心概念：资产、集合和插件
- 如何开始使用 Core 进行开发

{% /callout %}

## 摘要

**Metaplex Core** 是一种 Solana NFT 标准，在大多数新项目中取代 Token Metadata。它提供最低的铸造成本、强制版税以及用于自定义功能的插件架构。

- 单账户设计：每次铸造约 0.0029 SOL（对比 Token Metadata 的 0.022 SOL）
- 默认强制版税，带有白名单/黑名单控制
- 用于质押、属性、委托和自定义行为的插件系统
- 集合级操作：一次性冻结、更新版税或修改所有资产

## 不涉及的内容

本概述不涉及：同质化代币（使用 SPL Token）、Token Metadata 迁移路径或详细的插件实现。请参阅相关页面了解这些主题。

## 快速入门

**跳转到：** [开始使用](#下一步) · [主要优势](#介绍) · [常见问题](#常见问题) · [术语表](#术语表)

1. 安装 SDK：`npm install @metaplex-foundation/mpl-core`
2. 创建资产：[创建资产指南](/zh/smart-contracts/core/create-asset)
3. 添加插件：[插件概述](/zh/smart-contracts/core/plugins)
4. 使用 DAS 查询：[获取资产](/zh/smart-contracts/core/fetch)

{% quick-links %}

{% quick-link title="开始使用" icon="InboxArrowDown" href="/zh/smart-contracts/core/sdk" description="选择您喜欢的语言或库，开始在 Solana 上使用数字资产。" /%}

{% quick-link title="API 参考" icon="CodeBracketSquare" href="https://mpl-core.typedoc.metaplex.com/" target="_blank" description="在寻找特定内容？查看我们的 API 参考。" /%}

{% quick-link title="与 Token Metadata 的差异" icon="AcademicCap" href="/zh/smart-contracts/core/tm-differences" description="从 Token Metadata 迁移？了解变化和新功能。" /%}

{% quick-link title="在 UI 中体验 Core" icon="Beaker" href="https://core.metaplex.com/" target="_blank" description="使用我们的网页界面亲自铸造 Core 资产。" /%}

{% /quick-links %}

## 介绍

Metaplex Core 是 Solana 上新项目推荐使用的 NFT 标准。与 Token Metadata 和其他标准相比，Core 提供：

### 成本效率

| 标准 | 铸造成本 | 计算单元 |
|----------|-----------|---------------|
| **Metaplex Core** | 约 0.0029 SOL | 约 17,000 CU |
| Token Metadata | 约 0.022 SOL | 约 205,000 CU |
| Token Extensions | 约 0.0046 SOL | 约 85,000 CU |

### 主要优势

- **单账户设计**：Core 每个资产使用一个账户，而不是多个账户（铸造 + 元数据 + 代币账户）。这降低了成本并简化了开发。

- **强制版税**：[版税插件](/zh/smart-contracts/core/plugins/royalties) 默认强制创作者版税，带有白名单/黑名单控制。

- **集合级操作**：在单个交易中更新版税、冻结资产或修改整个集合的元数据。

- **插件架构**：通过插件为资产添加自定义行为：
  - [冻结委托](/zh/smart-contracts/core/plugins/freeze-delegate) - 允许他人冻结/解冻
  - [销毁委托](/zh/smart-contracts/core/plugins/burn-delegate) - 允许他人销毁
  - [属性](/zh/smart-contracts/core/plugins/attribute) - 链上键/值数据（由 DAS 自动索引）
  - [转移委托](/zh/smart-contracts/core/plugins/transfer-delegate) - 允许他人转移
  - 更多内容请参阅[插件部分](/zh/smart-contracts/core/plugins)

- **DAS 索引**：所有支持 DAS 的[主要 RPC 提供商](/zh/rpc-providers)已经索引 Core 资产。

## 核心概念

### 资产

**资产**是代表 NFT 的单个链上账户。与 Token Metadata（使用 3 个以上账户）不同，Core 资产在一个账户中包含所有权、元数据 URI 和插件数据。

参见：[什么是资产？](/zh/smart-contracts/core/what-is-an-asset)

### 集合

**集合**是将相关资产分组的 Core 账户。集合可以拥有自己的插件，这些插件适用于所有成员资产。例如，集合级版税适用于集合中的每个资产，除非被覆盖。

参见：[集合](/zh/smart-contracts/core/collections)

### 插件

**插件**是为资产或集合添加行为的模块化扩展。它们挂钩到生命周期事件（创建、转移、销毁）以强制规则或存储数据。

参见：[插件概述](/zh/smart-contracts/core/plugins)

## 快速参考

### 程序 ID

| 程序 | 地址 |
|---------|---------|
| MPL Core | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
| MPL Core (Devnet) | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |

### SDK 包

| 语言 | 包 |
|----------|---------|
| JavaScript/TypeScript | `@metaplex-foundation/mpl-core` |
| Rust | `mpl-core` |

## 下一步

1. **选择您的 SDK**：访问[开始使用](/zh/smart-contracts/core/sdk)安装 JavaScript 或 Rust SDK
2. **创建您的第一个资产**：遵循[创建资产](/zh/smart-contracts/core/create-asset)指南
3. **探索插件**：在[插件](/zh/smart-contracts/core/plugins)中查看可用行为
4. **从 Token Metadata 迁移**：查看[与 Token Metadata 的差异](/zh/smart-contracts/core/tm-differences)

{% callout %}
请注意，某些 Core 指令需要协议费用。请查看[协议费用](/zh/protocol-fees)页面了解当前信息。
{% /callout %}

## 常见问题

### 什么是 Metaplex Core？

Metaplex Core 是 Solana 上的下一代 NFT 标准，采用单账户设计实现更低成本、强制版税和灵活的插件系统。它是新 NFT 项目的推荐标准。

### Core 与 Token Metadata 有什么不同？

Core 每个资产使用一个账户（对比 Token Metadata 的 3 个以上），铸造成本降低约 80%，计算量更低，并包含内置版税强制。Token Metadata 对于新项目被视为遗留标准。

### 我可以从 Token Metadata 迁移到 Core 吗？

Core 资产和 Token Metadata NFT 是独立的标准。没有自动迁移。新项目应使用 Core；现有的 Token Metadata 集合继续工作。

### Core 支持版税吗？

是的。Core 有一个[版税插件](/zh/smart-contracts/core/plugins/royalties)，默认强制版税。您可以设置基点、创作者分成以及市场的白名单/黑名单规则。

### 什么是插件？

插件是为 Core 资产或集合添加行为的模块化扩展。例如冻结委托（允许冻结）、属性（链上数据）和版税（创作者支付）。

### 铸造 Core 资产需要多少费用？

每个资产约 0.0029 SOL，而 Token Metadata 约 0.022 SOL。这使得 Core 的铸造成本降低约 80%。

### 哪些 RPC 提供商支持 Core？

所有支持 DAS（Digital Asset Standard）的主要 RPC 提供商都索引 Core 资产。请参阅 [RPC 提供商](/zh/rpc-providers)了解当前列表。

### 我可以将 Core 用于游戏资产吗？

可以。Core 的插件系统非常适合游戏：使用属性存储链上状态、使用冻结委托锁定物品、使用转移委托进行市场集成。

## 术语表

| 术语 | 定义 |
|------|------------|
| **资产** | 代表 NFT 的单个 Core 链上账户，包含所有权、元数据和插件 |
| **集合** | 将相关资产分组并可应用集合级插件的 Core 账户 |
| **插件** | 为资产或集合添加行为的模块化扩展（版税、冻结、属性） |
| **DAS** | Digital Asset Standard - 用于查询索引 NFT 数据的 API 规范 |
| **基点** | 以百分之一为单位的版税百分比（500 = 5%） |
| **委托** | 被授权对资产执行特定操作而不拥有它的账户 |
| **CPI** | 跨程序调用 - 从另一个 Solana 程序调用 Core 程序 |
| **URI** | 指向包含名称、图像和属性的 JSON 文件的链下元数据 URL |

---

*由 Metaplex Foundation 维护 · 最后验证：2026 年 1 月 · 适用于 mpl-core 0.x*
