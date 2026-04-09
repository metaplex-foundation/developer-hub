---
title: 代理身份
metaTitle: 代理身份程序 | MPL 代理注册表 | Metaplex
description: MPL 代理身份程序技术参考 — 指令账户、PDA 派生、账户结构和错误代码。
keywords:
  - Agent Identity program
  - RegisterIdentityV1
  - AgentIdentityV1
  - PDA derivation
  - lifecycle hooks
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Smart Contracts
  - Solana
  - Metaplex
proficiencyLevel: Advanced
created: '02-25-2026'
updated: '03-12-2026'
---

代理身份程序为 MPL Core 资产注册链上身份记录。{% .lead %}

## Summary

代理身份程序（`1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p`）为 MPL Core 资产创建基于 PDA 的身份记录，并附加带有 Transfer、Update 和 Execute 生命周期钩子的 `AgentIdentity` 插件。

- **单一指令** — `RegisterIdentityV1` 在一个交易中处理 PDA 创建、账户初始化和插件附加
- **40 字节账户** — `AgentIdentityV1` PDA 仅存储鉴别器、bump 和资产公钥
- **生命周期钩子** — 插件在 Transfer、Update、Execute 事件上注册 approve、listen 和 reject 检查
- **确定性 PDA** — 从种子 `["agent_identity", <asset_pubkey>]` 派生，便于链上查找

## 程序 ID

| 网络 | 地址 |
|------|------|
| 主网 | `1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p` |
| 开发网 | `1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p` |

## 指令：RegisterIdentityV1

通过创建 PDA 并将带有 Transfer、Update、Execute 生命周期钩子的 `AgentIdentity` 插件附加到 MPL Core 资产来注册代理身份。

### 账户

| 账户 | 可写 | 签名者 | 可选 | 描述 |
|------|------|--------|------|------|
| `agentIdentity` | 是 | 否 | 否 | 待创建的 PDA（从资产自动派生） |
| `asset` | 是 | 否 | 否 | 要注册的 MPL Core 资产 |
| `collection` | 是 | 否 | 是 | 资产所属集合 |
| `payer` | 是 | 是 | 否 | 支付账户租金和费用 |
| `authority` | 否 | 是 | 是 | 集合权限方（默认为 `payer`） |
| `mplCoreProgram` | 否 | 否 | 否 | MPL Core 程序 |
| `systemProgram` | 否 | 否 | 否 | 系统程序 |

### 参数

| 参数 | 类型 | 描述 |
|------|------|------|
| `agentRegistrationUri` | `string` | 指向链下代理注册元数据的 URI |

### 操作内容

1. 从种子 `["agent_identity", <asset>]` 派生 PDA
2. 创建并初始化 `AgentIdentityV1` 账户（40 字节）
3. 通过 CPI 调用 MPL Core，使用提供的 URI 将 `AgentIdentity` 插件附加到资产
4. 注册 **Transfer**、**Update** 和 **Execute** 事件的生命周期检查（approve、listen 和 reject）

### 生命周期检查

`AgentIdentity` 插件在三个生命周期事件上注册钩子：

| 事件 | Approve | Listen | Reject |
|------|---------|--------|--------|
| Transfer | 是 | 是 | 是 |
| Update | 是 | 是 | 是 |
| Execute | 是 | 是 | 是 |

这意味着身份插件可以参与批准、观察或拒绝资产上的转账、更新和执行操作。

## PDA 派生

**种子：** `["agent_identity", <asset_pubkey>]`

```typescript
import { findAgentIdentityV1Pda } from '@metaplex-foundation/mpl-agent-registry';

const pda = findAgentIdentityV1Pda(umi, { asset: assetPublicKey });
// 返回 [publicKey, bump]
```

## 账户：AgentIdentityV1

40 字节，8 字节对齐，通过 bytemuck 实现零拷贝。

| 偏移 | 字段 | 类型 | 大小 | 描述 |
|------|------|------|------|------|
| 0 | `key` | `u8` | 1 | 账户鉴别器（`1` = AgentIdentityV1） |
| 1 | `bump` | `u8` | 1 | PDA bump 种子 |
| 2 | `_padding` | `[u8; 6]` | 6 | 对齐填充 |
| 8 | `asset` | `Pubkey` | 32 | 此身份绑定的 MPL Core 资产 |

## 获取账户

```typescript
import {
  fetchAgentIdentityV1,
  safeFetchAgentIdentityV1,
  fetchAgentIdentityV1FromSeeds,
  fetchAllAgentIdentityV1,
  getAgentIdentityV1GpaBuilder,
} from '@metaplex-foundation/mpl-agent-registry';

// 通过 PDA 地址获取（未找到则抛出异常）
const identity = await fetchAgentIdentityV1(umi, pda);

// 安全获取（未找到则返回 null）
const identity = await safeFetchAgentIdentityV1(umi, pda);

// 通过种子获取（内部派生 PDA）
const identity = await fetchAgentIdentityV1FromSeeds(umi, { asset });

// 批量获取
const identities = await fetchAllAgentIdentityV1(umi, [pda1, pda2]);

// GPA 查询
const results = await getAgentIdentityV1GpaBuilder(umi)
  .whereField('asset', assetPublicKey)
  .get();
```

## 错误

| 代码 | 名称 | 描述 |
|------|------|------|
| 0 | `InvalidSystemProgram` | 系统程序账户不正确 |
| 1 | `InvalidInstructionData` | 指令数据格式错误 |
| 2 | `InvalidAccountData` | PDA 派生与资产不匹配 |
| 3 | `InvalidMplCoreProgram` | MPL Core 程序账户不正确 |
| 4 | `InvalidCoreAsset` | 资产不是有效的 MPL Core 资产 |

*由 [Metaplex](https://github.com/metaplex-foundation) 维护 · 最后验证于 2026 年 3 月 · [在 GitHub 上查看源代码](https://github.com/metaplex-foundation/mpl-agent)*
