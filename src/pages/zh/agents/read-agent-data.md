---
title: 读取代理数据
metaTitle: 在 Solana 上读取代理数据 | Metaplex Agent Registry
description: 在 Solana 上验证代理注册并读取代理身份数据。
keywords:
  - read agent data
  - agent identity
  - AgentIdentity plugin
  - Asset Signer
  - agent wallet
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Agent Data
  - Solana
  - Metaplex
proficiencyLevel: Beginner
created: '02-25-2026'
updated: '03-12-2026'
---

[注册](/agents/register-agent)后在链上读取和验证代理身份数据。{% .lead %}

## 概述

读取代理身份数据、验证注册状态、检查 AgentIdentity 插件、获取链下注册文档以及派生代理的内置钱包地址。

- 使用 `safeFetchAgentIdentityV1` **检查注册** — 对未注册资产返回 `null`
- 直接在获取的 Core 资产上**检查 AgentIdentity 插件**的 URI 和生命周期钩子
- 从链上 URI **获取注册文档**以读取代理元数据和服务端点
- 使用 `findAssetSignerPda` **派生代理钱包** — 一个无私钥的 PDA 持有代理资金

## 检查注册

安全获取方法在身份不存在时返回 `null` 而不是抛出异常，这对于检查资产是否已注册很有用：

```typescript
import { safeFetchAgentIdentityV1, findAgentIdentityV1Pda } from '@metaplex-foundation/mpl-agent-registry';

const pda = findAgentIdentityV1Pda(umi, { asset: assetPublicKey });
const identity = await safeFetchAgentIdentityV1(umi, pda);

console.log('Registered:', identity !== null);
```

## 从种子获取

您也可以直接从资产的公钥获取身份，无需手动派生 PDA：

```typescript
import { fetchAgentIdentityV1FromSeeds } from '@metaplex-foundation/mpl-agent-registry';

const identity = await fetchAgentIdentityV1FromSeeds(umi, {
  asset: assetPublicKey,
});
```

## 验证 AgentIdentity 插件

注册会将 `AgentIdentity` 插件附加到 Core 资产。您可以直接从获取的资产中读取它来检查注册 URI 和生命周期钩子：

```typescript
import { fetchAsset } from '@metaplex-foundation/mpl-core';

const assetData = await fetchAsset(umi, assetPublicKey);

const agentIdentity = assetData.agentIdentities?.[0];
console.log(agentIdentity?.uri);               // registration URI
console.log(agentIdentity?.lifecycleChecks?.transfer);  // truthy
console.log(agentIdentity?.lifecycleChecks?.update);    // truthy
console.log(agentIdentity?.lifecycleChecks?.execute);   // truthy
```

## 读取注册文档

`AgentIdentity` 插件上的 `uri` 指向一个包含代理完整配置文件（名称、描述、服务端点等）的链下 JSON 文档。像其他 URI 一样获取它：

```typescript
import { fetchAsset } from '@metaplex-foundation/mpl-core';

const assetData = await fetchAsset(umi, assetPublicKey);
const agentIdentity = assetData.agentIdentities?.[0];

if (agentIdentity?.uri) {
  const response = await fetch(agentIdentity.uri);
  const registration = await response.json();

  console.log(registration.name);          // "Plexpert"
  console.log(registration.description);   // "An informational agent..."
  console.log(registration.active);        // true

  for (const service of registration.services) {
    console.log(service.name);             // "web", "A2A", "MCP", etc.
    console.log(service.endpoint);         // service URL
    console.log(service.version);          // protocol version (if set)
  }
}
```

该文档遵循 [ERC-8004](https://eips.ethereum.org/EIPS/eip-8004) 代理注册标准。典型示例如下：

```json
{
  "type": "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
  "name": "An informational agent providing help related to Metaplex protocols and tools.",
  "description": "An autonomous agent that executes DeFi strategies on Solana.",
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
    }
  ],
  "active": true,
  "registrations": [
    {
      "agentId": "<MINT_ADDRESS>",
      "agentRegistry": "solana:101:metaplex"
    }
  ],
  "supportedTrust": ["reputation", "crypto-economic"]
}
```

完整字段参考请参阅[注册代理](/agents/register-agent#agent-registration-document)。

## 获取代理钱包

每个 Core 资产都有一个称为 **Asset Signer** 的内置钱包——从资产公钥派生的 PDA。不存在私钥，因此无法被盗。钱包可以持有 SOL、代币或任何其他资产。使用 `findAssetSignerPda` 派生地址：

```typescript
import { findAssetSignerPda } from '@metaplex-foundation/mpl-core';

const assetSignerPda = findAssetSignerPda(umi, { asset: assetPublicKey });

const balance = await umi.rpc.getBalance(assetSignerPda);
console.log('Agent wallet:', assetSignerPda);
console.log('Balance:', balance.basisPoints.toString(), 'lamports');
```

地址是确定性的，因此任何人都可以从资产的公钥派生它来发送资金或检查余额。只有资产本身才能通过委托的[执行者](/agents/run-an-agent)经由 Core 的 [Execute](/smart-contracts/core/execute-asset-signing) 指令为此钱包签名。

有关账户布局、PDA 派生详情和错误代码，请参阅 [MPL Agent Registry](/smart-contracts/mpl-agent) 智能合约文档。

## 注意事项

- Asset Signer 是一个 PDA——不存在私钥。它可以从任何来源接收资金，但只有资产本身才能通过 Core 的 [Execute](/smart-contracts/core/execute-asset-signing) 指令签署发出的交易。
- `safeFetchAgentIdentityV1` 对未注册资产返回 `null` 而不是抛出异常，使其可以安全地用于无需 try/catch 的存在性检查。
- `findAssetSignerPda` 确定性地派生钱包地址。无论网络如何都返回相同的地址，因此您可以使用相同的资产密钥在 devnet 和 mainnet 上使用它。

*由 Metaplex 维护 · 2026 年 3 月验证 · [在 GitHub 上查看源码](https://github.com/metaplex-foundation/mpl-agent)*
