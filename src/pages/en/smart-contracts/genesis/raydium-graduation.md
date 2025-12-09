---
title: Raydium Graduation
metaTitle: Genesis - Raydium Graduation
description: Learn how to graduate your bonding curve to a Raydium CPMM pool.
---

After your bonding curve period ends, you can "graduate" to a Raydium Constant Product Market Maker (CPMM) pool. This transition moves your token from the Genesis bonding curve to permanent decentralized exchange liquidity on Raydium.

## Why Graduate to Raydium?

Graduation is the final step in a Genesis token launch, providing several key benefits:

- **Permanent Liquidity**: The Raydium pool remains active indefinitely, unlike time-limited bonding curves
- **Decentralized Trading**: Anyone can trade through the standard Raydium interface and aggregators
- **Price Continuity**: The pool is initialized at the exact same price as the bonding curve's final state
- **Ecosystem Integration**: Your token becomes available through Jupiter, Raydium UI, and other Solana DEX aggregators

### The Graduation Flow

```
Bonding Curve Period Ends
        │
        ▼
Execute End Behaviors (transitionV2)
  • SendStartPrice → Captures final price ratio
  • SendQuoteTokenPercentage → Transfers SOL to Raydium bucket
        │
        ▼
Graduate to Raydium (graduateToRaydiumCpmmV2)
  • Creates Raydium CPMM pool
  • Adds tokens and SOL as initial liquidity
  • Burns excess tokens to maintain price
        │
        ▼
Trading Continues on Raydium
  • Permanent decentralized liquidity
  • Available through DEX aggregators
```

## Add a Raydium CPMM Bucket

The Raydium bucket is an "outflow" bucket that receives tokens and SOL from other buckets to create a liquidity pool. You must add this bucket during the setup phase, before finalizing your Genesis Account.

```typescript
import {
  addRaydiumCpmmBucketV2,
  findRaydiumCpmmBucketV2Pda,
} from "@metaplex-foundation/genesis";
import { generateSigner } from "@metaplex-foundation/umi";

const now = BigInt(Math.floor(Date.now() / 1000));
const lpTokenClaimAuthority = generateSigner(umi);

await addRaydiumCpmmBucketV2(umi, {
  baseMint: baseMint.publicKey,
  quoteMint: quoteMint,
  bucketIndex: 2,
  baseTokenAllocation: 500_000_000_000n, // 500 billion tokens
  lpUnlockStart: 0n,
  lpTokenClaimAuthority: lpTokenClaimAuthority.publicKey,
  backendSigner: umi.identity,
  startCondition: {
    __kind: 'TimeAbsolute',
    padding: Array(47).fill(0),
    time: now,
    triggeredTimestamp: 0n,
  },
}).sendAndConfirm(umi);
```

### Configuration Reference

| Parameter | Description |
|-----------|-------------|
| `bucketIndex` | Unique index for this bucket (typically 2, after vault and bonding curve) |
| `baseTokenAllocation` | Tokens allocated for Raydium liquidity |
| `lpUnlockStart` | When LP tokens can be claimed (future functionality) |
| `lpTokenClaimAuthority` | Wallet that can claim LP tokens (future functionality) |
| `startCondition` | When graduation can be triggered |

### Understanding Token Allocation

The `baseTokenAllocation` for the Raydium bucket works differently than other buckets:

- This is the **maximum** tokens that could go to the pool
- The actual amount used depends on the bonding curve's final price
- Excess tokens are burned to maintain price continuity
- Typically, allocate a significant portion (e.g., 50% of total supply) to ensure sufficient liquidity

{% callout type="note" %}
The Raydium bucket receives its SOL from the bonding curve's end behaviors. You don't deposit SOL directly—it flows automatically from the bonding curve when you call `transitionV2`.
{% /callout %}

## Transition: Execute End Behaviors

After the bonding curve's `swapEndCondition` is met, you must call `transitionV2` to execute the end behaviors. This is a critical step that:

1. **Captures the final price** from the bonding curve
2. **Transfers collected SOL** to the Raydium bucket
3. **Prepares for graduation** by setting up the price ratio

### End Behaviors Explained

When you configured the bonding curve, you specified end behaviors:

**SendStartPrice**: Calculates the bonding curve's final price ratio (tokens/SOL) and sends it to the destination bucket. This ratio is used to initialize the Raydium pool at the correct price.

**SendQuoteTokenPercentage**: Transfers a percentage of collected SOL to another bucket. Typically set to 10000 (100%) to send all collected SOL to Raydium.

### Executing the Transition

```typescript
import {
  transitionV2,
  findRaydiumBucketSignerPda,
  findRaydiumCpmmBucketV2Pda,
} from "@metaplex-foundation/genesis";
import { findAssociatedTokenPda } from "@metaplex-foundation/mpl-toolbox";
import { publicKey } from "@metaplex-foundation/umi";

// Derive the Raydium bucket PDA
const [raydiumBucket] = findRaydiumCpmmBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 2,
});

// Get Raydium bucket's signer PDA (holds tokens/SOL)
const bucketSigner = findRaydiumBucketSignerPda(umi, {
  bucket: raydiumBucket,
})[0];

// Derive the quote token account for the Raydium bucket
const raydiumBucketQuoteTokenAccount = findAssociatedTokenPda(umi, {
  owner: bucketSigner,
  mint: quoteMint,
});

// Execute transition
await transitionV2(umi, {
  baseMint: baseMint.publicKey,
  quoteMint: quoteMint,
  primaryBucketIndex: 1, // Bonding curve bucket index
})
  .addRemainingAccounts([
    {
      pubkey: raydiumBucket,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: publicKey(raydiumBucketQuoteTokenAccount),
      isSigner: false,
      isWritable: true,
    },
  ])
  .sendAndConfirm(umi);
```

### Timing the Transition

The transition can only be called after the bonding curve's `swapEndCondition` is met:

- If using `TimeAbsolute`, wait until the specified timestamp passes
- If using other condition types, ensure the condition is triggered
- You can check the bonding curve state to verify conditions are met

```typescript
import { fetchBondingCurveBucketV2 } from "@metaplex-foundation/genesis";

const bondingCurveData = await fetchBondingCurveBucketV2(umi, bondingCurveBucket);

// Check if end condition is met
const endCondition = bondingCurveData.extensions.swapEndCondition;
const now = BigInt(Math.floor(Date.now() / 1000));

if (endCondition.__kind === 'TimeAbsolute' && endCondition.time <= now) {
  console.log('End condition met, ready for transition');
} else {
  console.log('Waiting for end condition...');
}
```

## Graduate to Raydium CPMM

After the transition completes, call `graduateToRaydiumCpmmV2` to create the actual Raydium pool. This is the final step that makes your token tradeable on Raydium.

### Deriving Raydium PDAs

The `deriveRaydiumPDAsV2` helper automatically derives all necessary Raydium CPMM account addresses with correct token ordering:

```typescript
import { deriveRaydiumPDAsV2 } from "@metaplex-foundation/genesis";
import { publicKey } from "@metaplex-foundation/umi";

// For wSOL pairs on mainnet (default)
const raydiumAccounts = deriveRaydiumPDAsV2(umi, baseMint.publicKey);

// For wSOL pairs on devnet
const raydiumAccountsDevnet = deriveRaydiumPDAsV2(umi, baseMint.publicKey, {
  env: 'devnet',
});

// For other quote tokens
const customQuoteMint = publicKey('...');
const raydiumAccountsCustom = deriveRaydiumPDAsV2(umi, baseMint.publicKey, {
  quoteMint: customQuoteMint,
  env: 'mainnet',
});
```

The helper returns all required accounts:

| Account | Description |
|---------|-------------|
| `poolState` | Main Raydium pool state account |
| `poolAuthority` | Pool's signing authority |
| `lpMint` | LP token mint address |
| `baseVault` | Pool's base token vault |
| `quoteVault` | Pool's quote token vault |
| `observationState` | TWAP observation account |
| `ammConfig` | Raydium AMM configuration |
| `raydiumProgram` | Raydium CPMM program ID |
| `createPoolFee` | Fee destination for pool creation |
| `token0Mint` | First token in Raydium's ordering |
| `token1Mint` | Second token in Raydium's ordering |
| `isProjectMintToken0` | Whether your token is token0 or token1 |

### Token Ordering

Raydium orders tokens deterministically (by public key). The `isProjectMintToken0` flag tells you which position your token is in:

```typescript
console.log('Token ordering:');
console.log('- token0:', raydiumPoolAccounts.token0Mint);
console.log('- token1:', raydiumPoolAccounts.token1Mint);
console.log('- isProjectMintToken0:', raydiumPoolAccounts.isProjectMintToken0);
```

This matters because vault indices and other parameters depend on token ordering. The `deriveRaydiumPDAsV2` helper handles this automatically.

### Executing Graduation

```typescript
import { graduateToRaydiumCpmmV2 } from "@metaplex-foundation/genesis";

// Derive all Raydium pool accounts
const raydiumPoolAccounts = deriveRaydiumPDAsV2(
  umi,
  baseMint.publicKey,
  {
    quoteMint: quoteMint,
    env: 'mainnet'  // or 'devnet' for testing
  }
);

// Graduate to Raydium CPMM
await graduateToRaydiumCpmmV2(umi, {
  baseMint: baseMint.publicKey,
  quoteMint: quoteMint,
  bucketIndex: 2,
  backendSigner: umi.identity,
  ...raydiumPoolAccounts,
}).sendAndConfirm(umi);

console.log('Graduation complete! Pool:', raydiumPoolAccounts.poolState);
```

### Price Calculation

The Raydium pool is initialized using the bonding curve's final price ratio, ensuring price continuity:

```
graduated_base_amount = (quote_in_signer × price_numerator) / price_denominator
```

Where:
- `quote_in_signer` is the SOL transferred from the bonding curve
- `price_numerator` and `price_denominator` define the price ratio

**Example:**
If the bonding curve ended at 0.001 SOL per token and transferred 100 SOL:
- The pool would be initialized with 100 SOL and 100,000 tokens
- Traders moving from the bonding curve to Raydium see minimal price disruption

### Token Burning

After graduation, any unused base tokens from the allocation are burned:

```
burned_tokens = baseTokenAllocation - graduated_base_amount
```

This ensures the circulating supply matches what was actually distributed, maintaining the intended tokenomics.

## Fetch Raydium Bucket Data

Check the state of your Raydium bucket at any time:

```typescript
import {
  fetchRaydiumCpmmBucketV2,
  findRaydiumCpmmBucketV2Pda,
} from "@metaplex-foundation/genesis";

const [raydiumBucket] = findRaydiumCpmmBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 2,
});

const raydiumData = await fetchRaydiumCpmmBucketV2(umi, raydiumBucket);

console.log('Price numerator:', raydiumData.priceNumerator);
console.log('Price denominator:', raydiumData.priceDenominator);
console.log('Graduated amount:', raydiumData.graduatedBaseTokenAmount);
console.log('SOL received:', raydiumData.quoteTokenDepositTotal);
```

### Checking Graduation Status

```typescript
function checkGraduationStatus(raydiumData) {
  if (raydiumData.graduatedBaseTokenAmount === 0n) {
    return 'not_graduated';
  }
  return 'graduated';
}

const status = checkGraduationStatus(raydiumData);
console.log('Graduation status:', status);
```

## Complete Graduation Example

Here's the full flow from end-of-bonding-curve to Raydium:

```typescript
import {
  transitionV2,
  graduateToRaydiumCpmmV2,
  deriveRaydiumPDAsV2,
  findRaydiumBucketSignerPda,
  findRaydiumCpmmBucketV2Pda,
  fetchBondingCurveBucketV2,
} from "@metaplex-foundation/genesis";
import { findAssociatedTokenPda } from "@metaplex-foundation/mpl-toolbox";

async function graduateToRaydium() {
  // Step 1: Verify bonding curve has ended
  const bondingCurveData = await fetchBondingCurveBucketV2(umi, bondingCurveBucket);
  const now = BigInt(Math.floor(Date.now() / 1000));

  if (bondingCurveData.extensions.swapEndCondition.time > now) {
    throw new Error('Bonding curve period has not ended yet');
  }

  // Step 2: Derive necessary accounts
  const [raydiumBucket] = findRaydiumCpmmBucketV2Pda(umi, {
    genesisAccount,
    bucketIndex: 2,
  });

  const bucketSigner = findRaydiumBucketSignerPda(umi, {
    bucket: raydiumBucket,
  })[0];

  const raydiumBucketQuoteTokenAccount = findAssociatedTokenPda(umi, {
    owner: bucketSigner,
    mint: quoteMint,
  });

  // Step 3: Execute transition (moves SOL and sets price)
  console.log('Executing transition...');
  await transitionV2(umi, {
    baseMint: baseMint.publicKey,
    quoteMint: quoteMint,
    primaryBucketIndex: 1,
  })
    .addRemainingAccounts([
      { pubkey: raydiumBucket, isSigner: false, isWritable: true },
      { pubkey: publicKey(raydiumBucketQuoteTokenAccount), isSigner: false, isWritable: true },
    ])
    .sendAndConfirm(umi);

  console.log('Transition complete');

  // Step 4: Graduate to Raydium
  console.log('Graduating to Raydium...');
  const raydiumPoolAccounts = deriveRaydiumPDAsV2(umi, baseMint.publicKey, {
    quoteMint: quoteMint,
    env: 'mainnet',
  });

  await graduateToRaydiumCpmmV2(umi, {
    baseMint: baseMint.publicKey,
    quoteMint: quoteMint,
    bucketIndex: 2,
    backendSigner: umi.identity,
    ...raydiumPoolAccounts,
  }).sendAndConfirm(umi);

  console.log('Graduation complete!');
  console.log('Raydium Pool:', raydiumPoolAccounts.poolState);
  console.log('LP Mint:', raydiumPoolAccounts.lpMint);

  return raydiumPoolAccounts;
}
```

## Future Functionality

### LP Token Claims

The `lpTokenClaimAuthority` and `lpUnlockStart` parameters are reserved for future LP token claiming functionality:

- **LP tokens** are minted when the Raydium pool is created
- Currently, these LP tokens remain with the protocol
- Future updates may enable claiming LP tokens for liquidity providers

{% callout type="note" %}
LP token claiming is not yet implemented. The parameters are included for forward compatibility. Check the latest documentation for updates on this feature.
{% /callout %}

## Best Practices

### 1. Time Your Graduation Appropriately
- Ensure the bonding curve period has fully ended before transitioning
- Consider waiting a few blocks after the end condition for safety
- Monitor for any pending bonding curve transactions

### 2. Test the Full Flow on Devnet
- Use `env: 'devnet'` in `deriveRaydiumPDAsV2`
- Verify the pool is created with correct price
- Test trading on the Raydium devnet UI

### 3. Communicate with Your Community
- Announce when graduation will happen
- Provide the Raydium pool address after graduation
- Explain that trading continues seamlessly

### 4. Verify Price Continuity
- Check the graduated price matches the bonding curve's final price
- Monitor for arbitrage opportunities (a sign of price discontinuity)

### 5. Consider Post-Graduation Steps
- Update your website/app to point to the Raydium pool
- Submit your token to Raydium's token list
- Register on Jupiter for aggregator visibility

## Troubleshooting

### "Bonding curve end condition not met"
The bonding curve's `swapEndCondition` hasn't been triggered yet. Wait until the specified time or condition is met.

### "Transition already executed"
You've already called `transitionV2`. Proceed directly to `graduateToRaydiumCpmmV2`.

### "Insufficient SOL in bucket"
The end behaviors may not have transferred SOL correctly. Check:
- End behaviors were configured properly
- Transition was executed successfully
- Bonding curve had collected SOL

### "Invalid token ordering"
Let `deriveRaydiumPDAsV2` handle token ordering automatically. Don't manually specify token0/token1.

## Next Steps

- Review the [Overview](/smart-contracts/genesis) for the complete Genesis flow
- Learn about [Bonding Curves](/smart-contracts/genesis/bonding-curves)
- Explore [Vault Deposits](/smart-contracts/genesis/vault-deposits) for presale functionality
