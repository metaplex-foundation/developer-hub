---
title: 联合曲线兑换集成
metaTitle: Genesis 联合曲线兑换集成 | Metaplex
description: 如何使用 Genesis SDK 读取联合曲线状态、获取兑换报价、执行买入和卖出交易、处理滑点、解码兑换事件以及索引生命周期事件。
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
  - swap events
  - indexing
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
proficiencyLevel: Intermediate
created: '03-30-2026'
updated: '03-30-2026'
howToSteps:
  - 安装 Genesis SDK 并配置 Umi 实例
  - 使用 findBondingCurveBucketV2Pda 获取 BondingCurveBucketV2 账户
  - 检查 isSwappable 以确认曲线处于活跃状态
  - 调用 getSwapResult 获取包含手续费的报价
  - 使用 applySlippage 推导 minAmountOut
  - 通过 swapBondingCurveV2 发送兑换并在链上确认
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: isSwappable 和 isSoldOut 有什么区别？
    a: isSwappable 在曲线正在接受交易时返回 true——开始条件已满足，结束条件尚未触发，首次购买（如已配置）已完成，且代币尚存。isSoldOut 在 baseTokenBalance 降至零时返回 true，此时交易结束并触发毕业流程。曲线可以已售罄但尚未毕业。
  - q: 调用 swapBondingCurveV2 之前需要先包装 SOL 吗？
    a: 是的。联合曲线使用包装 SOL（wSOL）作为报价代币。swapBondingCurveV2 指令不会自动包装或解包 SOL。买入时，需创建 wSOL ATA，向其转入原生 SOL，并在发送兑换前调用 syncNative。卖出时，在兑换完成后关闭 wSOL ATA 以将其解包回原生 SOL。
  - q: getSwapResult 返回什么，它如何处理手续费？
    a: getSwapResult 返回 amountIn（用户实际支付金额）、fee（收取的总手续费）和 amountOut（用户收到的金额）。买入时，手续费在 AMM 运算前从 SOL 输入中扣除。卖出时，手续费在 AMM 运算后从 SOL 输出中扣除。将 true 作为第四个参数传入，可获取免手续费的首次购买报价。
  - q: 如何防止滑点？
    a: 使用 applySlippage(quote.amountOut, slippageBps) 推导 minAmountOut，然后将其传给 swapBondingCurveV2。链上程序会在实际输出低于 minAmountOut 时拒绝交易。常用值为稳定行情下 50 bps（0.5%）、波动性发行时 200 bps（2%）。
  - q: isSoldOut 和 isGraduated 有什么区别？
    a: isSoldOut 是对 bucket 的 baseTokenBalance 进行的同步检查——一旦所有代币被购买完毕即返回 true。isGraduated 是一个异步 RPC 调用，检查 Raydium CPMM 池是否已被创建并注入资金。在售罄与毕业之间存在一个窗口期，此时 isSoldOut 为 true 但 isGraduated 为 false。
  - q: 如何从交易中解码 BondingCurveSwapEvent？
    a: 在 Genesis 程序（GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B）的内部指令中找到判别字节为 255 的条目，截去该首字节，然后将剩余字节传给 getBondingCurveSwapEventSerializer().deserialize()。该事件包含方向、金额、手续费以及兑换后的储备状态。
---

使用 Genesis SDK 读取[联合曲线](/smart-contracts/genesis/bonding-curve) 状态、计算兑换报价、在链上执行买入和卖出交易、处理滑点、解码兑换事件，并索引联合曲线发行的完整生命周期。{% .lead %}

{% callout title="本指南涵盖内容" %}
本指南涵盖：
- 获取并解析 `BondingCurveBucketV2` 账户状态
- 使用 `isSwappable`、`isSoldOut` 和 `isGraduated` 检查生命周期状态
- 使用 `getSwapResult` 获取精确的兑换报价
- 使用 `applySlippage` 保护用户免受滑点影响
- 使用 `swapBondingCurveV2` 构建买入和卖出交易
- 从已确认交易中解码 `BondingCurveSwapEvent`
- 链上生命周期事件索引
{% /callout %}

## 摘要

联合曲线兑换使用 Genesis SDK 与链上 `BondingCurveBucketV2` 账户交互——这是一个恒积 AMM，接受 SOL 并返回代币（买入），或接受代币并返回 SOL（卖出）。有关定价数学基础，请参阅[联合曲线——运作原理](/smart-contracts/genesis/bonding-curve)。

- **发送前先获取报价** — 调用 `getSwapResult` 获取精确的含手续费输入和输出金额
- **滑点保护** — 使用 `applySlippage` 推导 `minAmountOut` 并将其传给指令
- **wSOL 需手动处理** — 兑换指令不会自动包装或解包原生 SOL；调用方必须自行管理 wSOL [关联代币账户（ATA）](https://spl.solana.com/associated-token-account)
- **Program ID** — Solana 主网上为 `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`

*由 Metaplex Foundation 维护 · 最后验证于 2026 年 3 月 · 适用于 `@metaplex-foundation/genesis` 1.x*

## 快速开始

**跳转至：** [安装](#installation) · [配置](#umi-and-genesis-plugin-setup) · [获取曲线](#fetching-a-bonding-curve-bucketv2) · [生命周期辅助函数](#bonding-curve-lifecycle-helpers) · [报价](#getting-a-swap-quote) · [滑点](#slippage-protection) · [执行兑换](#constructing-swap-transactions) · [事件](#reading-swap-events) · [索引](#indexing-lifecycle-events) · [错误处理](#error-handling) · [API 参考](#api-reference)

1. 安装依赖包并使用 `genesis()` 插件配置 Umi 实例
2. 推导 `BondingCurveBucketV2Pda` 并获取账户
3. 检查 `isSwappable(bucket)` — 若返回 false 则中止操作
4. 调用 `getSwapResult(bucket, amountIn, 'buy')` 获取含手续费的报价
5. 使用 `applySlippage(quote.amountOut, slippageBps)` 获得 `minAmountOut`
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

使用单条命令安装三个必需的依赖包。

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

// Load your wallet keypair from a local file.
const keypairFile = JSON.parse(readFileSync('/path/to/keypair.json', 'utf-8'));

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(genesis());

const keypair = umi.eddsa.createKeypairFromSecretKey(Uint8Array.from(keypairFile));
umi.use(keypairIdentity(keypair));
```

## 获取 Bonding Curve BucketV2

根据已掌握的信息，可选用三种发现策略。

### 从已知 Genesis 账户获取

当你已创建了联合曲线并已持有 genesis 账户地址时使用此方法。

```typescript {% title="fetch-from-genesis.ts" showLineNumbers=true %}
import {
  findBondingCurveBucketV2Pda,
  fetchBondingCurveBucketV2,
} from '@metaplex-foundation/genesis';
import { publicKey } from '@metaplex-foundation/umi';

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT_PUBKEY');

// Derive the bonding curve PDA (bucket index 0 for the primary curve).
const [bucketPda] = findBondingCurveBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

const bucket = await fetchBondingCurveBucketV2(umi, bucketPda);
```

### 从代币 Mint 获取

当你只有代币 mint 地址时使用此方法——常见于从用户输入或 API 接收 mint 的集成场景。

```typescript {% title="fetch-from-mint.ts" showLineNumbers=true %}
import {
  findGenesisAccountV2Pda,
  findBondingCurveBucketV2Pda,
  fetchBondingCurveBucketV2,
} from '@metaplex-foundation/genesis';
import { publicKey } from '@metaplex-foundation/umi';

const baseMint = publicKey('TOKEN_MINT_PUBKEY');

// Step 1: derive the genesis account from the mint.
const [genesisAccount] = findGenesisAccountV2Pda(umi, {
  baseMint,
  genesisIndex: 0,
});

// Step 2: derive the bonding curve bucket from the genesis account.
const [bucketPda] = findBondingCurveBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

const bucket = await fetchBondingCurveBucketV2(umi, bucketPda);
```

### 发现所有联合曲线（GPA）

使用 GPA builder 获取程序上的所有 `BondingCurveBucketV2` 账户——适用于索引器和仪表盘。

```typescript {% title="discover-all-curves.ts" showLineNumbers=true %}
import { getBondingCurveBucketV2GpaBuilder } from '@metaplex-foundation/genesis';

const allCurves = await getBondingCurveBucketV2GpaBuilder(umi)
  .whereField('discriminator', /* BondingCurveBucketV2 discriminator */)
  .get();

for (const curve of allCurves) {
  console.log('Bucket PDA:', curve.publicKey.toString());
  console.log('Base token balance:', curve.data.baseTokenBalance.toString());
}
```

## 读取 Bonding Curve BucketV2 状态

`BondingCurveBucketV2` 账户包含计算报价、检查生命周期状态以及展示市场数据所需的所有字段。

| 字段 | 类型 | 描述 |
|-------|------|-------------|
| `baseTokenBalance` | `bigint` | 曲线上剩余的代币数量。零表示已售罄。 |
| `baseTokenAllocation` | `bigint` | 创建时分配给此曲线的代币总量。 |
| `quoteTokenDepositTotal` | `bigint` | 买家存入的真实 SOL 金额（lamports）。初始为 0。 |
| `virtualSol` | `bigint` | 初始化时添加的虚拟 SOL 储备（仅用于定价）。 |
| `virtualTokens` | `bigint` | 初始化时添加的虚拟代币储备（仅用于定价）。 |
| `depositFee` | `number` | 适用于每次兑换 SOL 侧的协议手续费率。 |
| `withdrawFee` | `number` | 适用于卖出 SOL 输出侧的协议手续费率。 |
| `swapStartCondition` | `object` | 允许交易前必须满足的条件。 |
| `swapEndCondition` | `object` | 触发时结束交易的条件。 |

{% callout type="note" %}
`virtualSol` 和 `virtualTokens` 仅存在于定价数学中——它们从未作为真实资产存入链上。请参阅[联合曲线——运作原理](/smart-contracts/genesis/bonding-curve#why-bonding-curves-require-virtual-reserves)了解虚拟储备如何塑造恒积曲线。
{% /callout %}

有关当前协议手续费率，请参阅[协议费用](/protocol-fees)页面。

## 联合曲线生命周期辅助函数

Genesis SDK 中的五个辅助函数可在无需额外 RPC 调用的情况下检查曲线状态（`isGraduated` 除外）。

### isSwappable

`isSwappable(bucket)` 在曲线正在接受公开兑换时返回 `true`——开始条件已满足、结束条件尚未触发、首次购买（如已配置）已完成，且代币尚存。**在获取报价或发送兑换之前，务必先检查此函数。**

```typescript {% title="lifecycle-helpers.ts" showLineNumbers=true %}
import {
  isSwappable,
  isFirstBuyPending,
  isSoldOut,
  getFillPercentage,
  isGraduated,
} from '@metaplex-foundation/genesis';

// Returns true only when the curve actively accepts public swaps.
const canSwap = isSwappable(bucket);

// Returns true when a first-buy is configured but not yet executed.
// While true, only the designated buyer can trade.
const firstBuyPending = isFirstBuyPending(bucket);

// Returns true when baseTokenBalance === 0.
// This triggers graduation processing.
const soldOut = isSoldOut(bucket);

// Returns a number 0–100 representing how much of the allocation has been sold.
const fillPercent = getFillPercentage(bucket);
console.log(`Curve is ${fillPercent.toFixed(1)}% filled`);

// Async — makes an RPC call to check if the Raydium CPMM pool exists onchain.
const graduated = await isGraduated(umi, bucket);
```

### 生命周期辅助函数速查表

| 辅助函数 | 异步 | 返回值 | 描述 |
|--------|-------|---------|-------------|
| `isSwappable(bucket)` | 否 | `boolean` | 接受公开交易时为 `true` |
| `isFirstBuyPending(bucket)` | 否 | `boolean` | 指定首次购买尚未完成时为 `true` |
| `isSoldOut(bucket)` | 否 | `boolean` | `baseTokenBalance === 0n` 时为 `true` |
| `getFillPercentage(bucket)` | 否 | `number` | 已售出分配量的 0–100 百分比 |
| `isGraduated(umi, bucket)` | 是 | `boolean` | Raydium CPMM 池链上存在时为 `true` |

## 获取兑换报价

`getSwapResult(bucket, amountIn, direction, isFirstBuy?)` 无需发送任何交易即可计算兑换的精确含手续费金额。

该函数返回：
- `amountIn` — 经调整后的实际输入金额
- `fee` — 收取的总手续费（协议费 + 创作者费），买入以 lamports 计，卖出以基础代币计
- `amountOut` — 收到的代币（买入）或 SOL（卖出）

### 买入报价（SOL 换代币）

```typescript {% title="buy-quote.ts" showLineNumbers=true %}
import { getSwapResult } from '@metaplex-foundation/genesis';

const SOL_IN = 1_000_000_000n; // 1 SOL in lamports

const buyQuote = getSwapResult(bucket, SOL_IN, 'buy');

console.log('SOL input:    ', buyQuote.amountIn.toString(), 'lamports');
console.log('Total fee:    ', buyQuote.fee.toString(), 'lamports');
console.log('Tokens out:   ', buyQuote.amountOut.toString());
```

### 卖出报价（代币换 SOL）

```typescript {% title="sell-quote.ts" showLineNumbers=true %}
import { getSwapResult } from '@metaplex-foundation/genesis';

const TOKENS_IN = 500_000_000_000n; // 500 tokens (9 decimals)

const sellQuote = getSwapResult(bucket, TOKENS_IN, 'sell');

console.log('Tokens input: ', sellQuote.amountIn.toString());
console.log('Total fee:    ', sellQuote.fee.toString(), 'lamports');
console.log('SOL out:      ', sellQuote.amountOut.toString(), 'lamports');
```

### 首次购买手续费豁免

将 `true` 作为第四个参数传入，可以在手续费豁免的情况下模拟首次购买报价。这与指定买家执行一次性免手续费购买时的链上行为一致。

```typescript {% title="first-buy-quote.ts" showLineNumbers=true %}
import { getSwapResult } from '@metaplex-foundation/genesis';

const SOL_IN = 2_000_000_000n; // 2 SOL in lamports

// Pass `true` to simulate zero-fee first buy.
const firstBuyQuote = getSwapResult(bucket, SOL_IN, 'buy', true);

console.log('Fee (waived): ', firstBuyQuote.fee.toString()); // 0n
console.log('Tokens out:   ', firstBuyQuote.amountOut.toString());
```

### 当前价格辅助函数

三个辅助函数可在无需计算完整兑换报价的情况下获取当前价格。

```typescript {% title="current-price.ts" showLineNumbers=true %}
import {
  getCurrentPrice,
  getCurrentPriceQuotePerBase,
  getCurrentPriceComponents,
} from '@metaplex-foundation/genesis';

// Price as tokens per SOL (tokens you receive for 1 SOL).
const tokensPerSol = getCurrentPrice(bucket);

// Price as SOL per token (lamports you pay for 1 base unit).
const lamportsPerToken = getCurrentPriceQuotePerBase(bucket);

// Low-level components: effective totalSol, totalTokens, and k invariant.
const { totalSol, totalTokens, k } = getCurrentPriceComponents(bucket);
```

## 滑点保护

`applySlippage(expectedAmountOut, slippageBps)` 通过将预期输出减去滑点容忍度来推导 `minAmountOut`。将 `minAmountOut` 传给兑换指令——当实际输出低于此阈值时，链上程序将拒绝交易。

```typescript {% title="slippage.ts" showLineNumbers=true %}
import { getSwapResult, applySlippage } from '@metaplex-foundation/genesis';

const SOL_IN = 1_000_000_000n; // 1 SOL

const quote = getSwapResult(bucket, SOL_IN, 'buy');

// 100 bps = 1.0% slippage tolerance.
// Use 50 bps (0.5%) for stable conditions; 200 bps (2%) for volatile launches.
const SLIPPAGE_BPS = 100;

const minAmountOut = applySlippage(quote.amountOut, SLIPPAGE_BPS);

console.log('Expected out: ', quote.amountOut.toString());
console.log('Min accepted: ', minAmountOut.toString());
```

{% callout type="warning" %}
切勿在未通过 `applySlippage` 推导 `minAmountOut` 的情况下发送兑换交易。联合曲线的价格随每次交易变化；若不加滑点保护，当另一笔交易在你的报价与确认之间执行时，用户可能收到远少于报价的代币。
{% /callout %}

## 构建兑换交易

`swapBondingCurveV2(umi, accounts)` 构建兑换指令。调用方负责在交易前后处理包装 SOL（wSOL）——详见下方的 [wSOL 包装说明](#wsol-wrapping-note)。

### 买入交易（SOL 换代币）

```typescript {% title="swap-buy.ts" showLineNumbers=true %}
import {
  getSwapResult,
  applySlippage,
  swapBondingCurveV2,
  findBondingCurveBucketV2Pda,
} from '@metaplex-foundation/genesis';
import {
  findAssociatedTokenPda,
  createAssociatedTokenAccountInstruction,
} from '@metaplex-foundation/mpl-toolbox';
import { publicKey, sol, transactionBuilder } from '@metaplex-foundation/umi';

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT_PUBKEY');
const baseMint = publicKey('TOKEN_MINT_PUBKEY');
const quoteMint = publicKey('So11111111111111111111111111111111111111112'); // wSOL

const [bucketPda] = findBondingCurveBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 });
const bucket = await fetchBondingCurveBucketV2(umi, bucketPda);

if (!isSwappable(bucket)) {
  throw new Error('Curve is not currently accepting swaps');
}

const SOL_IN = 1_000_000_000n; // 1 SOL in lamports
const quote = getSwapResult(bucket, SOL_IN, 'buy');
const minAmountOut = applySlippage(quote.amountOut, 100); // 1% slippage

// Derive the user's token ATAs.
const [userBaseTokenAccount] = findAssociatedTokenPda(umi, {
  mint: baseMint,
  owner: umi.identity.publicKey,
});
const [userQuoteTokenAccount] = findAssociatedTokenPda(umi, {
  mint: quoteMint,
  owner: umi.identity.publicKey,
});

// NOTE: You must fund the wSOL ATA with SOL_IN lamports before this call.
// See the wSOL Wrapping Note section below.
const tx = swapBondingCurveV2(umi, {
  genesisAccount,
  bucketPda,
  baseMint,
  quoteMint,
  userBaseTokenAccount,
  userQuoteTokenAccount,
  amountIn: quote.amountIn,
  minAmountOut,
  direction: 'buy',
});

const result = await tx.sendAndConfirm(umi);
console.log('Buy confirmed:', result.signature);
```

### 卖出交易（代币换 SOL）

```typescript {% title="swap-sell.ts" showLineNumbers=true %}
import {
  getSwapResult,
  applySlippage,
  swapBondingCurveV2,
  fetchBondingCurveBucketV2,
  findBondingCurveBucketV2Pda,
  isSwappable,
} from '@metaplex-foundation/genesis';
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox';
import { publicKey } from '@metaplex-foundation/umi';

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT_PUBKEY');
const baseMint = publicKey('TOKEN_MINT_PUBKEY');
const quoteMint = publicKey('So11111111111111111111111111111111111111112'); // wSOL

const [bucketPda] = findBondingCurveBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 });
const bucket = await fetchBondingCurveBucketV2(umi, bucketPda);

if (!isSwappable(bucket)) {
  throw new Error('Curve is not currently accepting swaps');
}

const TOKENS_IN = 500_000_000_000n; // 500 tokens (9 decimals)
const quote = getSwapResult(bucket, TOKENS_IN, 'sell');
const minAmountOut = applySlippage(quote.amountOut, 100); // 1% slippage

const [userBaseTokenAccount] = findAssociatedTokenPda(umi, {
  mint: baseMint,
  owner: umi.identity.publicKey,
});
const [userQuoteTokenAccount] = findAssociatedTokenPda(umi, {
  mint: quoteMint,
  owner: umi.identity.publicKey,
});

const tx = swapBondingCurveV2(umi, {
  genesisAccount,
  bucketPda,
  baseMint,
  quoteMint,
  userBaseTokenAccount,
  userQuoteTokenAccount,
  amountIn: quote.amountIn,
  minAmountOut,
  direction: 'sell',
});

const result = await tx.sendAndConfirm(umi);
// NOTE: After a sell, close the wSOL ATA to unwrap back to native SOL.
// See the wSOL Wrapping Note section below.
console.log('Sell confirmed:', result.signature);
```

### wSOL 包装说明

{% callout type="warning" title="需手动处理 wSOL" %}
`swapBondingCurveV2` 指令使用包装 SOL（wSOL）作为报价代币。它**不会**自动包装或解包原生 SOL。

**买入时：** 在发送兑换之前，需创建 wSOL [关联代币账户（ATA）](https://spl.solana.com/associated-token-account)，将所需 lamports 转入其中，并调用 `syncNative` 同步账户余额。

**卖出时：** 兑换确认后，使用 `closeAccount` 关闭 wSOL ATA，将 wSOL 解包回用户钱包中的原生 SOL。

当前版本仅支持 wSOL 作为报价代币，尚不支持 USDC 作为报价代币。
{% /callout %}

```typescript {% title="wsol-wrap-unwrap.ts" showLineNumbers=true %}
import {
  findAssociatedTokenPda,
  createAssociatedTokenAccountIdempotentInstruction,
  syncNative,
  closeToken,
} from '@metaplex-foundation/mpl-toolbox';
import { transactionBuilder, sol } from '@metaplex-foundation/umi';
import { NATIVE_MINT } from '@solana/spl-token';
import { publicKey } from '@metaplex-foundation/umi';

const wSOL = publicKey('So11111111111111111111111111111111111111112');
const [wSolAta] = findAssociatedTokenPda(umi, {
  mint: wSOL,
  owner: umi.identity.publicKey,
});

// --- Wrap SOL before a buy ---
const SOL_AMOUNT = sol(1); // 1 SOL

const wrapBuilder = transactionBuilder()
  .add(createAssociatedTokenAccountIdempotentInstruction(umi, {
    mint: wSOL,
    owner: umi.identity.publicKey,
  }))
  // Transfer native SOL into the wSOL ATA.
  .add({
    instruction: {
      programId: publicKey('11111111111111111111111111111111'), // System Program
      keys: [
        { pubkey: umi.identity.publicKey, isSigner: true, isWritable: true },
        { pubkey: wSolAta, isSigner: false, isWritable: true },
      ],
      data: /* SystemProgram.transfer encode */ new Uint8Array(),
    },
    signers: [umi.identity],
    bytesCreatedOnChain: 0,
  })
  // Sync the ATA balance to reflect the deposited lamports.
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

{% callout type="note" %}
在生产环境中，建议使用 `@solana/spl-token` 的辅助函数 `createWrappedNativeAccount` 进行包装，或使用单笔原子交易同时完成包装、兑换和解包，以减少往返次数。
{% /callout %}

## 读取兑换事件

每次已确认的兑换都会以判别字节 `255` 的内部指令形式发出 `BondingCurveSwapEvent`。从交易中解码它可以获取精确的兑换后储备状态、手续费明细和方向。

### BondingCurveSwapEvent 字段

| 字段 | 类型 | 描述 |
|-------|------|-------------|
| `direction` | `'buy' \| 'sell'` | 交易方向 |
| `amountIn` | `bigint` | 实际输入金额（买入以 lamports 计，卖出以基础代币计） |
| `amountOut` | `bigint` | 收到的输出金额 |
| `fee` | `bigint` | 收取的总手续费（以 lamports 计） |
| `baseTokenBalanceAfter` | `bigint` | 兑换后的 `baseTokenBalance` |
| `quoteTokenDepositTotalAfter` | `bigint` | 兑换后的 `quoteTokenDepositTotal` |

### 从已确认交易中解码兑换事件

```typescript {% title="decode-swap-event.ts" showLineNumbers=true %}
import {
  getBondingCurveSwapEventSerializer,
} from '@metaplex-foundation/genesis';
import { publicKey } from '@metaplex-foundation/umi';

const GENESIS_PROGRAM_ID = 'GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B';
const SWAP_EVENT_DISCRIMINATOR = 255;

async function decodeSwapEvent(signature: string) {
  const tx = await umi.rpc.getTransaction(signature, {
    commitment: 'confirmed',
  });

  if (!tx) throw new Error('Transaction not found');

  const serializer = getBondingCurveSwapEventSerializer();

  for (const innerIx of tx.meta?.innerInstructions ?? []) {
    for (const ix of innerIx.instructions) {
      const programId = tx.transaction.message.accountKeys[ix.programIdIndex];

      if (programId.toString() !== GENESIS_PROGRAM_ID) continue;

      const data = ix.data; // Uint8Array
      if (data[0] !== SWAP_EVENT_DISCRIMINATOR) continue;

      // Slice off the discriminator byte, then deserialize.
      const eventBytes = data.slice(1);
      const [event] = serializer.deserialize(eventBytes);

      console.log('Direction:            ', event.direction);
      console.log('Amount in:            ', event.amountIn.toString());
      console.log('Amount out:           ', event.amountOut.toString());
      console.log('Fee:                  ', event.fee.toString());
      console.log('Base balance after:   ', event.baseTokenBalanceAfter.toString());
      console.log('Quote deposit after:  ', event.quoteTokenDepositTotalAfter.toString());

      return event;
    }
  }

  return null; // No swap event found in this transaction.
}
```

## 索引生命周期事件

索引器可以通过监听 Genesis 程序指令和内部指令事件来追踪联合曲线的完整生命周期。

**Program ID：** `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`

### 生命周期事件

| 事件 | 描述 | 关键字段 |
|-------|-------------|------------|
| 代币创建 | SPL 代币铸造，genesis 账户初始化 | `baseMint`、`genesisAccount` |
| 联合曲线添加 | `BondingCurveBucketV2` 账户创建 | `bucketPda`、`baseTokenAllocation`、`virtualSol`、`virtualTokens` |
| 已最终确定 | 发行配置锁定，bucket 激活 | `genesisAccount` |
| 上线 | `swapStartCondition` 满足，交易开放 | `bucketPda`、时间戳 |
| 兑换 | 买入或卖出执行 | `BondingCurveSwapEvent`（判别字节 255） |
| 已售罄 | `baseTokenBalance === 0` | `bucketPda`、`quoteTokenDepositTotal` |
| 毕业曲柄 | 流动性迁移指令已提交 | `bucketPda`、`raydiumCpmmPool` |
| 已毕业 | Raydium CPMM 池已注入资金，联合曲线已关闭 | `cpmmPoolPda`、累积 SOL |

### 从事件追踪当前价格

从每个 `BondingCurveSwapEvent` 中包含的兑换后储备状态推导当前价格，而非在每次交易后重新获取账户：

```typescript {% title="price-from-event.ts" showLineNumbers=true %}
function getPriceFromEvent(event: BondingCurveSwapEvent, bucket: BondingCurveBucketV2) {
  // totalTokens = virtualTokens + baseTokenBalance after swap
  const totalTokens = bucket.virtualTokens + event.baseTokenBalanceAfter;
  // totalSol = virtualSol + quoteTokenDepositTotal after swap
  const totalSol = bucket.virtualSol + event.quoteTokenDepositTotalAfter;
  // Price: tokens per SOL (how many tokens you receive for 1 SOL)
  return Number(totalTokens) / Number(totalSol);
}
```

### 账户判别字节

| 账户 | 判别字节 | 描述 |
|---------|---------------|-------------|
| `GenesisAccountV2` | 每种账户类型唯一 | 主协调账户 |
| `BondingCurveBucketV2` | 每种账户类型唯一 | 联合曲线 AMM 状态 |
| `BondingCurveSwapEvent` | `255`（内部指令） | 程序发出的每次兑换事件 |

### PDA 推导

| PDA | Seeds |
|-----|-------|
| `GenesisAccountV2` | `["genesis_account_v2", baseMint, genesisIndex (u8)]` |
| `BondingCurveBucketV2` | `["bonding_curve_bucket_v2", genesisAccount, bucketIndex (u8)]` |

使用 Genesis SDK 中的 `findGenesisAccountV2Pda` 和 `findBondingCurveBucketV2Pda` 函数在 TypeScript 中推导 PDA。

## 错误处理

链上程序会发出带类型的错误。通过错误代码或消息捕获它们，并向用户提供清晰的反馈。

| 错误 | 原因 | 解决方法 |
|-------|-------|------------|
| `BondingCurveInsufficientFunds` | 曲线持有的代币（买入）或 SOL（卖出）不足以完成请求 | 重新获取 bucket 并重新报价；曲线可能即将售罄 |
| `InsufficientOutputAmount` | 实际输出低于 `minAmountOut`（超出滑点容忍度） | 增大 `slippageBps` 或立即重试 |
| `InvalidSwapDirection` | `direction` 字段与提供的指令账户不匹配 | 验证 `direction` 参数与传入的代币账户匹配 |
| `BondingCurveNotStarted` | `swapStartCondition` 尚未满足 | 检查 `bucket.swapStartCondition` 并等待曲线上线 |
| `BondingCurveEnded` | `swapEndCondition` 已触发——曲线已售罄或已毕业 | 曲线已关闭；将用户引导至 Raydium CPMM 池 |

```typescript {% title="error-handling.ts" showLineNumbers=true %}
import { isSwappable, isSoldOut, getSwapResult, applySlippage, swapBondingCurveV2 } from '@metaplex-foundation/genesis';

async function executeBuy(bucket, amountIn: bigint, slippageBps: number) {
  if (!isSwappable(bucket)) {
    if (isSoldOut(bucket)) {
      throw new Error('This token has sold out. Trade on Raydium.');
    }
    throw new Error('Curve is not yet active. Check the start time.');
  }

  const quote = getSwapResult(bucket, amountIn, 'buy');
  const minAmountOut = applySlippage(quote.amountOut, slippageBps);

  try {
    const result = await swapBondingCurveV2(umi, {
      // ... accounts
      amountIn: quote.amountIn,
      minAmountOut,
      direction: 'buy',
    }).sendAndConfirm(umi);

    return result.signature;
  } catch (err: any) {
    if (err.message?.includes('InsufficientOutputAmount')) {
      throw new Error('Price moved too fast. Try again with higher slippage.');
    }
    if (err.message?.includes('BondingCurveInsufficientFunds')) {
      throw new Error('Not enough tokens remaining. Re-fetch and reduce amount.');
    }
    throw err;
  }
}
```

## 注意事项

- `virtualSol` 和 `virtualTokens` 在曲线创建时设定且不可更改——它们永久定义价格曲线的形状
- 所有手续费金额以 lamports 计（SOL 侧）；当前费率值请参阅[协议费用](/protocol-fees)
- 当前版本不支持 USDC 作为报价代币；仅接受 wSOL
- `isGraduated` 每次调用都会发起一次 RPC 请求——请在索引器中缓存结果，而非每次渲染时调用
- `BondingCurveSwapEvent` 的判别字节始终为 `255`——Genesis 程序上任何以该字节开头的内部指令都是兑换事件
- 在 `isSoldOut` 返回 `true` 与 `isGraduated` 返回 `true` 之间，曲线已售罄但 Raydium CPMM 池尚未注入资金；在 `isGraduated` 确认之前，请勿将用户引导至 Raydium
- 在生产环境中，每次兑换前都应重新获取 bucket——价格随每位用户的每次交易而变化
- 联合曲线与[发行池](/smart-contracts/genesis/launch-pool)和[预售](/smart-contracts/genesis/presale)发行类型不同，后两者使用固定存款窗口和批量价格发现机制

## API 参考

### 报价和价格函数

| 函数 | 异步 | 返回值 | 描述 |
|----------|-------|---------|-------------|
| `getSwapResult(bucket, amountIn, direction, isFirstBuy?)` | 否 | `{ amountIn, fee, amountOut }` | 含手续费的兑换报价 |
| `getCurrentPrice(bucket)` | 否 | `number` | 当前储备状态下每 SOL 可换代币数 |
| `getCurrentPriceQuotePerBase(bucket)` | 否 | `number` | 每个基础代币单位所需 lamports |
| `getCurrentPriceComponents(bucket)` | 否 | `{ totalSol, totalTokens, k }` | 原始 AMM 储备组件 |

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

### 兑换指令——必需账户

| 账户 | 可写 | 签名 | 描述 |
|---------|----------|--------|-------------|
| `genesisAccount` | 是 | 否 | Genesis 协调 PDA |
| `bucketPda` | 是 | 否 | `BondingCurveBucketV2` PDA |
| `baseMint` | 否 | 否 | SPL 代币 mint |
| `quoteMint` | 否 | 否 | wSOL mint |
| `userBaseTokenAccount` | 是 | 否 | 用户的基础代币 ATA |
| `userQuoteTokenAccount` | 是 | 否 | 用户的 wSOL ATA |
| `payer` | 是 | 是 | 交易手续费付款方 |

### 兑换指令——可选账户

| 账户 | 描述 |
|---------|-------------|
| `feeQuoteTokenAccount` | 协议手续费目标地址（wSOL ATA） |
| `creatorFeeQuoteTokenAccount` | 累积创作者费的桶的 wSOL ATA；配置了 `CreatorFee` 扩展时自动解析 |
| `firstBuyerAccount` | 仅指定首次购买钱包时需要 |

### 账户发现

| 函数 | 返回值 | 描述 |
|----------|---------|-------------|
| `findBondingCurveBucketV2Pda(umi, { genesisAccount, bucketIndex })` | `[PublicKey, bump]` | 推导 bucket PDA |
| `findGenesisAccountV2Pda(umi, { baseMint, genesisIndex })` | `[PublicKey, bump]` | 推导 genesis 账户 PDA |
| `fetchBondingCurveBucketV2(umi, pda)` | `BondingCurveBucketV2` | 获取并反序列化账户 |
| `getBondingCurveBucketV2GpaBuilder(umi)` | GPA builder | 查询所有联合曲线账户 |

## FAQ

### isSwappable 和 isSoldOut 有什么区别？

`isSwappable` 仅在曲线正在接受公开交易时返回 `true`——开始条件已满足、结束条件尚未触发、首次购买（如已配置）已完成，且代币尚存。`isSoldOut` 在 `baseTokenBalance` 降至零的瞬间返回 `true`，此时交易结束并触发毕业流程。曲线可以已售罄但尚未毕业——在此窗口期内两个函数均不允许兑换。

### 调用 swapBondingCurveV2 之前需要先包装 SOL 吗？

是的。联合曲线使用 wSOL 作为报价代币，`swapBondingCurveV2` 不会自动包装或解包原生 SOL。买入时，需创建 wSOL [关联代币账户（ATA）](https://spl.solana.com/associated-token-account)，存入所需 lamports，并在发送兑换前调用 `syncNative`。卖出时，确认后关闭 wSOL ATA 以转换回原生 SOL。

### getSwapResult 返回什么，它如何处理手续费？

`getSwapResult` 返回 `{ amountIn, fee, amountOut }`。买入时，手续费在 AMM 公式运算前从 SOL 输入中扣除——用户支付 `amountIn` 总额，AMM 收到 `amountIn − fee`。卖出时，手续费在 AMM 公式运算后从 SOL 输出中扣除——用户收到扣除手续费后的净 `amountOut`。将 `true` 作为第四个参数传入以模拟首次购买手续费豁免。

### 如何防止滑点？

调用 `applySlippage(quote.amountOut, slippageBps)` 推导 `minAmountOut`，然后将其传给 `swapBondingCurveV2`。若实际输出低于 `minAmountOut`，链上程序将拒绝交易。常用值：稳定行情下 50 bps（0.5%），波动性发行时 200 bps（2%）。

### isSoldOut 和 isGraduated 有什么区别？

`isSoldOut` 是本地同步检查——`baseTokenBalance` 为 `0n` 时立即返回 `true`。`isGraduated` 是异步 RPC 调用，验证 Raydium CPMM 池是否已在链上创建并注入资金。在售罄与毕业之间存在一个窗口期，此时 `isSoldOut` 为 `true` 但 `isGraduated` 为 `false`。在 `isGraduated` 确认池已存在之前，请勿将用户重定向至 Raydium。

### 如何从交易中解码 BondingCurveSwapEvent？

在 Genesis 程序（`GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`）的内部指令中找到首个数据字节为 `255` 的条目。截去该字节并将剩余部分传给 `getBondingCurveSwapEventSerializer().deserialize(data.slice(1))`。返回的对象包含方向、金额、手续费以及更新价格索引所需的兑换后储备状态。
