---
title: 程序和操作
metaTitle: 程序和操作 | Metaplex 技能
description: Metaplex Skill 覆盖的程序和操作的详细分析。
created: '02-23-2026'
updated: '04-08-2026'
keywords:
  - Agent Registry
  - Core
  - Token Metadata
  - Bubblegum
  - Candy Machine
  - Genesis
  - bonding curve
  - mplx CLI
  - Umi SDK
  - Kit SDK
about:
  - Metaplex programs
  - CLI operations
  - SDK operations
proficiencyLevel: Beginner
---

Metaplex Skill 覆盖 CLI、Umi SDK 和 Kit SDK 中的六个程序。本页提供每个程序支持的功能以及使用时机的详细分析。{% .lead %}

## 概述

Metaplex Skill 为 AI 代理提供关于六个 Metaplex 程序及其在 CLI、Umi SDK 和 Kit SDK 中可用工具的知识。

- 所有六个程序（[Agent Registry](/agents)、[Genesis](/smart-contracts/genesis)、[Core](/core)、[Token Metadata](/token-metadata)、[Bubblegum](/smart-contracts/bubblegum-v2)、[Candy Machine](/smart-contracts/core-candy-machine)）都支持 CLI 和 Umi SDK
- Kit SDK 仅适用于 Token Metadata
- `mplx` CLI 无需编写代码即可处理大多数操作
- 使用本页确定适合您任务的程序和工具方法

## 程序覆盖

下表显示了每个程序可用的工具方法。

| 程序 | CLI | Umi SDK | Kit SDK |
|---------|-----|---------|---------|
| **Agent Registry** | Yes | Yes | — |
| **Genesis** | Yes | Yes | — |
| **Core** | Yes | Yes | — |
| **Token Metadata** | Yes | Yes | Yes |
| **Bubblegum** | Yes | Yes | — |
| **Candy Machine** | Yes | Yes | — |

## Agent Registry

[Agent Registry](/agents) 为 MPL Core 资产提供链上代理身份、钱包和执行委托。

**CLI** (`mplx agents`)：注册代理身份、委托和撤销执行、获取代理数据、将 Genesis 代币链接到代理。完整的代理代币创建流程请使用 `mplx genesis launch create --agentMint --agentSetToken` 一步完成发行和链接。

**Umi SDK**：完整的编程访问，包括 Mint Agent API（`mintAndSubmitAgent`），在单个交易中创建 Core 资产并注册身份。支持现有资产的 `registerIdentityV1`、执行委托，以及完整的[代理代币创建](/agents/create-agent-token)流程——通过 Genesis 发行代币并使用 `setAgentTokenV1` 链接。

{% callout type="note" %}
每个 Core 资产都通过 Core 的 Execute 钩子拥有内置钱包（Asset Signer PDA）。Agent Registry 添加可发现的身份记录，并允许所有者将链下执行者委托来操作代理。
{% /callout %}

## Core

Solana 上的下一代 NFT 标准。Core NFT 比 Token Metadata NFT 便宜得多，支持版税强制、冻结委托、属性等插件系统。

**CLI** (`mplx core`)：创建和更新集合与资产，管理插件。

**Umi SDK**：完整的编程访问，包括按所有者/集合/创建者查询、插件配置和委托管理。

## Token Metadata

原始的 Metaplex NFT 标准。支持同质化代币、NFT、可编程 NFT (pNFT) 和版本。

**CLI** (`mplx tm`)：创建 NFT 和 pNFT。转移和更新资产。同质化代币请使用 `mplx toolbox token`。

**Umi SDK**：对所有 Token Metadata 操作的完整编程访问。

**Kit SDK**：使用 `@solana/kit` 以最少依赖进行 Token Metadata 操作。当您想避免 Umi 框架时很有用。

## Bubblegum（压缩 NFT）

[Bubblegum](/smart-contracts/bubblegum-v2) 使用 Merkle 树进行状态压缩，可大规模创建 NFT。压缩 NFT 在初始树创建后仅需传统 NFT 的一小部分成本。

**CLI** (`mplx bg`)：创建 Merkle 树，铸造 cNFT（批量限制约 100），查询、更新、转移和销毁。

**Umi SDK**：完整的编程访问。对于超过约 100 的批量或 DAS API 查询，使用 SDK。

{% callout type="note" %}
压缩 NFT 操作需要支持 DAS 的 RPC 端点。标准 Solana RPC 端点不支持 cNFT 操作所需的 Digital Asset Standard API。
{% /callout %}

## Candy Machine

[Core Candy Machine](/smart-contracts/core-candy-machine) 使用可配置的铸造规则（守卫）部署 NFT 投放。守卫控制谁可以铸造、何时、以什么价格以及多少个。

**CLI** (`mplx cm`)：设置 Candy Machine 配置、插入项目和部署。铸造需要 SDK。

**Umi SDK**：包括铸造操作和守卫配置的完整编程访问。

## Genesis

[Genesis](/smart-contracts/genesis) 是具有公平分发和自动向 Raydium 流动性毕业的代币发行协议。支持两种发行类型：**launchpool**（可配置的分配和 48 小时存款窗口，可选团队归属期）和 **bonding curve**（即时恒积 AMM，交易立即开始，售罄时自动毕业到 Raydium CPMM）。

**CLI** (`mplx genesis`)：通过 launchpool 或 bonding curve 创建和管理代币发行。支持 bonding curve 发行的创作者费用、首次购买和代理模式。

**Umi SDK**：通过 Launch API（`createAndRegisterLaunch`）的完整编程访问。包含 bonding curve 交换集成（状态获取、生命周期辅助、带滑点的报价计算和交换执行）。也支持将 Genesis 代币链接到 Agent Registry 身份的代理发行流程。

## CLI 功能

`mplx` CLI 无需编写代码即可直接处理大多数 Metaplex 操作：

| 任务 | CLI 支持 |
|------|-------------|
| 注册代理身份 | Yes (`mplx agents register`) |
| 注册执行者配置文件 | Yes (`mplx agents executive register`) |
| 委托/撤销执行 | Yes (`mplx agents executive delegate` / `revoke`) |
| 获取代理数据 | Yes (`mplx agents fetch`) |
| 设置代理代币（Genesis 链接） | Yes (`mplx agents set-agent-token`，需要 asset-signer 模式) |
| 创建同质化代币 | Yes (`mplx toolbox token create`) |
| 创建 Core NFT/集合 | Yes (`mplx core`) |
| 创建 TM NFT/pNFT | Yes (`mplx tm create`) |
| 转移 TM NFT | Yes (`mplx tm transfer`) |
| 转移同质化代币 | Yes (`mplx toolbox token transfer`) |
| 转移 Core NFT | Yes (`mplx core asset transfer`) |
| 销毁 Core NFT | Yes |
| 更新 Core NFT 元数据 | Yes |
| 上传到存储 | Yes (`mplx toolbox storage upload`) |
| Candy Machine 投放 | Yes（设置/配置/插入——铸造需要 SDK） |
| 压缩 NFT (cNFT) | Yes（批量限制约 100，更大批量使用 SDK） |
| Execute (asset-signer 钱包) | Yes (`mplx core asset execute`) |
| 检查 SOL 余额/空投 | Yes (`mplx toolbox sol`) |
| 按所有者/集合查询资产 | 仅 SDK (DAS API) |
| 代币发行 — launchpool (Genesis) | Yes (`mplx genesis launch create`) |
| 代币发行 — bonding curve (Genesis) | Yes (`mplx genesis launch create --launchType bonding-curve`) |
| 代理代币发行 (Genesis + 链接) | Yes (`mplx genesis launch create --agentMint --agentSetToken`) |

## 选择指南

使用以下指导为您的任务选择合适的程序和工具。

### 自主代理

使用 **[Agent Registry](/agents)** 为 MPL Core 资产注册链上身份和执行委托。Mint Agent API（`mintAndSubmitAgent`）在单个交易中创建 Core 资产并注册身份。对于现有资产，使用 `mplx agents register <AGENT_MINT> --use-ix`（CLI）或 `registerIdentityV1`（SDK）。代理可以通过 Genesis 发行并使用 `setAgentTokenV1` 链接来[创建和链接代理代币](/agents/create-agent-token)。

### NFT: Core vs Token Metadata

| 选择 | 条件 |
|--------|------|
| **Core** | 新 NFT 项目、更低成本、插件、版税强制 |
| **Token Metadata** | 现有 TM 集合、需要版本、用于遗留兼容性的 pNFT |

### 何时使用压缩 NFT

以最低成本铸造数千个或更多 NFT 时使用 **Bubblegum**。前期成本是 Merkle 树创建；之后每次铸造仅需交易费用。

### 何时使用 Candy Machine

需要控制铸造规则（白名单、开始/结束日期、铸造限制、支付代币等）的 NFT 投放使用 **Core Candy Machine**。

### 同质化代币

同质化代币始终使用 **Token Metadata**。

### 代币发行

具有公平分发和自动 Raydium 流动性毕业的代币生成事件使用 **[Genesis](/smart-contracts/genesis)**。两种发行类型可用：

- **Launchpool**（默认） — 可配置的分配和 48 小时存款窗口，可选团队归属期支持。
- **Bonding curve** — 即时恒积 AMM，交易立即开始。支持创作者费用、首次购买和代理模式。售罄时自动毕业到 Raydium CPMM。

### 资产作为代理/保险库/钱包 (Execute)

当资产（NFT、代理、保险库）需要持有 SOL 或代币、转移资金、签署交易或拥有其他资产时，使用 **Core Execute**。每个 Core 资产都有一个可作为自主钱包运行的 signer PDA。

### CLI vs SDK

| 选择 | 条件 |
|--------|------|
| **CLI** | 默认选择——直接执行，无需代码 |
| **Umi SDK** | 需要代码，或操作不被 CLI 支持 |
| **Kit SDK** | 特别使用 `@solana/kit` 且需要最少依赖（仅 Token Metadata） |

## 快速参考

每个程序都有对应的 npm 包用于 SDK 访问；CLI 将所有程序捆绑在一个工具中。

| 工具 | 包 |
|------|---------|
| CLI | [`@metaplex-foundation/cli`](https://github.com/metaplex-foundation/cli) (`mplx`) |
| Umi SDK | [`@metaplex-foundation/umi`](https://github.com/metaplex-foundation/umi) |
| Agent Registry SDK | [`@metaplex-foundation/mpl-agent-registry`](https://github.com/metaplex-foundation/mpl-agent-registry) |
| Core SDK | [`@metaplex-foundation/mpl-core`](https://github.com/metaplex-foundation/mpl-core) |
| Token Metadata SDK | [`@metaplex-foundation/mpl-token-metadata`](https://github.com/metaplex-foundation/mpl-token-metadata) |
| Bubblegum SDK | [`@metaplex-foundation/mpl-bubblegum`](https://github.com/metaplex-foundation/mpl-bubblegum) |
| Candy Machine SDK | [`@metaplex-foundation/mpl-core-candy-machine`](https://github.com/metaplex-foundation/mpl-core-candy-machine) |
| Genesis SDK | [`@metaplex-foundation/genesis`](https://github.com/metaplex-foundation/genesis) |
| Kit SDK（仅 TM） | [`@metaplex-foundation/mpl-token-metadata-kit`](https://github.com/metaplex-foundation/mpl-token-metadata/tree/main/clients/js-kit) |

## 注意事项

- 压缩 NFT (Bubblegum) 操作需要支持 DAS 的 RPC 端点；标准 Solana RPC 不支持 Digital Asset Standard API
- Candy Machine 铸造需要 SDK——CLI 仅处理设置、配置和项目插入
- 按所有者或集合查询资产需要 DAS API（仅 SDK）
- Kit SDK 支持仅限于 Token Metadata；所有其他程序使用 Umi
- 设置代理代币（`setAgentTokenV1`）需要 Core 资产的 asset-signer 模式
- Bonding curve 发行在所有代币售罄后自动毕业到 Raydium CPMM
