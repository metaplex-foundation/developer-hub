---
title: Genesis 联合曲线创作者费
metaTitle: Genesis 联合曲线创作者费——配置与认领 | Metaplex
description: 如何在 Genesis 联合曲线发行中配置创作者费，以及在活跃曲线期间和毕业到 Raydium CPMM 池后认领累积的费用。
keywords:
  - creator fee
  - bonding curve
  - genesis
  - claimBondingCurveCreatorFeeV2
  - claimRaydiumCreatorFeeV2
  - creatorFeeWallet
  - creatorFeeAccrued
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
updated: '04-09-2026'
howToSteps:
  - Set creatorFeeWallet in the launch object when calling createAndRegisterLaunch
  - After launch, monitor creatorFeeAccrued in the bucket account using fetchBondingCurveBucketV2
  - Call claimBondingCurveCreatorFeeV2 to collect accrued fees during the active curve
  - After graduation, call claimRaydiumCreatorFeeV2 to collect fees from the Raydium CPMM pool
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: 未设置 creatorFeeWallet 时默认的创作者费钱包是什么？
    a: 默认是发行钱包——签署 createLaunch 调用的钱包。在 launch 对象中显式设置 creatorFeeWallet 可将费用重定向到任何其他地址。
  - q: 创作者费是在每次兑换时转账的吗？
    a: 不是。创作者费在每次兑换时累积到 bucket 中（creatorFeeAccrued），不会立即转账。在活跃曲线期间调用 claimBondingCurveCreatorFeeV2 认领，毕业后调用 claimRaydiumCreatorFeeV2 认领。
  - q: 任何人都可以调用 claimBondingCurveCreatorFeeV2 吗？
    a: 是的。claimBondingCurveCreatorFeeV2 和 claimRaydiumCreatorFeeV2 都是无需许可的——任何钱包都可以触发认领，但 SOL 始终发送到配置的创作者费钱包，而非调用方。
  - q: 首次购买需要支付创作者费吗？
    a: 不需要。配置首次购买时，协议兑换费和创作者费均对该一次性初始购买豁免。之后所有兑换正常支付创作者费。
  - q: 如何检查已累积了多少创作者费？
    a: 使用 Genesis SDK 的 fetchBondingCurveBucketV2 从 bucket 账户读取 creatorFeeAccrued 字段。
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
- **毕业后认领** — `claimRaydiumCreatorFeeV2` 在曲线毕业后从 Raydium CPMM 池收取费用

关于创作者费如何与兑换定价和协议兑换费交互，请参阅[运作原理——手续费结构](/smart-contracts/genesis/bonding-curve-theory#fee-structure)。

## 快速开始

**跳转至：** [发行时配置](#configuring-a-creator-fee-at-launch) · [重定向到钱包](#redirecting-creator-fees-to-a-specific-wallet) · [Agent PDA](#agent-launches-automatic-pda-routing) · [与首次购买组合](#combining-creator-fees-with-a-first-buy) · [检查累积费用](#checking-accrued-creator-fees) · [活跃曲线期间认领](#claiming-creator-fees-during-the-active-curve) · [毕业后认领](#claiming-creator-fees-after-graduation)

1. 调用 `createAndRegisterLaunch` 时在 `launch` 对象中设置 `creatorFeeWallet`
2. 发行后读取 `bucket.creatorFeeAccrued` 监控累积费用
3. 调用 `claimBondingCurveCreatorFeeV2` 在曲线活跃时收取费用
4. 毕业后调用 `claimRaydiumCreatorFeeV2` 收取 Raydium LP 费用

## 前置条件

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
  firstBuyAmount: 0.5, // 0.5 SOL, fee-free for the first buyer
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

// Read the configured creator fee wallet from the bucket extension
const creatorFeeExt = bucket.extensions.creatorFee;
const creatorFeeWallet = isSome(creatorFeeExt) ? creatorFeeExt.value.wallet : null;
console.log('Creator fee wallet:', creatorFeeWallet?.toString() ?? 'none configured');
```

## 在活跃曲线期间认领创作者费

`claimBondingCurveCreatorFeeV2` 将所有累积的创作者费从 bucket 转移到配置的创作者费钱包。可在曲线活跃期间任何时间调用。

```typescript {% title="claim-creator-fees.ts" showLineNumbers=true %}
import { claimBondingCurveCreatorFeeV2 } from '@metaplex-foundation/genesis';
import { isSome } from '@metaplex-foundation/umi';

// Read the creator fee wallet from the bucket extension before claiming.
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

联合曲线[毕业](/smart-contracts/genesis/bonding-curve-theory#phase-3-graduated)后，流动性迁移到 Raydium CPMM 池，创作者费继续从 LP 交易活动中累积。`RaydiumCpmmBucketV2` 账户暴露了类似于 `BondingCurveBucketV2` 的 `creatorFeeAccrued` 和 `creatorFeeClaimed` 字段。使用 `claimRaydiumCreatorFeeV2` 收取毕业后的费用。

```typescript {% title="claim-raydium-creator-fees.ts" showLineNumbers=true %}
import { claimRaydiumCreatorFeeV2 } from '@metaplex-foundation/genesis';

const result = await claimRaydiumCreatorFeeV2(umi, {
  genesisAccount,
  // ... Raydium pool accounts
}).sendAndConfirm(umi);
```

{% callout type="note" %}
与联合曲线对应物一样，`claimRaydiumCreatorFeeV2` 是无需许可的——任何钱包都可以触发认领，但 SOL 始终发送到配置的创作者费钱包。
{% /callout %}

## 注意事项

- 创作者费在每次兑换时累积到 bucket（`creatorFeeAccrued`），不会立即转账——需显式调用认领指令才能收取；`creatorFeeClaimed` 追踪迄今累积认领的总额
- 两个认领指令均无需许可：任何钱包都可以触发，但 SOL 始终流向配置的创作者费钱包，而非调用方
- `creatorFeeWallet` 未设置时默认为发行钱包；曲线创建后无法更改
- 首次购买机制仅对指定的初始购买豁免所有费用（协议费和创作者费）；之后所有兑换正常收取创作者费
- 创作者费应用于每次兑换的 SOL 侧，无论方向（买入或卖出）；不与协议兑换费复利
- 当前费率请参阅 [Genesis 协议费用](/smart-contracts/genesis)页面
- 兑换侧上下文——读取 bucket 状态、计算报价和执行交易——请参阅[联合曲线兑换集成](/smart-contracts/genesis/bonding-curve-swaps)

## FAQ

### 未设置 `creatorFeeWallet` 时默认的创作者费钱包是什么？

默认的创作者费钱包是发行钱包——签署 `createLaunch` 调用的钱包。在 `launch` 对象中显式设置 `creatorFeeWallet` 可将费用重定向到任何其他地址。

### 创作者费是在每次兑换时转账的吗？

不是。创作者费在每次兑换时累积到 bucket（`creatorFeeAccrued`），不会立即转账。在活跃曲线期间调用 `claimBondingCurveCreatorFeeV2` 认领，毕业后调用 `claimRaydiumCreatorFeeV2` 认领。

### 任何人都可以调用 `claimBondingCurveCreatorFeeV2` 吗？

是的。`claimBondingCurveCreatorFeeV2` 和 `claimRaydiumCreatorFeeV2` 都是无需许可的——任何钱包都可以触发认领，但 SOL 始终发送到配置的创作者费钱包，而非调用方。

### 首次购买需要支付创作者费吗？

不需要。配置首次购买时，协议兑换费和创作者费均对该一次性初始购买豁免。之后所有兑换正常支付创作者费。

### 如何检查已累积了多少创作者费？

使用 `fetchBondingCurveBucketV2` 从 bucket 账户读取 `creatorFeeAccrued` 字段。详见[检查累积的创作者费](#checking-accrued-creator-fees)。

### 发行后可以更改创作者费钱包吗？

不可以。创作者费钱包在曲线创建时设定，曲线上线后无法更改。
