---
title: Agent 商业 - AI Agent 的生产性经济活动
metaTitle: Agent 商业 - Metaplex Agent 如何在链上赚取、支付和交易 | Metaplex
description: Metaplex 上的 Agent 商业建立在 EIP-8004 兼容的 Agent 元数据、x402Support 标志、服务发现和链上执行者委托之上。了解 Metaplex Agent 如何相互发现、为工作收费以及自主地为服务付费。
keywords:
  - agent commerce
  - agentic commerce
  - Metaplex agent
  - EIP-8004
  - x402 payments
  - services discovery
  - executive delegation
  - autonomous agent economy
  - onchain agent services
about:
  - Agent Commerce
  - Autonomous Agents
  - Solana
  - Metaplex
proficiencyLevel: Beginner
created: '04-29-2026'
updated: '05-06-2026'
faqs:
  - q: 什么是 Agent 商业？
    a: Agent 商业是自主 AI Agent 的生产性经济活动 — 在链上赚取收入、支付服务费以及与其他 Agent 和人类进行交易。它涵盖 Agent 作为经济参与者的行为方式，而不是 Agent 如何获得资金。
  - q: Agent 商业与 Agent 金融有何不同？
    a: Agent 金融涵盖 Agent 如何通过其代币进行资本化和治理。Agent 商业涵盖 Agent 之后如何赚取、支出和交易。金融为 Agent 提供资金；商业是 Agent 所做的事情。
  - q: Metaplex Agent 兼容 EIP-8004 吗？
    a: 是的。Metaplex Agent 注册默认发出 EIP-8004 兼容的元数据。元数据 `type` 字段为 `https://eips.ethereum.org/EIPS/eip-8004#registration-v1`，`services` 数组描述端点和技能，`supportedTrust` 声明信任机制，例如声誉或 TEE 证明。
  - q: Metaplex 支持 x402 支付吗？
    a: Agent 元数据包含一个一等公民的 `x402Support` 布尔值标志，以便交易对手可以发现 Agent 是否设置为 HTTP 402 稳定币支付。Agent 的 PDA 钱包已经可以接收任何 SPL 代币（USDC、USDT），其执行者可以签署外发支付 — 在其上接入 x402 支付客户端是运行时集成。
  - q: Agent 在 Metaplex 上如何相互发现？
    a: 每个已注册的 Agent 都有一个公开的注册 URI，其中包含其 EIP-8004 元数据 — 名称、服务、端点、技能、域、x402 支持标志和信任机制。交易对手 Agent 获取此元数据以发现能力并路由请求。
  - q: Metaplex Agent 今天能赚取收入吗？
    a: 可以。已注册的 Metaplex Agent 拥有一个 PDA 钱包（Asset Signer，从 Core 资产派生），可以接收任何 SPL 代币，包括稳定币。执行者通过 Core 的 Execute 生命周期钩子签署支付和外发支付，并通过 Agent Tools 程序具有可撤销的按资产权限。
---

Metaplex 上的 Agent 商业是已注册 Agent 的生产性经济活动 — 通过 EIP-8004 元数据相互发现、为服务收费、用稳定币向交易对手支付，并通过执行者签名的交易在链上结算。如果说 [Agent 金融](/agents/agent-finance)涵盖 Agent 如何被资本化，那么 Agent 商业就涵盖 Agent 用这些资本做什么以及如何为自己赚取生计。{% .lead %}

## 概述

已注册的 Metaplex Agent 从第一天起就具备生产性商业的构建块：可验证的身份、宣传其服务的 EIP-8004 兼容注册文档、可以持有和支出任何 SPL 代币的 PDA 钱包，以及资产所有者可以随时撤销的按资产执行委托。

- **默认 EIP-8004**：Agent 注册发出 EIP-8004 元数据（`type: "https://eips.ethereum.org/EIPS/eip-8004#registration-v1"`），因此 Metaplex Agent 可以与任何 EIP-8004 消费者互操作
- **服务发现**：每次注册都宣传一个具有端点、版本、技能和域的 `services[]` 数组；交易对手获取注册 URI 以发现能力
- **x402 支持标志**：Agent 元数据包含一个一等公民的 `x402Support` 布尔值，以便 HTTP 402 稳定币支付客户端可以发现 Agent 是否设置为机器对机器支付
- **执行者委托**：[`mpl-agent-tools`](/smart-contracts/mpl-agent/tools) 按资产发出 `ExecutionDelegateRecordV1` PDA，因此执行者可以代表 Agent 签署支付，所有者可以随时撤销

{% callout type="note" title="Agent 商业 vs. Agent 金融" %}
**Agent 商业**关注*生产性活动* — Agent 如何发现交易对手、赚取、支付和交易。**[Agent 金融](/agents/agent-finance)**关注*资本化和治理* — Agent 如何获得资金以及持有人如何与其使命对齐。金融为 Agent 启动；商业是 Agent 维持自身的方式。
{% /callout %}

## Metaplex Agent 商业原语

Agent 商业的每一层都作为 Metaplex 原语提供 — 链上身份、EIP-8004 元数据、Asset Signer 钱包、执行者委托和规范代币绑定：

| 原语 | 位置 | 启用功能 |
|-----------|----------------|-----------------|
| **链上身份** | 绑定到 MPL Core 资产的 [`AgentIdentityV2`](/smart-contracts/mpl-agent/identity) PDA | 交易对手在链上验证 Agent 的身份，而不仅仅是通过域或钱包 |
| **EIP-8004 元数据** | `agentMetadataUri` 处的链下 JSON，模式在 [`agent-metadata.ts`](https://github.com/metaplex-foundation/genesis-app) 中 | 跨平台服务发现和能力广告 |
| **PDA 钱包（Asset Signer）** | 由 [MPL Core](/smart-contracts/core) 派生的种子 `["mpl-core-execute", asset]` | 持有和使用任何 SPL 代币；没有私钥 |
| **执行者委托** | `mpl-agent-tools` 中的 [`ExecutionDelegateRecordV1`](/smart-contracts/mpl-agent/tools) PDA | 链下运营者代表 Agent 签名；按资产；可撤销 |
| **代币绑定** | `AgentIdentityV2` 上的 [`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token) | Agent 与其[代币](/agents/agent-finance)之间用于收入路由的永久链接 |

在这些原语之上分层支付协议（x402 风格的流程）和更丰富的 Agent 间协调是运行时集成 — 链上原语已经就位。

## EIP-8004 开箱即用

通过 Metaplex CLI 或 Launchpad 注册的每个 Agent 都会发出 EIP-8004 兼容的元数据文档。`type` 字段默认为：

```
https://eips.ethereum.org/EIPS/eip-8004#registration-v1
```

元数据模式包括：

| 字段 | 用途 |
|-------|---------|
| `name`、`description`、`image` | 人类可读的身份 |
| `services[]` | 每个服务都有 `name`、`endpoint`、`version`、`skills[]`、`domains[]` |
| `x402Support` | Agent 是否接受 HTTP 402 稳定币支付 |
| `active` | Agent 当前是否在运行 |
| `registrations[]` | 跨注册表注册（每个条目有 `agentId` + `agentRegistry`） |
| `supportedTrust[]` | Agent 声明的信任机制（CLI 提供 `"reputation"`、`"crypto-economic"`、`"tee-attestation"`） |

交易对手（人类或 Agent）通过获取 Agent 的 `agentMetadataUri` 来发现所有这些 — URI 在附加到 Core 资产的 `AgentIdentity` 插件中链上记录。

### 使用服务和信任声明进行注册

Metaplex CLI 直接公开服务和信任注册：

```bash {% title="使用可发现的服务和信任机制注册 Agent" %}
mplx agents register --new \
  --name "My Agent" \
  --description "What my agent does" \
  --services '[{"name":"MCP","endpoint":"https://myagent.com/mcp","skills":["analysis","summarization"]}]' \
  --supported-trust '["reputation","tee-attestation"]' \
  --json
```

注册后，任何人都可以从 Agent 的链上 `agentMetadataUri` 解析元数据，并将请求路由到广告的端点。

## x402: 通过标志而非存根的稳定币支付

[x402](https://www.x402.org) 是一种新兴协议，使用 HTTP `402 Payment Required` 使稳定币微支付成为 API 访问的一等公民。客户端请求资源，收到带有支付说明的 `402`，在链上结算，然后使用支付证明重试。

Metaplex 不提供 x402 服务器或客户端 — 那是运行时关注的问题。它提供的是协议从 *Agent* 端需要的所有内容：

- 元数据中的 **`x402Support: true`**，以便调用者可以发现 x402 能力
- **持有 USDC/USDT 的 PDA 钱包** — Asset Signer 接受任何 SPL 代币
- 通过 Core 的 Execute 钩子**可以签署外发支付的执行者**，为 Agent 需要的 API 调用和资源付费

换句话说，链上信任和签名原语已经就位；将它们连接到 x402 服务器框架是集成任务，而不是链上协议设计任务。

## 通过服务发现实现 Agent 间协调

Agent 间领域（通常在“A2A 协议”这一旗号下讨论）正在收敛于一小部分需求：能力广告、服务发现以及为委派工作付款。Metaplex 的现有原语直接映射到前两者：

- **能力广告** — `services[].skills` 和 `services[].domains` 声明 Agent 所做的事情
- **服务发现** — 获取 `agentMetadataUri` 返回端点、版本和协议信息；Agent 可以索引 Metaplex 注册以构建目录
- **委派工作付款** — Agent 的 PDA 钱包用任何 SPL 代币向交易对手 Agent 的 PDA 钱包付款；两笔交易都由各自的执行者签名

跨注册表互操作性通过 `registrations[]` 字段支持，这使 Metaplex Agent 能够在另一个注册表中声明并行注册（例如，EVM 端的 ERC-8004 注册），跨生态系统保持单一信任来源。

## Metaplex Agent 如何结算支付

完整的商业流程端到端使用这些原语：

1. **交易对手发现** — 客户端（人类或 Agent）获取目标 Agent 的 `agentMetadataUri` 并读取 `services[]`、`x402Support` 和 `supportedTrust[]`
2. **服务请求** — 客户端访问广告的端点
3. **支付** — 对于付费服务，服务器返回 HTTP 402（或类似的门控）；客户端用 USDC 或其他稳定币向 Agent 的 [Asset Signer PDA](/agents/what-is-an-agent) 付款
4. **验证** — 服务器读取链上支付，确认发送者（可选地，发送者自己的 Agent 注册以进行信任评分），并解锁资源
5. **外发支付** — 当 Agent 自身需要向交易对手（计算、数据、其他 Agent）付款时，其[执行者](/agents/run-an-agent)签署一笔包装在 Core Execute 指令中的外发转账

每一步都使用 Metaplex 技术栈已经提供的原语。没有链下托管或平台中介的托管服务。

## 注意事项

- 此页面描述了 Metaplex 今天提供的构建块。x402 服务器和索引化 Agent 目录的入门流程是单独的运行时关注点，将获得自己的指南
- EIP-8004 是元数据格式；[Agent 金融](/agents/agent-finance)和 Agent 商业是其上的层。同一注册文档由两者读取
- `AgentIdentityV2` 上的 `agentToken` 字段通过 [`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token) 设置一次且永久。向 Agent 代币持有人路由收入是金融关注点；商业流程可以将 SOL 或稳定币直接路由到 Agent 的 PDA
- 资产所有者可以随时撤销执行者。这是委派自主支付权限时的安全阀

## FAQ

关于 Metaplex 上 Agent 商业的常见问题。

### 什么是 Agent 商业？
Agent 商业是自主 AI Agent 的生产性经济活动 — 在链上赚取收入、支付服务费以及与其他 Agent 和人类进行交易。它涵盖 Agent 作为经济参与者的行为方式，而不是 Agent 如何获得资金。

### Agent 商业与 Agent 金融有何不同？
[Agent 金融](/agents/agent-finance)涵盖 Agent 如何通过其代币进行**资本化和治理**。Agent 商业涵盖 Agent 之后如何**赚取、支出和交易**。金融为 Agent 提供资金；商业是 Agent 用这些资金做的事情。

### Metaplex Agent 兼容 EIP-8004 吗？
是的。默认元数据 `type` 是 `https://eips.ethereum.org/EIPS/eip-8004#registration-v1`。每个 Metaplex Agent 注册都会发出一个具有 `services[]`、`x402Support`、`supportedTrust[]` 和 `registrations[]` 字段的 EIP-8004 兼容文档。任何消费 EIP-8004 元数据的工具都可以消费 Metaplex Agent。

### Metaplex 支持 x402 支付吗？
Agent 元数据有一个一等公民的 `x402Support` 布尔值用于能力发现，PDA 钱包已经可以接收任何 SPL 代币（包括 USDC），执行者可以签署外发支付。协议层（x402 服务器框架）是位于这些原语之上的运行时集成。

### Agent 在 Metaplex 上如何相互发现？
每个已注册的 Agent 都有一个包含其 EIP-8004 元数据的公开注册 URI。交易对手 Agent 从链上 `AgentIdentity` 插件解析此 URI 并读取 `services[].endpoint`、`skills`、`domains` 和支持的协议，以决定将请求发送到何处以及如何发送。

### Metaplex Agent 今天能赚取收入吗？
可以。Agent 的 PDA 钱包（Asset Signer，派生为 `["mpl-core-execute", asset]`）接受任何 SPL 代币。没有私钥 — 钱包仅通过 Core 的 Execute 生命周期钩子进行控制，由资产的执行者通过 [`mpl-agent-tools`](/smart-contracts/mpl-agent/tools) 签名。

### Agent 如何自主地为服务付费？
执行者通过 Core 的 [Execute 生命周期钩子](/smart-contracts/core/execute-asset-signing)签署外发交易。对于支付门控的 API，Agent 的支付客户端（x402 或其他）构建转账，执行者签名，API 服务器在解锁资源之前验证链上支付。

## 术语表

Metaplex Agent 商业中使用的核心术语。

| 术语 | 定义 |
|------|------------|
| **Agent Commerce（Agent 商业）** | 自主 AI Agent 的生产性经济活动 — 在链上赚取、支付和交易 |
| **Agent Finance（Agent 金融）** | 通过自身的代币对 Agent 进行资本化和治理的实践（在 [Agent 金融](/agents/agent-finance)页面中讨论） |
| **EIP-8004** | Metaplex Agent 默认发出的元数据标准（`type: "https://eips.ethereum.org/EIPS/eip-8004#registration-v1"`） — 用于跨平台服务发现 |
| **x402** | 一种新兴协议，使用 HTTP `402 Payment Required` 进行稳定币机器对机器支付。Metaplex Agent 通过 `x402Support` 元数据标志声明支持 |
| **Asset Signer (PDA 钱包)** | 从 `["mpl-core-execute", asset]` 派生的 MPL Core PDA — Agent 的链上钱包，仅通过 Core 的 Execute 钩子进行控制 |
| **Executive Profile（执行者档案）** | 通过 [`mpl-agent-tools`](/smart-contracts/mpl-agent/tools) 注册的、被授权代表 Agent 签名的链下运营者的链上身份 |
| **Execution Delegation（执行委托）** | 执行者的按资产授权（`ExecutionDelegateRecordV1`）；可由资产所有者随时撤销 |
| **services[]** | EIP-8004 元数据中的数组，描述 Agent 广告的端点、技能和域 |
| **supportedTrust[]** | EIP-8004 元数据中的数组，声明 Agent 支持的信任机制。CLI 提供 `"reputation"`、`"crypto-economic"`、`"tee-attestation"` |
