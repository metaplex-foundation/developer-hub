---
title: API 客户端
metaTitle: API 客户端 | Genesis SDK | Metaplex
description: 使用 Genesis API 客户端在 Solana 上创建和注册代币发行。提供从简单到完全控制的三种集成模式。
created: '02-19-2026'
updated: '02-19-2026'
keywords:
  - Genesis API client
  - token launch SDK
  - createLaunch
  - registerLaunch
  - createAndRegisterLaunch
about:
  - SDK API client
  - Token launch creation
  - Launch registration
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---

Genesis API 客户端提供了用于创建和注册代币发行的高级函数。它通过基于 Umi 构建的简洁接口，处理交易构建、签名和链上注册。{% .lead %}

{% callout type="note" %}
我们建议使用 SDK 以编程方式创建发行，因为 [metaplex.com](https://www.metaplex.com) 尚未支持 Genesis 程序的全部功能。通过 API 创建的主网发行在注册后将显示在 metaplex.com 上。
{% /callout %}

## 安装

```bash
npm install @metaplex-foundation/genesis @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults
```

## 设置

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { genesis } from '@metaplex-foundation/genesis';
import { keypairIdentity } from '@metaplex-foundation/umi';

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(genesis());

// For server-side or scripts, load a keypair
umi.use(keypairIdentity(myKeypair));
```

## 三种集成模式

SDK 提供三种创建发行的模式，从全自动到完全手动。

### 简易模式 — `createAndRegisterLaunch`

最简单的方式。一次函数调用即可处理所有事项：创建链上账户、通过 Umi 签名并发送交易，以及注册发行。

{% code-tabs-imported from="genesis/api_easy_mode" frameworks="umi" filename="createAndRegisterLaunch" /%}

**返回 `CreateAndRegisterLaunchResult`：**

| 字段 | 类型 | 描述 |
|-------|------|-------------|
| `signatures` | `Uint8Array[]` | 交易签名 |
| `mintAddress` | `string` | 创建的代币铸造地址 |
| `genesisAccount` | `string` | Genesis 账户 PDA 地址 |
| `launch.id` | `string` | 发行 ID |
| `launch.link` | `string` | 发行页面 URL |
| `token.id` | `string` | 代币 ID |
| `token.mintAddress` | `string` | 代币铸造地址 |

### 中级模式 — 自定义交易发送器

使用 `createAndRegisterLaunch` 配合自定义 `txSender` 回调，适用于多签钱包或自定义重试逻辑等场景。

{% code-tabs-imported from="genesis/api_custom_sender" frameworks="umi" filename="customTxSender" /%}

`txSender` 回调接收未签名交易数组，必须返回签名数组。回调完成后 SDK 会处理注册。

### 完全控制 — `createLaunch` + `registerLaunch`

完全控制交易生命周期。调用 `createLaunch` 获取未签名交易，自行处理签名和发送，然后调用 `registerLaunch`。

{% code-tabs-imported from="genesis/api_full_control" frameworks="umi" filename="fullControl" /%}

**`createLaunch` 返回 `CreateLaunchResponse`：**

| 字段 | 类型 | 描述 |
|-------|------|-------------|
| `transactions` | `Transaction[]` | 需要签名并发送的未签名 Umi 交易 |
| `blockhash` | `BlockhashWithExpiryBlockHeight` | 用于确认交易的区块哈希 |
| `mintAddress` | `string` | 创建的代币铸造地址 |
| `genesisAccount` | `string` | Genesis 账户 PDA 地址 |

**`registerLaunch` 返回 `RegisterLaunchResponse`：**

| 字段 | 类型 | 描述 |
|-------|------|-------------|
| `existing` | `boolean?` | 如果发行已注册则为 `true` |
| `launch.id` | `string` | 发行 ID |
| `launch.link` | `string` | 发行页面 URL |
| `token.id` | `string` | 代币 ID |
| `token.mintAddress` | `string` | 代币铸造地址 |

{% callout type="warning" %}
在调用 `registerLaunch` 之前，交易必须在链上确认。注册端点会验证 Genesis 账户是否存在以及是否与预期配置匹配。
{% /callout %}

---

## 配置

### CreateLaunchInput

| 字段 | 类型 | 必填 | 描述 |
|-------|------|----------|-------------|
| `wallet` | `PublicKey \| string` | 是 | 创建者钱包（签署交易） |
| `token` | `TokenMetadata` | 是 | 代币元数据 |
| `network` | `SvmNetwork` | 否 | `'solana-mainnet'`（默认）或 `'solana-devnet'` |
| `quoteMint` | `QuoteMintInput` | 否 | `'SOL'`（默认）、`'USDC'` 或原始铸造地址 |
| `launchType` | `LaunchType` | 是 | `'project'` |
| `launch` | `ProjectLaunchInput` | 是 | 发行配置 |

### TokenMetadata

| 字段 | 类型 | 必填 | 描述 |
|-------|------|----------|-------------|
| `name` | `string` | 是 | 代币名称，1–32 个字符 |
| `symbol` | `string` | 是 | 代币符号，1–10 个字符 |
| `image` | `string` | 是 | 图片 URL（必须是 Irys 网关 URL） |
| `description` | `string` | 否 | 最多 250 个字符 |
| `externalLinks` | `ExternalLinks` | 否 | 网站、Twitter、Telegram 链接 |

### ExternalLinks

| 字段 | 类型 | 描述 |
|-------|------|-------------|
| `website` | `string?` | 网站 URL |
| `twitter` | `string?` | Twitter/X 用户名（`@mytoken`）或完整 URL |
| `telegram` | `string?` | Telegram 用户名或完整 URL |

### LaunchpoolConfig

| 字段 | 类型 | 描述 |
|-------|------|-------------|
| `tokenAllocation` | `number` | 销售代币数量（总供应量 10 亿中的一部分） |
| `depositStartTime` | `Date \| string` | 存款期开始时间（持续 48 小时） |
| `raiseGoal` | `number` | 最低募集报价代币数量，以整数单位表示（例如 200 SOL） |
| `raydiumLiquidityBps` | `number` | 用于 Raydium LP 的募集资金百分比，以基点表示（2000–10000） |
| `fundsRecipient` | `PublicKey \| string` | 接收解锁部分募集资金的地址 |

### LockedAllocation（Streamflow 锁仓）

可通过 `launch.lockedAllocations` 添加可选的锁仓代币计划：

| 字段 | 类型 | 描述 |
|-------|------|-------------|
| `name` | `string` | 流名称，最多 64 个字符（例如 "Team"、"Advisors"） |
| `recipient` | `PublicKey \| string` | 锁仓接收方钱包 |
| `tokenAmount` | `number` | 锁仓计划中的代币总量 |
| `vestingStartTime` | `Date \| string` | 解锁计划开始时间 |
| `vestingDuration` | `{ value: number, unit: TimeUnit }` | 完整锁仓周期 |
| `unlockSchedule` | `TimeUnit` | 代币释放频率 |
| `cliff` | `object?` | 可选悬崖期，包含 `duration` 和 `unlockAmount` |

{% callout type="warning" %}
`vestingStartTime` 必须在**存款期结束之后**（即 `depositStartTime` + 48 小时之后）。API 将拒绝在存款窗口关闭之前开始的锁仓计划。
{% /callout %}

**TimeUnit 值：** `'SECOND'`、`'MINUTE'`、`'HOUR'`、`'DAY'`、`'WEEK'`、`'TWO_WEEKS'`、`'MONTH'`、`'QUARTER'`、`'YEAR'`

**带锁仓分配的示例：**

{% code-tabs-imported from="genesis/api_locked_allocations" frameworks="umi" filename="lockedAllocations" /%}

### SignAndSendOptions

`createAndRegisterLaunch` 的选项（扩展自 `RpcSendTransactionOptions`）：

| 字段 | 类型 | 默认值 | 描述 |
|-------|------|---------|-------------|
| `txSender` | `(txs: Transaction[]) => Promise<Uint8Array[]>` | — | 自定义交易发送器回调 |
| `commitment` | `string` | `'confirmed'` | 确认的承诺级别 |
| `preflightCommitment` | `string` | `'confirmed'` | 预检承诺级别 |
| `skipPreflight` | `boolean` | `false` | 跳过预检检查 |

---

## 错误处理

SDK 提供三种错误类型及对应的类型守卫函数。

### GenesisApiError

当 API 返回非成功响应时抛出。

```typescript
import { isGenesisApiError } from '@metaplex-foundation/genesis';

try {
  await createLaunch(umi, input);
} catch (err) {
  if (isGenesisApiError(err)) {
    console.error('API error:', err.statusCode, err.responseBody);
  }
}
```

| 属性 | 类型 | 描述 |
|----------|------|-------------|
| `statusCode` | `number` | HTTP 状态码 |
| `responseBody` | `unknown` | API 返回的完整响应体 |

### GenesisApiNetworkError

当 fetch 调用失败时抛出（网络问题、DNS 故障等）。

```typescript
import { isGenesisApiNetworkError } from '@metaplex-foundation/genesis';

if (isGenesisApiNetworkError(err)) {
  console.error('Network error:', err.cause.message);
}
```

| 属性 | 类型 | 描述 |
|----------|------|-------------|
| `cause` | `Error` | 底层 fetch 错误 |

### GenesisValidationError

当输入验证在发起 API 调用之前失败时抛出。

```typescript
import { isGenesisValidationError } from '@metaplex-foundation/genesis';

if (isGenesisValidationError(err)) {
  console.error(`Validation failed on field "${err.field}":`, err.message);
}
```

| 属性 | 类型 | 描述 |
|----------|------|-------------|
| `field` | `string` | 验证失败的输入字段 |

### 综合错误处理

{% code-tabs-imported from="genesis/api_error_handling" frameworks="umi" filename="errorHandling" /%}

---

## 验证规则

SDK 在将输入发送到 API 之前会进行验证：

| 规则 | 约束条件 |
|------|-----------|
| 代币名称 | 1–32 个字符 |
| 代币符号 | 1–10 个字符 |
| 代币图片 | 有效的 HTTPS URL |
| 代币描述 | 最多 250 个字符 |
| 代币分配量 | 大于 0 |
| 募集目标 | 大于 0 |
| Raydium 流动性 BPS | 2000–10000（20%–100%） |
| 总供应量 | 固定为 10 亿枚代币 |
| 锁仓分配名称 | 最多 64 个字符 |

{% callout type="note" %}
总供应量始终为 10 亿枚代币。SDK 会自动计算创建者分配额，即总供应量减去 Launch Pool、Raydium LP 和所有锁仓分配后的剩余部分。
{% /callout %}

---

## 辅助函数

### signAndSendLaunchTransactions

如果您希望将默认的签名并发送行为作为独立函数使用（适用于重试或部分流程）：

```typescript
import {
  createLaunch,
  signAndSendLaunchTransactions,
} from '@metaplex-foundation/genesis';

const createResult = await createLaunch(umi, input);
const signatures = await signAndSendLaunchTransactions(umi, createResult, {
  commitment: 'confirmed',
});
```

交易按顺序签名并发送——每笔交易在下一笔发送之前完成确认。

### buildCreateLaunchPayload

验证输入并构建原始 API 载荷。为高级用例导出：

```typescript
import { buildCreateLaunchPayload } from '@metaplex-foundation/genesis';

const payload = buildCreateLaunchPayload(input);
// Use payload with your own HTTP client
```
