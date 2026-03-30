---
title: JavaScript SDK
metaTitle: JavaScript SDK | Genesis | Metaplex
description: Genesis JavaScript SDK 的 API 参考。Solana 上代币发行的函数签名、参数和类型。
created: '01-15-2025'
updated: '03-10-2026'
keywords:
  - Genesis SDK
  - JavaScript SDK
  - TypeScript SDK
  - token launch SDK
  - Umi framework
  - Genesis API reference
about:
  - SDK installation
  - API reference
  - Genesis instructions
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 什么是 Umi，为什么需要它？
    a: Umi 是 Metaplex 的 Solana JavaScript 框架。它提供了统一的接口来构建交易、管理签名者以及与 Metaplex 程序交互。
  - q: 我可以在浏览器中使用 Genesis SDK 吗？
    a: 可以。SDK 在 Node.js 和浏览器环境中都可以使用。在浏览器中，请使用钱包适配器进行签名，而不是密钥对文件。
  - q: fetch 和 safeFetch 有什么区别？
    a: fetch 在账户不存在时会抛出错误。safeFetch 则返回 null，适用于检查账户是否存在而无需错误处理。
  - q: 如何获取代币的发行类型？
    a: 使用代币的铸币地址通过 fetchGenesisAccountV2FromSeeds 获取 GenesisAccountV2 链上账户。launchType 字段返回 0（未初始化）或 3（LaunchPoolV1）。您也可以使用 GPA 构建器查询特定类型的所有发行。
  - q: 如何处理交易错误？
    a: 将 sendAndConfirm 调用包装在 try/catch 块中。常见错误包括资金不足、账户已初始化和时间条件违规。
---

Genesis JavaScript SDK 的 API 参考。完整教程请参阅 [Launch Pool](/zh/smart-contracts/genesis/launch-pool) 或 [Presale](/zh/smart-contracts/genesis/presale)。 {% .lead %}

{% quick-links %}

{% quick-link title="NPM Package" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/genesis" description="@metaplex-foundation/genesis" /%}

{% quick-link title="TypeDoc" target="_blank" icon="JavaScript" href="https://mpl-genesis.typedoc.metaplex.com/" description="自动生成的 API 文档" /%}

{% /quick-links %}

## 安装

```bash
npm install @metaplex-foundation/genesis @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-toolbox \
  @metaplex-foundation/mpl-token-metadata
```

## 设置

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { genesis } from '@metaplex-foundation/genesis';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(genesis())
  .use(mplTokenMetadata());
```

完整的实现示例请参阅 [Launch Pool](/zh/smart-contracts/genesis/launch-pool) 或 [Presale](/zh/smart-contracts/genesis/presale)。

---

## 指令参考

### 核心

| 函数 | 描述 |
|----------|-------------|
| [initializeV2()](#initialize-v2) | 创建 Genesis Account 并铸造代币 |
| [finalizeV2()](#finalize-v2) | 锁定配置，激活发行 |

### Buckets

| 函数 | 描述 |
|----------|-------------|
| [addLaunchPoolBucketV2()](#add-launch-pool-bucket-v2) | 添加按比例分配的 bucket |
| [addPresaleBucketV2()](#add-presale-bucket-v2) | 添加固定价格销售 bucket |
| [addUnlockedBucketV2()](#add-unlocked-bucket-v2) | 添加资金库/接收者 bucket |

### Launch Pool 操作

| 函数 | 描述 |
|----------|-------------|
| [depositLaunchPoolV2()](#deposit-launch-pool-v2) | 向 Launch Pool 存入 SOL |
| [withdrawLaunchPoolV2()](#withdraw-launch-pool-v2) | 提取 SOL（存款期间） |
| [claimLaunchPoolV2()](#claim-launch-pool-v2) | 领取代币（存款期结束后） |

### Presale 操作

| 函数 | 描述 |
|----------|-------------|
| [depositPresaleV2()](#deposit-presale-v2) | 向 Presale 存入 SOL |
| [claimPresaleV2()](#claim-presale-v2) | 领取代币（存款期结束后） |

### 管理员

| 函数 | 描述 |
|----------|-------------|
| [triggerBehaviorsV2()](#trigger-behaviors-v2) | 执行结束行为 |
| [revokeV2()](#revoke-v2) | 永久撤销铸造和冻结权限 |

---

## 函数签名

### initializeV2

```typescript
await initializeV2(umi, {
  baseMint,           // Signer - new token keypair
  quoteMint,          // PublicKey - deposit token (wSOL)
  fundingMode,        // number - use 0
  totalSupplyBaseToken, // bigint - supply with decimals
  name,               // string - token name
  symbol,             // string - token symbol
  uri,                // string - metadata URI
}).sendAndConfirm(umi);
```

### finalizeV2

```typescript
await finalizeV2(umi, {
  baseMint,           // PublicKey
  genesisAccount,     // PublicKey
}).sendAndConfirm(umi);
```

### addLaunchPoolBucketV2

```typescript
await addLaunchPoolBucketV2(umi, {
  genesisAccount,           // PublicKey
  baseMint,                 // PublicKey
  baseTokenAllocation,      // bigint - tokens for this bucket
  depositStartCondition,    // TimeCondition
  depositEndCondition,      // TimeCondition
  claimStartCondition,      // TimeCondition
  claimEndCondition,        // TimeCondition
  minimumDepositAmount,     // bigint | null
  endBehaviors,             // EndBehavior[]
}).sendAndConfirm(umi);
```

### addPresaleBucketV2

```typescript
await addPresaleBucketV2(umi, {
  genesisAccount,           // PublicKey
  baseMint,                 // PublicKey
  baseTokenAllocation,      // bigint
  allocationQuoteTokenCap,  // bigint - SOL cap (sets price)
  depositStartCondition,    // TimeCondition
  depositEndCondition,      // TimeCondition
  claimStartCondition,      // TimeCondition
  claimEndCondition,        // TimeCondition
  minimumDepositAmount,     // bigint | null
  depositLimit,             // bigint | null - max per user
  endBehaviors,             // EndBehavior[]
}).sendAndConfirm(umi);
```

### addUnlockedBucketV2

```typescript
await addUnlockedBucketV2(umi, {
  genesisAccount,       // PublicKey
  baseMint,             // PublicKey
  baseTokenAllocation,  // bigint - usually 0n
  recipient,            // PublicKey - who can claim
  claimStartCondition,  // TimeCondition
  claimEndCondition,    // TimeCondition
}).sendAndConfirm(umi);
```

### depositLaunchPoolV2

```typescript
await depositLaunchPoolV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  amountQuoteToken,   // bigint - lamports
}).sendAndConfirm(umi);
```

### depositPresaleV2

```typescript
await depositPresaleV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  amountQuoteToken,   // bigint - lamports
}).sendAndConfirm(umi);
```

### withdrawLaunchPoolV2

```typescript
await withdrawLaunchPoolV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  amountQuoteToken,   // bigint - lamports
}).sendAndConfirm(umi);
```

### claimLaunchPoolV2

```typescript
await claimLaunchPoolV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  recipient,          // PublicKey
}).sendAndConfirm(umi);
```

### claimPresaleV2

```typescript
await claimPresaleV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  recipient,          // PublicKey
}).sendAndConfirm(umi);
```

### triggerBehaviorsV2

```typescript
await triggerBehaviorsV2(umi, {
  genesisAccount,     // PublicKey
  primaryBucket,      // PublicKey
  baseMint,           // PublicKey
})
  .addRemainingAccounts([/* destination bucket + its quote token account */])
  .sendAndConfirm(umi);
```

### revokeV2

```typescript
await revokeV2(umi, {
  genesisAccount,           // PublicKey
  baseMint,                 // PublicKey
  revokeMintAuthority,      // boolean
  revokeFreezeAuthority,    // boolean
}).sendAndConfirm(umi);
```

---

## PDA 辅助函数

| 函数 | 种子 |
|----------|-------|
| findGenesisAccountV2Pda() | `baseMint`, `genesisIndex` |
| findLaunchPoolBucketV2Pda() | `genesisAccount`, `bucketIndex` |
| findPresaleBucketV2Pda() | `genesisAccount`, `bucketIndex` |
| findUnlockedBucketV2Pda() | `genesisAccount`, `bucketIndex` |
| findLaunchPoolDepositV2Pda() | `bucket`, `recipient` |
| findPresaleDepositV2Pda() | `bucket`, `recipient` |

```typescript
const [genesisAccountPda] = findGenesisAccountV2Pda(umi, { baseMint: mint.publicKey, genesisIndex: 0 });
const [bucketPda] = findLaunchPoolBucketV2Pda(umi, { genesisAccount: genesisAccountPda, bucketIndex: 0 });
const [depositPda] = findLaunchPoolDepositV2Pda(umi, { bucket: bucketPda, recipient: wallet });
```

---

## 获取函数

### Genesis 账户

Genesis 账户存储包括[发行类型](#launchtype)在内的顶层发行状态。后端 crank 在创建后通过 `setLaunchTypeV2` 指令在链上设置 `launchType` 字段，因此在 crank 处理之前，该值可能为 `Uninitialized`（0）。

| 函数 | 返回值 |
|----------|---------|
| fetchGenesisAccountV2() | Genesis 账户状态（不存在时抛出错误） |
| safeFetchGenesisAccountV2() | Genesis 账户状态或 `null` |
| fetchGenesisAccountV2FromSeeds() | 通过 PDA 种子（`baseMint`、`genesisIndex`）获取 |
| safeFetchGenesisAccountV2FromSeeds() | 同上，不存在时返回 `null` |
| fetchAllGenesisAccountV2() | 批量获取多个 Genesis 账户 |

```typescript
import {
  fetchGenesisAccountV2,
  fetchGenesisAccountV2FromSeeds,
  findGenesisAccountV2Pda,
  LaunchType,
} from '@metaplex-foundation/genesis';

// 通过 PDA 地址获取
const [genesisAccountPda] = findGenesisAccountV2Pda(umi, {
  baseMint: mintAddress,
  genesisIndex: 0,
});
const account = await fetchGenesisAccountV2(umi, genesisAccountPda);
console.log(account.data.launchType); // 0 = Uninitialized, 3 = LaunchPoolV1

// 直接通过种子获取
const account2 = await fetchGenesisAccountV2FromSeeds(umi, {
  baseMint: mintAddress,
  genesisIndex: 0,
});

// 检查发行类型
if (account2.data.launchType === LaunchType.LaunchPoolV1) {
  console.log('This is a launch pool');
}
```

**Genesis 账户字段：** `authority`、`baseMint`、`quoteMint`、`totalSupplyBaseToken`、`totalAllocatedSupplyBaseToken`、`totalProceedsQuoteToken`、`fundingMode`、`launchType`、`bucketCount`、`finalized`

### GPA 构建器 — 按发行类型查询

使用 `getGenesisAccountV2GpaBuilder()` 查询按链上字段过滤的所有 Genesis 账户。这使用 Solana 的字节级过滤器 `getProgramAccounts` RPC 方法进行高效查找。

```typescript
import {
  getGenesisAccountV2GpaBuilder,
  LaunchType,
} from '@metaplex-foundation/genesis';

// 获取所有 Launch Pool 发行
const launchpools = await getGenesisAccountV2GpaBuilder(umi)
  .whereField('launchType', LaunchType.LaunchPoolV1)
  .getDeserialized();

// 按多个字段过滤
const finalizedLaunchpools = await getGenesisAccountV2GpaBuilder(umi)
  .whereField('launchType', LaunchType.LaunchPoolV1)
  .whereField('finalized', true)
  .getDeserialized();

for (const account of launchpools) {
  console.log(account.publicKey, account.data.baseMint, account.data.launchType);
}
```

{% callout type="note" %}
`launchType` 在发行创建后由后端 crank 追溯设置。最近创建的发行可能会显示 `LaunchType.Uninitialized`（0），直到 crank 处理完毕。
{% /callout %}

### Bucket 和存款

| 函数 | 返回值 |
|----------|---------|
| fetchLaunchPoolBucketV2() | Bucket 状态（不存在时抛出错误） |
| safeFetchLaunchPoolBucketV2() | Bucket 状态或 `null` |
| fetchPresaleBucketV2() | Bucket 状态（不存在时抛出错误） |
| safeFetchPresaleBucketV2() | Bucket 状态或 `null` |
| fetchLaunchPoolDepositV2() | 存款状态（不存在时抛出错误） |
| safeFetchLaunchPoolDepositV2() | 存款状态或 `null` |
| fetchPresaleDepositV2() | 存款状态（不存在时抛出错误） |
| safeFetchPresaleDepositV2() | 存款状态或 `null` |

```typescript
const bucket = await fetchLaunchPoolBucketV2(umi, bucketPda);
const deposit = await safeFetchLaunchPoolDepositV2(umi, depositPda); // null if not found
```

**Bucket 状态字段：** `quoteTokenDepositTotal`、`depositCount`、`claimCount`、`bucket.baseTokenAllocation`

**存款状态字段：** `amountQuoteToken`、`claimed`

---

## 类型

### LaunchType

由后端 crank 通过 `setLaunchTypeV2` 指令追溯设置的链上发行类型。发行类型代表发行使用的底层机制。

```typescript
enum LaunchType {
  Uninitialized = 0,   // 尚未由 crank 设置
  LaunchPoolV1 = 3,    // Launch Pool（按比例分配）
}
```

[Integration APIs](/smart-contracts/genesis/integration-apis) 以字符串形式返回（`'launchpool'`），而链上 SDK 使用上述数字枚举。

### GenesisAccountV2

Genesis 发行的顶层链上账户。每个代币铸币地址、每个发行索引对应一个账户。

```typescript
{
  key: Key;
  bump: number;
  index: number;                          // Genesis 索引（通常为 0）
  finalized: boolean;                     // finalizeV2() 后为 true
  authority: PublicKey;                    // 发行创建者
  baseMint: PublicKey;                     // 正在发行的代币
  quoteMint: PublicKey;                    // 存款代币（例如 wSOL）
  totalSupplyBaseToken: bigint;            // 代币总供应量
  totalAllocatedSupplyBaseToken: bigint;   // 分配给 bucket 的供应量
  totalProceedsQuoteToken: bigint;         // 收集的总存款额
  fundingMode: number;                     // 资金模式（0）
  launchType: number;                      // 0 = 未初始化, 3 = LaunchPoolV1
  bucketCount: number;                     // Bucket 数量
}
```

账户大小：**136 字节**。PDA 种子：`["genesis_v2", baseMint, genesisIndex]`。

### TimeCondition

```typescript
{
  __kind: 'TimeAbsolute',
  padding: Array(47).fill(0),
  time: bigint,                    // Unix timestamp (seconds)
  triggeredTimestamp: null,
}
```

### EndBehavior

```typescript
{
  __kind: 'SendQuoteTokenPercentage',
  padding: Array(4).fill(0),
  destinationBucket: PublicKey,
  percentageBps: number,           // 10000 = 100%
  processed: false,
}
```

---

## 常量

| 常量 | 值 |
|----------|-------|
| `WRAPPED_SOL_MINT` | `So11111111111111111111111111111111111111112` |

---

## 常见错误

| 错误 | 原因 |
|-------|-------|
| `insufficient funds` | SOL 不足以支付费用 |
| `already initialized` | Genesis Account 已存在 |
| `already finalized` | 最终化后无法修改 |
| `deposit period not active` | 不在存款窗口内 |
| `claim period not active` | 不在领取窗口内 |

---

## 常见问题

### 什么是 Umi，为什么需要它？
Umi 是 Metaplex 的 Solana JavaScript 框架。它提供了统一的接口来构建交易、管理签名者以及与 Metaplex 程序交互。

### 我可以在浏览器中使用 Genesis SDK 吗？
可以。SDK 在 Node.js 和浏览器环境中都可以使用。在浏览器中，请使用钱包适配器进行签名，而不是密钥对文件。

### fetch 和 safeFetch 有什么区别？
`fetch` 在账户不存在时会抛出错误。`safeFetch` 则返回 `null`，适用于检查账户是否存在。

### 如何获取代币的发行类型？
使用代币的铸币地址通过 `fetchGenesisAccountV2FromSeeds()` 获取 `GenesisAccountV2` 账户。`launchType` 字段返回 `0`（未初始化）或 `3`（LaunchPoolV1）。要查询特定类型的所有发行，请使用 [GPA 构建器](#gpa-构建器--按发行类型查询)。或者，[Integration APIs](/smart-contracts/genesis/integration-apis) 在 REST 响应中以字符串形式返回发行类型。

### 如何处理交易错误？
将 `sendAndConfirm` 调用包装在 try/catch 块中。检查错误消息以了解具体的失败原因。

---

## 下一步

完整的实现教程：

- [开始使用](/zh/smart-contracts/genesis/getting-started) - 设置和首次发行
- [Launch Pool](/zh/smart-contracts/genesis/launch-pool) - 按比例分配
- [Presale](/zh/smart-contracts/genesis/presale) - 固定价格销售
