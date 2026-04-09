---
title: 快速入门
metaTitle: MPL 代理注册表快速入门 | Metaplex
description: 安装 MPL 代理注册表 SDK 并在 Solana 上注册您的第一个代理身份。
keywords:
  - MPL Agent Registry
  - getting started
  - agent identity SDK
  - Umi
  - Solana
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Smart Contracts
  - Solana
  - Metaplex
proficiencyLevel: Beginner
created: '02-25-2026'
updated: '03-12-2026'
---

安装 SDK 并注册您的第一个代理身份。{% .lead %}

## Summary

安装 `@metaplex-foundation/mpl-agent-registry` 包，使用 `mplAgentIdentity()` 和 `mplAgentTools()` 插件配置 Umi，并在 MPL Core 资产上注册第一个代理身份。

- **安装** — 通过 npm 安装 SDK，并使用 `mplAgentIdentity()` 和 `mplAgentTools()` 配置 Umi
- **创建** — 如果还没有 MPL Core 集合和资产，先创建它们
- **注册** — 使用 `registerIdentityV1` 注册身份，并验证附加的 `AgentIdentity` 插件
- **需要** — `@metaplex-foundation/umi-bundle-defaults` 和 `@metaplex-foundation/mpl-core`

## 安装

```shell
npm install @metaplex-foundation/mpl-agent-registry
```

## 设置

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplCore } from '@metaplex-foundation/mpl-core';
import { mplAgentIdentity, mplAgentTools } from '@metaplex-foundation/mpl-agent-registry';

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplCore())
  .use(mplAgentIdentity())
  .use(mplAgentTools());
```

## 注册身份

您需要一个 MPL Core 资产。如果还没有，请先创建：

```typescript
import { generateSigner } from '@metaplex-foundation/umi';
import { create, createCollection } from '@metaplex-foundation/mpl-core';
import {
  registerIdentityV1,
  findAgentIdentityV1Pda,
  fetchAgentIdentityV1,
} from '@metaplex-foundation/mpl-agent-registry';

// 创建集合和资产
const collection = generateSigner(umi);
const asset = generateSigner(umi);

await createCollection(umi, {
  collection,
  name: 'Agent Collection',
  uri: 'https://example.com/collection.json',
}).sendAndConfirm(umi);

await create(umi, {
  asset,
  name: 'My Agent',
  uri: 'https://example.com/agent.json',
  collection,
}).sendAndConfirm(umi);

// 使用指向代理元数据的 URI 注册身份
await registerIdentityV1(umi, {
  asset: asset.publicKey,
  collection: collection.publicKey,
  agentRegistrationUri: 'https://example.com/agent-registration.json',
}).sendAndConfirm(umi);

// 验证
const pda = findAgentIdentityV1Pda(umi, { asset: asset.publicKey });
const identity = await fetchAgentIdentityV1(umi, pda);
console.log(identity.asset); // 与 asset.publicKey 匹配
```

## 验证 AgentIdentity 插件

注册后，资产将附带带有 URI 和生命周期检查的 `AgentIdentity` 插件：

```typescript
import { fetchAsset } from '@metaplex-foundation/mpl-core';

const assetData = await fetchAsset(umi, asset.publicKey);

// 检查 AgentIdentity 插件
const agentIdentity = assetData.agentIdentities?.[0];
console.log(agentIdentity?.uri);               // 'https://example.com/agent-registration.json'
console.log(agentIdentity?.lifecycleChecks?.transfer);  // truthy
console.log(agentIdentity?.lifecycleChecks?.update);    // truthy
console.log(agentIdentity?.lifecycleChecks?.execute);   // truthy
```

## 下一步

- **[代理身份](/smart-contracts/mpl-agent/identity)** — 身份程序的完整详情
- **[代理工具](/smart-contracts/mpl-agent/tools)** — 执行档案和执行委托

*由 [Metaplex](https://github.com/metaplex-foundation) 维护 · 最后验证于 2026 年 3 月 · [在 GitHub 上查看源代码](https://github.com/metaplex-foundation/mpl-agent)*
