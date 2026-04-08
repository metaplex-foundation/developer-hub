---
title: Bonding Curve Swap Integration
metaTitle: Genesis Bonding Curve Swap Integration | Metaplex
description: How to read bonding curve state, get swap quotes, execute buy and sell transactions, handle slippage, and claim creator fees using the Genesis SDK.
updated: '04-08-2026'
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
  - q: What is the difference between isSwappable and isSoldOut?
    a: isSwappable returns true when the curve is actively accepting trades — the start condition is met, the end condition has not been triggered, the first buy (if configured) is done, and tokens remain. isSoldOut returns true when baseTokenBalance hits zero, which ends trading and triggers graduation.
  - q: Do I need to wrap SOL before calling swapBondingCurveV2?
    a: Yes. The bonding curve uses wrapped SOL (wSOL) as the quote token. The swapBondingCurveV2 instruction does not wrap or unwrap SOL automatically. For buys, create a wSOL ATA, transfer native SOL in, and call syncNative before sending the swap. For sells, close the wSOL ATA after the swap to unwrap back to native SOL.
  - q: What does getSwapResult return and how does it handle fees?
    a: getSwapResult returns amountIn (what the user actually pays), fee (total fee charged), and amountOut (what the user receives). For buys, the fee is deducted from SOL input before the AMM runs. For sells, the fee is deducted from SOL output after the AMM runs. Pass true as the fourth argument to waive fees for a first buy quote.
  - q: How do I protect against slippage?
    a: Use applySlippage(quote.amountOut, slippageBps) to derive a minAmountOut, then pass it to swapBondingCurveV2. The on-chain program rejects the transaction if the actual output falls below minAmountOut. Common values are 50 bps (0.5%) for stable conditions and 200 bps (2%) for volatile launches.
---

Use the Genesis SDK to read [bonding curve](/smart-contracts/genesis/bonding-curve) state, compute swap quotes, execute buy and sell transactions onchain, handle slippage, and claim creator fees. {% .lead %}

{% callout title="What You'll Build" %}
This guide covers:
- Fetching and interpreting `BondingCurveBucketV2` account state
- Checking lifecycle status with `isSwappable`, `isSoldOut`, and `isGraduated`
- Getting accurate swap quotes with `getSwapResult`
- Protecting users with `applySlippage`
- Constructing buy and sell transactions with `swapBondingCurveV2`
- Claiming creator fees from the curve and post-graduation Raydium pool
{% /callout %}

## Summary

Bonding curve swaps use the Genesis SDK to interact with the `BondingCurveBucketV2` onchain account — a constant product AMM that accepts SOL and returns tokens (buy) or accepts tokens and returns SOL (sell). For the underlying pricing mathematics, see [Theory of Operation](/smart-contracts/genesis/bonding-curve-theory).

- **Quote before sending** — call `getSwapResult` to get the exact fee-adjusted input and output amounts
- **Slippage protection** — derive `minAmountOut` with `applySlippage` and pass it to the instruction
- **wSOL is manual** — the swap instruction does not wrap or unwrap native SOL; callers must handle the wSOL ATA themselves
- **Program ID** — `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B` on Solana mainnet

## Quick Start

**Jump to:** [Installation](#installation) · [Setup](#umi-and-genesis-plugin-setup) · [Fetch Curve](#fetching-a-bonding-curve-bucketv2) · [Lifecycle Helpers](#bonding-curve-lifecycle-helpers) · [Quote](#getting-a-swap-quote) · [Slippage](#slippage-protection) · [Execute Swap](#constructing-swap-transactions) · [Creator Fees](#claiming-creator-fees) · [Errors](#error-handling) · [API Reference](#api-reference)

1. Install the packages and configure a Umi instance with the `genesis()` plugin
2. Derive `BondingCurveBucketV2Pda` and fetch the account
3. Check `isSwappable(bucket)` — abort if false
4. Call `getSwapResult(bucket, amountIn, 'buy')` for a fee-adjusted quote
5. Apply `applySlippage(quote.amountOut, slippageBps)` to get `minAmountOut`
6. Handle wSOL wrapping manually, then send `swapBondingCurveV2` and confirm

## Prerequisites

- **Node.js 18+** — required for native BigInt support
- **Solana wallet** funded with SOL for transaction fees and swap input
- A Solana RPC endpoint (mainnet-beta or devnet)
- Familiarity with the [Umi framework](https://github.com/metaplex-foundation/umi) and async/await patterns

## Tested Configuration

| Tool | Version |
|------|---------|
| `@metaplex-foundation/genesis` | 1.x |
| `@metaplex-foundation/umi` | 1.x |
| `@metaplex-foundation/umi-bundle-defaults` | 1.x |
| Node.js | 18+ |

## Installation

```bash {% title="Terminal" %}
npm install @metaplex-foundation/genesis \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults
```

## Umi and Genesis Plugin Setup

Configure a Umi instance and register the `genesis()` plugin before calling any SDK function.

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

## Fetching a Bonding Curve BucketV2

Three discovery strategies are available depending on what you already know.

### Fetch from a Known Genesis Account

```typescript {% title="fetch-from-genesis.ts" showLineNumbers=true %}
import {
  findBondingCurveBucketV2Pda,
  fetchBondingCurveBucketV2,
} from '@metaplex-foundation/genesis';
import { publicKey } from '@metaplex-foundation/umi';

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT_PUBKEY');

const [bucketPda] = findBondingCurveBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

const bucket = await fetchBondingCurveBucketV2(umi, bucketPda);
```

### Fetch from a Token Mint

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

## Reading Bonding Curve BucketV2 State

| Field | Type | Description |
|-------|------|-------------|
| `baseTokenBalance` | `bigint` | Tokens remaining on the curve. Zero means sold out. |
| `baseTokenAllocation` | `bigint` | Total tokens allocated to this curve at creation. |
| `quoteTokenDepositTotal` | `bigint` | Real SOL deposited by buyers (lamports). Starts at 0. |
| `virtualSol` | `bigint` | Virtual SOL reserve added at initialization (pricing only). |
| `virtualTokens` | `bigint` | Virtual token reserve added at initialization (pricing only). |
| `depositFee` | `number` | Protocol fee rate applied to the SOL side of every swap. |
| `withdrawFee` | `number` | Protocol fee rate applied to the SOL output side of sells. |
| `swapStartCondition` | `object` | Condition that must be met before trading is allowed. |
| `swapEndCondition` | `object` | Condition that ends trading when triggered. |

{% callout type="note" %}
`virtualSol` and `virtualTokens` exist only in pricing mathematics — they are never deposited as real assets onchain. See [Theory of Operation](/smart-contracts/genesis/bonding-curve-theory#why-bonding-curves-require-virtual-reserves) for how virtual reserves shape the constant product curve.
{% /callout %}

## Bonding Curve Lifecycle Helpers

Five helper functions inspect curve state without additional RPC calls (except `isGraduated`).

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

| Helper | Async | Returns | Description |
|--------|-------|---------|-------------|
| `isSwappable(bucket)` | No | `boolean` | `true` when accepting public trades |
| `isFirstBuyPending(bucket)` | No | `boolean` | `true` when designated first-buy not yet done |
| `isSoldOut(bucket)` | No | `boolean` | `true` when `baseTokenBalance === 0n` |
| `getFillPercentage(bucket)` | No | `number` | 0–100 percentage of allocation sold |
| `isGraduated(umi, bucket)` | Yes | `boolean` | `true` when Raydium CPMM pool exists onchain |

## Getting a Swap Quote

`getSwapResult(bucket, amountIn, direction, isFirstBuy?)` computes the exact fee-adjusted amounts for a swap without sending any transaction.

Returns `{ amountIn, fee, amountOut }`:
- `amountIn` — actual input amount after any adjustments
- `fee` — total fee charged (protocol + creator), in lamports
- `amountOut` — tokens received (buy) or SOL received (sell)

### Buy Quote (SOL to Tokens)

```typescript {% title="buy-quote.ts" showLineNumbers=true %}
import { getSwapResult } from '@metaplex-foundation/genesis';

const SOL_IN = 1_000_000_000n; // 1 SOL in lamports

const buyQuote = getSwapResult(bucket, SOL_IN, 'buy');

console.log('SOL input:    ', buyQuote.amountIn.toString(), 'lamports');
console.log('Total fee:    ', buyQuote.fee.toString(), 'lamports');
console.log('Tokens out:   ', buyQuote.amountOut.toString());
```

### Sell Quote (Tokens to SOL)

```typescript {% title="sell-quote.ts" showLineNumbers=true %}
const TOKENS_IN = 500_000_000_000n; // 500 tokens (9 decimals)

const sellQuote = getSwapResult(bucket, TOKENS_IN, 'sell');

console.log('Tokens input: ', sellQuote.amountIn.toString());
console.log('Total fee:    ', sellQuote.fee.toString(), 'lamports');
console.log('SOL out:      ', sellQuote.amountOut.toString(), 'lamports');
```

### First Buy Fee Waiver

Pass `true` as the fourth argument to quote a first buy with fees waived:

```typescript {% title="first-buy-quote.ts" showLineNumbers=true %}
const firstBuyQuote = getSwapResult(bucket, SOL_IN, 'buy', true);
console.log('Fee (waived): ', firstBuyQuote.fee.toString()); // 0n
```

### Current Price Helpers

```typescript {% title="current-price.ts" showLineNumbers=true %}
import {
  getCurrentPrice,
  getCurrentPriceQuotePerBase,
  getCurrentPriceComponents,
} from '@metaplex-foundation/genesis';

const tokensPerSol = getCurrentPrice(bucket);
const lamportsPerToken = getCurrentPriceQuotePerBase(bucket);
const { totalSol, totalTokens, k } = getCurrentPriceComponents(bucket);
```

## Slippage Protection

`applySlippage(expectedAmountOut, slippageBps)` reduces the expected output by the slippage tolerance. Pass `minAmountOut` to the swap instruction — the onchain program rejects the transaction if the actual output falls below this value.

```typescript {% title="slippage.ts" showLineNumbers=true %}
import { getSwapResult, applySlippage } from '@metaplex-foundation/genesis';

const quote = getSwapResult(bucket, 1_000_000_000n, 'buy');
const minAmountOut = applySlippage(quote.amountOut, 100); // 1% slippage
```

{% callout type="warning" %}
Never send a swap without a `minAmountOut` derived from `applySlippage`. The bonding curve price moves with every trade; without slippage protection a user can receive far fewer tokens than quoted.
{% /callout %}

Common values: 50 bps (0.5%) for stable conditions; 200 bps (2%) during volatile launches.

## Constructing Swap Transactions

`swapBondingCurveV2(umi, accounts)` builds the swap instruction. The caller is responsible for handling wrapped SOL (wSOL) before and after the transaction.

### Buy Transaction (SOL to Tokens)

```typescript {% title="swap-buy.ts" showLineNumbers=true %}
import {
  getSwapResult,
  applySlippage,
  swapBondingCurveV2,
  findBondingCurveBucketV2Pda,
  fetchBondingCurveBucketV2,
  isSwappable,
} from '@metaplex-foundation/genesis';
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox';
import { publicKey } from '@metaplex-foundation/umi';

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT_PUBKEY');
const baseMint = publicKey('TOKEN_MINT_PUBKEY');
const quoteMint = publicKey('So11111111111111111111111111111111111111112'); // wSOL

const [bucketPda] = findBondingCurveBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 });
const bucket = await fetchBondingCurveBucketV2(umi, bucketPda);

if (!isSwappable(bucket)) throw new Error('Curve is not currently accepting swaps');

const SOL_IN = 1_000_000_000n; // 1 SOL in lamports
const quote = getSwapResult(bucket, SOL_IN, 'buy');
const minAmountOut = applySlippage(quote.amountOut, 100);

const [userBaseTokenAccount] = findAssociatedTokenPda(umi, { mint: baseMint, owner: umi.identity.publicKey });
const [userQuoteTokenAccount] = findAssociatedTokenPda(umi, { mint: quoteMint, owner: umi.identity.publicKey });

// NOTE: Fund the wSOL ATA before this call. See wSOL Wrapping Note below.
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

### Sell Transaction (Tokens to SOL)

```typescript {% title="swap-sell.ts" showLineNumbers=true %}
const TOKENS_IN = 500_000_000_000n;
const quote = getSwapResult(bucket, TOKENS_IN, 'sell');
const minAmountOut = applySlippage(quote.amountOut, 100);

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
// NOTE: Close the wSOL ATA after a sell to unwrap back to native SOL.
console.log('Sell confirmed:', result.signature);
```

### wSOL Wrapping Note

{% callout type="warning" title="Manual wSOL handling required" %}
`swapBondingCurveV2` uses wrapped SOL (wSOL) as the quote token and does **not** wrap or unwrap native SOL automatically.

**For buys:** Create a wSOL ATA, transfer the required lamports into it, and call `syncNative` before sending the swap.

**For sells:** Close the wSOL ATA after the swap confirms to unwrap back to native SOL.

Only wSOL is accepted as the quote token in the current version.
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

## Claiming Creator Fees

Creator fees are accrued in the bucket (`creatorFeeAccrued`) on every swap rather than transferred directly. Claim them via the permissionless `claimBondingCurveCreatorFeeV2` instruction.

### During the Active Curve

```typescript {% title="claim-creator-fees.ts" showLineNumbers=true %}
import { claimBondingCurveCreatorFeeV2 } from '@metaplex-foundation/genesis';

const result = await claimBondingCurveCreatorFeeV2(umi, {
  genesisAccount,
  bucketPda,
}).sendAndConfirm(umi);

console.log('Creator fees claimed:', result.signature);
```

### After Graduation (Raydium LP Fees)

After graduation, creator fees continue to accrue from Raydium LP trading activity. Claim post-graduation fees via `claimRaydiumCreatorFeeV2`:

```typescript {% title="claim-raydium-creator-fees.ts" showLineNumbers=true %}
import { claimRaydiumCreatorFeeV2 } from '@metaplex-foundation/genesis';

const result = await claimRaydiumCreatorFeeV2(umi, {
  genesisAccount,
  // ... Raydium pool accounts
}).sendAndConfirm(umi);
```

{% callout type="note" %}
Both `claimBondingCurveCreatorFeeV2` and `claimRaydiumCreatorFeeV2` are permissionless — anyone can call them, but fees are sent to the configured creator fee wallet, not the caller.
{% /callout %}

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| `BondingCurveInsufficientFunds` | Not enough tokens (buy) or SOL (sell) remaining | Re-fetch the bucket and re-quote; curve may be nearly sold out |
| `InsufficientOutputAmount` | Actual output fell below `minAmountOut` | Increase `slippageBps` or retry immediately |
| `InvalidSwapDirection` | `direction` does not match instruction accounts | Verify `direction` matches the token accounts passed |
| `BondingCurveNotStarted` | `swapStartCondition` not yet met | Check `bucket.swapStartCondition` and wait |
| `BondingCurveEnded` | Curve is sold out or graduated | Direct users to the Raydium CPMM pool |

```typescript {% title="error-handling.ts" showLineNumbers=true %}
async function executeBuy(bucket, amountIn: bigint, slippageBps: number) {
  if (!isSwappable(bucket)) {
    if (isSoldOut(bucket)) throw new Error('Token sold out. Trade on Raydium.');
    throw new Error('Curve not yet active. Check the start time.');
  }

  const quote = getSwapResult(bucket, amountIn, 'buy');
  const minAmountOut = applySlippage(quote.amountOut, slippageBps);

  try {
    return await swapBondingCurveV2(umi, {
      amountIn: quote.amountIn,
      minAmountOut,
      direction: 'buy',
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

## Notes

- Re-fetch the bucket before every swap in production — the price changes with every trade by any user
- `virtualSol` and `virtualTokens` are immutable after curve creation — cache them; only real reserve fields change per swap
- `isGraduated` makes an RPC call on every invocation — cache the result in your indexer
- Between `isSoldOut` returning `true` and `isGraduated` returning `true`, the curve is sold out but Raydium is not yet funded; do not send users to Raydium until `isGraduated` confirms
- For event decoding and lifecycle indexing, see [Indexing & Events](/smart-contracts/genesis/bonding-curve-indexing)
- All fee amounts are in lamports (SOL side); see [Protocol Fees](/protocol-fees) for current rates

## API Reference

### Quote and Price Functions

| Function | Async | Returns | Description |
|----------|-------|---------|-------------|
| `getSwapResult(bucket, amountIn, direction, isFirstBuy?)` | No | `{ amountIn, fee, amountOut }` | Fee-adjusted swap quote |
| `getCurrentPrice(bucket)` | No | `number` | Tokens per SOL at current reserve state |
| `getCurrentPriceQuotePerBase(bucket)` | No | `number` | Lamports per base token unit |
| `getCurrentPriceComponents(bucket)` | No | `{ totalSol, totalTokens, k }` | Raw AMM reserve components |

### Lifecycle Functions

| Function | Async | Returns | Description |
|----------|-------|---------|-------------|
| `isSwappable(bucket)` | No | `boolean` | `true` when accepting public trades |
| `isFirstBuyPending(bucket)` | No | `boolean` | `true` when designated first-buy not yet done |
| `isSoldOut(bucket)` | No | `boolean` | `true` when `baseTokenBalance === 0n` |
| `getFillPercentage(bucket)` | No | `number` | 0–100 percentage of allocation sold |
| `isGraduated(umi, bucket)` | Yes | `boolean` | `true` when Raydium CPMM pool exists onchain |

### Slippage

| Function | Returns | Description |
|----------|---------|-------------|
| `applySlippage(amountOut, slippageBps)` | `bigint` | Reduces `amountOut` by `slippageBps / 10_000` |

### Swap Instruction Accounts

| Account | Writable | Signer | Description |
|---------|----------|--------|-------------|
| `genesisAccount` | Yes | No | Genesis coordination PDA |
| `bucketPda` | Yes | No | `BondingCurveBucketV2` PDA |
| `baseMint` | No | No | SPL token mint |
| `quoteMint` | No | No | wSOL mint |
| `userBaseTokenAccount` | Yes | No | User's base token ATA |
| `userQuoteTokenAccount` | Yes | No | User's wSOL ATA |
| `payer` | Yes | Yes | Transaction fee payer |

### Account Discovery

| Function | Returns | Description |
|----------|---------|-------------|
| `findBondingCurveBucketV2Pda(umi, { genesisAccount, bucketIndex })` | `[PublicKey, bump]` | Derives the bucket PDA |
| `findGenesisAccountV2Pda(umi, { baseMint, genesisIndex })` | `[PublicKey, bump]` | Derives the genesis account PDA |
| `fetchBondingCurveBucketV2(umi, pda)` | `BondingCurveBucketV2` | Fetches and deserializes the account |

## FAQ

### What is the difference between isSwappable and isSoldOut?
`isSwappable` returns `true` only when the curve is actively accepting public trades. `isSoldOut` returns `true` the moment `baseTokenBalance` reaches zero, ending trading and triggering graduation. A curve can be sold out but not yet graduated.

### Do I need to wrap SOL before calling swapBondingCurveV2?
Yes. The bonding curve uses wSOL as its quote token and `swapBondingCurveV2` does not wrap or unwrap native SOL automatically. See [wSOL Wrapping Note](#wsol-wrapping-note).

### What does getSwapResult return and how does it handle fees?
`getSwapResult` returns `{ amountIn, fee, amountOut }`. For buys, the fee is deducted from SOL input before the AMM formula runs. For sells, the fee is deducted from the SOL output after the AMM runs. Pass `true` as the fourth argument to simulate the first-buy fee waiver.

### How do I protect against slippage?
Call `applySlippage(quote.amountOut, slippageBps)` to derive `minAmountOut`, then pass it to `swapBondingCurveV2`. The onchain program rejects the transaction if the actual output falls below `minAmountOut`.
