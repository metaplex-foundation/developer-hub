---
title: 代理工具
metaTitle: 代理工具程序 | MPL 代理注册表 | Metaplex
description: MPL 代理工具程序技术参考 — 执行档案、执行委托、账户和 PDA 派生。
keywords:
  - Agent Tools program
  - executive profile
  - execution delegation
  - RegisterExecutiveV1
  - DelegateExecutionV1
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Smart Contracts
  - Solana
  - Metaplex
proficiencyLevel: Advanced
created: '03-11-2026'
updated: '03-12-2026'
---

代理工具程序管理代理资产的执行委托，允许资产所有者将执行权限委托给执行档案。{% .lead %}

## Summary

代理工具程序（`TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S`）提供两个管理执行委托的指令：`RegisterExecutiveV1` 创建执行档案，`DelegateExecutionV1` 授予该档案代表代理资产执行的权限。

- **两个指令** — `RegisterExecutiveV1`（一次性档案设置）和 `DelegateExecutionV1`（按资产委托）
- **ExecutiveProfileV1** — 从 `["executive_profile", <authority>]` 派生的 40 字节 PDA，每个钱包一个
- **ExecutionDelegateRecordV1** — 将执行档案与特定代理资产关联的 104 字节 PDA
- **仅所有者委托** — 只有资产所有者才能创建委托记录；程序在链上验证所有权

## 程序 ID

相同的程序地址部署在主网和开发网上。

| 网络 | 地址 |
|------|------|
| 主网 | `TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S` |
| 开发网 | `TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S` |

## 概述

工具程序提供两个指令：

1. **RegisterExecutiveV1** — 创建可作为代理资产执行者的执行档案
2. **DelegateExecutionV1** — 授予执行档案代表代理资产执行的权限

执行档案每个权限方注册一次。委托按资产进行——资产所有者创建将其代理资产与特定执行档案关联的委托记录。

## 指令：RegisterExecutiveV1

为指定权限方创建执行档案 PDA。

### 账户

需要四个账户：待创建的档案 PDA、付款方、可选权限方和系统程序。

| 账户 | 可写 | 签名者 | 可选 | 描述 |
|------|------|--------|------|------|
| `executiveProfile` | 是 | 否 | 否 | 待创建的 PDA（从权限方自动派生） |
| `payer` | 是 | 是 | 否 | 支付账户租金和费用 |
| `authority` | 否 | 是 | 是 | 此执行档案的权限方（默认为 `payer`） |
| `systemProgram` | 否 | 否 | 否 | 系统程序 |

### 操作内容

1. 从种子 `["executive_profile", <authority>]` 派生 PDA
2. 验证账户未初始化
3. 创建并初始化存储权限方的 `ExecutiveProfileV1` 账户（40 字节）

## 指令：DelegateExecutionV1

将代理资产的执行权限委托给执行档案。

### 账户

需要七个账户，包括执行档案、代理资产、其身份 PDA 和待创建的委托记录 PDA。

| 账户 | 可写 | 签名者 | 可选 | 描述 |
|------|------|--------|------|------|
| `executiveProfile` | 否 | 否 | 否 | 已注册的执行档案 |
| `agentAsset` | 否 | 否 | 否 | 要委托的 MPL Core 资产 |
| `agentIdentity` | 否 | 否 | 否 | 资产的代理身份 PDA |
| `executionDelegateRecord` | 是 | 否 | 否 | 待创建的 PDA（自动派生） |
| `payer` | 是 | 是 | 否 | 支付账户租金和费用 |
| `authority` | 否 | 是 | 是 | 必须是资产所有者（默认为 `payer`） |
| `systemProgram` | 否 | 否 | 否 | 系统程序 |

### 操作内容

1. 验证执行档案存在且已初始化
2. 验证代理资产是有效的 MPL Core 资产
3. 验证代理身份已为该资产注册
4. 验证签名者是资产所有者
5. 从种子 `["execution_delegate_record", <executive_profile>, <agent_asset>]` 派生 PDA
6. 创建并初始化 `ExecutionDelegateRecordV1` 账户（104 字节）

## PDA 派生

两种账户类型都是从确定性种子派生的 PDA。使用 SDK 辅助函数计算它们。

| 账户 | 种子 | 大小 |
|------|------|------|
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

| 偏移 | 字段 | 类型 | 大小 | 描述 |
|------|------|------|------|------|
| 0 | `key` | `u8` | 1 | 账户鉴别器（`1` = ExecutiveProfileV1） |
| 1 | `_padding` | `[u8; 7]` | 7 | 对齐填充 |
| 8 | `authority` | `Pubkey` | 32 | 此执行档案的权限方 |

## 账户：ExecutionDelegateRecordV1

将执行档案与代理资产关联，记录谁有权代表其执行。104 字节，8 字节对齐。

| 偏移 | 字段 | 类型 | 大小 | 描述 |
|------|------|------|------|------|
| 0 | `key` | `u8` | 1 | 账户鉴别器（`2` = ExecutionDelegateRecordV1） |
| 1 | `bump` | `u8` | 1 | PDA bump 种子 |
| 2 | `_padding` | `[u8; 6]` | 6 | 对齐填充 |
| 8 | `executiveProfile` | `Pubkey` | 32 | 执行档案地址 |
| 40 | `authority` | `Pubkey` | 32 | 执行权限方 |
| 72 | `agentAsset` | `Pubkey` | 32 | 代理资产地址 |

## 错误

程序在注册或委托过程中验证失败时返回这些错误。

| 代码 | 名称 | 描述 |
|------|------|------|
| 0 | `InvalidSystemProgram` | 系统程序账户不正确 |
| 1 | `InvalidInstructionData` | 指令数据格式错误 |
| 2 | `InvalidAccountData` | 无效的账户数据 |
| 3 | `InvalidMplCoreProgram` | MPL Core 程序账户不正确 |
| 4 | `InvalidCoreAsset` | 资产不是有效的 MPL Core 资产 |
| 5 | `ExecutiveProfileMustBeUninitialized` | 执行档案已存在 |
| 6 | `InvalidExecutionDelegateRecordDerivation` | 委托记录 PDA 派生不匹配 |
| 7 | `ExecutionDelegateRecordMustBeUninitialized` | 委托记录已存在 |
| 8 | `InvalidAgentIdentity` | 代理身份账户无效 |
| 9 | `AgentIdentityNotRegistered` | 资产没有已注册的身份 |
| 10 | `AssetOwnerMustBeTheOneToDelegateExecution` | 只有资产所有者才能委托执行 |
| 11 | `InvalidExecutiveProfileDerivation` | 执行档案 PDA 派生不匹配 |

*由 [Metaplex](https://github.com/metaplex-foundation) 维护 · 最后验证于 2026 年 3 月 · [在 GitHub 上查看源代码](https://github.com/metaplex-foundation/mpl-agent)*
