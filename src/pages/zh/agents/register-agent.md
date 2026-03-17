---
title: 注册代理
metaTitle: 在 Solana 上注册代理 | Metaplex 014 Agent Registry
description: 通过将身份记录绑定到 MPL Core 资产，在 Metaplex 014 代理注册表上注册代理身份。
keywords:
  - register agent
  - agent identity
  - MPL Core
  - AgentIdentity plugin
  - ERC-8004
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Agent Registration
  - Solana
  - Metaplex
proficiencyLevel: Beginner
created: '02-25-2026'
updated: '03-12-2026'
---

通过将身份记录绑定到 MPL Core 资产，在 Metaplex 014 代理注册表上注册代理。{% .lead %}

## 概述

`registerIdentityV1` 指令将链上身份记录绑定到 MPL Core 资产，创建可发现的 PDA 并附加 Transfer、Update 和 Execute 的生命周期钩子。

- 从资产公钥派生 PDA 以实现链上可发现性
- 将带有生命周期钩子的 `AgentIdentity` 插件**附加**到 Core 资产
- **链接**到遵循 [ERC-8004](https://eips.ethereum.org/EIPS/eip-8004) 的链下注册文档以获取代理元数据
- **需要**现有的 MPL Core 资产和 `@metaplex-foundation/mpl-agent-registry` SDK

## 快速开始

1. [前提条件](#前提条件) — 获取 MPL Core 资产并安装 SDK
2. [注册代理](#注册代理-1) — 调用 `registerIdentityV1` 绑定身份
3. [代理注册文档](#代理注册文档) — 创建链下元数据 JSON
4. [验证注册](#验证注册) — 确认身份已附加
5. [完整示例](#完整示例) — 端到端代码示例

## 学习内容
本指南展示如何注册代理，包括：

- 链接到 MPL Core 资产的身份记录
- 使代理在链上可发现的 PDA（Program Derived Address）
- 带有 Transfer、Update 和 Execute 生命周期钩子的 AgentIdentity 插件

## 前提条件

注册前需要一个 MPL Core 资产。如果还没有，请参阅[创建 NFT](/nfts/create-nft)。有关身份程序本身的更多信息，请参阅 [MPL Agent Registry](/smart-contracts/mpl-agent) 文档。

## 注册代理

注册会从资产的公钥派生创建 PDA，并附加带有 Transfer、Update 和 Execute 生命周期钩子的 `AgentIdentity` 插件。PDA 使代理可被发现——任何人都可以从资产地址派生它并检查是否存在已注册的身份。

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

## 参数

| 参数 | 说明 |
|-----------|-------------|
| `asset` | 要注册的 MPL Core 资产 |
| `collection` | 资产的集合（可选） |
| `agentRegistrationUri` | 指向链下代理注册元数据的 URI |
| `payer` | 支付租金和费用（默认为 `umi.payer`） |
| `authority` | 集合权限（默认为 `payer`） |

## 代理注册文档

`agentRegistrationUri` 指向描述代理身份、服务和元数据的 JSON 文档。格式遵循适配 Solana 的 [ERC-8004](https://eips.ethereum.org/EIPS/eip-8004)。将 JSON（及任何相关图片）上传到 Arweave 等永久存储提供商以使其公开可访问。有关程序化上传，请参阅此[指南](/smart-contracts/mpl-hybrid/guides/create-deterministic-metadata-with-turbo)。

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

| 字段 | 必填 | 说明 |
|-------|----------|-------------|
| `type` | 是 | 模式标识符。使用 `https://eips.ethereum.org/EIPS/eip-8004#registration-v1`。 |
| `name` | 是 | 人类可读的代理名称 |
| `description` | 是 | 代理的自然语言描述——它做什么、如何工作以及如何交互 |
| `image` | 是 | 头像或标志 URI |
| `services` | 否 | 代理公开的服务端点数组（见下文） |
| `active` | 否 | 代理当前是否处于活跃状态（`true`/`false`） |
| `registrations` | 否 | 链接回代理身份的链上注册数组 |
| `supportedTrust` | 否 | 代理支持的信任模型（例如 `reputation`、`crypto-economic`、`tee-attestation`） |

### 服务

每个服务条目描述与代理交互的方式：

| 字段 | 必填 | 说明 |
|-------|----------|-------------|
| `name` | 是 | 服务类型——例如 `web`、`A2A`、`MCP`、`OASF`、`DID`、`email` |
| `endpoint` | 是 | 可以访问服务的 URL 或标识符 |
| `version` | 否 | 协议版本 |
| `skills` | 否 | 代理通过此服务公开的技能数组 |
| `domains` | 否 | 代理运营的域数组 |

### 注册

每个注册条目链接回链上身份记录：

| 字段 | 必填 | 说明 |
|-------|----------|-------------|
| `agentId` | 是 | 代理的铸造地址 |
| `agentRegistry` | 是 | 固定注册表标识符——使用 `solana:101:metaplex` |

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

## 完整示例

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

## 注意事项

- 注册是每个资产一次性的操作。对已注册的资产调用 `registerIdentityV1` 将失败。
- `agentRegistrationUri` 应指向永久托管的 JSON（例如 Arweave）。如果 URI 变得不可访问，链上身份仍然存在，但客户端将无法获取代理的元数据。
- `collection` 参数是可选的但建议使用——它在注册时启用集合级别的权限检查。
- Transfer、Update 和 Execute 的生命周期钩子会自动附加。这些钩子允许身份插件参与批准或拒绝对资产的操作。

*由 Metaplex 维护 · 2026 年 3 月验证 · [在 GitHub 上查看源码](https://github.com/metaplex-foundation/mpl-agent)*
