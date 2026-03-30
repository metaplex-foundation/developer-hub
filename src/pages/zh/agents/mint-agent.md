---
title: 铸造代理
metaTitle: 在 Solana 上铸造代理 | Metaplex Agent API
description: 使用 Metaplex Agent API 铸造代理 — 通过单次 API 调用创建 MPL Core 资产并注册其身份。
keywords:
  - mint agent
  - Agent API
  - mintAgent
  - mintAndSubmitAgent
  - MPL Core
  - agent registration
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Agent Minting
  - Solana
  - Metaplex
proficiencyLevel: Beginner
created: '03-30-2026'
updated: '03-30-2026'
---

使用 Metaplex Agent API 铸造代理 — 通过单次 API 调用创建 [MPL Core](/smart-contracts/core) 资产并注册其身份。{% .lead %}

## 概述

Metaplex Agent API 提供了一种简化的方式来铸造代理，无需手动创建 Core 资产和单独注册身份。单次 API 调用即可返回一个未签名的交易，用于创建资产并在链上注册身份。

- **单次 API 调用** — `mintAgent` 返回未签名交易；`mintAndSubmitAgent` 在一步中完成签名和发送
- 使用提供的名称和元数据 URI **创建 Core 资产**
- 使用代理元数据（服务、信任机制、注册）**注册身份**
- **多网络** — 支持 Solana mainnet/devnet、Eclipse、Sonic 和 Fogo 网络
- **需要** `@metaplex-foundation/mpl-agent-registry` SDK

## 快速开始

1. [安装 SDK](#安装-sdk) — 添加代理注册表包
2. [使用 mintAndSubmitAgent 铸造](#使用-mintandsubmitagent-一键铸造) — 注册代理的最快路径
3. [使用 mintAgent 分步签名](#使用-mintagent-分步签名) — 用于自定义签名流程
4. [代理元数据](#代理元数据) — 链上元数据载荷的结构

## 学习内容

本指南展示如何：

- 使用 Metaplex API 通过单次函数调用铸造代理
- 配置包含服务和信任机制的代理元数据
- 处理 API 返回的错误
- 指定不同的 SVM 网络

## 安装 SDK

```shell
npm install @metaplex-foundation/mpl-agent-registry @metaplex-foundation/umi-bundle-defaults
```

## 使用 mintAndSubmitAgent 一键铸造

`mintAndSubmitAgent` 函数调用 API，对返回的交易进行签名，然后发送到网络：

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mintAndSubmitAgent } from '@metaplex-foundation/mpl-agent-registry';

const umi = createUmi('https://api.mainnet-beta.solana.com');

const result = await mintAndSubmitAgent(umi, {}, {
  wallet: umi.identity.publicKey,
  name: 'My AI Agent',
  uri: 'https://example.com/agent-metadata.json',
  agentMetadata: {
    type: 'agent',
    name: 'My AI Agent',
    description: 'An autonomous agent that executes DeFi strategies on Solana.',
    services: [
      { name: 'web', endpoint: 'https://myagent.ai' },
      { name: 'A2A', endpoint: 'https://myagent.ai/agent-card.json' },
    ],
    registrations: [],
    supportedTrust: ['reputation'],
  },
});

console.log('Agent minted! Asset:', result.assetAddress);
console.log('Signature:', result.signature);
```

### 参数

| 参数 | 必填 | 说明 |
|-----------|----------|-------------|
| `wallet` | 是 | 代理所有者的钱包公钥（用于签名交易） |
| `name` | 是 | Core 资产的显示名称 |
| `uri` | 是 | Core 资产的元数据 URI |
| `agentMetadata` | 是 | 链上代理元数据（见[代理元数据](#代理元数据)） |
| `network` | 否 | 目标网络（默认为 `solana-mainnet`） |

### 返回值

| 字段 | 类型 | 说明 |
|-------|------|-------------|
| `signature` | `Uint8Array` | 交易签名 |
| `assetAddress` | `string` | 铸造代理的 Core 资产地址 |

## 使用 mintAgent 分步签名

`mintAgent` 函数返回用于自定义签名流程的未签名交易 — 当需要添加额外签名者或使用硬件钱包时很有用：

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mintAgent, signAndSendAgentTransaction } from '@metaplex-foundation/mpl-agent-registry';

const umi = createUmi('https://api.mainnet-beta.solana.com');

// Step 1: Get the unsigned transaction from the API
const mintResult = await mintAgent(umi, {}, {
  wallet: umi.identity.publicKey,
  name: 'My AI Agent',
  uri: 'https://example.com/agent-metadata.json',
  agentMetadata: {
    type: 'agent',
    name: 'My AI Agent',
    description: 'An autonomous agent.',
    services: [],
    registrations: [],
    supportedTrust: [],
  },
});

console.log('Asset address:', mintResult.assetAddress);

// Step 2: Sign and send
const signature = await signAndSendAgentTransaction(umi, mintResult);
```

### mintAgent 返回值

| 字段 | 类型 | 说明 |
|-------|------|-------------|
| `transaction` | `Transaction` | 反序列化的可签名 Umi 交易 |
| `blockhash` | `BlockhashWithExpiryBlockHeight` | 用于交易有效性的 blockhash |
| `assetAddress` | `string` | Core 资产地址 |

## 代理元数据

`agentMetadata` 对象描述代理的功能，作为链上注册的一部分存储：

```typescript
interface AgentMetadata {
  type: string;              // e.g., 'agent'
  name: string;              // Display name
  description: string;       // What the agent does
  services: AgentService[];  // Service endpoints
  registrations: AgentRegistration[];  // External registry links
  supportedTrust: string[];  // Trust mechanisms
}

interface AgentService {
  name: string;      // Service type: 'web', 'A2A', 'MCP', etc.
  endpoint: string;  // Service URL
}

interface AgentRegistration {
  agentId: string;       // Agent identifier
  agentRegistry: string; // Registry identifier
}
```

完整字段参考请参阅[注册代理 — 代理注册文档](/agents/register-agent#代理注册文档)。

## API 配置

传递 `AgentApiConfig` 对象作为第二个参数来自定义 API 端点或 fetch 实现：

| 选项 | 默认值 | 说明 |
|--------|---------|-------------|
| `baseUrl` | `https://api.metaplex.com` | Metaplex API 的基础 URL |
| `fetch` | `globalThis.fetch` | 自定义 fetch 实现（适用于 Node.js 或测试） |

```typescript
const result = await mintAndSubmitAgent(
  umi,
  { baseUrl: 'https://api.metaplex.com' },
  input
);
```

## 支持的网络

`network` 参数控制代理铸造在哪个 SVM 网络上：

| Network ID | 说明 |
|------------|-------------|
| `solana-mainnet` | Solana Mainnet（默认） |
| `solana-devnet` | Solana Devnet |
| `localnet` | 本地验证器 |
| `eclipse-mainnet` | Eclipse Mainnet |
| `sonic-mainnet` | Sonic Mainnet |
| `sonic-devnet` | Sonic Devnet |
| `fogo-mainnet` | Fogo Mainnet |
| `fogo-testnet` | Fogo Testnet |

## 错误处理

API 客户端会抛出可以捕获和检查的类型化错误：

| 错误类型 | 说明 |
|------------|-------------|
| `AgentApiError` | HTTP 响应错误 — 包含 `statusCode` 和 `responseBody` |
| `AgentApiNetworkError` | 网络连接问题 — 包含底层 `cause` |
| `AgentValidationError` | 客户端验证失败 — 包含失败的 `field` |

```typescript
import {
  isAgentApiError,
  isAgentApiNetworkError,
} from '@metaplex-foundation/mpl-agent-registry';

try {
  const result = await mintAndSubmitAgent(umi, {}, input);
} catch (err) {
  if (isAgentApiError(err)) {
    console.error('API error:', err.statusCode, err.responseBody);
  } else if (isAgentApiNetworkError(err)) {
    console.error('Network error:', err.cause.message);
  }
}
```

## 注意事项

- Metaplex API 在单个交易中完成 Core 资产创建和身份注册。无需单独调用 `registerIdentityV1`。
- `uri` 参数指向 Core 资产的元数据（名称、图片等），而 `agentMetadata` 包含代理特定的注册数据（服务、信任机制）。
- `mintAgent` 返回的交易包含 blockhash，必须在 blockhash 过期前（约 60-90 秒）签名并提交。
- 如需不使用 API 的手动注册，请参阅[注册代理](/agents/register-agent)。
