---
title: Agent Tools
metaTitle: Agent Tools 程序 | MPL Agent Registry | Metaplex
description: MPL Agent Tools 程序技术参考 — 执行档案、执行委托、撤销、账户和 PDA 派生。
keywords:
  - Agent Tools program
  - executive profile
  - execution delegation
  - RegisterExecutiveV1
  - DelegateExecutionV1
  - RevokeExecutionV1
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Smart Contracts
  - Solana
  - Metaplex
proficiencyLevel: Advanced
created: '03-11-2026'
updated: '03-30-2026'
---

Agent Tools 程序管理代理资产的执行委托，允许资产所有者委托和撤销执行权限。{% .lead %}

## 概述

Agent Tools 程序（`TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S`）提供三条指令用于管理执行委托：`RegisterExecutiveV1` 创建执行档案，`DelegateExecutionV1` 授予该档案代表代理资产执行的权限，`RevokeExecutionV1` 移除该权限。

- **三条指令** — `RegisterExecutiveV1`（一次性档案设置）、`DelegateExecutionV1`（逐资产委托）和 `RevokeExecutionV1`（撤销）
- **ExecutiveProfileV1** — 40 字节 PDA，从 `["executive_profile", <authority>]` 派生，每个钱包一个
- **ExecutionDelegateRecordV1** — 104 字节 PDA，将执行档案链接到特定的代理资产
- **仅所有者可委托** — 只有资产所有者才能创建委托记录；程序在链上验证所有权
- **双方可撤销** — 资产所有者或执行权限方均可撤销委托

## 程序 ID

主网和开发网部署于相同的程序地址。

| 网络 | 地址 |
|---------|---------|
| Mainnet | `TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S` |
| Devnet | `TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S` |

## 概览

Tools 程序提供三条指令：

1. **RegisterExecutiveV1** — 创建可作为代理资产执行者的执行档案
2. **DelegateExecutionV1** — 授予执行档案代表代理资产执行的权限
3. **RevokeExecutionV1** — 移除现有的执行委托并回收租金

每个权限方注册一次执行档案。委托按资产进行——资产所有者创建委托记录，将其代理资产链接到特定的执行档案。任一方均可撤销委托。

## 指令：RegisterExecutiveV1

为给定权限方创建执行档案 PDA。

### 账户

需要四个账户：待创建的档案 PDA、付款方、可选的权限方和 System 程序。

| 账户 | 可写 | 签名者 | 可选 | 说明 |
|---------|----------|--------|----------|-------------|
| `executiveProfile` | 是 | 否 | 否 | 待创建的 PDA（从权限方自动派生） |
| `payer` | 是 | 是 | 否 | 支付账户租金和费用 |
| `authority` | 否 | 是 | 是 | 此执行档案的权限方（默认为 `payer`） |
| `systemProgram` | 否 | 否 | 否 | System 程序 |

### RegisterExecutiveV1 的操作流程

1. 从种子 `["executive_profile", <authority>]` 派生 PDA
2. 验证账户未初始化
3. 创建并初始化 `ExecutiveProfileV1` 账户（40 字节），存储权限方

## 指令：DelegateExecutionV1

将代理资产的执行权限委托给执行档案。

### 账户

需要七个账户，包括执行档案、代理资产、其身份 PDA 和待创建的委托记录 PDA。

| 账户 | 可写 | 签名者 | 可选 | 说明 |
|---------|----------|--------|----------|-------------|
| `executiveProfile` | 否 | 否 | 否 | 已注册的执行档案 |
| `agentAsset` | 否 | 否 | 否 | 要委托的 MPL Core 资产 |
| `agentIdentity` | 否 | 否 | 否 | 资产的[代理身份](/smart-contracts/mpl-agent/identity) PDA |
| `executionDelegateRecord` | 是 | 否 | 否 | 待创建的 PDA（自动派生） |
| `payer` | 是 | 是 | 否 | 支付账户租金和费用 |
| `authority` | 否 | 是 | 是 | 必须是资产所有者（默认为 `payer`） |
| `systemProgram` | 否 | 否 | 否 | System 程序 |

### DelegateExecutionV1 的操作流程

1. 验证执行档案存在且已初始化
2. 验证代理资产是有效的 MPL Core 资产
3. 验证资产已注册[代理身份](/smart-contracts/mpl-agent/identity)
4. 验证签名者是资产所有者
5. 从种子 `["execution_delegate_record", <executive_profile>, <agent_asset>]` 派生 PDA
6. 创建并初始化 `ExecutionDelegateRecordV1` 账户（104 字节）

## 指令：RevokeExecutionV1

关闭执行委托记录，移除执行方代表代理资产操作的权限。已关闭账户的租金退还到指定的目标地址。

### 账户

| 账户 | 可写 | 签名者 | 可选 | 说明 |
|---------|----------|--------|----------|-------------|
| `executionDelegateRecord` | 是 | 否 | 否 | 要关闭的委托记录 |
| `agentAsset` | 否 | 否 | 否 | 委托对应的代理资产 |
| `destination` | 是 | 否 | 否 | 接收已关闭账户退还租金的地址 |
| `payer` | 是 | 是 | 否 | 付款方 |
| `authority` | 否 | 是 | 是 | 必须是资产所有者或执行权限方（默认为 `payer`） |
| `systemProgram` | 否 | 否 | 否 | System 程序 |

### RevokeExecutionV1 的操作流程

1. 验证委托记录存在、已初始化且属于此程序
2. 验证记录的 `agentAsset` 字段与提供的代理资产匹配
3. 检查委托记录的 PDA 派生
4. 验证代理资产是有效的 MPL Core 资产
5. 验证签名者是**资产所有者**或委托中记录的**执行权限方**
6. 关闭委托记录账户并将租金退还到 `destination`

{% callout type="note" %}
资产所有者和执行方都可以撤销委托。这意味着执行方可以自愿解除与代理的关系，所有者也可以在不需要执行方签名的情况下移除执行方。
{% /callout %}

```typescript
import { revokeExecutionV1 } from '@metaplex-foundation/mpl-agent-registry';

await revokeExecutionV1(umi, {
  executionDelegateRecord: delegateRecordPda,
  agentAsset: agentAssetPublicKey,
  destination: umi.payer.publicKey,
}).sendAndConfirm(umi);
```

## PDA 派生

两种账户类型都是从确定性种子派生的 PDA。使用 SDK 辅助函数来计算它们。

| 账户 | 种子 | 大小 |
|---------|-------|------|
| `ExecutiveProfileV1` | `["executive_profile", <authority>]` | 40 字节 |
| `ExecutionDelegateRecordV1` | `["execution_delegate_record", <executive_profile>, <agent_asset>]` | 104 字节 |

```typescript
import {
  findExecutiveProfileV1Pda,
  findExecutionDelegateRecordV1Pda,
} from '@metaplex-foundation/mpl-agent-registry';

const profilePda = findExecutiveProfileV1Pda(umi, {
  authority: authorityPublicKey,
});

const delegatePda = findExecutionDelegateRecordV1Pda(umi, {
  executiveProfile: profilePda,
  agentAsset: assetPublicKey,
});
```

## 账户：ExecutiveProfileV1

存储拥有此执行档案的权限方。40 字节，8 字节对齐。

| 偏移量 | 字段 | 类型 | 大小 | 说明 |
|--------|-------|------|------|-------------|
| 0 | `key` | `u8` | 1 | 账户鉴别器（`1` = ExecutiveProfileV1） |
| 1 | `_padding` | `[u8; 7]` | 7 | 对齐填充 |
| 8 | `authority` | `Pubkey` | 32 | 此执行档案的权限方 |

## 账户：ExecutionDelegateRecordV1

将执行档案链接到代理资产，记录谁被授权代表其执行。104 字节，8 字节对齐。

| 偏移量 | 字段 | 类型 | 大小 | 说明 |
|--------|-------|------|------|-------------|
| 0 | `key` | `u8` | 1 | 账户鉴别器（`2` = ExecutionDelegateRecordV1） |
| 1 | `bump` | `u8` | 1 | PDA bump 种子 |
| 2 | `_padding` | `[u8; 6]` | 6 | 对齐填充 |
| 8 | `executiveProfile` | `Pubkey` | 32 | 执行档案地址 |
| 40 | `authority` | `Pubkey` | 32 | 执行权限方 |
| 72 | `agentAsset` | `Pubkey` | 32 | 代理资产地址 |

## 获取账户

### 执行档案

```typescript
import {
  fetchExecutiveProfileV1,
  safeFetchExecutiveProfileV1,
  fetchAllExecutiveProfileV1,
  fetchExecutiveProfileV1FromSeeds,
  getExecutiveProfileV1GpaBuilder,
} from '@metaplex-foundation/mpl-agent-registry';

// By PDA address (throws if not found)
const profile = await fetchExecutiveProfileV1(umi, profilePda);

// Safe fetch (returns null if not found)
const profile = await safeFetchExecutiveProfileV1(umi, profilePda);

// By seeds (derives PDA internally)
const profile = await fetchExecutiveProfileV1FromSeeds(umi, {
  authority: authorityPublicKey,
});

// Batch fetch
const profiles = await fetchAllExecutiveProfileV1(umi, [pda1, pda2]);

// GPA query
const results = await getExecutiveProfileV1GpaBuilder(umi)
  .whereField('authority', authorityPublicKey)
  .get();
```

### 执行委托记录

```typescript
import {
  fetchExecutionDelegateRecordV1,
  safeFetchExecutionDelegateRecordV1,
  fetchAllExecutionDelegateRecordV1,
  fetchExecutionDelegateRecordV1FromSeeds,
  getExecutionDelegateRecordV1GpaBuilder,
} from '@metaplex-foundation/mpl-agent-registry';

// By PDA address (throws if not found)
const record = await fetchExecutionDelegateRecordV1(umi, delegatePda);

// Safe fetch (returns null if not found)
const record = await safeFetchExecutionDelegateRecordV1(umi, delegatePda);

// By seeds (derives PDA internally)
const record = await fetchExecutionDelegateRecordV1FromSeeds(umi, {
  executiveProfile: profilePda,
  agentAsset: assetPublicKey,
});

// Batch fetch
const records = await fetchAllExecutionDelegateRecordV1(umi, [pda1, pda2]);

// GPA query — find all delegations for a specific agent
const results = await getExecutionDelegateRecordV1GpaBuilder(umi)
  .whereField('agentAsset', assetPublicKey)
  .get();
```

## 错误码

| 代码 | 名称 | 说明 |
|------|------|-------------|
| 0 | `InvalidSystemProgram` | System 程序账户不正确 |
| 1 | `InvalidInstructionData` | 指令数据格式错误 |
| 2 | `InvalidAccountData` | 账户数据无效 |
| 3 | `InvalidMplCoreProgram` | MPL Core 程序账户不正确 |
| 4 | `InvalidCoreAsset` | 资产不是有效的 MPL Core 资产 |
| 5 | `ExecutiveProfileMustBeUninitialized` | 执行档案已存在 |
| 6 | `InvalidExecutionDelegateRecordDerivation` | 委托记录 PDA 派生不匹配 |
| 7 | `ExecutionDelegateRecordMustBeUninitialized` | 委托记录已存在 |
| 8 | `InvalidAgentIdentity` | 代理身份账户无效 |
| 9 | `AgentIdentityNotRegistered` | 资产没有已注册的身份 |
| 10 | `AssetOwnerMustBeTheOneToDelegateExecution` | 只有资产所有者才能委托执行 |
| 11 | `InvalidExecutiveProfileDerivation` | 执行档案 PDA 派生不匹配 |
| 12 | `ExecutionDelegateRecordMustBeInitialized` | 委托记录不存在或未初始化 |
| 13 | `UnauthorizedRevoke` | 签名者不是资产所有者或执行权限方 |

## 注意事项

- 每个钱包只能有一个执行档案。尝试为同一钱包注册第二个档案将失败并返回 `ExecutiveProfileMustBeUninitialized`。
- 委托记录按（执行方，资产）对存储。同一执行方可以被委托到多个代理资产。
- 撤销时将委托记录的租金退还到 `destination` 账户，不一定是原始付款方。
- 资产所有者或执行权限方均可撤销委托——双方都拥有此权利。
