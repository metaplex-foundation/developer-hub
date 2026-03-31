---
title: 创建代理
metaTitle: 在 Solana 上创建代理 | Metaplex Agent Registry
description: 在 Solana 上创建和注册代理——使用 Metaplex Agent API 进行一步式流程，或手动注册现有 MPL Core 资产。
keywords:
  - create agent
  - mint agent
  - register agent
  - Agent API
  - agent identity
  - MPL Core
  - AgentIdentity plugin
  - ERC-8004
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Agent Creation
  - Agent Registration
  - Solana
  - Metaplex
proficiencyLevel: Beginner
created: '03-30-2026'
updated: '03-30-2026'
---

在 Solana 上创建和注册代理——使用 Metaplex Agent API 进行一步式流程，或使用 `registerIdentityV1` 手动注册现有的 [MPL Core](/smart-contracts/core) 资产。{% .lead %}

## 概述

创建代理意味着铸造一个 MPL Core 资产并将链上身份记录绑定到该资产。Metaplex Agent API 可以在单笔交易中完成这两个操作。如果您已有 Core 资产，可以直接使用链上指令注册身份。

- **API 路径（推荐）** — `mintAndSubmitAgent` 在一次调用中创建资产并注册身份
- **手动路径** — `registerIdentityV1` 将身份绑定到现有 Core 资产
- **身份记录** — 从资产公钥派生的 PDA，带有 `AgentIdentity` 插件和生命周期钩子
- **注册文档** — 遵循 [ERC-8004](https://eips.ethereum.org/EIPS/eip-8004) 规范的链下 JSON，描述代理的服务和元数据
- **需要** `@metaplex-foundation/mpl-agent-registry` SDK

## 快速开始

1. [安装 SDK](#install-the-sdk) — 添加代理注册包
2. [使用 API 铸造](#mint-an-agent-with-the-api) — 注册代理的最快路径（推荐）
3. [注册现有资产](#register-an-existing-asset) — 适用于已有 MPL Core 资产的用户
4. [代理注册文档](#agent-registration-document) — 链下元数据的结构
5. [验证注册](#verify-registration) — 确认身份已附加

## Install the SDK

```shell
npm install @metaplex-foundation/mpl-agent-registry @metaplex-foundation/umi-bundle-defaults
```

## 使用 API 铸造代理

Metaplex Agent API 在单笔交易中创建 MPL Core 资产并注册其身份。这是新代理的推荐路径。

### 一次调用铸造并提交

`mintAndSubmitAgent` 函数调用 API、签署返回的交易并将其发送到网络：

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

#### mintAndSubmitAgent 参数

| 参数 | 必填 | 描述 |
|-----------|----------|-------------|
| `wallet` | 是 | 代理所有者的钱包公钥（用于签署交易） |
| `name` | 是 | Core 资产的显示名称 |
| `uri` | 是 | Core 资产的元数据 URI |
| `agentMetadata` | 是 | 链上代理元数据（参见[代理注册文档](#agent-registration-document)） |
| `network` | 否 | 目标网络（默认为 `solana-mainnet`） |

#### mintAndSubmitAgent 返回值

| 字段 | 类型 | 描述 |
|-------|------|-------------|
| `signature` | `Uint8Array` | 交易签名 |
| `assetAddress` | `string` | 铸造代理的 Core 资产地址 |

### 使用单独签名步骤铸造

`mintAgent` 函数返回未签名的交易，用于自定义签名流程——当您需要额外签名者或硬件钱包时很有用：

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

#### mintAgent 返回值

| 字段 | 类型 | 描述 |
|-------|------|-------------|
| `transaction` | `Transaction` | 准备签名的反序列化 Umi 交易 |
| `blockhash` | `BlockhashWithExpiryBlockHeight` | 用于交易有效性的 blockhash |
| `assetAddress` | `string` | Core 资产地址 |

### API 配置

传递 `AgentApiConfig` 对象作为第二个参数来自定义 API 端点或 fetch 实现：

| 选项 | 默认值 | 描述 |
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

### 支持的网络

`network` 参数控制代理在哪个 SVM 网络上铸造：

| Network ID | 描述 |
|------------|-------------|
| `solana-mainnet` | Solana 主网（默认） |
| `solana-devnet` | Solana Devnet |
| `localnet` | 本地验证器 |
| `eclipse-mainnet` | Eclipse 主网 |
| `sonic-mainnet` | Sonic 主网 |
| `sonic-devnet` | Sonic Devnet |
| `fogo-mainnet` | Fogo 主网 |
| `fogo-testnet` | Fogo 测试网 |

### API 错误处理

API 客户端会抛出类型化错误，您可以捕获和检查：

| 错误类型 | 描述 |
|------------|-------------|
| `AgentApiError` | HTTP 响应错误——包含 `statusCode` 和 `responseBody` |
| `AgentApiNetworkError` | 网络连接问题——包含底层 `cause` |
| `AgentValidationError` | 客户端验证失败——包含失败的 `field` |

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

## 注册现有资产

如果您已有 MPL Core 资产，使用 `registerIdentityV1` 指令直接绑定身份记录——无需 API。

{% callout type="note" %}
如果您还没有资产，请改用[上方的 API 路径](#mint-an-agent-with-the-api)。它会在单笔交易中创建资产并注册身份。
{% /callout %}

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplAgentIdentity } from '@metaplex-foundation/mpl-agent-registry';
import { registerIdentityV1 } from '@metaplex-foundation/mpl-agent-registry';

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplAgentIdentity());

await registerIdentityV1(umi, {
  asset: assetPublicKey,
  collection: collectionPublicKey,
  agentRegistrationUri: 'https://example.com/agent-registration.json',
}).sendAndConfirm(umi);
```

### registerIdentityV1 参数

| 参数 | 描述 |
|-----------|-------------|
| `asset` | 要注册的 MPL Core 资产 |
| `collection` | 资产的集合（可选） |
| `agentRegistrationUri` | 指向链下代理注册元数据的 URI |
| `payer` | 支付租金和费用（默认为 `umi.payer`） |
| `authority` | 集合权限（默认为 `payer`） |

### 完整手动示例

```typescript
import { generateSigner } from '@metaplex-foundation/umi';
import { create, createCollection } from '@metaplex-foundation/mpl-core';
import { registerIdentityV1 } from '@metaplex-foundation/mpl-agent-registry';

// 1. Create a collection
const collection = generateSigner(umi);
await createCollection(umi, {
  collection,
  name: 'Agent Collection',
  uri: 'https://example.com/collection.json',
}).sendAndConfirm(umi);

// 2. Create an asset
const asset = generateSigner(umi);
await create(umi, {
  asset,
  name: 'My Agent',
  uri: 'https://example.com/agent.json',
  collection,
}).sendAndConfirm(umi);

// 3. Register identity
await registerIdentityV1(umi, {
  asset: asset.publicKey,
  collection: collection.publicKey,
  agentRegistrationUri: 'https://example.com/agent-registration.json',
}).sendAndConfirm(umi);
```

## 代理注册文档

`agentRegistrationUri`（手动路径）或 `agentMetadata`（API 路径）描述代理的身份、服务和元数据。格式遵循针对 Solana 改编的 [ERC-8004](https://eips.ethereum.org/EIPS/eip-8004)。将 JSON（及任何关联的图片）上传到永久存储提供商如 Arweave，以便公开访问。

```json
{
  "type": "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
  "name": "Plexpert",
  "description": "An informational agent providing help related to Metaplex protocols and tools.",
  "image": "https://arweave.net/agent-avatar-tx-hash",
  "services": [
    {
      "name": "web",
      "endpoint": "https://metaplex.com/agent/<ASSET_PUBKEY>"
    },
    {
      "name": "A2A",
      "endpoint": "https://metaplex.com/agent/<ASSET_PUBKEY>/agent-card.json",
      "version": "0.3.0"
    },
    {
      "name": "MCP",
      "endpoint": "https://metaplex.com/agent/<ASSET_PUBKEY>/mcp",
      "version": "2025-06-18"
    }
  ],
  "active": true,
  "registrations": [
    {
      "agentId": "<MINT_ADDRESS>",
      "agentRegistry": "solana:101:metaplex"
    }
  ],
  "supportedTrust": [
    "reputation",
    "crypto-economic"
  ]
}
```

### 字段

| 字段 | 必填 | 描述 |
|-------|----------|-------------|
| `type` | 是 | Schema 标识符。使用 `https://eips.ethereum.org/EIPS/eip-8004#registration-v1`。 |
| `name` | 是 | 人类可读的代理名称 |
| `description` | 是 | 代理的自然语言描述——它做什么、如何工作以及如何与之交互 |
| `image` | 是 | 头像或标志 URI |
| `services` | 否 | 代理公开的服务端点数组（见下方） |
| `active` | 否 | 代理是否当前处于活动状态（`true`/`false`） |
| `registrations` | 否 | 链接回此代理身份的链上注册数组 |
| `supportedTrust` | 否 | 代理支持的信任模型（例如 `reputation`、`crypto-economic`、`tee-attestation`） |

### Services

每个服务条目描述与代理交互的一种方式：

| 字段 | 必填 | 描述 |
|-------|----------|-------------|
| `name` | 是 | 服务类型——例如 `web`、`A2A`、`MCP`、`OASF`、`DID`、`email` |
| `endpoint` | 是 | 可以访问服务的 URL 或标识符 |
| `version` | 否 | 协议版本 |
| `skills` | 否 | 代理通过此服务公开的技能数组 |
| `domains` | 否 | 代理运行的领域数组 |

### Registrations

每个注册条目链接回一个链上身份记录：

| 字段 | 必填 | 描述 |
|-------|----------|-------------|
| `agentId` | 是 | 代理的 mint 地址 |
| `agentRegistry` | 是 | 常量注册标识符——使用 `solana:101:metaplex` |

## 验证注册

```typescript
import { fetchAsset } from '@metaplex-foundation/mpl-core';

const assetData = await fetchAsset(umi, assetPublicKey);

// Check the AgentIdentity plugin
const agentIdentity = assetData.agentIdentities?.[0];
console.log(agentIdentity?.uri);               // your registration URI
console.log(agentIdentity?.lifecycleChecks?.transfer);  // truthy
console.log(agentIdentity?.lifecycleChecks?.update);    // truthy
console.log(agentIdentity?.lifecycleChecks?.execute);   // truthy
```

## 链接 Genesis Token

注册身份后，您可以选择使用 `setAgentTokenV1` 将 [Genesis](/smart-contracts/genesis) token 链接到代理。这会将代币发行与代理的链上身份关联。Genesis 账户必须使用 `Mint` 资金模式。

```typescript
import { setAgentTokenV1 } from '@metaplex-foundation/mpl-agent-registry';

await setAgentTokenV1(umi, {
  asset: asset.publicKey,
  genesisAccount: genesisAccountPublicKey,
}).sendAndConfirm(umi);
```

{% callout type="note" %}
代理 token 每个身份只能设置一次。此指令的 `authority` 必须是资产的 [Asset Signer](/smart-contracts/core/execute-asset-signing) PDA。完整账户详情请参阅 [Agent Identity](/smart-contracts/mpl-agent/identity#instruction-setagenttokenv1) 参考文档。
{% /callout %}

## 注意事项

- Metaplex API 在单笔交易中创建 Core 资产并注册身份。使用 API 时不需要单独调用 `registerIdentityV1`。
- `uri` 参数（API 路径）指向 Core 资产的元数据（名称、图片等），而 `agentMetadata` 包含代理特定的注册数据（服务、信任机制）。
- `mintAgent` 返回的交易包含 blockhash，必须在 blockhash 过期前签名并提交（大约 60-90 秒）。
- 通过 `registerIdentityV1` 注册是每个资产的一次性操作。对已注册的资产调用将会失败。
- `agentRegistrationUri` 应指向永久托管的 JSON（例如 Arweave）。如果 URI 变得不可访问，链上身份仍然存在，但客户端无法获取代理的元数据。
- `collection` 参数是可选的但建议使用——它在注册期间启用集合级别的权限检查。
- Transfer、Update 和 Execute 的生命周期钩子会自动附加。这些钩子允许身份插件参与审批或拒绝资产上的操作。
- 通过 `setAgentTokenV1` 链接 Genesis token 是可选的，可以在注册后的任何时间完成。

*由 [Metaplex](https://github.com/metaplex-foundation) 维护 · 最后验证于 2026 年 3 月*
