---
title: Bonding Curve V2 Swap Integration
metaTitle: Genesis Bonding Curve V2 Swap Integration | Metaplex
description: How to read bonding curve state, get swap quotes, execute buy and sell transactions, handle slippage, decode swap events, and index lifecycle events using the Genesis SDK.
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
    a: isSwappable returns true when the curve is actively accepting trades — the start condition is met, the end condition has not been triggered, the first buy (if configured) is done, and tokens remain. isSoldOut returns true when baseTokenBalance hits zero, which ends trading and triggers graduation. A curve can be sold out but not yet graduated.
  - q: Do I need to wrap SOL before calling swapBondingCurveV2?
    a: Yes. The bonding curve uses wrapped SOL (wSOL) as the quote token. The swapBondingCurveV2 instruction does not wrap or unwrap SOL automatically. For buys, create a wSOL ATA, transfer native SOL in, and call syncNative before sending the swap. For sells, close the wSOL ATA after the swap to unwrap back to native SOL.
  - q: What does getSwapResult return and how does it handle fees?
    a: getSwapResult returns amountIn (what the user actually pays), fee (total fee charged), and amountOut (what the user receives). For buys, the fee is deducted from SOL input before the AMM runs. For sells, the fee is deducted from SOL output after the AMM runs. Pass true as the fourth argument to waive fees for a first buy quote.
  - q: How do I protect against slippage?
    a: Use applySlippage(quote.amountOut, slippageBps) to derive a minAmountOut, then pass it to swapBondingCurveV2. The on-chain program rejects the transaction if the actual output falls below minAmountOut. Common values are 50 bps (0.5%) for stable conditions and 200 bps (2%) for volatile launches.
  - q: What is the difference between isSoldOut and isGraduated?
    a: isSoldOut is a synchronous check on the bucket's baseTokenBalance — it returns true the moment all tokens are purchased. isGraduated is an async RPC call that checks whether the Raydium CPMM pool has been created and funded. There is a window between sell-out and graduation where isSoldOut is true but isGraduated is false.
  - q: How do I decode a BondingCurveSwapEvent from a transaction?
    a: Find the inner instruction on the Genesis program (GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B) with discriminator byte 255, slice off that first byte, and pass the remaining bytes to getBondingCurveSwapEventSerializer().deserialize(). The event contains direction, amounts, fee, and post-swap reserve state.
---

Use the Genesis SDK to read [bonding curve V2](/smart-contracts/genesis/bonding-curve-v2) state, compute swap quotes, execute buy and sell transactions onchain, handle slippage, decode swap events, and index the full lifecycle of a bonding curve launch. {% .lead %}

{% callout title="What You'll Build" %}
This guide covers:
- Fetching and interpreting `BondingCurveBucketV2` account state
- Checking lifecycle status with `isSwappable`, `isSoldOut`, and `isGraduated`
- Getting accurate swap quotes with `getSwapResult`
- Protecting users with `applySlippage`
- Constructing buy and sell transactions with `swapBondingCurveV2`
- Decoding `BondingCurveSwapEvent` from confirmed transactions
- Indexing lifecycle events onchain
{% /callout %}

## Summary

Bonding curve V2 swaps use the Genesis SDK to interact with the `BondingCurveBucketV2` onchain account — a constant product AMM that accepts SOL and returns tokens (buy) or accepts tokens and returns SOL (sell). For the underlying pricing mathematics, see [Bonding Curve V2 — Theory of Operation](/smart-contracts/genesis/bonding-curve-v2).

- **Quote before sending** — call `getSwapResult` to get the exact fee-adjusted input and output amounts
- **Slippage protection** — derive `minAmountOut` with `applySlippage` and pass it to the instruction
- **wSOL is manual** — the swap instruction does not wrap or unwrap native SOL; callers must handle the wSOL [associated token account (ATA)](https://spl.solana.com/associated-token-account) themselves
- **Program ID** — `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B` on Solana mainnet


## Quick Start

**Jump to:** [Installation](#installation) · [Setup](#umi-and-genesis-plugin-setup) · [Fetch Curve](#fetching-a-bonding-curve-bucketv2) · [Lifecycle Helpers](#bonding-curve-lifecycle-helpers) · [Quote](#getting-a-swap-quote) · [Slippage](#slippage-protection) · [Execute Swap](#constructing-swap-transactions) · [Events](#reading-swap-events) · [Indexing](#indexing-lifecycle-events) · [Errors](#error-handling) · [API Reference](#api-reference)

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

Install the three required packages with a single command.

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

// Load your wallet keypair from a local file.
const keypairFile = JSON.parse(readFileSync('/path/to/keypair.json', 'utf-8'));

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(genesis());

const keypair = umi.eddsa.createKeypairFromSecretKey(Uint8Array.from(keypairFile));
umi.use(keypairIdentity(keypair));
```

## Fetching a Bonding Curve BucketV2

Three discovery strategies are available depending on what you already know.

### Fetch from a Known Genesis Account

Use this when you created the bonding curve and already have the genesis account address.

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

### Fetch from a Token Mint

Use this when you only have the token mint address — common in integrations that receive a mint from user input or an API.

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

### Discover All Bonding Curves (GPA)

Use the GPA builder to retrieve every `BondingCurveBucketV2` account on the program — useful for indexers and dashboards.

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

## Reading Bonding Curve BucketV2 State

The `BondingCurveBucketV2` account contains all fields needed to compute quotes, check lifecycle status, and display market data.

| Field | Type | Description |
|-------|------|-------------|
| `baseTokenBalance` | `bigint` | Tokens remaining on the curve. Zero means sold out. |
| `baseTokenAllocation` | `bigint` | Total tokens allocated to this curve at creation. |
| `quoteTokenDepositTotal` | `bigint` | Real SOL deposited by buyers (lamports). Starts at 0. |
| `virtualSol` | `bigint` | Virtual SOL reserve added at initialization (pricing only). |
| `virtualTokens` | `bigint` | Virtual token reserve added at initialization (pricing only). |
| `depositFee` | `number` | Protocol fee rate applied to the SOL side of every swap. |
| `withdrawFee` | `number` | Creator fee rate applied to the SOL side of every swap. |
| `swapStartCondition` | `object` | Condition that must be met before trading is allowed. |
| `swapEndCondition` | `object` | Condition that ends trading when triggered. |

{% callout type="note" %}
`virtualSol` and `virtualTokens` exist only in pricing mathematics — they are never deposited as real assets onchain. See [Bonding Curve V2 — Theory of Operation](/smart-contracts/genesis/bonding-curve-v2#why-bonding-curves-require-virtual-reserves) for how virtual reserves shape the constant product curve.
{% /callout %}

For current protocol fee rates, see the [Protocol Fees](/protocol-fees) page.

## Bonding Curve Lifecycle Helpers

Five helper functions in the Genesis SDK inspect curve state without requiring additional RPC calls (except `isGraduated`).

### isSwappable

`isSwappable(bucket)` returns `true` when the curve is actively accepting public swaps — the start condition is met, the end condition has not fired, the first buy (if configured) is complete, and tokens remain. **Always check this before quoting or sending a swap.**

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

### Lifecycle Helper Quick Reference

| Helper | Async | Returns | Description |
|--------|-------|---------|-------------|
| `isSwappable(bucket)` | No | `boolean` | `true` when accepting public trades |
| `isFirstBuyPending(bucket)` | No | `boolean` | `true` when designated first-buy not yet done |
| `isSoldOut(bucket)` | No | `boolean` | `true` when `baseTokenBalance === 0n` |
| `getFillPercentage(bucket)` | No | `number` | 0–100 percentage of allocation sold |
| `isGraduated(umi, bucket)` | Yes | `boolean` | `true` when Raydium CPMM pool exists onchain |

## Getting a Swap Quote

`getSwapResult(bucket, amountIn, direction, isFirstBuy?)` computes the exact fee-adjusted amounts for a swap without sending any transaction.

The function returns:
- `amountIn` — actual input amount after any adjustments
- `fee` — total fee charged (protocol + creator), in lamports for buys, in base tokens for sells
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
import { getSwapResult } from '@metaplex-foundation/genesis';

const TOKENS_IN = 500_000_000_000n; // 500 tokens (9 decimals)

const sellQuote = getSwapResult(bucket, TOKENS_IN, 'sell');

console.log('Tokens input: ', sellQuote.amountIn.toString());
console.log('Total fee:    ', sellQuote.fee.toString(), 'lamports');
console.log('SOL out:      ', sellQuote.amountOut.toString(), 'lamports');
```

### First Buy Fee Waiver

Pass `true` as the fourth argument to quote a first buy with fees waived. This matches the onchain behavior when the designated buyer executes their one-time fee-free purchase.

```typescript {% title="first-buy-quote.ts" showLineNumbers=true %}
import { getSwapResult } from '@metaplex-foundation/genesis';

const SOL_IN = 2_000_000_000n; // 2 SOL in lamports

// Pass `true` to simulate zero-fee first buy.
const firstBuyQuote = getSwapResult(bucket, SOL_IN, 'buy', true);

console.log('Fee (waived): ', firstBuyQuote.fee.toString()); // 0n
console.log('Tokens out:   ', firstBuyQuote.amountOut.toString());
```

### Current Price Helpers

Three helpers expose the current price without computing a full swap quote.

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

## Slippage Protection

`applySlippage(expectedAmountOut, slippageBps)` derives `minAmountOut` by reducing the expected output by the slippage tolerance. Pass `minAmountOut` to the swap instruction — the onchain program rejects the transaction if the actual output falls below this threshold.

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
Never send a swap without a `minAmountOut` derived from `applySlippage`. The bonding curve price moves with every trade; without slippage protection a user can receive far fewer tokens than quoted if another trade executes between their quote and their confirmation.
{% /callout %}

## Constructing Swap Transactions

`swapBondingCurveV2(umi, accounts)` builds the swap instruction. The caller is responsible for handling wrapped SOL (wSOL) before and after the transaction — see [wSOL Wrapping Note](#wsol-wrapping-note) below.

### Buy Transaction (SOL to Tokens)

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

### Sell Transaction (Tokens to SOL)

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

### wSOL Wrapping Note

{% callout type="warning" title="Manual wSOL handling required" %}
The `swapBondingCurveV2` instruction uses wrapped SOL (wSOL) as the quote token. It does **not** wrap or unwrap native SOL automatically.

**For buys:** Before sending the swap, create a wSOL [associated token account (ATA)](https://spl.solana.com/associated-token-account), transfer the required lamports into it, and call `syncNative` to synchronize the account balance.

**For sells:** After the swap is confirmed, close the wSOL ATA with `closeAccount` to unwrap the wSOL back to native SOL in the user's wallet.

USDC as a quote token is not yet supported. Only wSOL is accepted as the quote token in the current version.
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
In production, prefer the `@solana/spl-token` helper `createWrappedNativeAccount` for wrapping, or use a single transaction that wraps, swaps, and unwraps atomically to minimize round-trips.
{% /callout %}

## Reading Swap Events

Every confirmed swap emits a `BondingCurveSwapEvent` as an inner instruction with discriminator byte `255`. Decode it from the transaction to get exact post-swap reserve state, fee breakdown, and direction.

### BondingCurveSwapEvent Fields

| Field | Type | Description |
|-------|------|-------------|
| `direction` | `'buy' \| 'sell'` | Trade direction |
| `amountIn` | `bigint` | Actual input amount (lamports for buy, base tokens for sell) |
| `amountOut` | `bigint` | Output amount received |
| `fee` | `bigint` | Total fee charged in lamports |
| `baseTokenBalanceAfter` | `bigint` | `baseTokenBalance` after the swap |
| `quoteTokenDepositTotalAfter` | `bigint` | `quoteTokenDepositTotal` after the swap |

### Decoding a Swap Event from a Confirmed Transaction

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

## Indexing Lifecycle Events

Indexers can track the full lifecycle of a bonding curve by listening for Genesis program instructions and inner instruction events.

**Program ID:** `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`

### Lifecycle Events

| Event | Description | Key Fields |
|-------|-------------|------------|
| Token Created | SPL token minted, genesis account initialized | `baseMint`, `genesisAccount` |
| Bonding Curve Added | `BondingCurveBucketV2` account created | `bucketPda`, `baseTokenAllocation`, `virtualSol`, `virtualTokens` |
| Finalized | Launch configuration locked, buckets activated | `genesisAccount` |
| Goes Live | `swapStartCondition` met, trading open | `bucketPda`, timestamp |
| Swap | Buy or sell executed | `BondingCurveSwapEvent` (discriminator 255) |
| Sold Out | `baseTokenBalance === 0` | `bucketPda`, `quoteTokenDepositTotal` |
| Graduation Crank | Liquidity migration instruction submitted | `bucketPda`, `raydiumCpmmPool` |
| Graduated | Raydium CPMM pool funded, bonding curve closed | `cpmmPoolPda`, accumulated SOL |

### Tracking Current Price from Events

Derive the current price from the post-swap reserve state included in each `BondingCurveSwapEvent` rather than fetching the account after every trade:

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

### Account Discriminators

| Account | Discriminator | Description |
|---------|---------------|-------------|
| `GenesisAccountV2` | Unique per account type | Master coordination account |
| `BondingCurveBucketV2` | Unique per account type | Bonding curve AMM state |
| `BondingCurveSwapEvent` | `255` (inner instruction) | Per-swap event emitted by program |

### PDA Derivation

| PDA | Seeds |
|-----|-------|
| `GenesisAccountV2` | `["genesis_account_v2", baseMint, genesisIndex (u8)]` |
| `BondingCurveBucketV2` | `["bonding_curve_bucket_v2", genesisAccount, bucketIndex (u8)]` |

Derive PDAs in TypeScript with the `findGenesisAccountV2Pda` and `findBondingCurveBucketV2Pda` functions from the Genesis SDK.

## Error Handling

The onchain program emits typed errors. Catch them by error code or message and surface clear feedback to users.

| Error | Cause | Resolution |
|-------|-------|------------|
| `BondingCurveInsufficientFunds` | The curve does not hold enough tokens (buy) or SOL (sell) to fulfill the request | Re-fetch the bucket and re-quote; the curve may be nearly sold out |
| `InsufficientOutputAmount` | Actual output fell below `minAmountOut` (slippage exceeded) | Increase `slippageBps` or retry immediately |
| `InvalidSwapDirection` | `direction` field does not match the instruction accounts provided | Verify the `direction` argument matches the token accounts passed |
| `BondingCurveNotStarted` | `swapStartCondition` has not been met yet | Check `bucket.swapStartCondition` and wait until the curve is live |
| `BondingCurveEnded` | `swapEndCondition` was triggered — curve is sold out or graduated | The curve is closed; direct users to the Raydium CPMM pool |

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

## Notes

- `virtualSol` and `virtualTokens` are set at curve creation and are immutable — they define the price curve shape permanently
- All fee amounts are in lamports (SOL side); see [Protocol Fees](/protocol-fees) for current rate values
- USDC as a quote token is not yet supported; only wSOL is accepted in the current version
- `isGraduated` makes an RPC call on every invocation — cache the result in your indexer rather than calling it on every render
- The `BondingCurveSwapEvent` discriminator is always byte `255` — any inner instruction on the Genesis program with this leading byte is a swap event
- Between `isSoldOut` returning `true` and `isGraduated` returning `true`, the curve is sold out but the Raydium CPMM pool is not yet funded; do not send users to Raydium until `isGraduated` is confirmed
- Re-fetch the bucket before every swap in production — the price changes with every trade by any user
- Bonding Curve V2 is distinct from the [Launch Pool](/smart-contracts/genesis/launch-pool) and [Presale](/smart-contracts/genesis/presale) launch types, which use fixed deposit windows and batch price discovery

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

### Swap Instruction — Required Accounts

| Account | Writable | Signer | Description |
|---------|----------|--------|-------------|
| `genesisAccount` | Yes | No | Genesis coordination PDA |
| `bucketPda` | Yes | No | `BondingCurveBucketV2` PDA |
| `baseMint` | No | No | SPL token mint |
| `quoteMint` | No | No | wSOL mint |
| `userBaseTokenAccount` | Yes | No | User's base token ATA |
| `userQuoteTokenAccount` | Yes | No | User's wSOL ATA |
| `payer` | Yes | Yes | Transaction fee payer |

### Swap Instruction — Optional Accounts

| Account | Description |
|---------|-------------|
| `feeQuoteTokenAccount` | Protocol fee destination (wSOL ATA) |
| `creatorFeeQuoteTokenAccount` | Creator fee destination (wSOL ATA) |
| `firstBuyerAccount` | Required only for the designated first-buy wallet |

### Account Discovery

| Function | Returns | Description |
|----------|---------|-------------|
| `findBondingCurveBucketV2Pda(umi, { genesisAccount, bucketIndex })` | `[PublicKey, bump]` | Derives the bucket PDA |
| `findGenesisAccountV2Pda(umi, { baseMint, genesisIndex })` | `[PublicKey, bump]` | Derives the genesis account PDA |
| `fetchBondingCurveBucketV2(umi, pda)` | `BondingCurveBucketV2` | Fetches and deserializes the account |
| `getBondingCurveBucketV2GpaBuilder(umi)` | GPA builder | Queries all bonding curve accounts |

## FAQ

### What is the difference between isSwappable and isSoldOut?

`isSwappable` returns `true` only when the curve is actively accepting public trades — the start condition is met, the end condition has not fired, the first buy (if configured) is complete, and tokens remain. `isSoldOut` returns `true` the moment `baseTokenBalance` reaches zero, which ends trading and triggers graduation. A curve can be sold out but not yet graduated — during this window neither function allows swaps.

### Do I need to wrap SOL before calling swapBondingCurveV2?

Yes. The bonding curve uses wSOL as its quote token and `swapBondingCurveV2` does not wrap or unwrap native SOL automatically. For buys, create a wSOL [associated token account (ATA)](https://spl.solana.com/associated-token-account), deposit the required lamports, and call `syncNative` before sending the swap. For sells, close the wSOL ATA after confirmation to convert back to native SOL.

### What does getSwapResult return and how does it handle fees?

`getSwapResult` returns `{ amountIn, fee, amountOut }`. For buys, the fee is deducted from SOL input before the AMM formula runs — the user pays `amountIn` total and the AMM receives `amountIn − fee`. For sells, the fee is deducted from the SOL output after the AMM formula runs — the user receives `amountOut` net of fees. Pass `true` as the fourth argument to simulate the first-buy fee waiver.

### How do I protect against slippage?

Call `applySlippage(quote.amountOut, slippageBps)` to derive `minAmountOut`, then pass it to `swapBondingCurveV2`. The onchain program rejects the transaction if the actual output falls below `minAmountOut`. Common values: 50 bps (0.5%) for stable conditions, 200 bps (2%) during volatile launches.

### What is the difference between isSoldOut and isGraduated?

`isSoldOut` is a synchronous local check — it returns `true` as soon as `baseTokenBalance` is `0n`. `isGraduated` is an async RPC call that verifies whether the Raydium CPMM pool has been created and funded onchain. There is a window between sell-out and graduation where `isSoldOut` is `true` but `isGraduated` is `false`. Do not redirect users to Raydium until `isGraduated` confirms the pool exists.

### How do I decode a BondingCurveSwapEvent from a transaction?

Find inner instructions on the Genesis program (`GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`) where the first data byte is `255`. Slice off that byte and pass the remainder to `getBondingCurveSwapEventSerializer().deserialize(data.slice(1))`. The returned object contains direction, amounts, fee, and the post-swap reserve state needed to update a price index.
