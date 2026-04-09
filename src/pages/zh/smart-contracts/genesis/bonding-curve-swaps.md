---
title: 联合曲线兑换集成
metaTitle: Genesis 联合曲线兑换集成 | Metaplex
description: 如何使用 Genesis SDK 读取联合曲线状态、获取兑换报价、执行买入和卖出交易、处理滑点以及认领创作者费。
updated: '04-09-2026'
keywords:
  - bonding curve
  - swap
  - genesis
  - SOL
  - token launch
  - getSwapResult
  - swapBondingCurveV2
  - isSwappable
  - slippage
  - creator fees
  - Raydium CPMM
  - graduation
about:
  - Bonding Curve
  - Token Swap
  - Genesis
  - Solana
programmingLanguage:
  - JavaScript
  - TypeScript
  - Bash
cli: /dev-tools/cli/genesis/bonding-curve
proficiencyLevel: Intermediate
howToSteps:
  - Install the Genesis SDK and configure a Umi instance
  - Fetch the BondingCurveBucketV2 account using findBondingCurveBucketV2Pda
  - Check isSwappable to confirm the curve is active
  - Call getSwapResult to get a quote including fees
  - Apply slippage with applySlippage to derive minAmountOut
  - Send the swap with swapBondingCurveV2 and confirm onchain
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: isSwappable 和 isSoldOut 有什么区别？
    a: isSwappable 在曲线正在接受交易时返回 true——开始条件已满足，结束条件尚未触发，首次购买（如已配置）已完成，且代币尚存。isSoldOut 在 baseTokenBalance 降至零时返回 true，此时交易结束并触发毕业流程。
  - q: 调用 swapBondingCurveV2 之前需要先包装 SOL 吗？
    a: 是的。联合曲线使用包装 SOL（wSOL）作为报价代币。swapBondingCurveV2 指令不会自动包装或解包 SOL。买入时，需创建 wSOL ATA，向其转入原生 SOL，并在发送兑换前调用 syncNative。卖出时，在兑换完成后关闭 wSOL ATA 以将其解包回原生 SOL。
  - q: getSwapResult 返回什么，它如何处理手续费？
    a: getSwapResult 返回 amountIn（用户实际支付金额）、fee（协议手续费）、creatorFee（创作者费，如已配置）和 amountOut（用户收到的金额）。买入时，手续费在 AMM 运算前从 SOL 输入中扣除。卖出时，手续费在 AMM 运算后从 SOL 输出中扣除。将 true 作为第四个参数传入，可获取免手续费的首次购买报价。
  - q: 如何防止滑点？
    a: 使用 applySlippage(quote.amountOut, slippageBps) 推导 minAmountOutScaled，然后将其传给 swapBondingCurveV2 作为 minAmountOutScaled 字段。若实际输出低于此值，链上程序将拒绝交易。常用值为稳定行情下 50 bps（0.5%）、波动性发行时 200 bps（2%）。
---

使用 Genesis SDK 读取[联合曲线](/smart-contracts/genesis/bonding-curve)状态、计算兑换报价、在链上执行买入和卖出交易、处理滑点以及认领创作者费。{% .lead %}

{% callout title="本指南涵盖内容" %}
本指南涵盖：
- 获取并解析 `BondingCurveBucketV2` 账户状态
- 使用 `isSwappable`、`isSoldOut` 和 `isGraduated` 检查生命周期状态
- 使用 `getSwapResult` 获取精确的兑换报价
- 使用 `applySlippage` 保护用户免受滑点影响
- 使用 `swapBondingCurveV2` 构建买入和卖出交易
- 认领曲线和毕业后 Raydium 池中的创作者费
{% /callout %}

## 摘要

联合曲线兑换使用 Genesis SDK 与链上 `BondingCurveBucketV2` 账户交互——这是一个恒积 AMM，接受 SOL 并返回代币（买入），或接受代币并返回 SOL（卖出）。有关定价数学基础，请参阅[运作原理](/smart-contracts/genesis/bonding-curve-theory)。

- **发送前先获取报价** — 调用 `getSwapResult` 获取精确的含手续费输入和输出金额
- **滑点保护** — 使用 `applySlippage` 推导 `minAmountOutScaled` 并将其传给指令
- **wSOL 需手动处理** — 兑换指令不会自动包装或解包原生 SOL；调用方必须自行管理 wSOL ATA
- **Program ID** — Solana 主网上为 `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`

## 快速开始

**跳转至：** [安装](#installation) · [配置](#umi-and-genesis-plugin-setup) · [获取曲线](#fetching-a-bonding-curve-bucketv2) · [生命周期辅助函数](#bonding-curve-lifecycle-helpers) · [报价](#getting-a-swap-quote) · [滑点](#slippage-protection) · [执行兑换](#constructing-swap-transactions) · [创作者费](/smart-contracts/genesis/creator-fees) · [错误处理](#error-handling) · [API 参考](#api-reference)

1. 安装依赖包并使用 `genesis()` 插件配置 Umi 实例
2. 推导 `BondingCurveBucketV2Pda` 并获取账户
3. 检查 `isSwappable(bucket)` — 若返回 false 则中止操作
4. 调用 `getSwapResult(bucket, amountIn, SwapDirection.Buy)` 获取含手续费的报价
5. 使用 `applySlippage(quote.amountOut, slippageBps)` 获得 `minAmountOutScaled`
6. 手动处理 wSOL 包装，然后发送 `swapBondingCurveV2` 并确认

## 前置条件

- **Node.js 18+** — 原生 BigInt 支持所必需
- **Solana 钱包** — 已充值 SOL，用于支付交易费用和兑换输入
- Solana RPC 端点（mainnet-beta 或 devnet）
- 熟悉 [Umi 框架](https://github.com/metaplex-foundation/umi) 和 async/await 模式

## 测试配置

| 工具 | 版本 |
|------|---------|
| `@metaplex-foundation/genesis` | 1.x |
| `@metaplex-foundation/umi` | 1.x |
| `@metaplex-foundation/umi-bundle-defaults` | 1.x |
| Node.js | 18+ |

## 安装

```bash {% title="Terminal" %}
npm install @metaplex-foundation/genesis \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults
```

## Umi 和 Genesis 插件配置

在调用任何 SDK 函数前，先配置 Umi 实例并注册 `genesis()` 插件。

```typescript {% title="setup.ts" showLineNumbers=true %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { genesis } from '@metaplex-foundation/genesis';
import { keypairIdentity } from '@metaplex-foundation/umi';
import { readFileSync } from 'fs';

const keypairFile = JSON.parse(readFileSync('/path/to/keypair.json', 'utf-8'));

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(genesis());

const keypair = umi.eddsa.createKeypairFromSecretKey(Uint8Array.from(keypairFile));
umi.use(keypairIdentity(keypair));
```

## 获取 Bonding Curve BucketV2

根据已掌握的信息，可选用三种发现策略。

### 从已知 Genesis 账户获取

{% code-tabs-imported from="genesis/fetch_bonding_curve_bucket" frameworks="umi,cli" defaultFramework="umi" /%}

### 从代币 Mint 获取

```typescript {% title="fetch-from-mint.ts" showLineNumbers=true %}
import {
  findGenesisAccountV2Pda,
  findBondingCurveBucketV2Pda,
  fetchBondingCurveBucketV2,
} from '@metaplex-foundation/genesis';
import { publicKey } from '@metaplex-foundation/umi';

const baseMint = publicKey('TOKEN_MINT_PUBKEY');

const [genesisAccount] = findGenesisAccountV2Pda(umi, {
  baseMint,
  genesisIndex: 0,
});

const [bucketPda] = findBondingCurveBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

const bucket = await fetchBondingCurveBucketV2(umi, bucketPda);
```

## 读取 Bonding Curve BucketV2 状态

| 字段 | 类型 | 描述 |
|-------|------|-------------|
| `baseTokenBalance` | `bigint` | 曲线上剩余的代币数量。零表示已售罄。 |
| `baseTokenAllocation` | `bigint` | 创建时分配给此曲线的代币总量。 |
| `quoteTokenDepositTotal` | `bigint` | 买家存入的真实 SOL 金额（lamports）。初始为 0。 |
| `virtualSol` | `bigint` | 初始化时添加的虚拟 SOL 储备（仅用于定价）。 |
| `virtualTokens` | `bigint` | 初始化时添加的虚拟代币储备（仅用于定价）。 |
| `depositFee` | `number` | 适用于每次兑换 SOL 侧的协议手续费率。 |
| `withdrawFee` | `number` | 适用于卖出 SOL 输出侧的协议手续费率。 |
| `creatorFeeAccrued` | `bigint` | 自上次认领以来累积的创作者费（lamports）。 |
| `creatorFeeClaimed` | `bigint` | 迄今累计认领的创作者费（lamports）。 |
| `swapStartCondition` | `object` | 允许交易前必须满足的条件。 |
| `swapEndCondition` | `object` | 触发时结束交易的条件。 |

{% callout type="note" %}
`virtualSol` 和 `virtualTokens` 仅存在于定价数学中——它们从未作为真实资产存入链上。请参阅[运作原理](/smart-contracts/genesis/bonding-curve-theory#why-bonding-curves-require-virtual-reserves)了解虚拟储备如何塑造恒积曲线。
{% /callout %}

## 联合曲线生命周期辅助函数

五个辅助函数可在无需额外 RPC 调用的情况下检查曲线状态（`isGraduated` 除外）。

```typescript {% title="lifecycle-helpers.ts" showLineNumbers=true %}
import {
  isSwappable,
  isFirstBuyPending,
  isSoldOut,
  getFillPercentage,
  isGraduated,
} from '@metaplex-foundation/genesis';

const canSwap = isSwappable(bucket);
const firstBuyPending = isFirstBuyPending(bucket);
const soldOut = isSoldOut(bucket);
const fillPercent = getFillPercentage(bucket);
const graduated = await isGraduated(umi, bucket); // async RPC call
```

| 辅助函数 | 异步 | 返回值 | 描述 |
|--------|-------|---------|-------------|
| `isSwappable(bucket)` | 否 | `boolean` | 接受公开交易时为 `true` |
| `isFirstBuyPending(bucket)` | 否 | `boolean` | 指定首次购买尚未完成时为 `true` |
| `isSoldOut(bucket)` | 否 | `boolean` | `baseTokenBalance === 0n` 时为 `true` |
| `getFillPercentage(bucket)` | 否 | `number` | 已售出分配量的 0–100 百分比 |
| `isGraduated(umi, bucket)` | 是 | `boolean` | Raydium CPMM 池链上存在时为 `true` |

## 获取兑换报价

`getSwapResult(bucket, amountIn, swapDirection, isFirstBuy?)` 无需发送任何交易即可计算兑换的精确含手续费金额。

返回 `{ amountIn, fee, creatorFee, amountOut }`：
- `amountIn` — 经调整后的实际输入金额
- `fee` — 收取的协议手续费，以 lamports 计
- `creatorFee` — 收取的创作者费，以 lamports 计（未配置创作者费时为 0）
- `amountOut` — 收到的代币（买入）或 SOL（卖出）

### 买入报价（SOL 换代币）

{% code-tabs-imported from="genesis/swap_quote_buy" frameworks="umi,cli" defaultFramework="umi" /%}

### 卖出报价（代币换 SOL）

{% code-tabs-imported from="genesis/swap_quote_sell" frameworks="umi,cli" defaultFramework="umi" /%}

### 首次购买手续费豁免

将 `true` 作为第四个参数传入，可以模拟免手续费的首次购买报价：

```typescript {% title="first-buy-quote.ts" showLineNumbers=true %}
const firstBuyQuote = getSwapResult(bucket, SOL_IN, SwapDirection.Buy, true);
console.log('Fee (waived): ', firstBuyQuote.fee.toString()); // 0n
```

### 当前价格辅助函数

```typescript {% title="current-price.ts" showLineNumbers=true %}
import {
  getCurrentPrice,
  getCurrentPriceQuotePerBase,
  getCurrentPriceComponents,
} from '@metaplex-foundation/genesis';

const tokensPerSol = getCurrentPrice(bucket);          // bigint
const lamportsPerToken = getCurrentPriceQuotePerBase(bucket); // bigint
const { baseReserves, quoteReserves } = getCurrentPriceComponents(bucket);
```

## 滑点保护

`applySlippage(expectedAmountOut, slippageBps)` 将预期输出减去滑点容忍度。将结果作为 `minAmountOutScaled` 传给兑换指令——若实际输出低于此值，链上程序将拒绝交易。

```typescript {% title="slippage.ts" showLineNumbers=true %}
import { getSwapResult, applySlippage, SwapDirection } from '@metaplex-foundation/genesis';

const quote = getSwapResult(bucket, 1_000_000_000n, SwapDirection.Buy);
const minAmountOutScaled = applySlippage(quote.amountOut, 100); // 1% slippage
```

{% callout type="warning" %}
切勿在未通过 `applySlippage` 推导 `minAmountOutScaled` 的情况下发送兑换交易。联合曲线的价格随每次交易变化；若不加滑点保护，用户可能收到远少于报价的代币。
{% /callout %}

常用值：稳定行情下 50 bps（0.5%），波动性发行时 200 bps（2%）。

## 构建兑换交易

`swapBondingCurveV2(umi, accounts)` 构建兑换指令。调用方负责在交易前后处理包装 SOL（wSOL）。

### 买入交易（SOL 换代币）

{% code-tabs-imported from="genesis/swap_buy" frameworks="umi,cli" defaultFramework="umi" /%}

### 卖出交易（代币换 SOL）

{% code-tabs-imported from="genesis/swap_sell" frameworks="umi,cli" defaultFramework="umi" /%}

### wSOL 包装说明

{% callout type="warning" title="需手动处理 wSOL" %}
`swapBondingCurveV2` 使用包装 SOL（wSOL）作为报价代币，**不会**自动包装或解包原生 SOL。

**买入时：** 创建 wSOL ATA，将所需 lamports 转入其中，并在发送兑换前调用 `syncNative`。

**卖出时：** 兑换确认后关闭 wSOL ATA，将 wSOL 解包回原生 SOL。

当前版本仅接受 wSOL 作为报价代币。
{% /callout %}

```typescript {% title="wsol-wrap-unwrap.ts" showLineNumbers=true %}
import {
  findAssociatedTokenPda,
  createAssociatedTokenAccountIdempotentInstruction,
  syncNative,
  closeToken,
} from '@metaplex-foundation/mpl-toolbox';
import { transactionBuilder, sol, publicKey } from '@metaplex-foundation/umi';

const wSOL = publicKey('So11111111111111111111111111111111111111112');
const [wSolAta] = findAssociatedTokenPda(umi, { mint: wSOL, owner: umi.identity.publicKey });

// --- Wrap SOL before a buy ---
const wrapBuilder = transactionBuilder()
  .add(createAssociatedTokenAccountIdempotentInstruction(umi, {
    mint: wSOL,
    owner: umi.identity.publicKey,
  }))
  .add(syncNative(umi, { account: wSolAta }));

await wrapBuilder.sendAndConfirm(umi);

// --- Unwrap SOL after a sell ---
const unwrapBuilder = closeToken(umi, {
  account: wSolAta,
  destination: umi.identity.publicKey,
  authority: umi.identity,
});

await unwrapBuilder.sendAndConfirm(umi);
```

## 认领创作者费

创作者费在每次兑换时累积到 bucket（`creatorFeeAccrued`），而非直接转账。通过无需许可的 `claimBondingCurveCreatorFeeV2` 指令在曲线活跃时收取，并通过 `claimRaydiumCreatorFeeV2` 在毕业后收取。

完整认领流程——包括如何检查累积余额以及处理毕业后 Raydium LP 费用——请参阅[创作者费](/smart-contracts/genesis/creator-fees)。

## 错误处理

| 错误 | 原因 | 解决方法 |
|-------|-------|------------|
| `BondingCurveInsufficientFunds` | 曲线持有的代币（买入）或 SOL（卖出）不足 | 重新获取 bucket 并重新报价；曲线可能即将售罄 |
| `InsufficientOutputAmount` | 实际输出低于 `minAmountOutScaled` | 增大 `slippageBps` 或立即重试 |
| `InvalidSwapDirection` | `swapDirection` 值无效 | 从 `@metaplex-foundation/genesis` 导入传入 `SwapDirection.Buy` 或 `SwapDirection.Sell` |
| `BondingCurveNotStarted` | `swapStartCondition` 尚未满足 | 检查 `bucket.swapStartCondition` 并等待 |
| `BondingCurveEnded` | 曲线已售罄或已毕业 | 将用户引导至 Raydium CPMM 池 |

```typescript {% title="error-handling.ts" showLineNumbers=true %}
async function executeBuy(bucket, amountIn: bigint, slippageBps: number) {
  if (!isSwappable(bucket)) {
    if (isSoldOut(bucket)) throw new Error('Token sold out. Trade on Raydium.');
    throw new Error('Curve not yet active. Check the start time.');
  }

  const quote = getSwapResult(bucket, amountIn, SwapDirection.Buy);
  const minAmountOutScaled = applySlippage(quote.amountOut, slippageBps);

  try {
    return await swapBondingCurveV2(umi, {
      amount: quote.amountIn,
      minAmountOutScaled,
      swapDirection: SwapDirection.Buy,
      // ... accounts
    }).sendAndConfirm(umi);
  } catch (err: any) {
    if (err.message?.includes('InsufficientOutputAmount'))
      throw new Error('Price moved. Try again with higher slippage.');
    if (err.message?.includes('BondingCurveInsufficientFunds'))
      throw new Error('Not enough tokens remaining. Reduce amount.');
    throw err;
  }
}
```

## 注意事项

- 在生产环境中，每次兑换前都应重新获取 bucket——价格随每位用户的每次交易而变化
- `virtualSol` 和 `virtualTokens` 在曲线创建后不可更改——可缓存；每次兑换只有真实储备字段变化
- `isGraduated` 每次调用都会发起一次 RPC 请求——请在索引器中缓存结果
- 在 `isSoldOut` 返回 `true` 与 `isGraduated` 返回 `true` 之间，曲线已售罄但 Raydium 尚未注入资金；在 `isGraduated` 确认前不要将用户引导至 Raydium
- 事件解码和生命周期索引，请参阅[索引与事件](/smart-contracts/genesis/bonding-curve-indexing)
- 所有手续费金额以 lamports 计（SOL 侧）；当前费率请参阅[协议费用](/protocol-fees)

## API 参考

### 报价和价格函数

| 函数 | 异步 | 返回值 | 描述 |
|----------|-------|---------|-------------|
| `getSwapResult(bucket, amountIn, swapDirection, isFirstBuy?)` | 否 | `{ amountIn, fee, creatorFee, amountOut }` | 含手续费的兑换报价 |
| `getCurrentPrice(bucket)` | 否 | `bigint` | 每 SOL 单位可换基础代币数（整数除法） |
| `getCurrentPriceQuotePerBase(bucket)` | 否 | `bigint` | 每个基础代币单位所需 lamports（整数除法） |
| `getCurrentPriceComponents(bucket)` | 否 | `{ baseReserves, quoteReserves }` | 虚拟+真实组合储备（bigint） |

### 生命周期函数

| 函数 | 异步 | 返回值 | 描述 |
|----------|-------|---------|-------------|
| `isSwappable(bucket)` | 否 | `boolean` | 接受公开交易时为 `true` |
| `isFirstBuyPending(bucket)` | 否 | `boolean` | 指定首次购买尚未完成时为 `true` |
| `isSoldOut(bucket)` | 否 | `boolean` | `baseTokenBalance === 0n` 时为 `true` |
| `getFillPercentage(bucket)` | 否 | `number` | 已售出分配量的 0–100 百分比 |
| `isGraduated(umi, bucket)` | 是 | `boolean` | Raydium CPMM 池链上存在时为 `true` |

### 滑点

| 函数 | 返回值 | 描述 |
|----------|---------|-------------|
| `applySlippage(amountOut, slippageBps)` | `bigint` | 将 `amountOut` 减少 `slippageBps / 10_000` |

### 兑换指令账户

| 账户 | 可写 | 签名 | 描述 |
|---------|----------|--------|-------------|
| `genesisAccount` | 是 | 否 | Genesis 协调 PDA |
| `bucket` | 是 | 否 | `BondingCurveBucketV2` PDA |
| `baseMint` | 否 | 否 | SPL 代币 mint |
| `quoteMint` | 否 | 否 | wSOL mint |
| `baseTokenAccount` | 是 | 否 | 用户的基础代币 ATA |
| `quoteTokenAccount` | 是 | 否 | 用户的 wSOL ATA |
| `payer` | 是 | 是 | 交易手续费付款方 |

### 账户发现

| 函数 | 返回值 | 描述 |
|----------|---------|-------------|
| `findBondingCurveBucketV2Pda(umi, { genesisAccount, bucketIndex })` | `[PublicKey, bump]` | 推导 bucket PDA |
| `findGenesisAccountV2Pda(umi, { baseMint, genesisIndex })` | `[PublicKey, bump]` | 推导 genesis 账户 PDA |
| `fetchBondingCurveBucketV2(umi, pda)` | `BondingCurveBucketV2` | 获取并反序列化账户 |

## FAQ

### isSwappable 和 isSoldOut 有什么区别？

`isSwappable` 仅在曲线正在接受公开交易时返回 `true`。`isSoldOut` 在 `baseTokenBalance` 降至零的瞬间返回 `true`，此时交易结束并触发毕业流程。曲线可以已售罄但尚未毕业。

### 调用 swapBondingCurveV2 之前需要先包装 SOL 吗？

是的。联合曲线使用 wSOL 作为报价代币，`swapBondingCurveV2` 不会自动包装或解包原生 SOL。详见 [wSOL 包装说明](#wsol-wrapping-note)。

### getSwapResult 返回什么，它如何处理手续费？

`getSwapResult` 返回 `{ amountIn, fee, creatorFee, amountOut }`。买入时，手续费在 AMM 公式运算前从 SOL 输入中扣除。卖出时，手续费在 AMM 公式运算后从 SOL 输出中扣除。将 `true` 作为第四个参数传入以模拟首次购买手续费豁免（所有手续费归零）。

### 如何防止滑点？

调用 `applySlippage(quote.amountOut, slippageBps)` 推导 `minAmountOutScaled`，然后将其传给 `swapBondingCurveV2` 作为 `minAmountOutScaled` 字段。若实际输出低于此值，链上程序将拒绝交易。
