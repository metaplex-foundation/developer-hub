---
title: Core Candy Machine 程序概述
metaTitle: 程序概述 | Core Candy Machine
description: Core Candy Machine 程序架构、生命周期、账户结构和守卫系统的全面概述，用于在 Solana 上启动 MPL Core Asset 集合。
keywords:
  - core candy machine
  - candy machine overview
  - solana nft launch
  - mpl core candy machine
  - candy guard
  - nft minting
  - core assets
  - metaplex candy machine
  - candy machine lifecycle
  - candy machine account structure
  - guard system
  - config line settings
  - hidden settings
  - mint authority
  - candy machine architecture
  - solana nft distribution
  - bot protection
  - guard groups
about:
  - Core Candy Machine
  - Candy Guard
  - MPL Core
  - Solana NFT Launch
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
faqs:
  - q: Core Candy Machine 是什么，与 Candy Machine V3 有什么区别？
    a: Core Candy Machine 是最新的 Metaplex 铸造程序，专为 MPL Core Assets 设计。Candy Machine V3 使用旧标准铸造 Token Metadata NFT。Core Candy Machine 产生更轻量、更具成本效益的资产，因为 MPL Core 使用单账户模型而非每个 NFT 多个账户。
  - q: Core Candy Machine 有多少可用守卫？
    a: Core Candy Machine 通过配套的 Candy Guard 程序提供超过 23 个默认守卫。这些守卫涵盖支付收取（SOL、SPL 代币、NFT）、访问控制（允许列表、代币门控、NFT 门控）、调度（开始和结束日期）以及防机器人保护（机器人税、网关守护者）。
  - q: 可以在 Core Candy Machine 中使用自定义守卫吗？
    a: 可以。守卫系统作为单独的 Candy Guard 程序实现，可以分叉。开发者可以创建自定义守卫，同时仍依赖主 Candy Machine 程序进行实际的铸造逻辑。
  - q: Core Candy Machine 在所有物品铸造完毕后会怎样？
    a: 所有物品铸造完毕后，可以删除（提取）Candy Machine 以回收链上存储租金。此操作不可逆，会将用于租金的 SOL 返还到权限钱包。
  - q: 加载 Core Candy Machine 前是否需要预先创建 NFT？
    a: 不需要。您加载到 Candy Machine 中的是物品元数据（名称和 URI 对），而非实际的链上资产。Core Assets 仅在用户从 Candy Machine 铸造时才在 Solana 区块链上创建。
  - q: Candy Machine 权限和铸造权限有什么区别？
    a: 权限（authority）控制 Candy Machine 的配置和管理（更新设置、插入物品、提取）。铸造权限（mint authority）控制谁可以触发铸造。通常，Candy Guard 账户被设置为铸造权限，以便在任何铸造发生前强制执行守卫验证。
---

## 概要

Core Candy Machine 是 Metaplex 铸造和分发程序，专为在 Solana 上启动 [MPL Core](/zh/smart-contracts/core) Asset 集合而构建。它管理 NFT 发布的完整生命周期，从加载物品元数据到守卫铸造再到发布后清理。

- 支持超过 23 个可组合的[守卫](/zh/smart-contracts/core-candy-machine/guards)，用于支付、访问控制、调度和防机器人保护
- 铸造 [MPL Core Assets](/zh/smart-contracts/core)（单账户 NFT），而非传统 Token Metadata NFT
- 物品以元数据引用形式加载；链上资产仅在铸造时创建
- 单独的 [Candy Guard](/zh/smart-contracts/core-candy-machine/guards) 程序提供可分叉的访问控制层，用于自定义铸造工作流程

## 介绍

到 2022 年 9 月，Solana 上 78% 的 NFT 都是通过 Metaplex 的 Candy Machine 铸造的。这包括 Solana 生态系统中大多数知名的 NFT 项目。到 2024 年，Metaplex 推出了 [Core](/zh/smart-contracts/core) 协议，重新定义了 Solana 上的 NFT，并为 Core 标准提供了一个新的 Candy Machine，以适应用户喜爱的相同铸造机制。

以下是它提供的一些功能。

- 接受 SOL、NFT 或任何 Solana 代币的支付。
- 通过开始/结束日期、铸造限制、第三方签名者等限制您的发布。
- 通过可配置的机器人税和验证码等守门人保护您的发布免受机器人攻击。
- 限制特定资产/NFT/代币持有者或精选钱包列表的铸造。
- 使用不同的规则集创建多个铸造组。
- 在发布后揭示您的资产，同时允许用户验证该信息。
- 还有更多！

{% callout type="note" %}
本页面介绍的是 Core Candy Machine，用于铸造 [MPL Core](/zh/smart-contracts/core) Assets。如果您需要铸造 Token Metadata NFT，请参考 [Candy Machine V3](/zh/smart-contracts/candy-machine)。
{% /callout %}

## Core Candy Machine 生命周期

Core Candy Machine 生命周期由四个顺序阶段组成：创建、物品加载、铸造和可选的提取。每个阶段必须在下一个阶段开始前完成。

### 阶段 1 — 创建和配置 Candy Machine

第一步是创作者创建一个新的 Core Candy Machine 并配置其设置，包括[集合](/zh/smart-contracts/core/collections)地址、物品数量和可选的 [Config Line Settings](/zh/smart-contracts/core-candy-machine/create) 或 [Hidden Settings](/zh/smart-contracts/core-candy-machine/guides/create-a-core-candy-machine-with-hidden-settings)。

{% diagram %}
{% node #action label="1. 创建和配置" theme="pink" /%}
{% node parent="action" x="250" %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node label="设置" /%}
{% /node %}
{% edge from="action" to="candy-machine" path="straight" /%}
{% /diagram %}

创建的 Core Candy Machine 会跟踪自己的设置，这些设置决定了如何创建所有资产。例如，有一个 `collection` 参数将分配给从此 Core Candy Machine 创建的所有资产。有关所有可用设置的详情，请参阅[创建 Core Candy Machine](/zh/smart-contracts/core-candy-machine/create)。

### 阶段 2 — 将物品插入 Candy Machine

创建后，Candy Machine 必须加载每个待铸造物品的元数据。每个物品由一个 `name` 和一个指向预上传 JSON 元数据的 `uri` 组成。

{% diagram %}
{% node #action-1 label="1. 创建和配置" theme="pink" /%}
{% node #action-2 label="2. 插入物品" parent="action-1" y="50" theme="pink" /%}
{% node parent="action-1" x="250" %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node label="设置" /%}
{% node #item-1 label="物品 1" /%}
{% node #item-2 label="物品 2" /%}
{% node #item-3 label="物品 3" /%}
{% node #item-rest label="..." /%}
{% /node %}
{% edge from="action-1" to="candy-machine" path="straight" /%}
{% edge from="action-2" to="item-1" /%}
{% edge from="action-2" to="item-2" /%}
{% edge from="action-2" to="item-3" /%}
{% edge from="action-2" to="item-rest" /%}
{% /diagram %}

每个物品由两个参数组成：

- `name`: 资产的名称。
- `uri`: 指向资产 [JSON 元数据](/zh/smart-contracts/token-metadata/token-standard#the-non-fungible-standard) 的 URI。这意味着 JSON 元数据已经通过链上（例如 Arweave、IPFS）或链下（例如 AWS、您自己的服务器）存储提供商上传。您可以使用的工具来创建 Candy Machine，如 [CLI](/zh/dev-tools/cli/cm) 或 JS SDK 提供了帮助程序来完成此操作。

所有其他参数在资产之间共享，因此直接保存在 Candy Machine 的设置中以避免重复。有关更多详细信息，请参阅[插入物品](/zh/smart-contracts/core-candy-machine/insert-items)。

{% callout type="note" %}
此时还没有实际的链上资产存在。Candy Machine 仅存储元数据引用。资产在铸造时才在 Solana 区块链上创建。
{% /callout %}

### 阶段 3 — 从 Candy Machine 铸造资产

一旦 Candy Machine 完全加载且所有配置的[守卫](/zh/smart-contracts/core-candy-machine/guards)条件都满足，用户就可以开始铸造 Core Assets。每次铸造从 Candy Machine 消耗一个物品并创建一个新的链上资产。

{% diagram %}
{% node #action-1 label="1. 创建和配置" theme="pink" /%}
{% node #action-2 label="2. 插入物品" parent="action-1" y="50" theme="pink" /%}

{% node parent="action-1" x="250" %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node label="设置" /%}
{% node #item-1 label="物品 1" /%}
{% node #item-2 label="物品 2" /%}
{% node #item-3 label="物品 3" /%}
{% node #item-rest label="..." /%}
{% /node %}

{% node parent="candy-machine" x="180" y="20" %}
{% node #mint label="3. 铸造" theme="pink" /%}
{% node #mint-1 label="铸造 #1" theme="pink" /%}
{% node #mint-2 label="铸造 #2" theme="pink" /%}
{% node #mint-3 label="铸造 #3" theme="pink" /%}
{% /node %}

{% node #nft-1 parent="mint" x="120" label="资产" theme="blue" /%}
{% node #nft-2 parent="nft-1" y="50" label="资产" theme="blue" /%}
{% node #nft-3 parent="nft-2" y="50" label="资产" theme="blue" /%}

{% edge from="action-1" to="candy-machine" path="straight" /%}
{% edge from="action-2" to="item-1" /%}
{% edge from="action-2" to="item-2" /%}
{% edge from="action-2" to="item-3" /%}
{% edge from="action-2" to="item-rest" /%}
{% edge from="item-1" to="mint-1" /%}
{% edge from="item-2" to="mint-2" /%}
{% edge from="item-3" to="mint-3" /%}
{% edge from="mint-1" to="nft-1" path="bezier" /%}
{% edge from="mint-2" to="nft-2" path="bezier" /%}
{% edge from="mint-3" to="nft-3" path="bezier" /%}
{% /diagram %}

在铸造之前，一些用户可能需要执行额外的验证步骤——例如完成验证码或提交 Merkle Proof。有关更多详细信息，请参阅[铸造](/zh/smart-contracts/core-candy-machine/mint)。

### 阶段 4 — 提取 Candy Machine

所有资产铸造完毕后，Candy Machine 已完成其使命，可以删除以回收链上存储租金。权限将收到回收的 SOL。

{% diagram %}
{% node #action-1 label="4. 删除" theme="pink" /%}
{% node parent="action-1" x="150" %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node label="设置" /%}
{% node #item-1 label="物品 1" /%}
{% node #item-2 label="物品 2" /%}
{% node #item-3 label="物品 3" /%}
{% node #item-rest label="..." /%}
{% /node %}
{% node #nft-1 parent="candy-machine" x="200" label="资产" theme="blue" /%}
{% node #nft-2 parent="nft-1" y="50" label="资产" theme="blue" /%}
{% node #nft-3 parent="nft-2" y="50" label="资产" theme="blue" /%}
{% edge from="action-1" to="candy-machine" path="straight" /%}
{% /diagram %}

{% callout type="warning" %}
提取 Candy Machine 是不可逆的操作。只有在确定铸造流程已完成后才执行提取。有关详情，请参阅[提取 Candy Machine](/zh/smart-contracts/core-candy-machine/withdrawing-a-candy-machine)。
{% /callout %}

## Core Candy Machine 账户结构

Core Candy Machine 账户存储管理铸造流程所需的所有配置和状态数据。链上数据结构跟踪机器版本、启用的功能、权限密钥、集合绑定和兑换计数。

{% totem %}
{% totem-accordion title="链上 Core Candy Machine 数据结构" %}

Core Candy Machine 的链上账户结构。[在 GitHub 上查看](https://github.com/metaplex-foundation/mpl-core-candy-machine)

| 名称           | 类型    | 大小 | 描述                                              |
| -------------- | ------- | ---- | ------------------------------------------------ |
| version        | u8      | 1    | Candy Machine 账户的版本                          |
| features       | [u8; 6] | 6    | Candy Machine 启用的功能标志                       |
| authority      | Pubkey  | 32   | 管理 Candy Machine 的权限钱包                      |
| mint_authority | Pubkey  | 32   | 铸造权限——通常是 Candy Guard 账户                  |
| collection     | Pubkey  | 32   | 创建时分配的 MPL Core 集合地址                     |
| items_redeemed | u64     | 8    | 从此机器铸造的物品计数                             |

{% /totem-accordion %}
{% /totem %}

**权限（authority）** 控制管理操作，如更新设置、插入物品和提取租金。**铸造权限（mint_authority）** 控制谁可以触发铸造指令。当附加 [Candy Guard](/zh/smart-contracts/core-candy-machine/guards) 时，它成为铸造权限，以便在铸造前必须通过所有守卫验证。

## Candy Guard 系统

Candy Guard 程序是一个配套的 Solana 程序，为 Core Candy Machine 铸造提供可组合、可配置的访问控制。守卫是限制或修改铸造流程的模块化规则。

创作者可以使用我们所谓的"**守卫**"来为其 Core Candy Machine 添加各种功能。Metaplex Core Candy Machine 附带一个名为 **Candy Guard** 的额外 Solana 程序，该程序附带[**超过 23 个默认守卫**](/zh/smart-contracts/core-candy-machine/guards)。通过使用额外的程序，它允许高级开发人员分叉默认的 Candy Guard 程序以创建自己的[自定义守卫](/zh/smart-contracts/core-candy-machine/custom-guards/generating-client)，同时仍然能够依赖主 Candy Machine 程序。

每个守卫都可以根据需要启用和配置，因此创作者可以挑选他们需要的功能。禁用所有守卫将等同于允许任何人随时免费铸造资产，这可能不是创作者想要的。

### Candy Guard 组合示例

守卫组合在一起形成完整的铸造策略。以下示例演示了四个守卫如何组合创建一个防机器人保护、时间限制、速率限制的付费铸造。

假设 Core Candy Machine 有以下守卫：

- **[Sol Payment](/zh/smart-contracts/core-candy-machine/guards/sol-payment)**：确保铸造钱包向配置的目标钱包支付配置的 SOL 金额。
- **[Start Date](/zh/smart-contracts/core-candy-machine/guards/start-date)**：确保只能在配置的时间之后开始铸造。
- **[Mint Limit](/zh/smart-contracts/core-candy-machine/guards/mint-limit)**：确保每个钱包的铸造数量不超过配置的数量。
- **[Bot Tax](/zh/smart-contracts/core-candy-machine/guards/bot-tax)**：当此守卫被激活时，如果任何其他激活的守卫无法验证铸造，它将向尝试铸造的钱包收取少量配置的 SOL，以阻止自动机器人。

我们最终得到的是一个受机器人保护的 Candy Machine，它收取 SOL，在特定时间启动，并且每个钱包只允许有限数量的铸造。以下是一个具体示例。

{% diagram %}
{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node label="设置" /%}
{% node #items label="物品" /%}
{% node #guards %}
守卫:

- Sol Payment (0.1 SOL)
- Start Date (1月6日)
- Mint Limit (1)
- Bot Tax (0.01 SOL)

{% /node %}
{% /node %}

{% node parent="candy-machine" x="250" %}
{% node #mints label="资产" theme="pink" /%}
{% node #mint-1 label="#1: 钱包 A (1 SOL) 在 1月5日" theme="pink" /%}
{% node #mint-2 label="#2: 钱包 B (3 SOL) 在 1月6日" theme="pink" /%}
{% node #mint-3 label="#3: 钱包 B (2 SOL) 在 1月6日" theme="pink" /%}
{% node #mint-4 label="#4: 钱包 C (0.5 SOL) 在 1月6日" theme="pink" /%}
{% /node %}
{% node #fail-1 parent="mints" x="250" theme="red" %}
太早了 {% .text-xs %} \
收取机器人税
{% /node %}
{% node #nft-2 parent="fail-1" y="50" label="资产" theme="blue" /%}
{% node #fail-3 parent="nft-2" y="50" theme="red" %}
已经铸造了 1 个 {% .text-xs %} \
收取机器人税
{% /node %}
{% node #fail-4 parent="fail-3" y="50" theme="red" %}
SOL 不足 {% .text-xs %} \
收取机器人税
{% /node %}

{% edge from="candy-machine" to="mint-1" /%}
{% edge from="candy-machine" to="mint-2" /%}
{% edge from="candy-machine" to="mint-3" /%}
{% edge from="candy-machine" to="mint-4" /%}
{% edge from="mint-1" to="fail-1" path="bezier" /%}
{% edge from="mint-2" to="nft-2" path="bezier" /%}
{% edge from="mint-3" to="fail-3" path="bezier" /%}
{% edge from="mint-4" to="fail-4" path="bezier" /%}
{% /diagram %}

有超过 23 个默认守卫和创建自定义守卫的能力，创作者可以挑选对他们重要的功能并组合完美的 Candy Machine。守卫还可以组织为[守卫组](/zh/smart-contracts/core-candy-machine/guard-groups)，以定义多个铸造阶段（例如，允许列表钱包的早期访问阶段，随后是公开铸造）。了解守卫的最佳起点是 [Candy Guards](/zh/smart-contracts/core-candy-machine/guards) 页面。

## 注意事项

- Core Candy Machine 仅铸造 [MPL Core](/zh/smart-contracts/core) Assets。要铸造 Token Metadata NFT，请改用 [Candy Machine V3](/zh/smart-contracts/candy-machine)。
- 使用 Config Line Settings 时，必须在铸造开始前插入所有物品。
- 每个物品的 JSON 元数据必须在插入 Candy Machine 之前上传到存储提供商（Arweave、IPFS、AWS 等）。
- [提取](/zh/smart-contracts/core-candy-machine/withdrawing-a-candy-machine) Candy Machine 是不可逆的操作，会删除该机器的所有链上数据。
- Candy Guard 程序与 Candy Machine Core 程序是分开的。分叉守卫程序以实现自定义逻辑不需要修改核心铸造程序。
- 启用 [Bot Tax](/zh/smart-contracts/core-candy-machine/guards/bot-tax) 后，守卫验证失败将向失败的铸造者收费，而不是简单地拒绝交易。

*由 [Metaplex Foundation](https://github.com/metaplex-foundation) 维护 · 最后验证于 2026 年 3 月 · [在 GitHub 上查看源代码](https://github.com/metaplex-foundation/mpl-core-candy-machine)*

## 常见问题

### Core Candy Machine 是什么，与 Candy Machine V3 有什么区别？

Core Candy Machine 是最新的 Metaplex 铸造程序，专为 [MPL Core](/zh/smart-contracts/core) Assets 设计。[Candy Machine V3](/zh/smart-contracts/candy-machine) 使用旧标准铸造 Token Metadata NFT。Core Candy Machine 产生更轻量、更具成本效益的资产，因为 MPL Core 使用单账户模型而非每个 NFT 多个账户。

### Core Candy Machine 有多少可用守卫？

Core Candy Machine 通过配套的 Candy Guard 程序提供超过 23 个默认[守卫](/zh/smart-contracts/core-candy-machine/guards)。这些守卫涵盖支付收取（SOL、SPL 代币、NFT）、访问控制（允许列表、代币门控、NFT 门控）、调度（开始和结束日期）以及防机器人保护（机器人税、网关守护者）。

### 开发者可以为 Core Candy Machine 创建自定义守卫吗？

可以。守卫系统作为单独的 Candy Guard 程序实现，可以分叉。开发者可以创建[自定义守卫](/zh/smart-contracts/core-candy-machine/custom-guards/generating-client)，同时仍依赖主 Candy Machine 程序进行实际的铸造逻辑。

### Core Candy Machine 在所有物品铸造完毕后会怎样？

所有物品铸造完毕后，可以[提取](/zh/smart-contracts/core-candy-machine/withdrawing-a-candy-machine) Candy Machine 以回收链上存储租金。此操作不可逆，会将用于租金的 SOL 返还到权限钱包。

### 加载 Core Candy Machine 前是否需要将物品创建为链上资产？

不需要。您加载到 Candy Machine 中的是物品元数据（名称和 URI 对），而非实际的链上资产。Core Assets 仅在用户从 Candy Machine 铸造时才在 Solana 区块链上创建。有关详情，请参阅[插入物品](/zh/smart-contracts/core-candy-machine/insert-items)。

### Candy Machine 权限和铸造权限有什么区别？

**权限（authority）** 控制 Candy Machine 的配置和管理（更新设置、插入物品、提取）。**铸造权限（mint authority）** 控制谁可以触发铸造。通常，[Candy Guard](/zh/smart-contracts/core-candy-machine/guards) 账户被设置为铸造权限，以便在任何铸造发生前强制执行守卫验证。

## 术语表

| 术语 | 定义 |
|------|------------|
| Candy Machine | 一个临时的链上账户，存储物品元数据和 NFT 发布的配置。物品从中逐个铸造直到耗尽。 |
| Candy Guard | 一个配套的 Solana 程序，为 Candy Machine 提供可组合的访问控制规则（守卫）。它作为铸造权限，在委托给 Candy Machine 程序之前验证条件。 |
| 守卫（Guard） | Candy Guard 程序中的单一模块化规则，用于限制或修改铸造流程——例如，要求 SOL 支付或强制执行开始日期。 |
| 守卫组（Guard Group） | 一组命名的守卫，定义了一个独特的铸造阶段或层级。多个守卫组允许为不同受众设置不同规则（如允许列表 vs. 公开）。 |
| Config Line Settings | 一种 Candy Machine 配置模式，每个物品的名称和 URI 以可配置的长度约束单独存储在链上。 |
| Hidden Settings | 一种 Candy Machine 配置模式，所有铸造的资产共享相同的初始元数据，通常用于铸造后的揭示机制。 |
| 物品（Item） | 加载到 Candy Machine 中的名称和 URI 对，代表一个未来资产的元数据。在铸造前不是链上资产。 |
| 权限（Authority） | 拥有和管理 Candy Machine 的钱包——被授权更新设置、插入物品和提取租金。 |
| 铸造权限（Mint Authority） | 被授权调用 Candy Machine 铸造指令的账户。通常设置为 Candy Guard 账户以强制执行守卫验证。 |
| 集合（Collection） | 创建时分配给 Candy Machine 的 [MPL Core 集合](/zh/smart-contracts/core/collections)地址。所有铸造的资产自动添加到此集合。 |
