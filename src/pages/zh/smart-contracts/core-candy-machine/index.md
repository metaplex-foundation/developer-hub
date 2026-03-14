---
title: Core Candy Machine - Solana 上的 NFT 铸造与分发
metaTitle: Core Candy Machine — NFT 铸造与公平发布分发 | Metaplex
description: Core Candy Machine 是 Metaplex 在 Solana 上铸造和分发 Core Assets 的程序。配置守卫、插入物品并使用可自定义的铸造规则启动 NFT 集合。
created: '06-01-2024'
updated: '03-10-2026'
keywords:
  - core candy machine
  - candy machine
  - NFT minting
  - NFT launch
  - Solana NFT
  - Core Assets
  - minting program
  - candy guard
  - NFT distribution
  - fair mint
  - collection launch
  - Metaplex Core
  - SPL token payment
  - bot protection
  - mint guards
about:
  - Core Candy Machine minting program
  - NFT collection launches on Solana
  - Candy Guard access control
proficiencyLevel: Beginner
faqs:
  - q: Core Candy Machine 和 Candy Machine V3 有什么区别？
    a: Core Candy Machine 铸造的是 Metaplex Core Assets，采用单账户模型，成本更低且内置插件支持。Candy Machine V3 铸造的是传统的 Token Metadata NFT，每个代币需要多个账户。新项目应使用 Core Candy Machine。
  - q: 创建一个 Core Candy Machine 需要多少费用？
    a: 创建 Core Candy Machine 需要为链上账户支付租金，费用因加载的物品数量而异。铸造成本取决于启用了哪些守卫——例如，Sol Payment 守卫会在每次铸造时收取创作者定义的 SOL 金额。还会产生 Solana 交易费用。
  - q: 可以在 Core Candy Machine 上同时使用多个守卫吗？
    a: 可以。守卫是可组合的——您可以同时启用 23 多个默认守卫的任意组合。例如，结合 Sol Payment、Start Date、Mint Limit 和 Bot Tax 来创建一个有时间限制、速率限制、防机器人保护的付费铸造。
  - q: Core Candy Machine 在所有物品铸造完毕后会怎样？
    a: 所有物品铸造完毕后，可以删除（提取）Candy Machine 以回收链上租金。已铸造的 Core Assets 保留在链上，不受删除影响。
  - q: 是否需要单独的 Candy Guard 账户？
    a: 实际上是需要的。Candy Guard 账户是强制执行铸造规则（支付、时间、允许列表、防机器人保护）的组件。没有它，任何人都可以随时免费铸造。创建 Candy Guard 并将其设置为铸造权限是标准工作流程。
---

Metaplex 协议的 **Core Candy Machine** 是 Solana 上用于公平 NFT 集合发布的领先铸造和分发程序。专为 [Metaplex Core](/zh/smart-contracts/core) 资产标准构建，Core Candy Machine 充当临时的链上自动售货机，创作者加载物品，买家从中铸造。它允许创作者以安全且可自定义的方式将数字资产上链。{% .lead %}

- 使用单账户模型铸造 [Core Assets](/zh/smart-contracts/core/what-is-an-asset) ——比传统 Token Metadata NFT 成本更低、更简单
- 通过 [23 多个可组合守卫](/zh/smart-contracts/core-candy-machine/guards)自定义铸造流程，支持支付、时间控制、允许列表和防机器人保护
- 管理完整生命周期：[创建](/zh/smart-contracts/core-candy-machine/create)、[插入物品](/zh/smart-contracts/core-candy-machine/insert-items)、[铸造](/zh/smart-contracts/core-candy-machine/mint)和[提取](/zh/smart-contracts/core-candy-machine/withdrawing-a-candy-machine)
- 通过守卫配置支持 SOL、SPL 代币或 NFT 支付

这个名称指的是通过机械曲柄分发糖果的自动售货机。在这种情况下，糖果是 NFT，支付方式是 SOL 或 SPL 代币。

{% quick-links %}
{% quick-link title="入门指南" icon="InboxArrowDown" href="/zh/smart-contracts/core-candy-machine/sdk" description="找到您选择的语言或库，开始使用 Candy Machine。" /%}

{% quick-link title="CLI 命令" icon="CommandLine" href="/zh/dev-tools/cli/cm" description="使用 Metaplex CLI 通过交互式向导创建和管理 Candy Machine。" /%}

{% quick-link title="API 参考" icon="JavaScript" href="https://mpl-core-candy-machine.typedoc.metaplex.com/" target="_blank" description="查看 Javascript API 文档。" /%}

{% quick-link title="API 参考" icon="Rust" href="https://docs.rs/mpl-core-candy-machine-core/" target="_blank" description="查看 Rust API 文档。" /%}
{% /quick-links %}

{% callout %}
本文档指的是 Candy Machine 的最新版本，称为 Core Candy Machine。它允许铸造 [Core](/zh/smart-contracts/core) 资产。如果您想铸造 Metaplex Token Metadata NFT，[请参考 Candy Machine V3](/zh/smart-contracts/candy-machine)。
{% /callout %}

## Core Candy Machine 生命周期

Core Candy Machine 遵循四阶段生命周期：创建、加载、铸造和提取。创作者预先配置设置并插入物品元数据，然后买家按需铸造 Core Assets。所有物品铸造完毕后，创作者可以删除 Candy Machine 以回收租金。

1. **[创建和配置](/zh/smart-contracts/core-candy-machine/create)** Candy Machine 的集合级设置
2. **[插入物品](/zh/smart-contracts/core-candy-machine/insert-items)** 为每个资产提供名称和元数据 URI
3. **[铸造](/zh/smart-contracts/core-candy-machine/mint)** ——买家触发按需 Core Asset 创建，受守卫规则约束
4. **[提取](/zh/smart-contracts/core-candy-machine/withdrawing-a-candy-machine)** 发布后提取 Candy Machine 以回收链上租金

在买家铸造之前，链上不存在 Core Assets。Candy Machine 仅存储在铸造时创建每个资产所需的元数据引用。

## Candy Guard 与铸造自定义

[Candy Guards](/zh/smart-contracts/core-candy-machine/guards) 是模块化的访问控制规则，用于保护和自定义铸造流程。Core Candy Guard 程序附带 23 多个默认守卫，创作者可以独立启用和配置。

每个守卫处理单一职责，使其可组合。常见的守卫组合包括：

- **[Sol Payment](/zh/smart-contracts/core-candy-machine/guards/sol-payment)** ——每次铸造收取配置的 SOL 金额
- **[Start Date](/zh/smart-contracts/core-candy-machine/guards/start-date)** / **[End Date](/zh/smart-contracts/core-candy-machine/guards/end-date)** ——将铸造限制在一个时间窗口内
- **[Mint Limit](/zh/smart-contracts/core-candy-machine/guards/mint-limit)** ——限制每个钱包的铸造数量
- **[Bot Tax](/zh/smart-contracts/core-candy-machine/guards/bot-tax)** ——在铸造未通过守卫验证时收取罚金
- **[Allow List](/zh/smart-contracts/core-candy-machine/guards/allow-list)** ——将铸造限制为预定义的钱包集合
- **[Token Gate](/zh/smart-contracts/core-candy-machine/guards/token-gate)** / **[NFT Gate](/zh/smart-contracts/core-candy-machine/guards/nft-gate)** ——将铸造限制为特定代币或 NFT 的持有者

守卫通过一个单独的 [Candy Guard 账户](/zh/smart-contracts/core-candy-machine/guards)分配，该账户成为 Candy Machine 的铸造权限。高级开发者可以分叉 Candy Guard 程序来构建自定义守卫，同时仍依赖核心铸造程序。创作者还可以定义[守卫组](/zh/smart-contracts/core-candy-machine/guard-groups)，为不同受众提供不同的铸造条件（例如，允许列表阶段后跟公开销售）。

## 快速参考

| 项目 | 值 |
|------|-------|
| Core Candy Machine 程序 | `CMACYFENjoBMHzapRXyo1JZkVS6EtaDDzkjMrmQLvr4J` |
| Core Candy Guard 程序 | `CMAGAKJ67e9hRZgfC5SFTbZH8MgEmtqazKXjmkaJjWTJ` |
| JS SDK | `@metaplex-foundation/mpl-core-candy-machine` |
| Rust Crate | `mpl-core-candy-machine-core` |
| 源代码 | [GitHub](https://github.com/metaplex-foundation/mpl-core-candy-machine) |
| JS TypeDoc | [mpl-core-candy-machine.typedoc.metaplex.com](https://mpl-core-candy-machine.typedoc.metaplex.com/) |
| Rust 文档 | [docs.rs/mpl-core-candy-machine-core](https://docs.rs/mpl-core-candy-machine-core/) |
| 默认守卫 | 23 多个可组合守卫 |

## 注意事项

- Core Candy Machine 仅铸造 [Metaplex Core](/zh/smart-contracts/core) Assets。要铸造传统 Token Metadata NFT，请使用 [Candy Machine V3](/zh/smart-contracts/candy-machine)。
- 实际上需要 Candy Guard 账户来强制执行任何铸造限制。没有它，Candy Machine 将允许无限制的免费铸造。
- 铸造开始前必须插入物品。每个物品需要一个 `name` 和一个指向预上传 JSON 元数据的 `uri`。
- 所有物品铸造完毕后，提取 Candy Machine 以回收链上租金。已铸造的资产不受影响。
- Candy Guard 程序是独立于 Core Candy Machine 程序的链上程序。构建交易时必须引用两者。
- 有关防机器人保护的最佳实践，请参阅[防机器人保护最佳实践](/zh/smart-contracts/core-candy-machine/anti-bot-protection-best-practices)。


## 常见问题

### Core Candy Machine 和 Candy Machine V3 有什么区别？
Core Candy Machine 铸造的是 [Metaplex Core](/zh/smart-contracts/core) Assets，采用单账户模型，成本更低且内置插件支持。[Candy Machine V3](/zh/smart-contracts/candy-machine) 铸造的是传统 Token Metadata NFT，每个代币需要多个账户。新项目应使用 Core Candy Machine。

### 创建一个 Core Candy Machine 需要多少费用？
创建 Core Candy Machine 需要为链上账户支付租金，费用因加载的物品数量而异。铸造成本取决于启用了哪些[守卫](/zh/smart-contracts/core-candy-machine/guards)——例如，[Sol Payment](/zh/smart-contracts/core-candy-machine/guards/sol-payment) 守卫会在每次铸造时收取创作者定义的 SOL 金额。还会产生 Solana 交易费用。

### 可以在 Core Candy Machine 上同时启用多个守卫吗？
可以。守卫是可组合的——您可以同时启用 23 多个默认守卫的任意组合。例如，结合 Sol Payment、Start Date、Mint Limit 和 Bot Tax 来创建一个有时间限制、速率限制、防机器人保护的付费铸造。

### Core Candy Machine 在所有物品铸造完毕后会怎样？
所有物品铸造完毕后，可以[删除（提取）](/zh/smart-contracts/core-candy-machine/withdrawing-a-candy-machine) Candy Machine 以回收链上租金。已铸造的 Core Assets 保留在链上，不受删除影响。

### Core Candy Machine 是否需要单独的 Candy Guard 账户？
实际上是需要的。[Candy Guard](/zh/smart-contracts/core-candy-machine/guards) 账户是强制执行铸造规则（支付、时间、允许列表、防机器人保护）的组件。没有它，任何人都可以随时免费铸造。创建 Candy Guard 并将其设置为铸造权限是标准工作流程。

### 开发者可以创建自定义守卫吗？
可以。Candy Guard 程序设计为可分叉。开发者可以编写自定义守卫逻辑，同时依赖主 Core Candy Machine 程序进行铸造。默认的 23 多个守卫涵盖了大多数用例，但自定义守卫允许满足项目特定需求。

## 术语表

| 术语 | 定义 |
|------|------------|
| **Core Candy Machine** | 存储物品元数据并按需铸造 Core Assets 的链上 Metaplex 程序 |
| **Candy Guard** | 一个单独的链上程序，使用可组合的访问控制规则（守卫）包装 Candy Machine |
| **守卫（Guard）** | 一个单一的模块化规则，用于限制或修改铸造流程（如支付、时间、允许列表） |
| **守卫组（Guard Group）** | 一组命名的守卫配置，为不同受众应用不同的铸造条件 |
| **物品（Item）** | 铸造前加载到 Candy Machine 中的名称和元数据 URI 对 |
| **Core Asset** | Metaplex Core NFT——具有内置插件支持的单账户数字资产 |
| **铸造权限（Mint Authority）** | 被授权触发铸造的账户；通常设置为 Candy Guard 账户 |
| **集合（Collection）** | 分配给从 Candy Machine 铸造的所有资产的链上集合地址 |

## 后续步骤

1. **[SDK 设置](/zh/smart-contracts/core-candy-machine/sdk)** ——选择 JavaScript 或 Rust 并安装 SDK
2. **[创建 Core Candy Machine](/zh/smart-contracts/core-candy-machine/create)** ——配置设置并部署
3. **[插入物品](/zh/smart-contracts/core-candy-machine/insert-items)** ——将资产元数据加载到 Candy Machine
4. **[配置守卫](/zh/smart-contracts/core-candy-machine/guards)** ——设置支付、时间和访问规则
5. **[铸造 Core Assets](/zh/smart-contracts/core-candy-machine/mint)** ——了解铸造流程
