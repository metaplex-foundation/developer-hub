---
title: Bonding Curves
metaTitle: Genesis - Bonding Curves
description: Learn how to set up and use bonding curves for token launches with Genesis.
---

A bonding curve is an automated market maker (AMM) that creates a mathematical relationship between a token's price and its supply. As users buy tokens, the price increases; as they sell, it decreases. This creates automatic price discovery without needing traditional order books or market makers.

Genesis uses a **constant product bonding curve**, the same mathematical model used by Uniswap and Raydium. This provides predictable pricing, guaranteed liquidity, and protection against manipulation.

## How It Works

### The Constant Product Formula

The bonding curve maintains a constant product `K`:

```
K = (virtual_tokens + real_tokens) × (virtual_sol + real_sol)
```

Where:
- **virtual_tokens** and **virtual_sol**: Bootstrap liquidity that provides initial pricing
- **real_tokens**: Current token balance in the curve (decreases as tokens are sold)
- **real_sol**: Total SOL deposited (increases as users buy)

Because `K` must remain constant, when SOL goes in, tokens must come out (and vice versa).

### Price Discovery

The price at any moment is determined by the ratio of reserves:

```
price = total_sol_reserves / total_token_reserves
```

As users buy tokens:
1. They deposit SOL → `real_sol` increases
2. They receive tokens → `real_tokens` decreases
3. The ratio shifts → **price goes UP**

As users sell tokens:
1. They return tokens → `real_tokens` increases
2. They receive SOL → `real_sol` decreases
3. The ratio shifts → **price goes DOWN**

### Visual Example

```
Starting state:
  Tokens: 1000 (virtual) + 1000 (real) = 2000 total
  SOL:    10 (virtual) + 0 (real) = 10 total
  Price:  10 / 2000 = 0.005 SOL per token
  K = 2000 × 10 = 20,000

After someone buys 100 tokens with ~0.53 SOL:
  Tokens: 1000 + 900 = 1900 total
  SOL:    10 + 0.53 = 10.53 total
  Price:  10.53 / 1900 = 0.0055 SOL per token (10% increase)
  K = 1900 × 10.53 ≈ 20,000 (constant!)
```

## Virtual Liquidity Explained

Virtual liquidity is the secret sauce that makes bonding curves work from the start. Without it:
- Division by zero when no SOL has been deposited
- Extreme price volatility for early trades
- Easy manipulation by first buyers

With virtual liquidity:
- The curve has a defined starting price
- Early trades don't cause wild price swings
- The price curve is smooth and predictable

### Choosing Virtual Liquidity Values

The ratio of `virtualSol` to `virtualTokens` determines your **starting price**:

```typescript
// Starting price = virtualSol / (virtualTokens + baseTokenAllocation)
// If virtualSol = 1 SOL and virtualTokens + allocation = 1000 tokens
// Starting price = 1 / 1000 = 0.001 SOL per token
```

Higher virtual liquidity = more price stability but slower price appreciation.
Lower virtual liquidity = faster price movement but more volatility.

## Adding a Bonding Curve Bucket

Here's how to add a bonding curve to your Genesis Account:

```typescript
import {
  addConstantProductBondingCurveBucketV2,
  findRaydiumCpmmBucketV2Pda,
} from '@metaplex-foundation/genesis';
import { publicKey } from '@metaplex-foundation/umi';

const now = BigInt(Math.floor(Date.now() / 1000));

// First, derive the Raydium bucket PDA (needed for end behaviors)
const [raydiumBucket] = findRaydiumCpmmBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 2,
});

await addConstantProductBondingCurveBucketV2(umi, {
  // Basic configuration
  baseMint: baseMint.publicKey,
  quoteMint: WSOL_MINT,
  bucketIndex: 1,
  baseTokenAllocation: 500_000_000_000_000n,  // 500,000 tokens for the curve

  // Authority configuration
  actionsAuthority: actionsAuthority.publicKey,
  backendSigner: umi.identity,

  // Initial state
  paused: false,

  // Time conditions
  swapStartCondition: {
    __kind: 'TimeAbsolute',
    padding: Array(47).fill(0),
    time: now,
    triggeredTimestamp: 0n,
  },
  swapEndCondition: {
    __kind: 'TimeAbsolute',
    padding: Array(47).fill(0),
    time: now + 172800n,  // 48 hours from now
    triggeredTimestamp: 0n,
  },

  // Virtual liquidity (sets starting price and stability)
  virtualSol: 30_000_000_000n,      // 30 SOL virtual liquidity
  virtualTokens: 300_000_000_000_000n, // 300,000 tokens virtual

  // What happens when the curve ends
  endBehaviors: [
    {
      __kind: 'SendStartPrice',
      padding: Array(6).fill(0),
      destinationBucket: publicKey(raydiumBucket),
      processed: false,
    },
    {
      __kind: 'SendQuoteTokenPercentage',
      padding: Array(4).fill(0),
      destinationBucket: publicKey(raydiumBucket),
      percentageBps: 10000,  // 100% of collected SOL
      processed: false,
    },
  ],
}).sendAndConfirm(umi);
```

### Configuration Reference

| Parameter | Description |
|-----------|-------------|
| `bucketIndex` | Unique index for this bucket (e.g., 1) |
| `baseTokenAllocation` | How many tokens the curve can sell |
| `actionsAuthority` | Wallet that can pause/unpause trading |
| `paused` | Whether trading starts paused |
| `swapStartCondition` | When trading can begin |
| `swapEndCondition` | When trading ends |
| `virtualSol` | Virtual SOL for price bootstrapping |
| `virtualTokens` | Virtual tokens for price bootstrapping |
| `endBehaviors` | Actions to execute when the curve ends |

### End Behaviors Explained

End behaviors define what happens when `swapEndCondition` is met:

**SendStartPrice**: Captures the bonding curve's final price ratio and sends it to the destination bucket (usually Raydium). This ensures price continuity when graduating.

```typescript
{
  __kind: 'SendStartPrice',
  padding: Array(6).fill(0),
  destinationBucket: publicKey(raydiumBucket),
  processed: false,
}
```

**SendQuoteTokenPercentage**: Transfers a percentage of collected SOL to another bucket. Use `10000` for 100% (basis points).

```typescript
{
  __kind: 'SendQuoteTokenPercentage',
  padding: Array(4).fill(0),
  destinationBucket: publicKey(raydiumBucket),
  percentageBps: 10000,  // 100%
  processed: false,
}
```

## Trading on the Bonding Curve

### Buying Tokens

Users can buy tokens by depositing SOL:

```typescript
import { swapBondingCurveV2, SwapDirection } from '@metaplex-foundation/genesis';

// Buy tokens with 5 SOL
await swapBondingCurveV2(umi, {
  baseMint: baseMint.publicKey,
  quoteMint: WSOL_MINT,
  bucketIndex: 1,
  payer: buyer,
  backendSigner,
  swapDirection: SwapDirection.Buy,
  amount: 5_000_000_000n,  // 5 SOL (in lamports)
  minAmountOut: 0n,        // Minimum tokens to receive (slippage protection)
}).sendAndConfirm(umi);
```

### Selling Tokens

Users can sell tokens to receive SOL:

```typescript
// Sell 1000 tokens
await swapBondingCurveV2(umi, {
  baseMint: baseMint.publicKey,
  quoteMint: WSOL_MINT,
  bucketIndex: 1,
  payer: seller,
  backendSigner,
  swapDirection: SwapDirection.Sell,
  amount: 1_000_000_000_000n,  // 1000 tokens (with 9 decimals)
  minAmountOut: 0n,            // Minimum SOL to receive
}).sendAndConfirm(umi);
```

### Slippage Protection

Always set `minAmountOut` in production to protect against slippage:

```typescript
// Calculate expected output (simplified)
const expectedTokens = calculateExpectedTokens(solAmount);
const minAcceptable = expectedTokens * 0.99n;  // 1% slippage tolerance

await swapBondingCurveV2(umi, {
  // ...
  minAmountOut: minAcceptable,
});
```

If the actual output would be less than `minAmountOut`, the transaction fails.

## Admin Operations

### Pause Trading

The Actions Authority can pause the bonding curve to halt all trading:

```typescript
import { setBondingCurvePausedStateV2 } from '@metaplex-foundation/genesis';

// Pause trading
await setBondingCurvePausedStateV2(umi, {
  baseMint: baseMint.publicKey,
  bucketIndex: 1,
  actionsAuthority,
  paused: true,
}).sendAndConfirm(umi);

console.log('Trading paused');
```

### Resume Trading

```typescript
// Resume trading
await setBondingCurvePausedStateV2(umi, {
  baseMint: baseMint.publicKey,
  bucketIndex: 1,
  actionsAuthority,
  paused: false,
}).sendAndConfirm(umi);

console.log('Trading resumed');
```

Use pausing for:
- Emergency stops during issues
- Coordinating with off-chain events
- Maintenance windows

## Reading Bonding Curve State

Fetch the current state of the bonding curve:

```typescript
import {
  fetchBondingCurveBucketV2,
  findBondingCurveBucketV2Pda,
} from '@metaplex-foundation/genesis';

const [bondingCurveBucket] = findBondingCurveBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 1,
});

const data = await fetchBondingCurveBucketV2(umi, bondingCurveBucket);

console.log('Token balance:', data.bucket.baseTokenBalance);
console.log('SOL collected:', data.quoteTokenDepositTotal);
console.log('Is paused:', data.extensions.paused);
console.log('Virtual SOL:', data.virtualQuote);
console.log('Virtual tokens:', data.virtualBase);
```

### Calculating Current Price

```typescript
const totalTokens = data.virtualBase + data.bucket.baseTokenBalance;
const totalSol = data.virtualQuote + data.quoteTokenDepositTotal;
const pricePerToken = Number(totalSol) / Number(totalTokens);

console.log('Current price:', pricePerToken, 'SOL per token');
```

## Calculating Virtual Liquidities

Use this helper to calculate the correct virtual liquidity values for your desired price range:

```typescript
const PRECISION = 1_000_000_000n;
const MICROLAMPORTS_PER_LAMPORT = 1_000_000n;

interface BondingCurveParams {
  startPriceMicrolamports: bigint;  // Starting price per token
  endPriceMicrolamports: bigint;    // Ending price (when all tokens sold)
  totalTokens: bigint;              // Tokens allocated to the curve
}

function bigintSqrt(n: bigint): bigint {
  if (n < 0n) throw new Error('Cannot sqrt negative');
  if (n === 0n) return 0n;
  let x = n, y = (x + 1n) / 2n;
  while (y < x) { x = y; y = (x + n / x) / 2n; }
  return x;
}

function calculateVirtualLiquidity(params: BondingCurveParams) {
  const { startPriceMicrolamports, endPriceMicrolamports, totalTokens } = params;

  // Calculate sqrt(endPrice/startPrice)
  const priceRatio = (endPriceMicrolamports * PRECISION) / startPriceMicrolamports;
  const sqrtRatio = bigintSqrt(priceRatio * PRECISION);

  // virtualTokens = totalTokens / (sqrt(endPrice/startPrice) - 1)
  const denominator = sqrtRatio - PRECISION;
  const virtualTokens = (totalTokens * PRECISION) / denominator;

  // virtualSol = startPrice * (virtualTokens + totalTokens)
  const virtualSol = (startPriceMicrolamports * (virtualTokens + totalTokens))
    / MICROLAMPORTS_PER_LAMPORT + 1n;

  // Estimated SOL collected when all tokens are sold
  const collectedSol = (virtualSol * totalTokens) / virtualTokens;

  return { virtualTokens, virtualSol, collectedSol };
}

// Example: 2x price increase from start to end
const result = calculateVirtualLiquidity({
  startPriceMicrolamports: 50_000n,   // 0.00005 SOL
  endPriceMicrolamports: 100_000n,    // 0.0001 SOL
  totalTokens: 500_000_000_000_000n,  // 500,000 tokens
});

console.log('Virtual Tokens:', result.virtualTokens);
console.log('Virtual SOL:', result.virtualSol);
console.log('Expected SOL collected:', result.collectedSol);
```

## Fees

By default, the bonding curve charges a **2% fee** on both buys and sells. This fee is collected by the protocol.

{% callout type="note" %}
Fees help protect against sandwich attacks and provide sustainable protocol revenue. The exact fee structure may vary—check the latest documentation or program state for current values.
{% /callout %}

## Best Practices

### 1. Test on Devnet First
Always deploy and test your bonding curve configuration on devnet before mainnet.

### 2. Set Appropriate Time Windows
Give users enough time to participate but not so long that momentum is lost.

### 3. Choose Virtual Liquidity Carefully
- Higher virtual liquidity = more stable prices, slower appreciation
- Lower virtual liquidity = faster price movement, more volatility
- Consider your community size and expected volume

### 4. Implement Slippage Protection
Always use `minAmountOut` in production frontends.

### 5. Monitor the Curve
Track deposits, withdrawals, and price movement to identify any issues early.

## Next Steps

- [Vault Deposits](/smart-contracts/genesis/vault-deposits) - Set up pre-deposits before the curve opens
- [Raydium Graduation](/smart-contracts/genesis/raydium-graduation) - Graduate to permanent DEX liquidity
