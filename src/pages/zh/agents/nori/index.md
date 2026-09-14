---
title: Nori - 面向 Metaplex Agent 的按量付费服务
metaTitle: Nori - 面向 Agent 的按量付费 LLM、图像与 RPC 服务 | Metaplex
description: Nori 是 Metaplex 的服务 Agent，向其他 Agent 出售 LLM 推理、图像生成和 Solana RPC 访问，按次调用以 SOL 计量结算。了解 delegate-pay（委托支付）计费的运作方式，以及如何将 Nori 用作构建您自己的服务 Agent 的参考实现。
keywords:
  - Nori
  - service agent
  - agent plumber
  - pay-as-you-go inference
  - delegate-pay
  - x402 payments
  - A2A protocol
  - agent-to-agent services
  - Metaplex agent
about:
  - Nori
  - Agent Commerce
  - Autonomous Agents
  - Solana
  - Metaplex
proficiencyLevel: Intermediate
created: '07-08-2026'
updated: '07-08-2026'
faqs:
  - q: 什么是 Nori？
    a: Nori 是由 Metaplex Foundation 运营的按量付费服务 Agent。它向其他 Agent 出售 LLM 推理、图像生成和 Solana RPC 访问，以美元定价，按次调用以 SOL 从调用方 Agent 的链上 PDA 钱包结算。它同时也是构建 Metaplex 服务 Agent 的开源参考实现。
  - q: 使用 Nori 需要我自己的 LLM 提供商 API 密钥吗？
    a: 不需要。Nori 持有上游提供商的密钥（Anthropic、OpenAI、Google、图像生成、付费 Solana RPC）。消费方 Agent 只需要一个 Solana 密钥对和一个已注册的 Agent 资产 — 每次调用都按使用量以 SOL 从 Agent 的 PDA 钱包结算。
  - q: 如果 Nori 宕机，我的 Agent 会怎样？
    a: 依赖 Nori 提供推理、图像或 RPC 的已委托 Agent 在 Nori 不可用期间会失去这些能力。Nori 的接口是 OpenAI 兼容格式和标准 Solana JSON-RPC，因此应急后备方案是使用您自己的密钥将客户端指向任何其他 OpenAI 兼容提供商或 RPC 端点。自托管您自己的 Nori 实例计划在 v2 中提供。
  - q: 委托给 Nori 安全吗？Nori 会掏空我的钱包吗？
    a: 委托授予 Nori 对您 Agent 的 PDA 钱包的计费权限，因此那里只应保留工作余额。每笔扣费都附带可供审计的链上 Memo 收据，只有成功的调用才会被扣费，并且资产所有者可以随时撤销委托，这会硬停止 delegate-pay 轨道。
  - q: delegate-pay 轨道和 x402 轨道有什么区别？
    a: Delegate-pay 是主轨道 — 完成一次性链上委托后，Nori 按次调用直接从您 Agent 的 PDA 扣费，没有支付往返。x402 是未委托调用方的后备轨道 — 第一次请求返回带支付要求的 HTTP 402，调用方支付后重试。
---

Nori 是由 Metaplex Foundation 运营的按量付费**服务 Agent**。它向其他 Agent 出售 LLM 推理、图像生成和 Solana RPC 访问 — 以美元定价，按次调用以 SOL 从调用方 Agent 的链上钱包结算。Nori 同时也是 Metaplex 服务 Agent 的开源参考实现：Agent 构建者可以研究（并复制）它的 [A2A 接口](/agents/agent-commerce)、delegate-pay（委托支付）计费、x402 后备方案和费率卡模式。{% .lead %}

## 概述

Nori 免除了每个 Agent 运营者原本需要自行搭建的基础设施 — LLM 提供商密钥、图像生成账户、付费 Solana RPC 和按次调用计费。消费方 Agent 只需要一个 Solana 密钥对和一个[已注册的 Agent 资产](/agents/register-agent)。

- **三项计量服务** — `chat.completion`（Anthropic / OpenAI / Google，支持工具调用）、`image.generation`（gpt-image-1）和 `solana.rpc`（RPC + DAS 透传）
- **两条支付轨道** — [delegate-pay](/agents/nori/delegate-to-nori)（主轨道，一次性链上设置）和 x402 v2（后备轨道，按次调用的 HTTP 402 流程）
- **成功后计费（charge-on-success）** — 先运行上游调用；失败的调用永不扣费，每笔扣费都附带链上 Memo 收据
- **单点故障注意事项** — 已委托的 Agent 在推理、图像和 RPC 上依赖 Nori 的可用性；缓解措施参见 [Nori 作为单点故障](#nori-作为单点故障)

{% callout type="note" title="两类读者，一个页面" %}
如果您正在从自己的 Agent **消费** Nori 的服务，或者您正在**构建服务 Agent**并希望获得 A2A 技能、按次调用计费和费率卡发布的可运行参考，请使用本节。[源代码仓库](https://github.com/metaplex-foundation/agent-plumber)是开源的。
{% /callout %}

## Nori 提供的服务

Nori 通过共享同一处理器栈的两个接口暴露三项服务。技能的输入/输出对聊天和图像使用规范的 OpenAI 线格式，对 RPC 使用标准 Solana JSON-RPC — A2A 调用方和 OpenAI-SDK 调用方发送的负载逐字节相同。

| 服务 | 技能 ID | 端点 | 上游 |
|---------|----------|----------|----------|
| LLM 推理（支持工具调用） | `chat.completion` | `POST /v1/chat/completions` | Anthropic、OpenAI、Google — 按 `<provider>/<model>` 前缀路由 |
| 图像生成 | `image.generation` | `POST /v1/images/generations` | OpenAI gpt-image-1 |
| Solana RPC + DAS | `solana.rpc` | `POST /v1/solana/rpc` | 运营者配置的 RPC 提供商（DAS 方法透传） |

两个接口都能访问相同的服务：

- **OpenAI 兼容 HTTP**（`/v1/*`）— 通过 `baseURL` 将任何 OpenAI SDK 或 AI 框架指向 Nori。这是大多数消费方 Agent 使用的接口。
- **A2A JSON-RPC**（`/a2a`）— 程序化的 Agent 间调用。发现从 `GET /.well-known/agent-card.json` 开始，它公布技能、支付方案以及 Nori 的 `serviceExecutiveAddress`（您注册为委托方的地址）。

## Nori 支付的运作方式

Nori 按次调用选择一条支付轨道：调用方已接入时使用 delegate-pay，否则使用 x402。

| 轨道 | 何时触发 | 如何结算 |
|------|---------------|----------------|
| **Delegate-pay**（主轨道） | 调用方出示有效的 Bearer 令牌，且 Nori 是调用方 Agent 资产上已注册的[执行委托方](/smart-contracts/mpl-agent/tools) | Nori 签署一笔 MPL Core Execute 交易，将 SOL 从调用方的 PDA 转移到 Nori 的服务 PDA，并附带 Memo 收据 — 无支付往返 |
| **x402 v2**（后备轨道） | 无 Bearer 令牌、令牌无效或未设置委托 | 第一次请求返回带支付要求的 HTTP 402；调用方支付（SOL 或 USDC）后重试，并收到缓存的结果 |

Delegate-pay 轨道使 Nori 对您 Agent 的最终用户而言不可见：完成[一次性委托](/agents/nori/delegate-to-nori)后，每次调用都自动结算，没有钱包提示，也没有超额报价的预扣。定价发布在带版本号的[费率卡](/agents/nori/pricing-and-billing)上，并附有价格变更通知政策。

## Nori 作为单点故障

推理、图像生成和 RPC 都来自 Nori 的已委托 Agent，等于把 Nori 变成了单点故障：如果 Nori 不可用，该 Agent 会失去这些能力，直到 Nori 恢复。这是 Nori 自身风险登记册中排名第一的风险，v1 的缓解措施是文档和可移植接口，而非冗余。

请明确地为此做好规划：

- **接口在设计上是可移植的。** `chat.completion` 是规范的 OpenAI 线格式，`solana.rpc` 是标准 Solana JSON-RPC。应急（break-glass）后备方案只是一次配置变更：将您的 OpenAI 兼容客户端指向另一个提供商（使用您自己的密钥），将您的 RPC 调用指向任何公共或付费端点。
- **保留应急凭证。** 零 BYOK 是 Nori 提供的便利，不是您架构的必要条件。储备一个低配额的提供商密钥和一个免费 RPC URL，可以让您的 Agent 在 Nori 中断期间降级运行而不至瘫痪。
- **x402 轨道是支付层面的独立后备，而非可用性层面的。** 它消除了对委托的依赖，但仍然依赖 Nori 处于运行状态。
- **委托随时可撤销。** 如果您迁移离开 Nori，资产所有者撤销委托记录后，delegate-pay 轨道会[硬停止](/agents/nori/pricing-and-billing#硬停止语义)。

{% callout type="warning" title="自托管推迟到 v2" %}
运行您自己的 Nori 实例（彻底消除共享依赖）计划在 v2 中提供。在 v1 中，缓解措施是上述可移植的 OpenAI/JSON-RPC 接口 — 在设计您的 Agent 时，把 Nori 的基础 URL 当作一个配置值，而不是一个假设。
{% /callout %}

## 将 Nori 用作参考实现

Nori 是 Metaplex 服务 Agent 的可运行蓝图 — 一个向其他 Agent 收费提供工作的 Agent。[源代码仓库](https://github.com/metaplex-foundation/agent-plumber)端到端地演示了每种模式：

| 模式 | Nori 演示的内容 |
|---------|------------------------|
| Agent 卡片发现 | `/.well-known/agent-card.json` 公布技能、支付方案、`serviceAssetAddress` 和 `serviceExecutiveAddress` |
| Delegate-pay 计费 | 通过 MPL Core Execute CPI 从调用方的 PDA 扣费并附带 Memo 收据，配合 5 分钟委托状态缓存 |
| x402 v2 后备 | 规范的 HTTP 402 流程，配备协调方端点（`/verify`、`/settle`），并由协调方担任 feePayer，使调用方无需 SOL 支付网络费用 |
| 费率卡发布 | `GET /rate-card` 提供带版本号的价目表及通知期政策 |
| 成功后计费核算 | 先上游调用，后扣费；失败的调用返回错误且不扣费 |
| 免费委托接入 | 经过严格验证的 `POST /v1/delegate/submit`，作为费用支付方共同签署调用方的委托交易 |

要在您自己的分叉中添加新的付费服务：编写一个与支付无关、返回结果加 `costUsd` 的处理器，将定价加入价目表，将其接入 A2A 技能分发，并在 Agent 卡片上声明它。

## 快速参考

| 项目 | 值 |
|------|-------|
| Agent 卡片 | `GET /.well-known/agent-card.json` |
| 费率卡 | `GET /rate-card` |
| 服务 | `chat.completion`、`image.generation`、`solana.rpc` |
| OpenAI 兼容基础 URL | `<NORI_URL>/v1` |
| A2A 端点 | `POST /a2a`（JSON-RPC 2.0，`message/send`） |
| 支付轨道 | Delegate-pay（主轨道）、x402 v2（后备轨道） |
| 委托程序 | `mpl-agent-tools` — `TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S` |
| 源代码 | [GitHub](https://github.com/metaplex-foundation/agent-plumber) |

## 注意事项

- Nori 部署后的基础 URL 通过其 Agent 注册发布；本节各处的示例使用 `NORI_URL` 作为基础 URL 的占位符
- 扣费以美元定价，并在扣费时使用 Jupiter 的实时 SOL/USD 价格（30 秒缓存）转换为 SOL — 参见[定价与计费](/agents/nori/pricing-and-billing)
- 委托授予 Nori 对您 Agent 的 PDA 钱包的计费权限。那里只保留工作余额，并审计每笔扣费的 Memo 收据
- `message/sendStream` 在 Agent 卡片上有声明，但在 v1 中返回 501；A2A 调用是同步的
- Nori（托管的 Metaplex 服务）和 agent-plumber（开源实现）是同一代码库；本文档统一使用“Nori”指代两者

由 Metaplex Foundation 维护。最后验证日期：2026-07-08。

## FAQ

关于 Nori 的常见问题。

### 什么是 Nori？
Nori 是由 Metaplex Foundation 运营的按量付费服务 Agent。它向其他 Agent 出售 LLM 推理、图像生成和 Solana RPC 访问，以美元定价，按次调用以 SOL 从调用方 Agent 的链上 PDA 钱包结算。它同时也是构建 Metaplex 服务 Agent 的开源参考实现。

### 使用 Nori 需要我自己的 LLM 提供商 API 密钥吗？
不需要。Nori 持有上游提供商的密钥（Anthropic、OpenAI、Google、图像生成、付费 Solana RPC）。消费方 Agent 只需要一个 Solana 密钥对和一个[已注册的 Agent 资产](/agents/register-agent) — 每次调用都按使用量以 SOL 从 Agent 的 PDA 钱包结算。

### 如果 Nori 宕机，我的 Agent 会怎样？
依赖 Nori 提供推理、图像或 RPC 的已委托 Agent 在 Nori 不可用期间会失去这些能力。Nori 的接口是 OpenAI 兼容格式和标准 Solana JSON-RPC，因此应急后备方案是使用您自己的密钥将客户端指向任何其他 OpenAI 兼容提供商或 RPC 端点。自托管您自己的 Nori 实例计划在 v2 中提供。

### 委托给 Nori 安全吗？Nori 会掏空我的钱包吗？
委托授予 Nori 对您 Agent 的 PDA 钱包的计费权限，因此那里只应保留工作余额。每笔扣费都附带可供审计的链上 Memo 收据，[只有成功的调用才会被扣费](/agents/nori/pricing-and-billing#成功后计费核算)，并且资产所有者可以随时[撤销委托](/agents/nori/delegate-to-nori#从-nori-撤销委托)，这会硬停止 delegate-pay 轨道。

### delegate-pay 轨道和 x402 轨道有什么区别？
Delegate-pay 是主轨道 — 完成一次性链上委托后，Nori 按次调用直接从您 Agent 的 PDA 扣费，没有支付往返。x402 是未委托调用方的后备轨道 — 第一次请求返回带支付要求的 HTTP 402，调用方支付（SOL 或 USDC）后重试。

## 术语表

Nori 文档中使用的核心术语。

| 术语 | 定义 |
|------|------------|
| **Nori** | Metaplex Foundation 的按量付费服务 Agent，同时也是 Metaplex 服务 Agent 的参考实现（agent-plumber） |
| **服务 Agent（Service agent）** | 向其他 Agent 出售服务并按次调用收费的 Agent |
| **Delegate-pay（委托支付）** | Nori 的主支付轨道 — 完成一次性执行委托后，Nori 通过 MPL Core Execute 交易直接从调用方的 PDA 扣费 |
| **x402** | 用于机器对机器支付的 HTTP `402 Payment Required` 协议；Nori 面向未委托调用方的后备轨道 |
| **费率卡（Rate card）** | Nori 在 `GET /rate-card` 发布的价目表 — 带版本号、以美元计价，并附价格变更通知政策 |
| **成功后计费（Charge-on-success）** | Nori 的计费规则：先运行上游调用，只有成功的调用才会被扣费 |
| **硬停止（Hard stop）** | 当调用方取消委托或调用方的 PDA 钱包无法覆盖一笔扣费时，delegate-pay 服务立即终止 |
| **Asset Signer（PDA 钱包）** | Agent 的链上钱包，从 `["mpl-core-execute", asset]` 派生的 [MPL Core](/smart-contracts/core) PDA — Nori 扣费的来源账户 |
| **执行者配置文件（Executive profile）** | [`mpl-agent-tools`](/smart-contracts/mpl-agent/tools) 中链下签名者的链上身份；您委托给 Nori 的执行者配置文件 |
| **Agent 卡片（Agent card）** | 位于 `/.well-known/agent-card.json` 的 A2A 发现文档，公布技能、支付方案和 Nori 的服务地址 |
