---
title: 铸造 Agent
metaTitle: 铸造 Agent | Metaplex
description: 使用 Metaplex API 和 mpl-agent-registry SDK，通过单笔交易创建链上 AI Agent。托管 API 存储 Agent 元数据并返回未签名交易，由您签名并提交。
keywords:
  - mint agent
  - agent registration
  - Metaplex API
  - mpl-agent-registry
  - mintAgent
  - mintAndSubmitAgent
  - Core asset
  - agent identity
  - Solana
about:
  - Agent Registration
  - Metaplex API
  - Solana
programmingLanguage:
  - JavaScript
  - TypeScript
proficiencyLevel: Beginner
created: '03-27-2026'
updated: '03-27-2026'
howToSteps:
  - 安装 mpl-agent-registry 并配置 Umi 实例
  - 携带钱包、Agent 名称、元数据 URI 和 agentMetadata 调用 mintAndSubmitAgent
  - Metaplex API 存储元数据并返回未签名的 Solana 交易
  - 签名并提交交易，将 Core 资产和 Agent 身份注册到链上
howToTools:
  - Node.js
  - Umi framework
  - mpl-agent-registry SDK v0.2.0+
faqs:
  - q: mintAndSubmitAgent 和 mintAgent 有什么区别？
    a: mintAndSubmitAgent 是一个便利封装，调用 mintAgent 后一步完成交易签名和提交。需要手动签名控制、自定义交易发送器或在提交前检查交易时，请直接使用 mintAgent。
  - q: 通过 Metaplex API 铸造与直接使用 registerIdentityV1 有什么区别？
    a: Metaplex API 流程（mintAgent / mintAndSubmitAgent）在单笔交易中同时创建 Core 资产和 Agent 身份，无需预先存在的资产。registerIdentityV1 方式则是将身份插件附加到您已拥有的 Core 资产上。
  - q: 调用 mintAndSubmitAgent 之前需要创建 Core 资产吗？
    a: 不需要。API 在一笔交易中同时完成 Core 资产创建和 Agent 身份注册。您只需提供钱包地址、Agent 名称、元数据 URI 和 agentMetadata 对象。
  - q: uri 字段和 agentMetadata 有什么区别？
    a: uri 直接存储在 Core 资产的链上元数据中，应指向公开托管的 JSON 文件，与标准 NFT 相同。agentMetadata 对象发送给 Metaplex API，与 Agent 记录一起存储在链下。两者都在铸造时设置。
  - q: 上线主网前可以在 devnet 上测试吗？
    a: 可以。在输入中传入 network "solana-devnet"，并将 Umi 实例指向 Solana devnet RPC 端点即可。
  - q: API 返回了交易但链上提交失败会怎样？
    a: 链上交易失败意味着 Core 资产未创建且 Agent 身份未注册。再次调用 mintAgent 获取带有新 blockhash 的新交易，然后重试。
  - q: Metaplex API 支持哪些网络？
    a: 支持 Solana 主网、Solana Devnet、Localnet、Eclipse 主网、Sonic 主网、Sonic Devnet、Fogo 主网和 Fogo 测试网。
  - q: 铸造 Agent 需要多少费用？
    a: 铸造费用包括标准 Solana 交易费用，以及 Core 资产账户和 Agent Identity PDA 的租金。Metaplex API 的铸造不收取额外协议费用。
---

使用 Metaplex API 和 `mpl-agent-registry` SDK，通过单次调用在链上注册 AI Agent。 {% .lead %}

## Summary

Metaplex API 提供托管端点，存储 Agent 元数据并返回未签名的 Solana 交易。对该交易签名并提交后，将创建代表 Agent 的 [MPL Core](/core) 资产，并在单个原子操作中注册 [Agent Identity](/smart-contracts/mpl-agent/identity) PDA。

- **创建** — 在一笔交易中同时创建 MPL Core 资产和 Agent Identity PDA，无需预先存在的资产
- **托管 API** — `https://api.metaplex.com` 负责元数据存储，铸造前无需单独上传
- **两个 SDK 函数** — 一键流程使用 `mintAndSubmitAgent`，手动签名控制使用 `mintAgent`
- **多网络支持** — 支持 Solana 主网·devnet、Eclipse、Sonic 和 Fogo
- **要求** — `@metaplex-foundation/mpl-agent-registry` v0.2.0+

{% callout title="您将构建的内容" %}
一个已注册的链上 AI Agent：通过 Metaplex API 和 `mpl-agent-registry` SDK 创建的、连接了 Agent Identity PDA 的 MPL Core 资产。
{% /callout %}

## 快速开始

1. [了解流程](#how-it-works)
2. [安装 SDK](#installation)
3. [配置 Umi 实例](#umi-setup)
4. [一键铸造并注册](#mint-and-submit-an-agent)
5. [验证结果](#verify-the-result)

## How It Works

通过 Metaplex API 铸造 Agent 是一个由 SDK 协调的三步流程：

1. **API 调用** — SDK 将 Agent 详情发送至 `https://api.metaplex.com` 的 `POST /v1/agents/mint`。API 将 `agentMetadata` 存储在链下并构建未签名的 Solana 交易。
2. **返回未签名交易** — API 返回未签名的交易。您的私钥不会离开您的环境，API 只负责构建指令集。
3. **签名并提交** — 您（或 `mintAndSubmitAgent` 自动）用密钥对为交易签名并提交到网络。链上通过单个原子操作创建 Core 资产并注册 Agent Identity PDA。

### 两个字段，两个存储位置

调用 `mintAndSubmitAgent` 或 `mintAgent` 时，您提供两段不同的元数据：

| 字段 | 存储位置 | 用途 |
|------|---------|------|
| `uri` | 链上（Core 资产元数据中） | 指向公开托管的 JSON 文件，与标准 Core 资产 URI 相同。 |
| `agentMetadata` | 链下（Metaplex API 存储） | 描述 Agent 的功能、服务和信任模型，由注册表索引以供发现。 |

两者均在铸造时设置，不更新 Agent 就无法独立修改。

{% callout type="note" %}
本指南在一笔交易中同时创建新的 Core 资产并注册 Agent 身份。如果您已拥有 Core 资产且只需附加身份，请改用 [`registerIdentityV1`](/agents/register-agent)。
{% /callout %}

## Prerequisites

铸造前需要满足以下条件：

- Node.js 18 或更高版本
- 有余额的 Solana 钱包密钥对（该钱包支付交易费用并成为 Agent 所有者）
- Core 资产 NFT 元数据 JSON 的公开可访问 `uri`

## Installation

安装三个必需的软件包：Agent Registry SDK、核心 Umi 框架，以及提供 RPC 客户端和交易发送器的默认 Umi 包。

```bash {% title="Terminal" %}
npm install @metaplex-foundation/mpl-agent-registry @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults
```

## Umi Setup

[Umi](/umi) 是用于与 Solana 程序交互的 Metaplex JavaScript 框架。调用任何 SDK 函数前，需先配置 RPC 端点和密钥对。

`mplAgentIdentity()` 插件将 Agent Identity 程序的指令构建器和账户反序列化器注册到您的 Umi 实例。没有它，Umi 无法构建或读取 Agent Identity 程序指令。

```typescript {% title="setup.ts" %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { keypairIdentity } from '@metaplex-foundation/umi';
import { mplAgentIdentity } from '@metaplex-foundation/mpl-agent-registry';

// 将 Umi 指向您首选的 RPC
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplAgentIdentity());

// 加载密钥对 — 该钱包支付交易费用并成为 Agent 所有者
const keypair = umi.eddsa.createKeypairFromSecretKey(mySecretKeyBytes);
umi.use(keypairIdentity(keypair));
```

上述示例使用 `keypairIdentity`，即将原始私钥直接加载到 Umi 中。这是服务端脚本和后端集成的标准方式。Umi 还根据环境支持另外两种身份模式：

| 方式 | 方法 | 适用场景 |
|------|------|---------|
| **原始密钥对**（本示例） | `keypairIdentity` + `createKeypairFromSecretKey` | 服务端脚本、后端 |
| **文件系统钱包** | `createSignerFromKeypair` + `signerIdentity`（JSON 密钥文件） | 本地开发和 CLI 工具 |
| **浏览器钱包适配器** | `umi-signer-wallet-adapters` 中的 `walletAdapterIdentity` | Phantom、Backpack 等 Web dApp |

各种方式的完整代码示例，包括如何从 `.json` 文件加载文件系统密钥对以及如何接入钱包适配器，请参阅 Umi 文档中的[连接钱包](/dev-tools/umi/getting-started#connecting-a-wallet)。

## Mint and Submit an Agent

`mintAndSubmitAgent` 调用 Metaplex API，对返回的交易签名，并一步提交到网络。大多数集成场景使用此方式。

{% code-tabs-imported from="agents/mint_and_submit" frameworks="umi" filename="mintAndSubmitAgent" /%}

## Mint an Agent with Manual Signing

`mintAgent` 返回未签名的交易而不提交。需要添加优先费用、使用硬件钱包或集成自定义重试逻辑时使用。

{% code-tabs-imported from="agents/mint_manual" frameworks="umi" filename="mintAgent" /%}

## Verify the Result

铸造后，获取 Core 资产并检查 `AgentIdentity` 插件以确认 Agent 身份已注册。注册成功会附加 Transfer、Update 和 Execute 的生命周期钩子，这些是需要检查的信号。

{% code-tabs-imported from="agents/verify" frameworks="umi" filename="verifyRegistration" /%}

如果 `agentIdentities` 为 undefined 或为空，则身份未注册——交易可能静默失败或未确认。重试前请先在链上检查交易签名。

## Agent Metadata Fields

`agentMetadata` 对象发送给 Metaplex API，与 Agent 记录一起存储在链下。它与 Core 资产的 `uri`（NFT 元数据文件）不同，详情请参阅 [How It Works](#how-it-works)。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `type` | `string` | 是 | 模式标识符，使用 `'agent'`。 |
| `name` | `string` | 是 | Agent 显示名称 |
| `description` | `string` | 是 | Agent 的功能及交互方式 |
| `services` | `AgentService[]` | 否 | Agent 提供的服务端点 |
| `registrations` | `AgentRegistration[]` | 否 | 外部注册表条目链接 |
| `supportedTrust` | `string[]` | 否 | 支持的信任机制，如 `'tee'`、`'reputation'` |

### Agent Service 字段

`services` 中的每个条目描述与 Agent 交互的一种方式。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | `string` | 是 | 服务类型，如 `'trading'`、`'chat'`、`'MCP'`、`'A2A'` |
| `endpoint` | `string` | 是 | 访问服务的 URL |

## Supported Networks

在输入对象中传入 `network` 值。省略时默认为 `'solana-mainnet'`。请确保 Umi RPC 端点与所选网络匹配。

| 网络 | `network` 值 |
|------|-------------|
| Solana 主网 | `solana-mainnet`（默认） |
| Solana Devnet | `solana-devnet` |
| Localnet | `localnet` |
| Eclipse 主网 | `eclipse-mainnet` |
| Sonic 主网 | `sonic-mainnet` |
| Sonic Devnet | `sonic-devnet` |
| Fogo 主网 | `fogo-mainnet` |
| Fogo 测试网 | `fogo-testnet` |

## Devnet Testing

在上线主网前，先在 Solana devnet 上测试集成。将 Umi 实例指向 devnet RPC 并传入 `network: 'solana-devnet'`，API 将在 devnet 集群上注册 Agent。在 devnet 上铸造的 Agent 与主网拥有独立的资产地址，不会出现在主网浏览器中。

{% code-tabs-imported from="agents/devnet" frameworks="umi" filename="devnetTest" /%}

## Custom API Base URL

在配置参数（`mintAgent` 或 `mintAndSubmitAgent` 的第二个参数）中传入 `baseUrl`，可以指向 staging 或自托管 API。用于对接非生产环境时使用。

{% code-tabs-imported from="agents/custom_api_url" frameworks="umi" filename="customApiUrl" /%}

## Custom Transaction Sender

将 `txSender` 函数作为 `mintAndSubmitAgent` 的第四个参数传入，使用自己的签名和提交基础设施。适用于添加 Jito 包小费、优先费用或自定义确认轮询。

{% code-tabs-imported from="agents/custom_sender" frameworks="umi" filename="customSender" /%}

## Error Handling

SDK 导出了带类型的错误守卫，可以明确处理各种失败模式，而不是捕获通用错误。

{% code-tabs-imported from="agents/error_handling" frameworks="umi" filename="errorHandling" /%}

## Common Errors

最常见的失败模式及解决方法。

| 错误 | 原因 | 解决方法 |
|------|------|---------|
| `isAgentValidationError` | 必填输入字段缺失或格式错误 | 检查 `err.field`，确保提供了所有必填的 `agentMetadata` 字段 |
| `isAgentApiNetworkError` | 无法访问 API 端点 | 检查网络连接；查看 `err.cause` 了解底层错误 |
| `isAgentApiError` | API 返回非 2xx 状态码 | 检查 `err.statusCode` 和 `err.responseBody`；确认 `uri` 可公开访问 |
| Blockhash 过期 | 交易在 blockhash 过期前未提交 | 再次调用 `mintAgent` 获取新交易，然后重试提交 |
| 铸造后 `agentIdentities` 为空 | 交易已确认但身份插件未附加 | 获取交易回执确认成功；若静默失败，重试完整铸造流程 |

## Full Example

完整的端到端代码片段——配置、铸造、验证，可直接复制运行。

{% code-tabs-imported from="agents/full_example" frameworks="umi" filename="fullExample" /%}

## Notes

- `mintAndSubmitAgent` 每次调用都会创建新的 Core 资产，没有去重机制。用相同输入调用两次会在两个不同地址创建两个独立的 Agent。
- `uri` 字段存储在 Core 资产的链上元数据中，必须指向可公开访问的 JSON 文档。如果还没有托管的元数据 URI，请先将文件上传到 Arweave 或其他永久存储提供商。
- 如需在不创建新 Core 资产的情况下为现有资产附加 Agent 身份，请改用 [`registerIdentityV1`](/agents/register-agent)。
- Metaplex API 基础 URL 默认为 `https://api.metaplex.com`，无需 API 密钥。
- 铸造费用包括标准 Solana 交易费用以及 Core 资产账户和 Agent Identity PDA 的租金。
- 需要 `@metaplex-foundation/mpl-agent-registry` v0.2.0+。

## FAQ

### `mintAndSubmitAgent` 和 `mintAgent` 有什么区别？
`mintAndSubmitAgent` 是调用 `mintAgent` 后一步完成交易签名和提交的便利封装。需要手动签名控制、自定义交易发送器或在提交前检查交易时，请直接使用 `mintAgent`。

### 通过 Metaplex API 铸造与直接使用 `registerIdentityV1` 有什么区别？
Metaplex API 流程（`mintAgent` / `mintAndSubmitAgent`）在单笔交易中同时创建 Core 资产**和** Agent 身份，无需预先存在的 Core 资产。[`registerIdentityV1`](/agents/register-agent) 方式则是将身份插件附加到您已拥有的 MPL Core 资产上。

### `uri` 字段和 `agentMetadata` 有什么区别？
`uri` 直接存储在 Core 资产的链上元数据中，应指向公开托管的 JSON 文件，与标准 NFT 相同。`agentMetadata` 对象发送给 Metaplex API，与 Agent 记录一起存储在链下。两者都在铸造时设置。详情请参阅 [How It Works](#how-it-works)。

### 调用 `mintAndSubmitAgent` 之前需要创建 Core 资产吗？
不需要。API 同时处理 Core 资产创建和 Agent 身份注册。您只需提供钱包地址、Agent 名称、元数据 URI 和 `agentMetadata` 对象。

### 上线主网前可以在 devnet 上测试吗？
可以。在输入中传入 `network: 'solana-devnet'`，并将 Umi 实例指向 `https://api.devnet.solana.com`。

### API 返回了交易但链上提交失败会怎样？
链上交易失败意味着 Core 资产未创建且 Agent 身份未注册。再次调用 `mintAgent` 获取带有新 blockhash 的新交易，然后重试。

### Metaplex API 支持哪些网络？
Solana 主网、Solana Devnet、Localnet、Eclipse 主网、Sonic 主网、Sonic Devnet、Fogo 主网和 Fogo 测试网。传入的准确值请参阅 [Supported Networks](#supported-networks)。

### 铸造 Agent 需要多少费用？
铸造费用包括标准 Solana 交易费用以及 Core 资产账户和 Agent Identity PDA 的租金。Metaplex API 的铸造不收取额外协议费用。
