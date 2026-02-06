---
title: JavaScript SDK
metaTitle: JavaScript SDK | Genesis | Metaplex
description: Genesis JavaScript SDK 的 API 参考。Solana 上代币发行的函数签名、参数和类型。
created: '01-15-2025'
updated: '01-31-2026'
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
| [transitionV2()](#transition-v2) | 执行结束行为 |
| [revokeMintAuthorityV2()](#revoke-mint-authority-v2) | 永久撤销铸造权限 |
| [revokeFreezeAuthorityV2()](#revoke-freeze-authority-v2) | 永久撤销冻结权限 |

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
  backendSigner,        // { signer: PublicKey } | null
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

### transitionV2

```typescript
await transitionV2(umi, {
  genesisAccount,     // PublicKey
  primaryBucket,      // PublicKey
  baseMint,           // PublicKey
})
  .addRemainingAccounts([/* destination accounts */])
  .sendAndConfirm(umi);
```

### revokeMintAuthorityV2

```typescript
await revokeMintAuthorityV2(umi, {
  baseMint,           // PublicKey
}).sendAndConfirm(umi);
```

### revokeFreezeAuthorityV2

```typescript
await revokeFreezeAuthorityV2(umi, {
  baseMint,           // PublicKey
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

### 如何处理交易错误？
将 `sendAndConfirm` 调用包装在 try/catch 块中。检查错误消息以了解具体的失败原因。

---

## 下一步

完整的实现教程：

- [开始使用](/zh/smart-contracts/genesis/getting-started) - 设置和首次发行
- [Launch Pool](/zh/smart-contracts/genesis/launch-pool) - 按比例分配
- [Presale](/zh/smart-contracts/genesis/presale) - 固定价格销售
