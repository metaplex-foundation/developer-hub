---
title: Agent Identity
metaTitle: Agent Identity 程序 | MPL Agent Registry | Metaplex
description: MPL Agent Identity 程序技术参考 — RegisterIdentityV1、SetAgentTokenV1、AgentIdentityV2 账户结构、PDA 派生和错误码。
keywords:
  - Agent Identity program
  - RegisterIdentityV1
  - SetAgentTokenV1
  - AgentIdentityV2
  - AgentIdentityV1
  - PDA derivation
  - lifecycle hooks
  - Genesis token
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Smart Contracts
  - Solana
  - Metaplex
proficiencyLevel: Advanced
created: '02-25-2026'
updated: '03-30-2026'
---

Agent Identity 程序为 MPL Core 资产注册链上身份记录，并可选将 [Genesis](/smart-contracts/genesis) 代币链接到该身份。{% .lead %}

## 概述

Agent Identity 程序（`1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p`）为 [MPL Core](/smart-contracts/core) 资产创建基于 PDA 的身份记录，并附加带有 Transfer、Update 和 Execute 生命周期钩子的 `AgentIdentity` 插件。

- **两条指令** — `RegisterIdentityV1` 创建身份记录；`SetAgentTokenV1` 将 [Genesis](/smart-contracts/genesis) 代币链接到现有身份
- **104 字节账户** — `AgentIdentityV2` PDA 存储鉴别器、bump、资产公钥、可选的代理代币地址和保留空间
- **生命周期钩子** — 插件在 Transfer、Update 和 Execute 事件上注册批准、监听和拒绝检查
- **确定性 PDA** — 从种子 `["agent_identity", <asset_pubkey>]` 派生，便于链上查找

## 程序 ID

| 网络 | 地址 |
|---------|---------|
| Mainnet | `1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p` |
| Devnet | `1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p` |

## 指令：RegisterIdentityV1

通过创建 PDA 并将带有 Transfer、Update 和 Execute 生命周期钩子的 `AgentIdentity` 插件附加到 MPL Core 资产来注册代理身份。

### 账户

| 账户 | 可写 | 签名者 | 可选 | 说明 |
|---------|----------|--------|----------|-------------|
| `agentIdentity` | 是 | 否 | 否 | 待创建的 PDA（从资产自动派生） |
| `asset` | 是 | 否 | 否 | 要注册的 MPL Core 资产 |
| `collection` | 是 | 否 | 是 | 资产的集合 |
| `payer` | 是 | 是 | 否 | 支付账户租金和费用 |
| `authority` | 否 | 是 | 是 | 集合权限（默认为 `payer`） |
| `mplCoreProgram` | 否 | 否 | 否 | MPL Core 程序 |
| `systemProgram` | 否 | 否 | 否 | System 程序 |

### 参数

| 参数 | 类型 | 说明 |
|----------|------|-------------|
| `agentRegistrationUri` | `string` | 指向链下代理注册元数据的 URI |

### RegisterIdentityV1 的操作流程

1. 从种子 `["agent_identity", <asset>]` 派生 PDA
2. 创建并初始化 `AgentIdentityV2` 账户（104 字节）
3. 通过 CPI 调用 MPL Core，将带有提供的 URI 的 `AgentIdentity` 插件附加到资产
4. 为 **Transfer**、**Update** 和 **Execute** 事件注册生命周期检查（批准、监听和拒绝）

### 生命周期检查

`AgentIdentity` 插件在三个生命周期事件上注册钩子：

| 事件 | 批准 | 监听 | 拒绝 |
|-------|---------|--------|--------|
| Transfer | 是 | 是 | 是 |
| Update | 是 | 是 | 是 |
| Execute | 是 | 是 | 是 |

这意味着身份插件可以参与批准、观察或拒绝资产上的转移、更新和执行操作。

## 指令：SetAgentTokenV1

将 [Genesis](/smart-contracts/genesis) 代币关联到现有的代理身份。Genesis 账户必须使用 `Mint` 资金模式。如果身份仍为 `AgentIdentityV1`（40 字节），程序会自动将其升级为 `AgentIdentityV2`（104 字节）。

### 账户

| 账户 | 可写 | 签名者 | 可选 | 说明 |
|---------|----------|--------|----------|-------------|
| `agentIdentity` | 是 | 否 | 否 | 代理身份 PDA（V1 或 V2）— 从资产自动派生 |
| `asset` | 否 | 否 | 否 | MPL Core 资产 |
| `genesisAccount` | 否 | 否 | 否 | 代理代币发行的 Genesis 账户 |
| `payer` | 是 | 是 | 否 | 支付额外租金（从 V1 升级到 V2 时） |
| `authority` | 否 | 是 | 是 | 必须是 [Asset Signer](/smart-contracts/core/execute-asset-signing) PDA（默认为 `payer`） |
| `systemProgram` | 否 | 否 | 否 | System 程序 |

### SetAgentTokenV1 的操作流程

1. 验证代理身份 PDA 存在且为 V1 或 V2
2. 验证 Genesis 账户由 Genesis 程序（`GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`）拥有且使用 `Mint` 资金模式
3. 如果身份为 V1，将账户调整为 104 字节并将鉴别器升级为 V2
4. 从 Genesis 账户数据中读取 `base_mint` 公钥
5. 将 `base_mint` 存储为身份上的 `agent_token` 字段

{% callout type="warning" %}
代理代币只能设置一次。对已设置 `agent_token` 的身份调用 `SetAgentTokenV1` 将失败并返回错误 `AgentTokenAlreadySet`。
{% /callout %}

{% callout type="note" %}
`authority` 必须是资产的 [Asset Signer](/smart-contracts/core/execute-asset-signing) PDA。这是 Core 资产的内置钱包——一个从资产公钥派生的 PDA，没有私钥。
{% /callout %}

```typescript
import { setAgentTokenV1 } from '@metaplex-foundation/mpl-agent-registry';

await setAgentTokenV1(umi, {
  asset: assetPublicKey,
  genesisAccount: genesisAccountPublicKey,
}).sendAndConfirm(umi);
```

## PDA 派生

**种子：** `["agent_identity", <asset_pubkey>]`

V1 和 V2 账户使用相同的 PDA 派生方式。SDK 为两个版本提供查找器：

```typescript
import {
  findAgentIdentityV2Pda,
} from '@metaplex-foundation/mpl-agent-registry';

const pda = findAgentIdentityV2Pda(umi, { asset: assetPublicKey });
// Returns [publicKey, bump]
```

## 账户：AgentIdentityV2

104 字节，8 字节对齐，通过 bytemuck 进行零拷贝。这是 `RegisterIdentityV1` 创建和 `SetAgentTokenV1` 使用的当前账户版本。

| 偏移量 | 字段 | 类型 | 大小 | 说明 |
|--------|-------|------|------|-------------|
| 0 | `key` | `u8` | 1 | 账户鉴别器（`AgentIdentityV2`） |
| 1 | `bump` | `u8` | 1 | PDA bump 种子 |
| 2 | `_padding` | `[u8; 6]` | 6 | 对齐填充 |
| 8 | `asset` | `Pubkey` | 32 | 此身份绑定的 MPL Core 资产 |
| 40 | `agentToken` | `OptionalPubkey` | 33 | Genesis 代币铸造地址（如已设置） |
| 73 | `_reserved` | `[u8; 31]` | 31 | 保留供将来使用 |

## 账户：AgentIdentityV1（旧版）

40 字节，8 字节对齐。这是旧版账户格式。当调用 `SetAgentTokenV1` 时，现有的 V1 账户会自动升级为 V2。

| 偏移量 | 字段 | 类型 | 大小 | 说明 |
|--------|-------|------|------|-------------|
| 0 | `key` | `u8` | 1 | 账户鉴别器（`AgentIdentityV1`） |
| 1 | `bump` | `u8` | 1 | PDA bump 种子 |
| 2 | `_padding` | `[u8; 6]` | 6 | 对齐填充 |
| 8 | `asset` | `Pubkey` | 32 | 此身份绑定的 MPL Core 资产 |

## 获取账户

```typescript
import {
  fetchAgentIdentityV2,
  safeFetchAgentIdentityV2,
  fetchAllAgentIdentityV2,
  getAgentIdentityV2GpaBuilder,
} from '@metaplex-foundation/mpl-agent-registry';

// By PDA address (throws if not found)
const identity = await fetchAgentIdentityV2(umi, pda);

// Safe fetch (returns null if not found)
const identity = await safeFetchAgentIdentityV2(umi, pda);

// Batch fetch
const identities = await fetchAllAgentIdentityV2(umi, [pda1, pda2]);

// GPA query
const results = await getAgentIdentityV2GpaBuilder(umi)
  .whereField('asset', assetPublicKey)
  .get();
```

### 旧版 V1 获取器

V1 获取函数仍适用于尚未升级到 V2 的账户。新集成应使用上述 V2 获取器。

```typescript
import {
  fetchAgentIdentityV1,
  safeFetchAgentIdentityV1,
  findAgentIdentityV1Pda,
  fetchAgentIdentityV1FromSeeds,
  getAgentIdentityV1GpaBuilder,
} from '@metaplex-foundation/mpl-agent-registry';

const v1Pda = findAgentIdentityV1Pda(umi, { asset: assetPublicKey });

// Safe fetch (returns null if not found)
const identity = await safeFetchAgentIdentityV1(umi, v1Pda);

// By seeds
const identity = await fetchAgentIdentityV1FromSeeds(umi, { asset: assetPublicKey });

// GPA query
const results = await getAgentIdentityV1GpaBuilder(umi)
  .whereField('asset', assetPublicKey)
  .get();
```

## 错误码

| 代码 | 名称 | 说明 |
|------|------|-------------|
| 0 | `InvalidSystemProgram` | System 程序账户不正确 |
| 1 | `InvalidInstructionData` | 指令数据格式错误 |
| 2 | `InvalidAccountData` | PDA 派生与资产不匹配 |
| 3 | `InvalidMplCoreProgram` | MPL Core 程序账户不正确 |
| 4 | `InvalidCoreAsset` | 资产不是有效的 MPL Core 资产 |
| 5 | `InvalidAgentToken` | 代理代币账户无效 |
| 6 | `OnlyAssetSignerCanSetAgentToken` | 调用 `SetAgentTokenV1` 时权限方必须是 Asset Signer PDA |
| 7 | `AgentTokenAlreadySet` | 此身份的代理代币已经设置 |
| 8 | `InvalidAgentIdentity` | 代理身份账户无效或不属于此程序 |
| 9 | `AgentIdentityAlreadyRegistered` | 此资产已有注册身份 |
| 10 | `InvalidGenesisAccount` | Genesis 账户无效（所有者错误、鉴别器错误或大小不足） |
| 11 | `GenesisNotMintFunded` | Genesis 账户未使用 `Mint` 资金模式 |

## 注意事项

- `RegisterIdentityV1` 现在创建 `AgentIdentityV2` 账户（104 字节）。旧版 V1 账户（40 字节）会被 `SetAgentTokenV1` 自动升级为 V2。
- V2 上的 `agentToken` 字段是 `OptionalPubkey`。在调用 `SetAgentTokenV1` 之前为空（`None`）。
- `_reserved` 字段（31 字节）已清零，保留供将来扩展使用。
- V1 和 V2 账户共享相同的 PDA 派生种子：`["agent_identity", <asset_pubkey>]`。
