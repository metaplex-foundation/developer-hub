---
title: 概述
metaTitle: Metaplex Core | Solana 下一代 NFT 标准
description: Metaplex Core 是 Solana 上的下一代 NFT 标准，具有单账户设计、强制版税和灵活的插件系统。更低成本、更低计算、更高性能。
updated: '01-31-2026'
keywords:
  - Metaplex Core
  - Solana NFT
  - NFT standard
  - single-account NFT
  - enforced royalties
  - mpl-core
about:
  - NFT standards
  - Solana blockchain
  - Digital assets
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
faqs:
  - q: 什么是 Metaplex Core？
    a: Metaplex Core 是 Solana 上的下一代 NFT 标准，采用单账户设计实现更低成本、强制版税和灵活的插件系统。它是新 NFT 项目的推荐标准。
  - q: Core 与 Token Metadata 有何不同？
    a: Core 每个资产使用一个账户（Token Metadata 使用 3 个以上），铸造成本降低约 80%，计算使用量更低，并内置版税强制执行。
  - q: 我可以从 Token Metadata 迁移到 Core 吗？
    a: Core Asset 和 Token Metadata NFT 是不同的标准。没有自动迁移。新项目应使用 Core；现有 Token Metadata 收藏继续有效。
  - q: Core 支持版税吗？
    a: 是的。Core 有一个默认强制版税的 Royalties 插件。您可以设置基点、创作者分成以及市场的白名单/黑名单规则。
  - q: 什么是插件？
    a: 插件是为 Core Asset 或 Collection 添加行为的模块化扩展。例如 Freeze Delegate、Attributes 和 Royalties。
  - q: 铸造 Core Asset 需要多少费用？
    a: 每个资产约 0.0029 SOL，而 Token Metadata 约为 0.022 SOL。这使 Core 的铸造成本降低约 80%。
  - q: 哪些 RPC 提供商支持 Core？
    a: 所有支持 DAS（Digital Asset Standard）的主要 RPC 提供商都会索引 Core 资产。
  - q: 我可以将 Core 用于游戏资产吗？
    a: 可以。Core 的插件系统非常适合游戏，包括用于链上属性的 Attributes、用于锁定物品的 Freeze Delegate 和用于市场集成的 Transfer Delegate。
---
Metaplex Core（"Core"）是 Solana 上的**下一代 NFT 标准**。它采用**单账户设计**，与其他方案相比可将铸造成本降低 80% 以上，同时提供**强制版税**、**收藏级操作**以及用于自定义行为的**灵活插件系统**。 {% .lead %}
{% callout title="您将学到" %}
本概述涵盖：
- Metaplex Core 是什么以及为什么存在
- 相比 Token Metadata 和其他标准的主要优势
- 核心概念：Asset、Collection 和 Plugin
- 如何开始使用 Core 构建
{% /callout %}
## 摘要
**Metaplex Core** 是一个 Solana NFT 标准，可替代大多数新项目中的 Token Metadata。它提供最低的铸造成本、强制版税以及用于自定义功能的插件架构。
- 单账户设计：每次铸造约 0.0029 SOL（Token Metadata 为 0.022 SOL）
- 默认强制版税，带白名单/黑名单控制
- 用于质押、属性、委托和自定义行为的插件系统
- 收藏级操作：一次性冻结、更新版税或修改所有资产
## 范围外
本概述不涵盖：同质化代币（使用 SPL Token）、Token Metadata 迁移路径或详细的插件实现。请参阅特定页面了解这些主题。
## 快速开始
**跳转至：** [开始使用](#下一步) · [主要优势](#介绍) · [FAQ](#faq) · [术语表](#术语表)
1. 安装 SDK：`npm install @metaplex-foundation/mpl-core`
2. 创建 Asset：[创建 Asset 指南](/zh/smart-contracts/core/create-asset)
3. 添加插件：[插件概述](/zh/smart-contracts/core/plugins)
4. 使用 DAS 查询：[获取 Asset](/zh/smart-contracts/core/fetch)
{% quick-links %}
{% quick-link title="开始使用" icon="InboxArrowDown" href="/zh/smart-contracts/core/sdk" description="选择您喜欢的语言或库，开始在 Solana 上使用数字资产。" /%}
{% quick-link title="API 参考" icon="CodeBracketSquare" href="https://mpl-core.typedoc.metaplex.com/" target="_blank" description="在寻找特定内容？查看我们的 API 参考。" /%}
{% quick-link title="与 Token Metadata 的区别" icon="AcademicCap" href="/zh/smart-contracts/core/tm-differences" description="从 Token Metadata 迁移过来？了解变化和新功能。" /%}
{% quick-link title="在 UI 中体验 Core" icon="Beaker" href="https://core.metaplex.com/" target="_blank" description="使用我们的网页界面自己铸造 Core Asset。" /%}
{% /quick-links %}
## 介绍
Metaplex Core 是 Solana 上新项目推荐的 NFT 标准。与 Token Metadata 和其他标准相比，Core 提供：
### 成本效率
| 标准 | 铸造成本 | 计算单元 |
|----------|-----------|---------------|
| **Metaplex Core** | ~0.0029 SOL | ~17,000 CU |
| Token Metadata | ~0.022 SOL | ~205,000 CU |
| Token Extensions | ~0.0046 SOL | ~85,000 CU |
### 主要优势
- **单账户设计**：Core 每个资产使用一个账户，而不是多个（mint + metadata + token account）。这降低了成本并简化了开发。
- **强制版税**：[Royalties 插件](/zh/smart-contracts/core/plugins/royalties)默认强制执行创作者版税，带有白名单/黑名单控制。
- **收藏级操作**：在单个交易中更新整个收藏的版税、冻结资产或修改元数据。
- **插件架构**：通过插件为资产添加自定义行为：
  - [Freeze Delegate](/zh/smart-contracts/core/plugins/freeze-delegate) - 允许他人冻结/解冻
  - [Burn Delegate](/zh/smart-contracts/core/plugins/burn-delegate) - 允许他人销毁
  - [Attributes](/zh/smart-contracts/core/plugins/attribute) - 链上键/值数据（DAS 自动索引）
  - [Transfer Delegate](/zh/smart-contracts/core/plugins/transfer-delegate) - 允许他人转移
  - 更多内容请参阅[插件部分](/zh/smart-contracts/core/plugins)
- **DAS 索引**：所有[支持 DAS](/solana/rpcs-and-das) 的主要 RPC 提供商已经索引 Core 资产。
## 核心概念
### Asset
**Asset** 是代表 NFT 的单个链上账户。与 Token Metadata（使用 3 个以上账户）不同，Core Asset 在一个账户中包含所有权、元数据 URI 和插件数据。
参见：[什么是 Asset？](/zh/smart-contracts/core/what-is-an-asset)
### Collection
**Collection** 是将相关 Asset 分组的 Core 账户。Collection 可以有自己的插件，应用于所有成员 Asset。例如，收藏级版税适用于收藏中的每个 Asset，除非被覆盖。
参见：[Collection](/zh/smart-contracts/core/collections)
### Plugin
**Plugin** 是为 Asset 或 Collection 添加行为的模块化扩展。它们挂钩到生命周期事件（创建、转移、销毁）以强制执行规则或存储数据。
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
1. **选择 SDK**：访问[开始使用](/zh/smart-contracts/core/sdk)安装 JavaScript 或 Rust SDK
2. **创建第一个 Asset**：按照[创建 Asset](/zh/smart-contracts/core/create-asset) 指南操作
3. **探索插件**：在[插件](/zh/smart-contracts/core/plugins)中查看可用行为
4. **从 Token Metadata 迁移**：查看[与 Token Metadata 的区别](/zh/smart-contracts/core/tm-differences)
{% callout %}
请注意，某些 Core 指令需要协议费用。请查看[协议费用](/protocol-fees)页面了解当前信息。
{% /callout %}
## FAQ
### 什么是 Metaplex Core？
Metaplex Core 是 Solana 上的下一代 NFT 标准，采用单账户设计实现更低成本、强制版税和灵活的插件系统。它是新 NFT 项目的推荐标准。
### Core 与 Token Metadata 有何不同？
Core 每个资产使用一个账户（Token Metadata 使用 3 个以上），铸造成本降低约 80%，计算使用量更低，并内置版税强制执行。Token Metadata 在新项目中被视为遗留标准。详细比较请参阅[与 Token Metadata 的区别](/zh/smart-contracts/core/tm-differences)。
### 我可以从 Token Metadata 迁移到 Core 吗？
Core Asset 和 Token Metadata NFT 是不同的标准。没有自动迁移。新项目应使用 Core；现有 Token Metadata 收藏继续有效。
### Core 支持版税吗？
是的。Core 有一个默认强制版税的 [Royalties 插件](/zh/smart-contracts/core/plugins/royalties)。您可以设置基点、创作者分成以及市场的白名单/黑名单规则。
### 什么是插件？
插件是为 Core Asset 或 Collection 添加行为的模块化扩展。例如 Freeze Delegate（允许冻结）、Attributes（链上数据）和 Royalties（创作者支付）。
### 铸造 Core Asset 需要多少费用？
每个基础资产约 0.0029 SOL，而 Token Metadata 约为 0.022 SOL。这使 Core 的铸造成本降低约 80%。更多详情请参阅[与 Token Metadata 的区别](/zh/smart-contracts/core/tm-differences)。
### 哪些 RPC 提供商支持 Core？
所有支持 DAS（Digital Asset Standard）的主要 RPC 提供商都会索引 Core 资产。当前列表请参阅 [RPC 提供商](/solana/rpcs-and-das)。
### 我可以将 Core 用于游戏资产吗？
可以。Core 的插件系统非常适合游戏：使用 Attributes 存储链上属性，Freeze Delegate 锁定物品，Transfer Delegate 进行市场集成。
## 术语表
| 术语 | 定义 |
|------|------------|
| **Asset** | 代表 NFT 的单个 Core 链上账户，包含所有权、元数据和插件 |
| **Collection** | 将相关 Asset 分组并可应用收藏级插件的 Core 账户 |
| **Plugin** | 为 Asset 或 Collection 添加行为的模块化扩展（版税、冻结、属性） |
| **DAS** | Digital Asset Standard - 用于查询索引 NFT 数据的 API 规范 |
| **基点** | 以百分之一的百分比表示的版税比例（500 = 5%） |
| **Delegate** | 被授权对 Asset 执行特定操作而无需拥有它的账户 |
| **CPI** | Cross-Program Invocation - 从另一个 Solana 程序调用 Core 程序 |
| **URI** | 指向包含名称、图像和属性的 JSON 文件的链下元数据 URL |
