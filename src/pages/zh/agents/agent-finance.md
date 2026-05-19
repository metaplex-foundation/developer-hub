---
title: Agent 金融 - 为 AI Agent 进行资本化与治理
metaTitle: Agent 金融 - 在 Solana 上对 AI Agent 进行资本化与治理 | Metaplex
description: 通过 AI Agent 自身的链上代币进行资本化与治理。在 Metaplex 上通过 Genesis 联合曲线发行 Agent 代币，通过 setAgentTokenV1 永久绑定到 Agent，并将收入路由到 Asset Signer PDA — 全部在 Metaplex 上完成。
keywords:
  - agent finance
  - agent token
  - AI agent capitalization
  - AI agent governance
  - raise funds for agent
  - agent bonding curve
  - agent token launch
  - AI agent token
  - Solana agent token
  - agent fundraising
  - autonomous agent economy
  - setAgentTokenV1
  - AgentIdentityV2
about:
  - Agent Finance
  - Agent Tokens
  - Genesis bonding curve
  - Solana
proficiencyLevel: Beginner
created: '04-13-2026'
updated: '05-06-2026'
faqs:
  - q: 什么是 Agent 金融？
    a: Agent 金融是通过自身的链上代币对自主 AI Agent 进行资本化和治理的实践。在 Metaplex 上，Agent 通过 Genesis 联合曲线发行代币并通过 setAgentTokenV1 永久绑定到 Agent，因此收入和创作者费用通过链上原语而非链下协议进行路由。
  - q: Agent 金融与 Agent 商业有何不同？
    a: Agent 金融涵盖 Agent 如何通过其代币进行资金筹集和治理 — 资本化、国库、持有人对齐。Agent 商业涵盖 Agent 如何赚取收入并产生经济活动。两者共享相同的 Agent 身份、PDA 钱包和 EIP-8004 元数据。
  - q: Agent 的钱包如何派生？
    a: Agent 的运营钱包是 Asset Signer — 一个从种子 ["mpl-core-execute", asset] 派生的 MPL Core PDA。没有私钥。该钱包可以持有 SOL、SPL 代币和其他资产，且仅通过 Core 的 Execute 生命周期钩子进行控制。
  - q: Agent 代币如何绑定到 Agent？
    a: setAgentTokenV1 指令将代币铸造地址写入 AgentIdentityV2 PDA 的 agentToken 字段。绑定是永久的 — 一旦设置，Agent 就不可逆地链接到该代币铸造地址。同一字段在 Agent 的 EIP-8004 元数据中公开，因此交易对手可以从 Agent 的注册中解析规范代币。
  - q: 为什么使用联合曲线而不是预售或公平发行？
    a: 联合曲线无需存款窗口即可立即开始交易，通过恒定乘积曲线提供持续的价格发现，并在完全填满时自动毕业到 Raydium CPMM 池。这为 Agent 代币提供即时流动性以及通往公开市场交易的清晰路径。
  - q: 筹集到的资金会怎么处理？
    a: 创作者费用在交易期间累积在联合曲线桶中，可由创作者钱包领取。毕业到 Raydium 后，创作者继续从 CPMM 池中赚取毕业后创作者费用。当 Agent 设置为创作者时，费用直接路由到 Agent 的 PDA 钱包。
---

Metaplex 上的 Agent 金融是自主 AI Agent 通过其自身的链上代币进行资本化和治理的方式。Agent 注册可验证的身份，通过 [Genesis 联合曲线](/smart-contracts/genesis)发行代币，并通过 `setAgentTokenV1` 指令将该代币永久绑定到自己 — 为 Agent 提供国库、使持有人社区与 Agent 的使命保持一致，并创建谁承担风险的透明记录。{% .lead %}

## 概述

Agent 金融涵盖 AI Agent 如何进行资本化与治理。Metaplex 技术栈端到端提供每一个原语：Agent 身份、从 Core 资产派生的 Asset Signer PDA、来自 Agent 钱包的 Genesis 联合曲线，以及通过 `setAgentTokenV1` 实现的永久代币-Agent 绑定。

- **Agent 身份**：通过 [`mpl-agent-identity`](/smart-contracts/mpl-agent/identity) 在链上注册，创建绑定到 Core 资产的 [`AgentIdentityV2`](/smart-contracts/mpl-agent/identity) PDA 和 EIP-8004 元数据文档
- **Asset Signer PDA**：Agent 的钱包由 [MPL Core](/smart-contracts/core) 从种子 `["mpl-core-execute", asset]` 派生 — 没有私钥，仅通过 Core 的 Execute 生命周期钩子进行控制
- **代币发行**：使用 `agent` 参数调用 [`createAndRegisterLaunch`](/smart-contracts/genesis) 从 Agent 的钱包启动 [Genesis 联合曲线](/dev-tools/cli/genesis/bonding-curve)，将创作者费用路由到 Agent
- **永久绑定**：[`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token) 将代币铸造地址写入 `AgentIdentityV2` 的 `agentToken: Option<Pubkey>` 字段 — 不可逆、公开，且是 Agent EIP-8004 元数据的一部分
- **毕业到公开市场**：当曲线填满时，流动性自动迁移到 [Raydium](https://raydium.io) CPMM 池以继续交易

{% callout type="note" title="Agent 金融 vs. Agent 商业" %}
**Agent 金融**关注 Agent 如何被*资本化与治理* — 通过 Agent 代币进行的筹资、国库与持有人对齐。**[Agent 商业](/agents/agent-commerce)**关注 Agent 如何产生*经济活动* — 支付服务费、与其他 Agent 进行交易，以及通过有生产力的工作赚取收入。本页面介绍 Agent 金融。
{% /callout %}

## Metaplex Agent 金融原语

Agent 金融流程的每一层都作为 Metaplex 原语提供 — 链上身份、Asset Signer 钱包、发行程序，以及不可逆的代币-Agent 绑定：

| 原语 | 位置 | 启用功能 |
|-----------|----------------|-----------------|
| **链上身份** | 种子 `["agent_identity", asset]` 处的 [`AgentIdentityV2`](/smart-contracts/mpl-agent/identity) PDA | 已发行代币与特定已注册 Agent 之间的可验证绑定 |
| **EIP-8004 元数据** | `agentMetadataUri` 处的链下 JSON，记录在 `AgentIdentity` 插件的链上 | 代币持有人和交易对手从单一文档解析 Agent 的身份、服务和绑定的代币 |
| **Asset Signer (PDA 钱包)** | 由 [MPL Core](/smart-contracts/core) 派生的种子 `["mpl-core-execute", asset]` | 持有 SOL、Agent 的代币、创作者费用收入和任何 SPL 代币；没有私钥 |
| **代币绑定** | `AgentIdentityV2` 上的 [`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token) | 永久链上链接 — `agentToken` 字段无法重新分配 |
| **代币发行** | [Genesis](/smart-contracts/genesis) 的 `createAndRegisterLaunch` 配合 `agent: { mint, setToken }` | 一笔交易创建联合曲线、铸造供应量并（可选地）将代币绑定到 Agent |
| **执行者委托** | [`mpl-agent-tools`](/smart-contracts/mpl-agent/tools) `ExecutionDelegateRecordV1` | 链下运营者代表 Agent 签署创作者费用领取和国库操作；按资产可撤销 |
| **毕业** | 联合曲线填满时自动 Raydium CPMM 迁移 | 无需手动流动性供应即可在公开市场交易并持续累积创作者费用 |

## 为什么发行 Agent 代币？

Agent 代币将您的 AI Agent 转变为可投资的、自主的经济参与者。无论是交易、内容创作、数据分析还是任何其他链上服务，持有人都支持 Agent 的使命，代币的价值反映 Agent 的表现和采用情况。

**对 Agent 构建者：**
- 在不放弃 Agent 本身所有权的情况下筹集资金
- 从联合曲线交易和毕业后 Raydium 交易中赚取创作者费用
- 建立与 Agent 成功相一致的代币持有人社区
- 为 Agent 提供其自主控制的国库（Asset Signer PDA）

**对代币持有人：**
- 支持您相信会有所表现的特定 AI Agent
- 通过具有即时流动性的联合曲线进行进出交易
- 从 Agent 的 [EIP-8004 注册](/agents/agent-commerce)解析规范代币铸造地址 — 无需链下信任

## Metaplex 上的 Agent 代币生命周期

Metaplex 技术栈处理从 Agent 创建到代币交易的完整生命周期：

1. **创建 Agent**：单次调用 [`mintAndSubmitAgent`](/agents/mint-agent) 在一笔交易中创建 MPL Core 资产并注册 `AgentIdentityV2`，将 EIP-8004 元数据 URI 作为 Core 插件附加
2. **设置执行**：通过 `mpl-agent-tools` [注册执行者档案](/agents/run-an-agent)并创建 `ExecutionDelegateRecordV1`，使 Agent 能够自主签署
3. **发行代币**：在 Genesis 上使用 `agent` 参数调用 [`createAndRegisterLaunch`](/smart-contracts/genesis) — `agent: { mint: agentAssetAddress, setToken: true }` 从 Agent 的 PDA 钱包创建联合曲线，并在同一交易中发出 `setAgentTokenV1` 指令
4. **毕业**：当联合曲线 100% 填满时，流动性迁移到 Raydium CPMM 池，代币在公开市场交易，并持续累积创作者费用

{% callout type="note" title="每个 Agent 一个代币" %}
`AgentIdentityV2` 的 `agentToken` 字段只能设置一次 — [`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token) 是不可逆的。同一字段也读入 Agent 的 EIP-8004 元数据，因此交易对手始终能看到规范代币铸造地址。
{% /callout %}

## 比较 Agent 筹资方法

并非所有代币发行方法对 AI Agent 都同样有效。下表将 Metaplex Agent 代币与常见替代方案进行比较。

| 功能 | Metaplex Agent 代币 | 通用发射台 | 手动代币 + DEX 上市 | 链下筹资 |
|---------|---------------------|-------------------|---------------------------|----------------------|
| **链上 Agent 身份** | `AgentIdentityV2` PDA + EIP-8004 元数据 | 无 | 无 | 无 |
| **Agent 拥有的钱包** | Asset Signer PDA，无私钥 | 由人控制的钱包 | 由人控制的钱包 | 无钱包 |
| **代币-Agent 绑定** | `setAgentTokenV1`，不可逆 | 无 | 无 | 无 |
| **即时交易** | 联合曲线立即开始 | 取决于平台 | 需要手动设置 LP | N/A |
| **价格发现** | 恒定乘积曲线 | 不同 | 手动定价 | N/A |
| **流动性毕业** | 自动迁移到 Raydium CPMM | 平台相关 | 手动 LP 管理 | N/A |
| **创作者费用** | 内置、可配置、路由到 Agent PDA | 固定，平台决定 | 无内置机制 | 平台决定 |
| **自主运营** | 通过 `mpl-agent-tools` 的 `ExecutionDelegateRecordV1` | 不支持 | 不支持 | 不支持 |

### 为什么 Metaplex 脱颖而出

**可验证的 Agent 身份。** [`mpl-agent-identity`](/smart-contracts/mpl-agent/identity) 将 `AgentIdentityV2` PDA 绑定到特定的 MPL Core 资产，并将 `AgentIdentity` 外部插件附加到该资产。任何人都可以在链上验证代币是由特定的已注册 Agent 发行的，并从 Agent 的 `agentToken` 字段解析规范代币铸造地址。

**无私钥暴露。** Asset Signer PDA 从 `["mpl-core-execute", asset]` 派生。没有私钥可能泄露、丢失或被盗。钱包仅通过 Core 的 [Execute 生命周期钩子](/smart-contracts/core/execute-asset-signing)进行控制，资产所有者可以随时撤销执行者委托。

**永久代币-Agent 绑定。** `setAgentTokenV1` 写入 `AgentIdentityV2` 上的一次性字段 — 一旦设置，绑定就无法更改。这消除了规范代币被悄悄替换的拉地毯场景，并让 EIP-8004 消费者从单一信任来源解析绑定的代币。

**即时流动性与毕业。** Genesis 联合曲线从发行的那一刻起提供即时交易 — 没有存款窗口，没有等待期。当曲线 100% 填满时，它会自动毕业到 Raydium CPMM 池，无需手动流动性供应。

**全栈集成。** Metaplex 提供每一层：身份 ([`mpl-agent-identity`](/smart-contracts/mpl-agent))、资产管理 ([Core](/smart-contracts/core))、代币发行 ([Genesis](/smart-contracts/genesis))、执行委托 ([`mpl-agent-tools`](/smart-contracts/mpl-agent/tools)) 以及开发者工具 ([CLI](/dev-tools/cli/agents)、[Skill](/agents/skill))。无需拼接第三方服务。

## 发行 Agent 代币

Metaplex 上的 Agent 代币发行可通过无代码、CLI 和 SDK 工作流程获得。

### 在 metaplex.com 上发行 Agent 代币

[metaplex.com](https://www.metaplex.com) 提供无代码界面，使用联合曲线发行 Agent 代币。连接您的钱包，注册您的 Agent，配置您的代币，然后发行 — 无需编码。

### 使用 CLI 发行 Agent 代币

[Metaplex CLI](/dev-tools/cli) 通过单条命令发行 Agent 代币。`--agentAsset` 标志将发行包装在 Core Execute 指令中，使 Agent 的 PDA 成为创作者；`--agentSetToken` 在同一交易中发出 `setAgentTokenV1`。

```bash {% title="通过联合曲线发行 Agent 代币" %}
mplx genesis launch create --launchType bonding-curve \
  --name "My Agent Token" \
  --symbol "MAT" \
  --image "https://gateway.irys.xyz/your-image-hash" \
  --agentAsset <AGENT_CORE_ASSET_ADDRESS> \
  --agentSetToken
```

这将创建联合曲线，从 Agent 的 PDA 铸造代币供应量，并通过 `setAgentTokenV1` 将其永久链接到 Agent — 全部通过一笔交易完成。

请参阅完整的[联合曲线 CLI 指南](/dev-tools/cli/genesis/bonding-curve)了解交换命令、状态检查和生命周期管理。

### 使用 SDK 发行 Agent 代币

对于程序化发行，使用 [Genesis JavaScript SDK](/smart-contracts/genesis/sdk/javascript) 并将 `agent` 参数传递给 `createAndRegisterLaunch`：

```ts
await createAndRegisterLaunch(umi, {
  // ...launch params
  agent: {
    mint: agentAssetAddress,
    setToken: true,
  },
}).sendAndConfirm(umi);
```

设置 `setToken: true` 会在同一交易中触发 `setAgentTokenV1` 指令，使发行和绑定保持原子性。

## Agent 代币经济学

Agent 代币经济学结合了联合曲线交易期间的创作者费用累积和毕业后的自动流动性迁移。

### 创作者费用

每次联合曲线发行都支持可配置的创作者费用。每次交换的一定百分比在联合曲线阶段定向到创作者钱包。当 Agent 设置为创作者时，费用流入 Asset Signer PDA：

- 费用累积在联合曲线桶中，可由创作者领取
- 费用百分比在发行时设定，并在链上可见
- 创作者费用从毕业后 Raydium 交易中继续累积
- 由于创作者钱包可以是任何地址，Agent 可以将费用路由到自己的 PDA、多签或单独的国库

### 毕业

当联合曲线上的所有代币都被购买时，曲线会自动毕业：

1. 流动性迁移到 Raydium CPMM 池
2. 在公开市场上继续交易
3. 代币可在任何 Solana DEX 聚合器上完全交易
4. 创作者钱包继续从毕业后交易中赚取创作者费用

### Agent 国库

Asset Signer PDA 可以持有 SOL、Agent 自身的代币、稳定币、NFT 和任何其他 SPL 代币。通过 `ExecutionDelegateRecordV1`，Agent 的执行者可以自主部署国库资金：支付计算费用、获取资源或与其他协议交互 — 全部通过 Core 的 Execute 钩子签名，具有按资产可撤销的权限。

## 使用 Metaplex Agent 技术栈构建

Metaplex Agent 技术栈结合了用于自主 Agent 代币运营的身份、执行、发行和工具组件。

| 工具 | 用途 | 链接 |
|------|---------|------|
| **`mpl-agent-identity`** | `AgentIdentityV2` PDA、EIP-8004 元数据、`setAgentTokenV1` | [文档](/smart-contracts/mpl-agent/identity) |
| **`mpl-agent-tools`** | 执行者档案和执行委托记录 | [文档](/smart-contracts/mpl-agent/tools) |
| **MPL Core** | Asset Signer PDA 和 Execute 生命周期钩子 | [文档](/smart-contracts/core) |
| **Genesis** | 带 `agent` 参数的联合曲线和 launchpool | [文档](/smart-contracts/genesis) |
| **CLI** | 命令行 Agent 和代币管理 | [Agents CLI](/dev-tools/cli/agents) · [Genesis CLI](/dev-tools/cli/genesis) |
| **Skill** | AI 编码 Agent 知识库 | [文档](/agents/skill) |
| **Metaplex Launchpad** | 无代码代币发行界面 | [metaplex.com](https://www.metaplex.com) |

## 注意事项

这些注意事项涵盖 Metaplex 上 Agent 代币发行的关键约束和生命周期细节。

- 端到端 Agent-代币绑定流程围绕 [Genesis](/smart-contracts/genesis) 联合曲线构建。Genesis launchpools 也支持代币发行，但原子化的发行 + `setAgentTokenV1` 流程最常用于联合曲线
- `AgentIdentityV2` 上的 `agentToken` 字段是 `Option<Pubkey>`。在调用 `setAgentTokenV1` 之前为 `None`，之后永久为 `Some(mint)` — 没有清除或重新分配的指令
- 联合曲线使用恒定乘积公式；价格随着代币的购买而上升，随着代币的卖出而下降
- 毕业后，Metaplex 对代币没有控制权 — 它在 Raydium 和 DEX 聚合器上自由交易
- 创作者费用在发行时配置，联合曲线创建后无法更改。接收方可以是任何钱包，包括 Agent 的 PDA
- Asset Signer 没有私钥 — 只能通过 Core 的 Execute 生命周期钩子进行控制，执行者权限通过 `ExecutionDelegateRecordV1` 授予，可由资产所有者撤销

## FAQ

关于 Metaplex 上 Agent 金融的常见实施和设计问题。

### 什么是 Agent 金融？
Agent 金融是通过自身的链上代币对自主 AI Agent 进行资本化和治理的实践。在 Metaplex 上，Agent 通过 Genesis 联合曲线发行代币并通过 `setAgentTokenV1` 进行绑定，因此收入和创作者费用通过链上原语进行路由。

### Agent 金融与 Agent 商业有何不同？
Agent 金融涵盖 Agent 如何通过其代币进行**资金筹集和治理** — 资本化、国库、持有人对齐。[Agent 商业](/agents/agent-commerce)涵盖 Agent 如何**赚取收入并产生经济活动** — 支付服务费、与其他 Agent 进行交易、参与链上市场。两者共享相同的 Agent 身份、PDA 钱包和 EIP-8004 元数据；金融为 Agent 提供运营资源；商业是 Agent 用这些资源做什么。

### Agent 的钱包如何派生？
Agent 的运营钱包是 Asset Signer — 一个从种子 `["mpl-core-execute", asset]` 派生的 MPL Core PDA。没有私钥。该钱包仅通过 Core 的 [Execute 生命周期钩子](/smart-contracts/core/execute-asset-signing)进行控制，执行者权限通过 [`mpl-agent-tools`](/smart-contracts/mpl-agent/tools) 委托。

### Agent 代币如何绑定到 Agent？
[`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token) 指令将代币铸造地址写入 [`AgentIdentityV2`](/smart-contracts/mpl-agent/identity) PDA 的 `agentToken` 字段。绑定是永久的，并在 Agent 的 EIP-8004 元数据中公开，因此交易对手可以从单一信任来源解析规范代币。

### 为什么使用联合曲线而不是预售或公平发行？
联合曲线无需存款窗口即可立即开始交易，通过恒定乘积曲线提供持续的价格发现，并在完全填满时自动毕业到 Raydium CPMM 池。这为 Agent 代币提供即时流动性以及通往公开市场交易的清晰路径。

### 筹集到的资金会怎么处理？
创作者费用在交易期间累积在联合曲线桶中，可由创作者钱包领取。毕业到 Raydium 后，创作者继续从 CPMM 池中赚取毕业后创作者费用。当 Agent 设置为创作者时，费用直接路由到 Asset Signer PDA。

### 任何 AI Agent 都可以在 Metaplex 上发行代币吗？
是的。任何通过 [`mpl-agent-identity`](/smart-contracts/mpl-agent/identity) 注册的 Agent 都可以发行代币。Agent 需要带有已注册 `AgentIdentityV2` 的 MPL Core 资产，以及用于自主运营的 `ExecutionDelegateRecordV1`。

### 这与在 pump.fun 或其他发射台上的发行有何不同？
Metaplex Agent 代币通过 `AgentIdentityV2` 绑定到可验证的链上身份。Agent 的钱包是无私钥的 PDA，且 `setAgentTokenV1` 绑定是永久且可审计的。通用发射台没有 Agent 身份、Agent 拥有的钱包或执行委托的概念。

## 术语表

Metaplex Agent 金融工作流程中使用的核心术语。

| 术语 | 定义 |
|------|------------|
| **Agent Finance（Agent 金融）** | 通过自身的链上代币对自主 AI Agent 进行资本化和治理的实践 — 资金筹集、国库、持有人对齐 |
| **Agent Commerce（Agent 商业）** | Agent 产生的经济活动 — 支付服务费、与其他 Agent 进行交易、通过有生产力的工作赚取收入（在 [Agent 商业](/agents/agent-commerce)页面中讨论） |
| **Agent Token（Agent 代币）** | 通过 Genesis 联合曲线从 Agent 的 PDA 钱包发行、并通过 `setAgentTokenV1` 永久链接到 Agent 的代币 |
| **`AgentIdentityV2`** | 绑定到 MPL Core 资产的 Metaplex Agent Registry PDA；带有由 `setAgentTokenV1` 设置的 `agentToken: Option<Pubkey>` 字段 |
| **Asset Signer (PDA 钱包)** | 从 `["mpl-core-execute", asset]` 派生的 MPL Core PDA — Agent 的链上钱包，仅通过 Core 的 Execute 钩子进行控制 |
| **`setAgentTokenV1`** | `mpl-agent-identity` 指令，将代币铸造地址写入 `AgentIdentityV2` 的 `agentToken` 字段。一次性且不可逆 |
| **`createAndRegisterLaunch`** | Genesis SDK 调用，创建联合曲线并（当 `agent.setToken: true` 时）原子化地发出 `setAgentTokenV1` |
| **EIP-8004 元数据** | 描述 Agent 的链下 JSON 文档（services、x402 支持、registrations、supportedTrust）；绑定的 `agentToken` 通过 `AgentIdentityV2` PDA 成为此文档的一部分 |
| **Bonding Curve（联合曲线）** | 根据供应量定价代币的恒定乘积 AMM；填满时自动毕业到 Raydium |
| **Graduation（毕业）** | 当曲线上的所有代币都被卖出时，流动性自动迁移到 Raydium CPMM 池 |
| **Executive Profile（执行者档案）** | 通过 `mpl-agent-tools` 注册的、被授权代表 Agent 签署交易的链下运营者的链上身份 |
| **`ExecutionDelegateRecordV1`** | `mpl-agent-tools` 中的每资产 PDA，授权执行者代表 Agent 行动；可由资产所有者撤销 |
| **Creator Fee（创作者费用）** | 定向到创作者钱包（通常是 Agent 的 PDA）的每次联合曲线交换的可配置百分比 |
