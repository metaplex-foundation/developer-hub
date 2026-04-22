---
title: Genesis 联合曲线创作者费
metaTitle: Genesis 联合曲线创作者费——配置与认领 | Metaplex
description: 如何在 Genesis 联合曲线发行中配置创作者费，在活跃曲线期间认领累积费用，以及从 Raydium CPMM 池收集和认领毕业后费用。
keywords:
  - creator fee
  - bonding curve
  - genesis
  - claimBondingCurveCreatorFeeV2
  - claimRaydiumCreatorFeeV2
  - collectRaydiumCpmmFeesWithCreatorFeeV2
  - deriveRaydiumPDAsV2
  - findRaydiumCpmmBucketV2Pda
  - fetchRaydiumCpmmBucketV2
  - creatorFeeWallet
  - creatorFeeAccrued
  - RaydiumCpmmBucketV2
  - Raydium CPMM
  - token launch
  - Solana
about:
  - Creator Fees
  - Bonding Curve
  - Genesis
  - Solana
programmingLanguage:
  - JavaScript
  - TypeScript
proficiencyLevel: Intermediate
created: '04-09-2026'
updated: '04-13-2026'
howToSteps:
  - Set creatorFeeWallet in the launch object when calling createAndRegisterLaunch
  - After launch, monitor creatorFeeAccrued in the bucket account using fetchBondingCurveBucketV2
  - Call claimBondingCurveCreatorFeeV2 to collect accrued fees during the active curve
  - After graduation, call collectRaydiumCpmmFeesWithCreatorFeeV2 to harvest LP fees from the Raydium pool into the Genesis bucket
  - Call claimRaydiumCreatorFeeV2 to transfer the accumulated bucket balance to the creator wallet
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: 未设置 creatorFeeWallet 时默认的创作者费钱包是什么？
    a: 默认是发行钱包——签署 createLaunch 调用的钱包。在 launch 对象中显式设置 creatorFeeWallet 可将费用重定向到任何其他地址。
  - q: 创作者费是在每次兑换时转账的吗？
    a: 不是。创作者费在每次兑换时累积到 bucket 中（creatorFeeAccrued），不会立即转账。在活跃曲线期间调用 claimBondingCurveCreatorFeeV2 认领。毕业后调用 collectRaydiumCpmmFeesWithCreatorFeeV2 从 Raydium 池收集 LP 费用，然后调用 claimRaydiumCreatorFeeV2 转移到创作者钱包。
  - q: 任何人都可以调用 claimBondingCurveCreatorFeeV2 或 claimRaydiumCreatorFeeV2 吗？
    a: 是的。三条无需许可的费用指令横跨活跃曲线和毕业后两个阶段——collectRaydiumCpmmFeesWithCreatorFeeV2 和 claimBondingCurveCreatorFeeV2（活跃曲线）以及 claimRaydiumCreatorFeeV2（毕业后）。任何钱包都可以触发，但 SOL 始终发送到配置的创作者费钱包，而非调用方。
  - q: collectRaydiumCpmmFeesWithCreatorFeeV2 和 claimRaydiumCreatorFeeV2 有什么区别？
    a: collectRaydiumCpmmFeesWithCreatorFeeV2 从 Raydium CPMM 池中收集累积的 LP 交易费用到 Genesis RaydiumCpmmBucketV2 bucket。claimRaydiumCreatorFeeV2 将 bucket 中的余额转移到创作者费钱包。要完整收取毕业后费用，两个步骤都是必需的。
  - q: 首次购买需要支付创作者费吗？
    a: 不需要。配置首次购买时，协议兑换费和创作者费均对该一次性初始购买豁免。之后所有兑换正常支付创作者费。
  - q: 如何检查已累积了多少创作者费？
    a: 活跃曲线期间，使用 fetchBondingCurveBucketV2 从 BondingCurveBucketV2 读取 creatorFeeAccrued 字段。毕业后，使用 fetchRaydiumCpmmBucketV2 从 RaydiumCpmmBucketV2 读取 creatorFeeAccrued。请参阅检查累积的创作者费和检查累积的 Raydium 创作者费部分。
  - q: 发行后可以更改创作者费钱包吗？
    a: 不可以。创作者费钱包在曲线创建时设定，曲线上线后无法更改。
---

创作者费是 [Genesis 联合曲线](/smart-contracts/genesis/bonding-curve)上的可选每次兑换费用，在每次买入和卖出时累积到配置的钱包。{% .lead %}

{% callout title="本指南涵盖内容" %}
- 发行时配置创作者费钱包
- 将费用重定向到特定钱包或 Agent PDA
- 检查 bucket 中累积了多少费用
- 在活跃曲线期间认领累积费用
- 从 Raydium CPMM 池认领毕业后的费用
{% /callout %}

## 摘要

创作者费是 Genesis 联合曲线上的可选每次兑换费用，应用于每次买入和卖出的 SOL 侧。费用累积在 bucket 账户（`creatorFeeAccrued`）中而非立即转账——通过两个无需许可的指令收取。

- **配置** — 在曲线创建时的 `launch` 对象中设置 `creatorFeeWallet`；省略时默认为发行钱包
- **累积** — `creatorFeeAccrued` 在每次兑换时增加；费用不按次转账
- **活跃曲线认领** — `claimBondingCurveCreatorFeeV2` 在曲线活跃时收取累积费用
- **毕业后认领** — 两步流程：`collectRaydiumCpmmFeesWithCreatorFeeV2` 从 Raydium 池收集 LP 费用到 Genesis bucket，然后 `claimRaydiumCreatorFeeV2` 将 bucket 余额转移到创作者钱包

关于创作者费如何与兑换定价和协议兑换费交互，请参阅[运作原理——手续费结构](/smart-contracts/genesis/bonding-curve-theory#fee-structure)。

## 快速开始

本节介绍在活跃曲线和毕业后两个阶段配置和认领创作者费的最少步骤。

### 快速参考

| 指令 | 使用时机 | 必需账户 | 输出 / 效果 |
|---|---|---|---|
| `createAndRegisterLaunch`（设置 `creatorFeeWallet`） | 曲线创建时 | 创作者钱包、发行签名者 | 在 bucket 上配置费用钱包 |
| `fetchBondingCurveBucketV2`（读取 `creatorFeeAccrued`） | 活跃曲线期间任何时候 | Bucket PDA | 当前累积费用余额（lamports） |
| `claimBondingCurveCreatorFeeV2` | 活跃曲线——收取累积费用 | Genesis 账户、bucket PDA、base mint、创作者费钱包 | 累积 SOL 转移到创作者钱包 |
| `collectRaydiumCpmmFeesWithCreatorFeeV2` | 毕业后——收割 LP 费用 | Genesis 账户、Raydium 池 PDA、Raydium bucket PDA | LP 费用从 Raydium 池移至 Genesis bucket |
| `claimRaydiumCreatorFeeV2` | 毕业后——认领 bucket 余额 | Genesis 账户、Raydium bucket PDA、base/quote mint、创作者费钱包 | Bucket 余额转移到创作者钱包 |

**跳转至：** [发行时配置](#发行时配置创作者费) · [重定向到钱包](#将创作者费重定向到特定钱包) · [Agent PDA](#agent-发行自动-pda-路由) · [与首次购买组合](#将创作者费与首次购买组合) · [检查累积费用（曲线）](#检查累积的创作者费) · [活跃曲线期间认领](#在活跃曲线期间认领创作者费) · [检查 Raydium 费用](#检查累积的-raydium-创作者费) · [从 Raydium 收集](#步骤-1--从-raydium-cpmm-池收集费用) · [毕业后认领](#步骤-2--认领费用到创作者钱包)

1. 调用 `createAndRegisterLaunch` 时在 `launch` 对象中设置 `creatorFeeWallet`
2. 发行后读取 `bucket.creatorFeeAccrued` 监控累积费用
3. 调用 `claimBondingCurveCreatorFeeV2` 在曲线活跃时收取费用
4. 毕业后调用 `collectRaydiumCpmmFeesWithCreatorFeeV2` 从 Raydium 池收集 LP 费用
5. 调用 `claimRaydiumCreatorFeeV2` 将 bucket 余额转移到创作者钱包

## 前置条件

您需要 Genesis SDK、已配置的 Umi 实例和已充值的 Solana 钱包。

- 已安装 `@metaplex-foundation/genesis` SDK
- 配置了密钥对身份的 Umi 实例——详见[通过 Metaplex API 发行联合曲线](/smart-contracts/genesis/bonding-curve-launch#umi-setup)
- 用于支付交易费用的已充值 Solana 钱包

## 发行时配置创作者费

创作者费在传递给 `createAndRegisterLaunch`（或 `createLaunch`）的 `launch` 对象中配置。`creatorFeeWallet` 字段是可选的——省略时发行钱包默认接收所有费用。完整发行流程请参阅[通过 Metaplex API 发行联合曲线](/smart-contracts/genesis/bonding-curve-launch)。

### 将创作者费重定向到特定钱包

将 `creatorFeeWallet` 设置为任意钱包地址，将累积费用引导到发行钱包以外的地址。

```typescript {% title="launch-with-creator-fee.ts" showLineNumbers=true %}
import { createAndRegisterLaunch } from '@metaplex-foundation/genesis/api';

const result = await createAndRegisterLaunch(umi, {}, {
  wallet: umi.identity.publicKey,
  launchType: 'bondingCurve',
  token: {
    name: 'My Token',
    symbol: 'MTK',
    image: 'https://gateway.irys.xyz/your-image-id',
  },
  launch: {
    creatorFeeWallet: 'FeeRecipientWalletAddress...',
  },
});
```

{% callout type="note" %}
创作者费钱包在曲线创建时设定，曲线上线后无法更改。
{% /callout %}

### Agent 发行——自动 PDA 路由

代表 Metaplex Agent 发行时，创作者费自动路由到 Agent 的 PDA，无需手动设置 `creatorFeeWallet`。完整 Agent 发行流程——Core execute 封装和 `setToken` 关联——请参阅[创建 Agent 代币](/agents/create-agent-token)。

### 将创作者费与首次购买组合

可以同时配置创作者费钱包和首次购买。首次购买始终免费——不收取协议费或创作者费。之后所有兑换正常收取创作者费。

```typescript {% title="launch-with-fee-and-first-buy.ts" %}
launch: {
  creatorFeeWallet: 'FeeRecipientWalletAddress...',
  firstBuyAmount: 0.5, // 0.5 SOL，首次购买者免费
},
```

## 检查累积的创作者费

`BondingCurveBucketV2` 账户上的 `creatorFeeAccrued` 字段追踪自上次认领以来累积的 SOL 总量。使用 `fetchBondingCurveBucketV2` 读取：

```typescript {% title="check-creator-fees.ts" showLineNumbers=true %}
import {
  findBondingCurveBucketV2Pda,
  fetchBondingCurveBucketV2,
} from '@metaplex-foundation/genesis';
import { isSome, publicKey } from '@metaplex-foundation/umi';

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT_PUBKEY');
const baseMint = publicKey('TOKEN_MINT_PUBKEY');

const [bucketPda] = findBondingCurveBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

const bucket = await fetchBondingCurveBucketV2(umi, bucketPda);
console.log('Creator fees accrued (lamports):', bucket.creatorFeeAccrued);
console.log('Creator fees claimed to date (lamports):', bucket.creatorFeeClaimed);

// 从 bucket 扩展中读取配置的创作者费钱包
const creatorFeeExt = bucket.extensions.creatorFee;
const creatorFeeWallet = isSome(creatorFeeExt) ? creatorFeeExt.value.wallet : null;
console.log('Creator fee wallet:', creatorFeeWallet?.toString() ?? 'none configured');
```

## 在活跃曲线期间认领创作者费

`claimBondingCurveCreatorFeeV2` 将所有累积的创作者费从 bucket 转移到配置的创作者费钱包。可在曲线活跃期间任何时间调用。

```typescript {% title="claim-creator-fees.ts" showLineNumbers=true %}
import { claimBondingCurveCreatorFeeV2 } from '@metaplex-foundation/genesis';
import { isSome } from '@metaplex-foundation/umi';

// 认领前从 bucket 扩展读取创作者费钱包。
const creatorFeeExt = bucket.extensions.creatorFee;
if (!isSome(creatorFeeExt)) throw new Error('No creator fee configured on this bucket');
const creatorFeeWallet = creatorFeeExt.value.wallet;

const result = await claimBondingCurveCreatorFeeV2(umi, {
  genesisAccount,
  bucket: bucketPda,
  baseMint,
  creatorFeeWallet,
}).sendAndConfirm(umi);

console.log('Creator fees claimed:', result.signature);
```

{% callout type="note" %}
`claimBondingCurveCreatorFeeV2` 是无需许可的——任何钱包都可以调用它，但 SOL 始终发送到配置的创作者费钱包，而非调用方。
{% /callout %}

## 毕业后认领创作者费

联合曲线[毕业](/smart-contracts/genesis/bonding-curve-theory#phase-3-graduated)后，流动性迁移到 Raydium CPMM 池，创作者费继续从 LP 交易活动中累积。毕业后费用收取是一个**两步流程**：首先从 Raydium 池收集累积的 LP 交易费用到 Genesis `RaydiumCpmmBucketV2` bucket，然后认领 bucket 余额到创作者钱包。

### 检查累积的 Raydium 创作者费

`RaydiumCpmmBucketV2` 账户暴露了类似于 `BondingCurveBucketV2` 的 `creatorFeeAccrued` 和 `creatorFeeClaimed` 字段。使用 `findRaydiumCpmmBucketV2Pda` 和 `fetchRaydiumCpmmBucketV2` 进行派生和获取。

```typescript {% title="check-raydium-fees.ts" showLineNumbers=true %}
import {
  findRaydiumCpmmBucketV2Pda,
  fetchRaydiumCpmmBucketV2,
} from '@metaplex-foundation/genesis';
import { isSome, publicKey } from '@metaplex-foundation/umi';

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT_PUBKEY');

const [raydiumBucketPda] = findRaydiumCpmmBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

const raydiumBucket = await fetchRaydiumCpmmBucketV2(umi, raydiumBucketPda);
const claimable = raydiumBucket.creatorFeeAccrued - raydiumBucket.creatorFeeClaimed;
console.log('Claimable Raydium creator fees (lamports):', claimable);

const creatorFeeExt = raydiumBucket.extensions.creatorFee;
const creatorFeeWallet = isSome(creatorFeeExt) ? creatorFeeExt.value.wallet : null;
console.log('Creator fee wallet:', creatorFeeWallet?.toString() ?? 'none configured');
```

{% callout type="note" %}
`raydiumBucket.creatorFeeAccrued` 仅反映已从 Raydium 池收集到 bucket 中的费用。Raydium 池本身可能持有额外的未收集 LP 费用——在读取最终可认领余额之前，运行 `collectRaydiumCpmmFeesWithCreatorFeeV2` 将其移至 bucket。
{% /callout %}

### 步骤 1 — 从 Raydium CPMM 池收集费用

`collectRaydiumCpmmFeesWithCreatorFeeV2` 从 Raydium CPMM 池收集累积的 LP 交易费用，将其记入 `RaydiumCpmmBucketV2` bucket 签名者的代币账户，并更新 `creatorFeeAccrued`。必须在认领之前运行此步骤——在从 Raydium 收集费用之前，没有可认领的内容。

使用 `deriveRaydiumPDAsV2` 从 base mint 和 bucket 地址计算所有必需的 Raydium 池账户。传递 `creatorFee: true` 以选择创作者费 AMM 配置。

```typescript {% title="collect-raydium-fees.ts" showLineNumbers=true %}
import {
  collectRaydiumCpmmFeesWithCreatorFeeV2,
  deriveRaydiumPDAsV2,
  findRaydiumCpmmBucketV2Pda,
} from '@metaplex-foundation/genesis';
import { publicKey } from '@metaplex-foundation/umi';

const baseMint = publicKey('TOKEN_MINT_PUBKEY');
const quoteMint = publicKey('So11111111111111111111111111111111111111112'); // wSOL

const [raydiumBucketPda] = findRaydiumCpmmBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

const pdas = deriveRaydiumPDAsV2(umi, baseMint, raydiumBucketPda, {
  quoteMint,
  env: 'mainnet', // or 'devnet'
  creatorFee: true,
});

await collectRaydiumCpmmFeesWithCreatorFeeV2(umi, {
  baseMint,
  quoteMint,
  genesisAccount,
  poolState: pdas.poolState,
  raydiumCpmmBucket: raydiumBucketPda,
  ammConfig: pdas.ammConfig,
  poolAuthority: pdas.poolAuthority,
  baseVault: pdas.baseVault,
  quoteVault: pdas.quoteVault,
  raydiumProgram: pdas.raydiumProgram,
}).sendAndConfirm(umi);

console.log('Raydium LP fees collected into Genesis bucket');
```

{% callout type="note" %}
`collectRaydiumCpmmFeesWithCreatorFeeV2` 是无需许可的——任何钱包都可以调用。收集的费用流入 Genesis bucket 签名者的代币账户，并在下次 bucket 获取时反映在 `creatorFeeAccrued` 中。
{% /callout %}

### 步骤 2 — 认领费用到创作者钱包

`claimRaydiumCreatorFeeV2` 将 `RaydiumCpmmBucketV2` bucket 中累积的余额转移到配置的创作者费钱包。在收集后运行，或在 bucket 持有来自先前收集的未认领余额时随时运行。

```typescript {% title="claim-raydium-creator-fees.ts" showLineNumbers=true %}
import {
  claimRaydiumCreatorFeeV2,
  fetchRaydiumCpmmBucketV2,
  findRaydiumCpmmBucketV2Pda,
} from '@metaplex-foundation/genesis';
import { isSome, publicKey } from '@metaplex-foundation/umi';

const [raydiumBucketPda] = findRaydiumCpmmBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

// 收集后重新获取以取得更新的 creatorFeeAccrued。
const raydiumBucket = await fetchRaydiumCpmmBucketV2(umi, raydiumBucketPda);

const creatorFeeExt = raydiumBucket.extensions.creatorFee;
if (!isSome(creatorFeeExt)) throw new Error('No creator fee configured on this Raydium bucket');
const creatorFeeWallet = creatorFeeExt.value.wallet;

await claimRaydiumCreatorFeeV2(umi, {
  genesisAccount: raydiumBucket.bucket.genesis,
  bucket: raydiumBucketPda,
  baseMint: raydiumBucket.bucket.baseMint,
  quoteMint: raydiumBucket.bucket.quoteMint,
  creatorFeeWallet,
}).sendAndConfirm(umi);

console.log('Raydium creator fees claimed to:', creatorFeeWallet.toString());
```

{% callout type="note" %}
`claimRaydiumCreatorFeeV2` 是无需许可的——任何钱包都可以触发认领，但 SOL（作为 wSOL）始终发送到配置的创作者费钱包，而非调用方。
{% /callout %}

### 收集与认领合并流程

将两个构建器链式组合在单个交易中完成收集和认领。如果池中没有未收集的费用且 bucket 余额为零，请跳过两条指令以避免无效交易。

```typescript {% title="collect-and-claim-raydium.ts" showLineNumbers=true %}
import {
  collectRaydiumCpmmFeesWithCreatorFeeV2,
  claimRaydiumCreatorFeeV2,
  deriveRaydiumPDAsV2,
  fetchRaydiumCpmmBucketV2,
  findRaydiumCpmmBucketV2Pda,
} from '@metaplex-foundation/genesis';
import { isSome, publicKey, transactionBuilder } from '@metaplex-foundation/umi';

const baseMint = publicKey('TOKEN_MINT_PUBKEY');
const quoteMint = publicKey('So11111111111111111111111111111111111111112');
const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT_PUBKEY');

const [raydiumBucketPda] = findRaydiumCpmmBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

const raydiumBucket = await fetchRaydiumCpmmBucketV2(umi, raydiumBucketPda);

const creatorFeeExt = raydiumBucket.extensions.creatorFee;
if (!isSome(creatorFeeExt)) throw new Error('No creator fee configured');
const creatorFeeWallet = creatorFeeExt.value.wallet;

const pdas = deriveRaydiumPDAsV2(umi, baseMint, raydiumBucketPda, {
  quoteMint,
  env: 'mainnet', // or 'devnet'
  creatorFee: true,
});

await transactionBuilder()
  .add(collectRaydiumCpmmFeesWithCreatorFeeV2(umi, {
    baseMint,
    quoteMint,
    genesisAccount,
    poolState: pdas.poolState,
    raydiumCpmmBucket: raydiumBucketPda,
    ammConfig: pdas.ammConfig,
    poolAuthority: pdas.poolAuthority,
    baseVault: pdas.baseVault,
    quoteVault: pdas.quoteVault,
    raydiumProgram: pdas.raydiumProgram,
  }))
  .add(claimRaydiumCreatorFeeV2(umi, {
    genesisAccount,
    bucket: raydiumBucketPda,
    baseMint,
    quoteMint,
    creatorFeeWallet,
  }))
  .sendAndConfirm(umi);

console.log('Raydium creator fees collected and claimed to:', creatorFeeWallet.toString());
```

## 注意事项

以下注意事项涵盖费用时机、无需许可的认领、两步毕业后流程以及首次购买费用豁免。

- 创作者费在每次兑换时累积到 bucket（`creatorFeeAccrued`），不会立即转账——需显式调用认领指令才能收取；`creatorFeeClaimed` 追踪迄今累积认领的总额
- `claimBondingCurveCreatorFeeV2` 和 `claimRaydiumCreatorFeeV2` 均无需许可：任何钱包都可以触发，但 SOL 始终流向配置的创作者费钱包，而非调用方；`collectRaydiumCpmmFeesWithCreatorFeeV2` 也是无需许可的
- 毕业后费用需要按顺序两个步骤：`collectRaydiumCpmmFeesWithCreatorFeeV2`（从 Raydium 池收集 → Genesis bucket），然后 `claimRaydiumCreatorFeeV2`（bucket → 创作者钱包）；两者可合并到单个交易中
- `creatorFeeAccrued` 和 `creatorFeeClaimed` 同时存在于 `BondingCurveBucketV2`（活跃曲线）和 `RaydiumCpmmBucketV2`（毕业后）上；分别使用 `fetchBondingCurveBucketV2` 和 `fetchRaydiumCpmmBucketV2`
- `creatorFeeWallet` 未设置时默认为发行钱包；曲线创建后无法更改
- 首次购买机制仅对指定的初始购买豁免所有费用（协议费和创作者费）；之后所有兑换正常收取创作者费
- 创作者费应用于每次兑换的 SOL 侧，无论方向（买入或卖出）；不与协议兑换费复利
- 当前费率请参阅 [Genesis 协议费用](/smart-contracts/genesis)页面
- 兑换侧上下文——读取 bucket 状态、计算报价和执行交易——请参阅[联合曲线兑换集成](/smart-contracts/genesis/bonding-curve-swaps)

## FAQ

### 未设置 `creatorFeeWallet` 时默认的创作者费钱包是什么？

默认的创作者费钱包是发行钱包——签署 `createLaunch` 调用的钱包。在 `launch` 对象中显式设置 `creatorFeeWallet` 可将费用重定向到任何其他地址。

### 创作者费是在每次兑换时转账的吗？

不是。创作者费在每次兑换时累积到 bucket（`creatorFeeAccrued`），不会立即转账。在活跃曲线期间调用 `claimBondingCurveCreatorFeeV2` 认领。毕业后调用 `collectRaydiumCpmmFeesWithCreatorFeeV2` 从 Raydium 池收集 LP 费用，然后调用 `claimRaydiumCreatorFeeV2` 转移到创作者钱包。

### 任何人都可以调用 `claimBondingCurveCreatorFeeV2` 或 `claimRaydiumCreatorFeeV2` 吗？

是的。三条无需许可的费用指令横跨活跃曲线和毕业后两个阶段——`collectRaydiumCpmmFeesWithCreatorFeeV2` 和 `claimBondingCurveCreatorFeeV2`（活跃曲线）以及 `claimRaydiumCreatorFeeV2`（毕业后）。任何钱包都可以触发，但 SOL 始终发送到配置的创作者费钱包，而非调用方。

### `collectRaydiumCpmmFeesWithCreatorFeeV2` 和 `claimRaydiumCreatorFeeV2` 有什么区别？

`collectRaydiumCpmmFeesWithCreatorFeeV2` 从 Raydium CPMM 池中拉取累积的 LP 交易费用到 Genesis `RaydiumCpmmBucketV2` bucket——这会更新 bucket 上的 `creatorFeeAccrued`。`claimRaydiumCreatorFeeV2` 然后将该 bucket 余额转移到创作者费钱包。必须先运行收集再运行认领；没有收集，就没有 bucket 余额可认领。

### 为什么我的 Raydium bucket 上的 `creatorFeeAccrued` 在池活跃时为零？

`RaydiumCpmmBucketV2` 上的 `creatorFeeAccrued` 仅反映通过 `collectRaydiumCpmmFeesWithCreatorFeeV2` 从 Raydium 收集到 Genesis bucket 的费用。LP 交易费用首先在 Raydium 池状态内累积——直到运行收集指令，它们才会出现在 Genesis bucket 中。

### 首次购买需要支付创作者费吗？

不需要。配置首次购买时，协议兑换费和创作者费均对该一次性初始购买豁免。之后所有兑换正常支付创作者费。

### 如何检查已累积了多少创作者费？

活跃曲线期间，使用 `fetchBondingCurveBucketV2` 从 `BondingCurveBucketV2` 读取 `creatorFeeAccrued` 字段。毕业后，使用 `fetchRaydiumCpmmBucketV2` 从 `RaydiumCpmmBucketV2` 读取 `creatorFeeAccrued`。详见[检查累积的创作者费](#检查累积的创作者费)和[检查累积的 Raydium 创作者费](#检查累积的-raydium-创作者费)。

### 发行后可以更改创作者费钱包吗？

不可以。创作者费钱包在曲线创建时设定，曲线上线后无法更改。
