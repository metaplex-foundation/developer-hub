---
title: Launch Pool
metaTitle: Genesis - Launch Pool
description: Token distribution where users deposit during a window and receive tokens proportionally.
---

Launch Pools are a token launch mechanism designed for organic price discovery and limited sniping or front running. Users make deposits during a specified window and receive tokens proportional to their share of total deposits when the window closes.

Here's how they work:

1. A specific quantity of tokens is allocated to the Launch Pool contract. The Launch Pool remains open for a set period of time.
2. While the Launch Pool remains open, users can deposit SOL into it or withdraw their SOL from it (subject to a withdrawal fee).
3. When the Launch Pool ends, tokens are distributed proportionally based on each user's share of the total deposits.

## Overview

The Launch Pool lifecycle:

1. **Deposit Period** - Users deposit SOL during a defined window
2. **Transition** - End behaviors execute (e.g., send collected SOL to another bucket)
3. **Claim Period** - Users claim tokens proportional to their deposit weight

## Fees

- **User Deposit fee**: 2% of deposit amount
- **User Withdrawal fee**: 2% of withdrawal amount
- **Graduation fee**: 5% of the total deposits at the end of the Deposit Period

Deposit Fee Example: A user deposit of 10 SOL results in 9.8 SOL credited to the user's deposit account.

## Setting Up a Launch Pool

This guide assumes you've already initialized a Genesis Account. See [Getting Started](/smart-contracts/genesis/getting-started) for initialization steps.

### 1. Add the Launch Pool Bucket

```typescript
import {
  addLaunchPoolBucketV2,
  findLaunchPoolBucketV2Pda,
  findUnlockedBucketV2Pda,
  NOT_TRIGGERED_TIMESTAMP,
} from '@metaplex-foundation/genesis';
import { publicKey } from '@metaplex-foundation/umi';

// Derive bucket PDAs
const [launchPoolBucket] = findLaunchPoolBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

// Optional: Unlocked bucket to receive quote tokens after launch
const [unlockedBucket] = findUnlockedBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

// Define timing
const now = BigInt(Math.floor(Date.now() / 1000));
const depositStart = now;
const depositEnd = now + 86400n; // 24 hours
const claimStart = depositEnd + 1n;
const claimEnd = claimStart + 604800n; // 1 week claim window

await addLaunchPoolBucketV2(umi, {
  genesisAccount,
  baseMint: baseMint.publicKey,
  baseTokenAllocation: 1_000_000_000_000n, // Tokens for this bucket
  depositStartCondition: {
    __kind: 'TimeAbsolute',
    padding: Array(47).fill(0),
    time: depositStart,
    triggeredTimestamp: NOT_TRIGGERED_TIMESTAMP,
  },
  depositEndCondition: {
    __kind: 'TimeAbsolute',
    padding: Array(47).fill(0),
    time: depositEnd,
    triggeredTimestamp: NOT_TRIGGERED_TIMESTAMP,
  },
  claimStartCondition: {
    __kind: 'TimeAbsolute',
    padding: Array(47).fill(0),
    time: claimStart,
    triggeredTimestamp: NOT_TRIGGERED_TIMESTAMP,
  },
  claimEndCondition: {
    __kind: 'TimeAbsolute',
    padding: Array(47).fill(0),
    time: claimEnd,
    triggeredTimestamp: NOT_TRIGGERED_TIMESTAMP,
  },
  minimumDepositAmount: null,
  // Send 100% of collected SOL to unlocked bucket after deposits end
  endBehaviors: [
    {
      __kind: 'SendQuoteTokenPercentage',
      padding: Array(4).fill(0),
      destinationBucket: publicKey(unlockedBucket),
      percentageBps: 10000, // 100% in basis points
      processed: false,
    },
  ],
}).sendAndConfirm(umi);
```

### 2. Add an Unlocked Bucket (Optional)

If your Launch Pool uses `SendQuoteTokenPercentage` to forward collected SOL, you need a destination bucket:

```typescript
import { addUnlockedBucketV2 } from '@metaplex-foundation/genesis';

await addUnlockedBucketV2(umi, {
  genesisAccount,
  baseMint: baseMint.publicKey,
  baseTokenAllocation: 0n, // No base tokens, only receives quote tokens
  recipient: umi.identity.publicKey,
  claimStartCondition: {
    __kind: 'TimeAbsolute',
    padding: Array(47).fill(0),
    time: claimStart,
    triggeredTimestamp: NOT_TRIGGERED_TIMESTAMP,
  },
  claimEndCondition: {
    __kind: 'TimeAbsolute',
    padding: Array(47).fill(0),
    time: claimEnd,
    triggeredTimestamp: NOT_TRIGGERED_TIMESTAMP,
  },
  backendSigner: { signer: backendSigner.publicKey },
}).sendAndConfirm(umi);
```

### 3. Finalize the Genesis Account

Once all buckets are configured, finalize the launch configuration:

```typescript
import { finalizeV2 } from '@metaplex-foundation/genesis';

await finalizeV2(umi, {
  baseMint: baseMint.publicKey,
  genesisAccount,
}).sendAndConfirm(umi);
```

## User Operations

### Depositing

Users deposit wSOL during the deposit window. A 2% fee is applied to deposits.

```typescript
import {
  depositLaunchPoolV2,
  findLaunchPoolDepositV2Pda,
} from '@metaplex-foundation/genesis';

const depositAmount = 10_000_000_000n; // 10 SOL in lamports

await depositLaunchPoolV2(umi, {
  genesisAccount,
  bucket: launchPoolBucket,
  baseMint: baseMint.publicKey,
  amountQuoteToken: depositAmount,
}).sendAndConfirm(umi);

// Verify the deposit
const [depositPda] = findLaunchPoolDepositV2Pda(umi, {
  bucket: launchPoolBucket,
  recipient: umi.identity.publicKey,
});

const deposit = await fetchLaunchPoolDepositV2(umi, depositPda);
console.log('Deposited (after 2% fee):', deposit.amountQuoteToken);
```

Multiple deposits from the same user are accumulated into a single deposit account.

### Withdrawing

Users can withdraw during the deposit period. A 2% fee is applied to withdrawals.

```typescript
import { withdrawLaunchPoolV2 } from '@metaplex-foundation/genesis';

// Partial withdrawal
await withdrawLaunchPoolV2(umi, {
  genesisAccount,
  bucket: launchPoolBucket,
  baseMint: baseMint.publicKey,
  amountQuoteToken: 3_000_000_000n, // 3 SOL
}).sendAndConfirm(umi);
```

If a user withdraws their entire balance, the deposit PDA is closed.

### Claiming Tokens

After the deposit period ends and claims open, users claim tokens proportional to their deposit weight:

```typescript
import { claimLaunchPoolV2 } from '@metaplex-foundation/genesis';

await claimLaunchPoolV2(umi, {
  genesisAccount,
  bucket: launchPoolBucket,
  baseMint: baseMint.publicKey,
  recipient: umi.identity.publicKey,
}).sendAndConfirm(umi);
```

Token allocation formula:
```
userTokens = (userDeposit / totalDeposits) * bucketTokenAllocation
```

## Executing Transitions

After the deposit period ends, execute transitions to process end behaviors:

```typescript
import { transitionV2, WRAPPED_SOL_MINT } from '@metaplex-foundation/genesis';
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox';

// Get the destination bucket's quote token account
const unlockedBucketQuoteTokenAccount = findAssociatedTokenPda(umi, {
  owner: unlockedBucket,
  mint: WRAPPED_SOL_MINT,
});

await transitionV2(umi, {
  genesisAccount,
  primaryBucket: launchPoolBucket,
  baseMint: baseMint.publicKey,
})
  .addRemainingAccounts([
    {
      pubkey: unlockedBucket,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: publicKey(unlockedBucketQuoteTokenAccount),
      isSigner: false,
      isWritable: true,
    },
  ])
  .sendAndConfirm(umi);
```

## End Behaviors

End behaviors define what happens to collected quote tokens after the deposit period:

### SendQuoteTokenPercentage

Sends a percentage of collected SOL to another bucket:

```typescript
endBehaviors: [
  {
    __kind: 'SendQuoteTokenPercentage',
    padding: Array(4).fill(0),
    destinationBucket: publicKey(unlockedBucket),
    percentageBps: 10000, // 100% = 10000 bps
    processed: false,
  },
]
```

You can split funds across multiple buckets:

```typescript
endBehaviors: [
  {
    __kind: 'SendQuoteTokenPercentage',
    padding: Array(4).fill(0),
    destinationBucket: publicKey(treasuryBucket),
    percentageBps: 2000, // 20%
    processed: false,
  },
  {
    __kind: 'SendQuoteTokenPercentage',
    padding: Array(4).fill(0),
    destinationBucket: publicKey(liquidityBucket),
    percentageBps: 8000, // 80%
    processed: false,
  },
]
```

## Time Conditions

Launch Pool timing is controlled by four conditions:

| Condition | Description |
|-----------|-------------|
| `depositStartCondition` | When users can start depositing |
| `depositEndCondition` | When deposits close |
| `claimStartCondition` | When users can start claiming tokens |
| `claimEndCondition` | When claims close |

Use `TimeAbsolute` for specific timestamps:

```typescript
{
  __kind: 'TimeAbsolute',
  padding: Array(47).fill(0),
  time: BigInt(Math.floor(Date.now() / 1000) + 3600), // 1 hour from now
  triggeredTimestamp: NOT_TRIGGERED_TIMESTAMP,
}
```

## Fetching State

### Bucket State

```typescript
import { fetchLaunchPoolBucketV2 } from '@metaplex-foundation/genesis';

const bucket = await fetchLaunchPoolBucketV2(umi, launchPoolBucket);

console.log('Total deposits:', bucket.quoteTokenDepositTotal);
console.log('Deposit count:', bucket.depositCount);
console.log('Claim count:', bucket.claimCount);
console.log('Token allocation:', bucket.bucket.baseTokenAllocation);
```

### Deposit State

```typescript
import {
  fetchLaunchPoolDepositV2,
  safeFetchLaunchPoolDepositV2,
} from '@metaplex-foundation/genesis';

// Throws if not found
const deposit = await fetchLaunchPoolDepositV2(umi, depositPda);

// Returns null if not found
const maybeDeposit = await safeFetchLaunchPoolDepositV2(umi, depositPda);

if (deposit) {
  console.log('Amount:', deposit.amountQuoteToken);
  console.log('Claimed:', deposit.claimed);
}
```

## Next Steps

- [Priced Sale](/smart-contracts/genesis/priced-sale) - Pre-deposit collection before trading
- [Aggregation API](/smart-contracts/genesis/aggregation) - Query launch data via API
- [Launch Pool](https://github.com/metaplex-foundation/genesis/tree/main/clients/js/examples/launch-pool) - Example implementation on GitHub
