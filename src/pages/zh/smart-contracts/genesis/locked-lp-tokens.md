---
title: Locked LP Tokens
metaTitle: 毕业时的 LP 代币锁定 | Genesis Bonding Curve | Metaplex
description: 当 Genesis 联合曲线毕业时，Raydium CPMM 池中的 LP 代币会被程序锁定在 Genesis bucket 中，归属期设置为 never。了解如何在链上验证锁定。
created: '04-22-2026'
updated: '04-22-2026'
keywords:
  - locked LP tokens
  - LP token lock
  - graduation
  - bonding curve graduation
  - Raydium CPMM
  - program locked
  - program locked liquidity
  - Genesis
  - LP burn
  - liquidity lock
about:
  - LP token locking
  - Bonding curve graduation
  - Raydium CPMM liquidity
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 毕业时 LP 代币是被销毁还是被锁定？
    a: LP 代币是被程序锁定的，而不是被销毁。它们被转移到由 Genesis bucket 签名者 PDA 拥有的关联代币账户。bucket 的 lpLockSchedule 的 startCondition 和 cliffCondition 都设置为 Never，意味着没有钱包可以领取它们。
  - q: 任何人都可以提取被锁定的 LP 代币吗？
    a: 不能。RaydiumCpmmBucketV2 账户上的 lpLockSchedule 的 startCondition 和 cliffCondition 都设置为 Never。没有任何指令或权限可以释放它们。
  - q: 如何在链上验证 LP 代币已被锁定？
    a: 使用 Genesis SDK 获取 RaydiumCpmmBucketV2 账户，并检查 extensions.lpLockSchedule 的 startCondition.__kind 和 cliffCondition.__kind 都设置为 Never。lpTokenBalance 字段显示持有的 LP 代币的确切数量。
  - q: 销毁 LP 代币和程序锁定它们之间有什么区别？
    a: 销毁通过 SPL token burn 指令销毁代币，将它们从流通中永久移除。程序锁定将它们转移到归属期设置为 never 的 PDA — 代币仍存在于链上并可验证，但没有钱包可以提取它们。两种方法都使流动性变为永久性。
---

在[联合曲线毕业](/zh/smart-contracts/genesis/bonding-curve#lifecycle)期间创建的 LP 代币被程序锁定在 Genesis 拥有的 bucket 中。没有钱包可以提取它们。 {% .lead %}

## 概述

当 Genesis 联合曲线售罄并毕业进入 [Raydium CPMM](/zh/smart-contracts/genesis/bonding-curve-theory#phase-3-graduated) 池时，产生的 LP 代币会被转移到由 Genesis 程序拥有的 PDA。此 bucket 上的归属计划设置为 `Never`，使代币无法访问。

- **LP 代币不会被销毁** — 它们被转移到归属期设置为 never 的 Genesis bucket 签名者 PDA
- **程序锁定** — `lpLockSchedule.startCondition` 和 `cliffCondition` 都是 `Never`，因此没有指令或权限可以释放它们
- **链上可验证** — 获取 `RaydiumCpmmBucketV2` 账户以确认锁定计划和代币余额
- **自动发生** — 锁定作为毕业流程的一部分发生，无需手动步骤

## LP 代币锁定的工作原理

在毕业期间，LP 代币被存入由 **bucket 签名者 PDA**（一个没有私钥的程序派生地址）拥有的 ATA。`RaydiumCpmmBucketV2` 账户通过将 `lpLockSchedule.startCondition` 和 `cliffCondition` 都设置为 `{ __kind: 'Never' }` 来锁定它们，防止任何提取。

{% callout type="note" %}
一些平台将此称为 LP 代币"销毁"。在 Genesis 中，LP 代币不会被发送到销毁地址 — 它们保留在可验证的链上账户中。**程序锁定**这个术语更准确，因为代币存在并可被审计，但没有钱包可以访问它们。
{% /callout %}

### 毕业流程

1. 联合曲线售罄（`baseTokenBalance` 达到零）
2. 毕业自动触发 — 累积的 SOL 和代币迁移到 Raydium CPMM 池
3. Raydium 将 LP 代币返回给 Genesis 程序
4. LP 代币被存入 bucket 签名者的 ATA
5. `lpLockSchedule.startCondition` 和 `cliffCondition` 设置为 `Never` — 程序锁定 LP 代币

## 验证 LP 代币锁定

获取 `RaydiumCpmmBucketV2` 账户并检查 `lpLockSchedule` 扩展，以确认 LP 代币已被锁定。

### 派生账户

构成 LP 代币锁定的三个账户：

| 账户 | 描述 | 派生方式 |
|---------|-------------|---------------|
| **Raydium Bucket PDA** | 存储毕业状态和锁定配置的 `RaydiumCpmmBucketV2` 账户 | `findRaydiumCpmmBucketV2Pda(umi, { genesisAccount, bucketIndex })` |
| **Bucket Signer PDA** | 拥有 LP 代币 ATA 的 PDA — 没有私钥 | `findRaydiumBucketSignerPda(umi, { bucket })` |
| **Bucket Signer ATA** | 持有锁定的 LP 代币的关联代币账户 | 使用 bucket 签名者 + LP mint 的标准 ATA 派生 |

### 获取并检查锁定

```typescript {% title="verify-lp-lock.ts" showLineNumbers=true %}
import {
  genesis,
  findRaydiumCpmmBucketV2Pda,
  fetchRaydiumCpmmBucketV2,
  findRaydiumBucketSignerPda,
  findLpMintPda,
  RAYDIUM_CP_SWAP_PROGRAM_ID_MAINNET,
} from '@metaplex-foundation/genesis';
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox';

const umi = createUmi('https://api.mainnet-beta.solana.com').use(genesis());

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT_PUBKEY');

// 1. Derive the Raydium bucket PDA
const [raydiumBucketPda] = findRaydiumCpmmBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

// 2. Fetch the bucket account
const raydiumBucket = await fetchRaydiumCpmmBucketV2(umi, raydiumBucketPda);

// 3. Check the LP lock schedule
const lpLockSchedule = raydiumBucket.extensions.lpLockSchedule;

if (lpLockSchedule.__option === 'Some') {
  const schedule = lpLockSchedule.value;
  console.log('LP lock start condition:', schedule.startCondition.__kind);
  console.log('LP lock cliff condition:', schedule.cliffCondition.__kind);
  // Expected output: both "Never"
}

console.log('LP token balance:', raydiumBucket.lpTokenBalance);

// 4. Derive the bucket signer PDA
const [bucketSignerPda] = findRaydiumBucketSignerPda(umi, {
  bucket: raydiumBucketPda,
});

console.log('Bucket signer (LP token owner):', bucketSignerPda);

// 5. Derive the LP mint from the pool state
const [lpMint] = findLpMintPda(umi, RAYDIUM_CP_SWAP_PROGRAM_ID_MAINNET, raydiumBucket.poolState);

// 6. Derive the bucket signer's ATA for the LP mint
const [bucketSignerAta] = findAssociatedTokenPda(umi, {
  mint: lpMint,
  owner: bucketSignerPda,
});

console.log('LP mint:', lpMint);
console.log('Bucket signer ATA (holds LP tokens):', bucketSignerAta);
```

### 预期输出

当 LP 代币被程序锁定时，输出确认：

```
LP lock start condition: Never
LP lock cliff condition: Never
LP token balance: 123456789
Bucket signer (LP token owner): <PDA address>
LP mint: <LP mint address>
Bucket signer ATA (holds LP tokens): <ATA address>
```

`startCondition.__kind` 的值为 `Never` 确认归属不会开始，`cliffCondition` 的 `Never` 确认没有悬崖释放。两者共同证明 LP 代币无法被提取。

## RaydiumCpmmBucketV2 账户字段

与 LP 代币锁定相关的 `RaydiumCpmmBucketV2` 账户的关键字段：

| 字段 | 类型 | 描述 |
|-------|------|-------------|
| `lpTokenBalance` | `bigint` | bucket 签名者的 ATA 中持有的 LP 代币数量 |
| `lpClaimAuthority` | `Option<PublicKey>` | 可以领取 LP 代币的权限 — 未设置权限时为 `None` |
| `lpTokensClaimed` | `bigint` | 累计已领取的 LP 代币（完全锁定时为零） |
| `bucketSigner` | `PublicKey` | 拥有持有 LP 代币的 ATA 的 PDA |
| `extensions.lpLockSchedule` | `Option<ClaimSchedule>` | LP 代币的归属计划 — `startCondition` 设置为 `Never` |
| `poolState` | `PublicKey` | Raydium CPMM 池状态账户的地址（不是 LP mint — 读取池状态以获取 LP mint） |

### ClaimSchedule 字段

`lpLockSchedule` 扩展是一个具有以下字段的 `ClaimSchedule`：

| 字段 | 类型 | 描述 |
|-------|------|-------------|
| `startCondition` | `Condition` | 何时可以开始领取 — 程序锁定时为 `{ __kind: 'Never' }` |
| `duration` | `bigint` | 归属持续时间（秒）（开始为 `Never` 时无关） |
| `period` | `bigint` | 归属期间间隔（开始为 `Never` 时无关） |
| `cliffCondition` | `Condition` | 归属的悬崖条件 — LP 锁定时也为 `{ __kind: 'Never' }` |
| `cliffAmountBps` | `number` | 悬崖解锁百分比（基点）（开始为 `Never` 时无关） |

{% callout type="note" %}
`duration`、`period` 和 `cliffAmountBps` 字段存在于 `ClaimSchedule` 结构中，但当 `startCondition` 和 `cliffCondition` 都为 `Never` 时，它们在功能上无关。归属和悬崖释放都不能开始。
{% /callout %}


## FAQ

### 毕业时 LP 代币是被销毁还是被锁定？

LP 代币是被程序锁定的，而不是被销毁。它们被转移到由 Genesis bucket 签名者 PDA 拥有的[关联代币账户](/zh/solana/understanding-solana-accounts#associated-token-accounts-atas)。bucket 的 `lpLockSchedule` 的 `startCondition` 和 `cliffCondition` 都设置为 `Never`，意味着没有钱包可以领取它们。

### 任何人都可以提取被锁定的 LP 代币吗？

不能。`RaydiumCpmmBucketV2` 账户上的 `lpLockSchedule` 的 `startCondition` 和 `cliffCondition` 都设置为 `Never`。没有任何指令或权限可以释放它们。

### 如何在链上验证 LP 代币已被锁定？

使用 Genesis SDK 获取 `RaydiumCpmmBucketV2` 账户，并检查 `extensions.lpLockSchedule` 的 `startCondition.__kind` 和 `cliffCondition.__kind` 都设置为 `Never`。`lpTokenBalance` 字段显示持有的 LP 代币的确切数量。完整代码示例请参阅[验证 LP 代币锁定](#验证-lp-代币锁定)。

### 销毁 LP 代币和程序锁定它们之间有什么区别？

销毁通过 SPL token burn 指令销毁代币，将它们从流通中永久移除。程序锁定将它们转移到归属期设置为 `Never` 的 PDA — 代币仍存在于链上并可验证，但没有钱包可以提取它们。两种方法都使流动性变为永久性。

## 术语表

| 术语 | 定义 |
|------|------------|
| **Graduation** | 联合曲线售罄时触发的自动流程 — 将累积的 SOL 和代币迁移到 Raydium CPMM 池 |
| **LP Token** | 代表 Raydium CPMM 池份额的流动性提供者代币 |
| **Program-Locked** | 持有在 PDA 拥有的账户中且没有提取路径的代币 — 无法访问但可在链上验证 |
| **Bucket Signer PDA** | 拥有持有 LP 代币的 ATA 的程序派生地址；没有私钥 |
| **ClaimSchedule** | 具有开始条件、持续时间、期间和悬崖的归属配置 — 用于 Raydium bucket 定义 LP 代币释放规则 |
| **Condition: Never** | 永远无法满足的条件变体 — 在 `lpLockSchedule` 上同时用作 `startCondition` 和 `cliffCondition` 以防止 LP 代币领取 |
| **RaydiumCpmmBucketV2** | 存储毕业后状态（包括 Raydium 池引用、LP 代币余额和锁定计划）的 Genesis 账户 |
