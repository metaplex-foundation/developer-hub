---
title: 运行代理
metaTitle: 在 Solana 上运行代理 | Metaplex Agent Registry
description: 设置执行者配置文件并委托执行，以在 Solana 上运行自主代理。
keywords:
  - run agent
  - executive profile
  - execution delegation
  - Agent Tools
  - autonomous agent
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Execution Delegation
  - Solana
  - Metaplex
proficiencyLevel: Intermediate
created: '03-11-2026'
updated: '03-30-2026'
---

设置执行者配置文件并委托执行，以在 Solana 上运行代理。{% .lead %}

## 概述

执行委托允许链下执行者代表代理资产签署交易，弥合链上身份与链下操作之间的差距。

- **注册执行者配置文件** — 每个钱包一次性的链上设置，创建可验证的运营者身份
- **委托执行** — 资产所有者通过链上委托记录将其代理链接到特定执行者
- **验证委托** — 派生委托记录 PDA 并检查账户是否存在
- **需要**一个[已注册的代理](/agents/register-agent)和 `@metaplex-foundation/mpl-agent-registry` 包（v0.2.0+）

## 快速开始

1. [为什么需要委托](#为什么需要委托) — 了解委托解决的问题
2. [注册执行者配置文件](#注册执行者配置文件) — 每个钱包一次性设置
3. [委托执行](#委托执行) — 将代理链接到执行者
4. [验证委托](#验证委托) — 确认委托记录存在
5. [撤销委托](#撤销委托) — 移除执行者的权限
6. [完整示例](#完整示例) — 端到端代码示例

## 为什么需要委托

每个 Core 资产都有一个内置钱包（[Asset Signer](/smart-contracts/core/execute-asset-signing)）——一个没有私钥的 PDA，这意味着它不会被盗。只有资产本身才能通过 Core 的 Execute 生命周期钩子为该钱包签名。

问题在于 Solana 不支持后台任务或链上推理。代理无法自行唤醒并提交交易。必须由链下的某个东西来执行。但代理所有者也不应该必须坐在电脑前批准每个操作。

执行委托弥合了这一差距。所有者委托给一个**执行者**——一个受信任的链下运营者，使用 Execute 钩子代表代理签署交易。所有者控制谁来运行他们的代理，而无需为每笔交易保持在线。

## 什么是执行者？

执行者是一个链上配置文件，代表被授权运营代理资产的钱包。可以将其视为服务账户：您将钱包注册为执行者一次，然后各个代理所有者可以将执行委托给它。

这将**身份**（代理是谁）与**执行**（谁来运营）分离。执行者配置文件是从钱包公钥派生的 PDA——每个钱包一个。委托是按资产进行的：代理所有者创建一个将其代理链接到特定执行者的委托记录。一个执行者可以运行许多代理，所有者可以在不触及代理身份的情况下切换执行者。

每个执行者配置文件都存在于链上，因此注册表充当可验证的目录。任何人都可以枚举配置文件，查看执行者运营哪些代理，并检查委托历史。这为执行者根据其链上记录进行评级的声誉层奠定了基础。

## 前提条件

您需要一个具有身份记录和 AgentIdentity 插件的[已注册代理](/agents/register-agent)，以及 `@metaplex-foundation/mpl-agent-registry` 包（v0.2.0+）。

## 注册执行者配置文件

在执行者运行任何代理之前，它需要一个配置文件。这是每个钱包一次性的设置：

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplAgentTools } from '@metaplex-foundation/mpl-agent-registry';
import { registerExecutiveV1 } from '@metaplex-foundation/mpl-agent-registry';

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplAgentTools());

await registerExecutiveV1(umi, {
  payer: umi.payer,
}).sendAndConfirm(umi);
```

配置文件 PDA 从种子 `["executive_profile", <authority>]` 派生，因此每个钱包只能有一个。

## 委托执行

执行者配置文件就位后，代理资产所有者可以将执行委托给它。这将在链上创建一个将代理链接到执行者的委托记录：

```typescript
import { delegateExecutionV1 } from '@metaplex-foundation/mpl-agent-registry';
import { findAgentIdentityV1Pda, findExecutiveProfileV1Pda } from '@metaplex-foundation/mpl-agent-registry';

const agentIdentity = findAgentIdentityV1Pda(umi, { asset: agentAssetPublicKey });
const executiveProfile = findExecutiveProfileV1Pda(umi, { authority: executiveAuthorityPublicKey });

await delegateExecutionV1(umi, {
  agentAsset: agentAssetPublicKey,
  agentIdentity,
  executiveProfile,
}).sendAndConfirm(umi);
```

只有资产所有者可以委托执行。程序验证：

- 执行者配置文件存在
- 代理资产是有效的 MPL Core 资产
- 代理具有已注册的身份
- 签名者是资产所有者

## 参数

### RegisterExecutiveV1

| 参数 | 说明 |
|-----------|-------------|
| `payer` | 支付租金和费用（也用作权限） |
| `authority` | 拥有此执行者配置文件的钱包（默认为 `payer`） |

### DelegateExecutionV1

| 参数 | 说明 |
|-----------|-------------|
| `agentAsset` | 已注册代理的 MPL Core 资产 |
| `agentIdentity` | 资产的代理身份 PDA |
| `executiveProfile` | 要委托的执行者配置文件 PDA |
| `payer` | 支付租金和费用（默认为 `umi.payer`） |
| `authority` | 必须是资产所有者（默认为 `payer`） |

## 验证委托

要检查委托是否存在，派生委托记录 PDA 并查看账户是否存在：

```typescript
import {
  findExecutiveProfileV1Pda,
  findExecutionDelegateRecordV1Pda,
} from '@metaplex-foundation/mpl-agent-registry';

const executiveProfile = findExecutiveProfileV1Pda(umi, {
  authority: executiveAuthorityPublicKey,
});

const delegateRecord = findExecutionDelegateRecordV1Pda(umi, {
  executiveProfile,
  agentAsset: agentAssetPublicKey,
});

const account = await umi.rpc.getAccount(delegateRecord);
console.log('Delegated:', account.exists);
```

## 撤销委托

`revokeExecutionV1` 指令通过关闭委托记录账户来移除执行者的权限。关闭账户的租金将退还到指定的目标地址。

**资产所有者**或**执行者权限方**都可以撤销委托：

```typescript
import { revokeExecutionV1, findExecutionDelegateRecordV1Pda, findExecutiveProfileV1Pda } from '@metaplex-foundation/mpl-agent-registry';

const executiveProfile = findExecutiveProfileV1Pda(umi, {
  authority: executiveAuthorityPublicKey,
});

const delegateRecord = findExecutionDelegateRecordV1Pda(umi, {
  executiveProfile,
  agentAsset: agentAssetPublicKey,
});

await revokeExecutionV1(umi, {
  executionDelegateRecord: delegateRecord,
  agentAsset: agentAssetPublicKey,
  destination: umi.payer.publicKey,
}).sendAndConfirm(umi);
```

### RevokeExecutionV1 参数

| 参数 | 说明 |
|-----------|-------------|
| `executionDelegateRecord` | 要关闭的委托记录 PDA |
| `agentAsset` | 代理的 MPL Core 资产 |
| `destination` | 接收关闭账户退还租金的地址 |
| `payer` | 支付者（默认为 `umi.payer`） |
| `authority` | 必须是资产所有者或执行者权限方（默认为 `payer`） |

## 完整示例

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { generateSigner } from '@metaplex-foundation/umi';
import { create, createCollection } from '@metaplex-foundation/mpl-core';
import { mplAgentIdentity, mplAgentTools } from '@metaplex-foundation/mpl-agent-registry';
import {
  registerIdentityV1,
  registerExecutiveV1,
  delegateExecutionV1,
  findAgentIdentityV1Pda,
  findExecutiveProfileV1Pda,
} from '@metaplex-foundation/mpl-agent-registry';

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplAgentIdentity())
  .use(mplAgentTools());

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

// 4. Register executive profile
await registerExecutiveV1(umi, {
  payer: umi.payer,
}).sendAndConfirm(umi);

// 5. Delegate execution
const agentIdentity = findAgentIdentityV1Pda(umi, { asset: asset.publicKey });
const executiveProfile = findExecutiveProfileV1Pda(umi, { authority: umi.payer.publicKey });

await delegateExecutionV1(umi, {
  agentAsset: asset.publicKey,
  agentIdentity,
  executiveProfile,
}).sendAndConfirm(umi);
```

## 注意事项

- 每个钱包只能有一个执行者配置文件。PDA 从 `["executive_profile", <authority>]` 派生，因此使用同一钱包再次调用 `registerExecutiveV1` 将失败。
- 委托是按资产进行的——所有者必须为每个要让执行者运营的代理创建单独的委托记录。
- 只有资产所有者可以委托执行。程序在链上验证所有权。
- 资产所有者或执行者权限方都可以撤销委托——双方都拥有此权利。
- 所有者可以通过撤销当前委托并使用不同的执行者配置文件创建新委托来切换执行者。

有关账户布局、PDA 派生详情和错误代码，请参阅 [Agent Tools](/smart-contracts/mpl-agent/tools) 智能合约参考。
