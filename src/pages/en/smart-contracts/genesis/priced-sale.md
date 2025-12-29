---
title: Priced Sale
metaTitle: Genesis - Priced Sale
description: Fixed-price token sale where users deposit SOL and receive tokens at a predetermined rate.
---

Priced Sales are a token launch mechanism where tokens are sold at a fixed, predetermined price. Unlike Launch Pools where the final price depends on total deposits, Priced Sales let you set the exact price per token upfront.

Here's how they work:

1. A specific quantity of tokens is allocated to the Priced Sale with a SOL cap that determines the fixed price.
2. While the Priced Sale remains open, users deposit SOL to purchase tokens at the fixed rate.
3. When the Priced Sale ends, users claim their tokens based on their deposit amount at the predetermined price.

## Overview

The Priced Sale lifecycle:

1. **Deposit Period** - Users deposit SOL during a defined window at a fixed price
2. **Transition** - End behaviors execute (e.g., send collected SOL to another bucket)
3. **Claim Period** - Users claim tokens based on their deposits

### Price Calculation

The token price is determined by the ratio of allocated tokens to the SOL cap:

```
price = allocationQuoteTokenCap / baseTokenAllocation
tokens = deposit / price
```

For example, if you allocate 1,000,000 tokens with a 100 SOL cap:
- Price = 100 SOL / 1,000,000 tokens = 0.0001 SOL per token
- A 10 SOL deposit receives 100,000 tokens

## Fees

- **User Deposit fee**: 2% of deposit amount

Deposit Fee Example: A user deposit of 10 SOL results in 9.8 SOL credited to the user's deposit account.

## Setting Up a Priced Sale

This section walks through the complete setup process, from initializing a Genesis Account to finalizing your Priced Sale configuration.

### Prerequisites

Before you begin, ensure you have umi and the Genesis SDK installed:

```bash
npm install @metaplex-foundation/genesis @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-toolbox
```

### 1. Initialize the Genesis Account

The Genesis Account is the foundation of your token launch. It creates your token and coordinates all distribution buckets.

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox';
import {
  mplGenesis,
  initializeV2,
  findGenesisAccountV2Pda,
  WRAPPED_SOL_MINT,
} from '@metaplex-foundation/genesis';
import { generateSigner, keypairIdentity } from '@metaplex-foundation/umi';

// Create Umi instance
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplToolbox())
  .use(mplGenesis());

// Set up your wallet as the identity
// umi.use(keypairIdentity(yourKeypair));

// Generate a new mint for your token
const baseMint = generateSigner(umi);

// Define your token supply (accounting for decimals)
// With 9 decimals: 1_000_000_000 = 1 token
const TOTAL_SUPPLY = 1_000_000_000_000_000n; // 1 million tokens

// Derive the Genesis Account PDA
const [genesisAccount] = findGenesisAccountV2Pda(umi, {
  baseMint: baseMint.publicKey,
  genesisIndex: 0, // Use 0 for your first campaign
});

// Initialize the Genesis Account
// WRAPPED_SOL_MINT is the standard quote token (what users pay with)
await initializeV2(umi, {
  baseMint,
  quoteMint: WRAPPED_SOL_MINT,
  fundingMode: 0, // Standard funding mode
  totalSupplyBaseToken: TOTAL_SUPPLY,
  name: 'My Token',
  symbol: 'MTK',
  uri: 'https://example.com/metadata.json',
}).sendAndConfirm(umi);

console.log('Genesis Account:', genesisAccount);
console.log('Token Mint:', baseMint.publicKey);
```

{% callout type="note" %}
The `totalSupplyBaseToken` should equal the sum of all bucket allocations. Plan your token distribution before initialization.
{% /callout %}

### 2. Add the Priced Sale Bucket

```typescript
import {
  addPresaleBucketV2,
  findPresaleBucketV2Pda,
  findUnlockedBucketV2Pda,
  NOT_TRIGGERED_TIMESTAMP,
} from '@metaplex-foundation/genesis';
import { publicKey } from '@metaplex-foundation/umi';

// Derive bucket PDAs
const [presaleBucket] = findPresaleBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

// Optional: Unlocked bucket to receive quote tokens after sale
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

await addPresaleBucketV2(umi, {
  genesisAccount,
  baseMint: baseMint.publicKey,
  baseTokenAllocation: TOTAL_SUPPLY, // All tokens go to the Priced Sale
  allocationQuoteTokenCap: 100_000_000_000n, // 100 SOL cap (sets the price)
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
  // Send 100% of collected SOL to unlocked bucket after sale ends
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

### 3. Add an Unlocked Bucket

If your Priced Sale uses `SendQuoteTokenPercentage` as shown above to forward collected SOL, you need a destination bucket:

```typescript
import {
  addUnlockedBucketV2,
  NOT_TRIGGERED_TIMESTAMP,
} from '@metaplex-foundation/genesis';
import { generateSigner } from '@metaplex-foundation/umi';

// Optional: Create a backend signer for authorized claims
const backendSigner = generateSigner(umi);

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

### 4. Finalize the Genesis Account

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
  depositPresaleV2,
  findPresaleDepositV2Pda,
  fetchPresaleDepositV2,
} from '@metaplex-foundation/genesis';

const depositAmount = 10_000_000_000n; // 10 SOL in lamports

await depositPresaleV2(umi, {
  genesisAccount,
  bucket: presaleBucket,
  baseMint: baseMint.publicKey,
  amountQuoteToken: depositAmount,
}).sendAndConfirm(umi);

// Verify the deposit
const [depositPda] = findPresaleDepositV2Pda(umi, {
  bucket: presaleBucket,
  recipient: umi.identity.publicKey,
});

const deposit = await fetchPresaleDepositV2(umi, depositPda);
console.log('Deposited (after 2% fee):', deposit.amountQuoteToken);
```

Multiple deposits from the same user are accumulated into a single deposit account.

### Claiming Tokens

After the deposit period ends and claims open, users claim tokens based on their deposit:

```typescript
import { claimPresaleV2 } from '@metaplex-foundation/genesis';

await claimPresaleV2(umi, {
  genesisAccount,
  bucket: presaleBucket,
  baseMint: baseMint.publicKey,
  recipient: umi.identity.publicKey,
}).sendAndConfirm(umi);
```

Token allocation formula:
```
userTokens = (userDeposit / allocationQuoteTokenCap) * baseTokenAllocation
```

## Executing Transitions

After the deposit period ends, the Priced Sale bucket holds two things:
1. **Base tokens** - allocated for users to claim
2. **Quote tokens (SOL)** - collected from user deposits

The transition instruction processes the `endBehaviors` you configured when creating the bucket. For example, if you set up `SendQuoteTokenPercentage` with 100% going to an unlocked bucket, the transition will transfer all collected SOL from the Priced Sale bucket to that destination.

### Why Transitions Matter

Without calling transition:
- The collected SOL stays locked in the Priced Sale bucket
- The team/treasury cannot access the raised funds
- Users can still claim their tokens (claiming works independently)

After transition:
- The SOL moves to the destination bucket(s)
- The configured recipient can claim the funds

### Calling Transition

```typescript
import { transitionV2, WRAPPED_SOL_MINT } from '@metaplex-foundation/genesis';
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox';
import { publicKey } from '@metaplex-foundation/umi';

// Get the destination bucket's quote token account
const unlockedBucketQuoteTokenAccount = findAssociatedTokenPda(umi, {
  owner: unlockedBucket,
  mint: WRAPPED_SOL_MINT,
});

await transitionV2(umi, {
  genesisAccount,
  primaryBucket: presaleBucket,
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

The `addRemainingAccounts` passes the destination bucket and its token account so the program knows where to send the SOL. Each end behavior is marked as `processed: true` after execution, preventing duplicate transfers.

## Configuration Options

### Deposit Limits

Restrict how much each user can deposit:

```typescript
await addPresaleBucketV2(umi, {
  // ... other options
  depositLimit: { amount: 5_000_000_000n }, // Max 5 SOL per user
});
```

### Minimum Deposit Amount

Set a minimum deposit requirement:

```typescript
await addPresaleBucketV2(umi, {
  // ... other options
  minimumDepositAmount: { amount: 100_000_000n }, // Min 0.1 SOL
});
```

### Deposit Cooldown

Throttle deposits to prevent rapid-fire transactions:

```typescript
await addPresaleBucketV2(umi, {
  // ... other options
  depositCooldown: { seconds: 60n }, // 60 second cooldown between deposits
  perCooldownDepositLimit: { amount: 1_000_000_000n }, // Max 1 SOL per cooldown
});
```

### Allowlist (Whitelist)

Restrict deposits to allowlisted addresses using a Merkle tree:

```typescript
await addPresaleBucketV2(umi, {
  // ... other options
  allowlist: {
    merkleRoot: allowlistMerkleRoot,
    merkleTreeHeight: 10,
    endTime: allowlistEndTime, // When allowlist restrictions end
    quoteCap: 50_000_000_000n, // Max SOL during allowlist phase
  },
});
```

When depositing with an allowlist, provide the Merkle proof:

```typescript
await depositPresaleV2(umi, {
  genesisAccount,
  bucket: presaleBucket,
  baseMint: baseMint.publicKey,
  amountQuoteToken: depositAmount,
  proof: merkleProof, // Array of PublicKeys forming the proof
}).sendAndConfirm(umi);
```

### Claim Schedule (Vesting)

Distribute tokens gradually over time instead of all at once:

```typescript
await addPresaleBucketV2(umi, {
  // ... other options
  claimSchedule: {
    cliffAmountBps: 2000, // 20% available at cliff
    period: 86400n, // 1 day vesting period
    startTime: claimStart,
    endTime: claimStart + 2592000n, // 30 days total vesting
  },
});
```

With a claim schedule, users can claim multiple times as tokens vest.

### Backend Signer

Require backend authorization for deposits:

```typescript
await addPresaleBucketV2(umi, {
  // ... other options
  backendSigner: { signer: backendSignerPublicKey },
});

// When depositing, include the backend signer
await depositPresaleV2(umi, {
  genesisAccount,
  bucket: presaleBucket,
  baseMint: baseMint.publicKey,
  amountQuoteToken: depositAmount,
  backendSigner: backendSignerKeypair,
}).sendAndConfirm(umi);
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

Priced Sale timing is controlled by four conditions:

| Condition | Description |
|-----------|-------------|
| `depositStartCondition` | When users can start depositing |
| `depositEndCondition` | When deposits close |
| `claimStartCondition` | When users can start claiming tokens |
| `claimEndCondition` | When claims close |

Use `TimeAbsolute` for specific timestamps:

```typescript
import { NOT_TRIGGERED_TIMESTAMP } from '@metaplex-foundation/genesis';

const condition = {
  __kind: 'TimeAbsolute',
  padding: Array(47).fill(0),
  time: BigInt(Math.floor(Date.now() / 1000) + 3600), // 1 hour from now
  triggeredTimestamp: NOT_TRIGGERED_TIMESTAMP,
};
```

## Fetching State

### Bucket State

```typescript
import { fetchPresaleBucketV2 } from '@metaplex-foundation/genesis';

const bucket = await fetchPresaleBucketV2(umi, presaleBucket);

console.log('Total deposits:', bucket.quoteTokenDepositTotal);
console.log('Deposit count:', bucket.depositCount);
console.log('Claim count:', bucket.claimCount);
console.log('Token allocation:', bucket.bucket.baseTokenAllocation);
console.log('SOL cap:', bucket.allocationQuoteTokenCap);
```

### Deposit State

```typescript
import {
  fetchPresaleDepositV2,
  safeFetchPresaleDepositV2,
} from '@metaplex-foundation/genesis';

// Throws if not found
const deposit = await fetchPresaleDepositV2(umi, depositPda);

// Returns null if not found
const maybeDeposit = await safeFetchPresaleDepositV2(umi, depositPda);

if (deposit) {
  console.log('Amount deposited:', deposit.amountQuoteToken);
  console.log('Amount claimed:', deposit.amountClaimed);
  console.log('Fully claimed:', deposit.claimed);
}
```

## Priced Sale vs Launch Pool

| Feature | Priced Sale | Launch Pool |
|---------|-------------|-------------|
| Price | Fixed upfront | Determined by total deposits |
| Deposit cap | Has a SOL cap | No cap |
| Oversubscription | Not possible | All deposits accepted |
| Price discovery | None (preset) | Organic |

**Use Priced Sale when:**
- You want a fixed, known price per token
- You have a specific funding target
- Early supporters should know exactly what they're getting

**Use Launch Pool when:**
- You want organic price discovery
- You want to accept all deposits regardless of amount
- Fair distribution is more important than price certainty

## Complete Example

Here's a complete end-to-end example that sets up a Priced Sale from scratch:

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplToolbox, findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox';
import {
  mplGenesis,
  initializeV2,
  findGenesisAccountV2Pda,
  addPresaleBucketV2,
  findPresaleBucketV2Pda,
  addUnlockedBucketV2,
  findUnlockedBucketV2Pda,
  finalizeV2,
  depositPresaleV2,
  findPresaleDepositV2Pda,
  claimPresaleV2,
  transitionV2,
  fetchPresaleBucketV2,
  fetchPresaleDepositV2,
  NOT_TRIGGERED_TIMESTAMP,
  WRAPPED_SOL_MINT,
} from '@metaplex-foundation/genesis';
import { generateSigner, publicKey, sol } from '@metaplex-foundation/umi';

async function runPricedSale() {
  // === SETUP ===
  const umi = createUmi('https://api.mainnet-beta.solana.com')
    .use(mplToolbox())
    .use(mplGenesis());

  // Set up your wallet identity here
  // umi.use(keypairIdentity(yourKeypair));

  const baseMint = generateSigner(umi);
  const backendSigner = generateSigner(umi);

  // Token allocation: 1 million tokens with 9 decimals
  const PRICED_SALE_TOKENS = 1_000_000_000_000_000n;

  // === STEP 1: Initialize Genesis Account ===
  const [genesisAccount] = findGenesisAccountV2Pda(umi, {
    baseMint: baseMint.publicKey,
    genesisIndex: 0,
  });

  await initializeV2(umi, {
    baseMint,
    fundingMode: 0,
    totalSupplyBaseToken: PRICED_SALE_TOKENS,
    name: 'Priced Sale Token',
    symbol: 'PST',
    uri: 'https://example.com/metadata.json',
  }).sendAndConfirm(umi);

  console.log('Genesis Account initialized:', genesisAccount);

  // === STEP 2: Define Timing ===
  const now = BigInt(Math.floor(Date.now() / 1000));
  const depositStart = now + 60n; // Start in 1 minute
  const depositEnd = now + 86400n; // End in 24 hours
  const claimStart = depositEnd + 1n;
  const claimEnd = claimStart + 604800n; // 1 week claim window

  // === STEP 3: Derive Bucket PDAs ===
  const [presaleBucket] = findPresaleBucketV2Pda(umi, {
    genesisAccount,
    bucketIndex: 0,
  });

  const [unlockedBucket] = findUnlockedBucketV2Pda(umi, {
    genesisAccount,
    bucketIndex: 0,
  });

  // === STEP 4: Add Priced Sale Bucket ===
  // Price: 100 SOL for 1 million tokens = 0.0001 SOL per token
  await addPresaleBucketV2(umi, {
    genesisAccount,
    baseMint: baseMint.publicKey,
    baseTokenAllocation: PRICED_SALE_TOKENS,
    allocationQuoteTokenCap: 100_000_000_000n, // 100 SOL cap
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
    minimumDepositAmount: { amount: 100_000_000n }, // Min 0.1 SOL
    depositLimit: { amount: 10_000_000_000n }, // Max 10 SOL per user
    endBehaviors: [
      {
        __kind: 'SendQuoteTokenPercentage',
        padding: Array(4).fill(0),
        destinationBucket: publicKey(unlockedBucket),
        percentageBps: 10000, // 100%
        processed: false,
      },
    ],
  }).sendAndConfirm(umi);

  console.log('Priced Sale bucket added:', presaleBucket);

  // === STEP 5: Add Unlocked Bucket (Treasury) ===
  await addUnlockedBucketV2(umi, {
    genesisAccount,
    baseMint: baseMint.publicKey,
    baseTokenAllocation: 0n,
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

  console.log('Unlocked bucket added:', unlockedBucket);

  // === STEP 6: Finalize ===
  await finalizeV2(umi, {
    baseMint: baseMint.publicKey,
    genesisAccount,
  }).sendAndConfirm(umi);

  console.log('Genesis finalized! Priced Sale is now active.');

  // === CHECK STATE ===
  const bucket = await fetchPresaleBucketV2(umi, presaleBucket);
  console.log('Token allocation:', bucket.bucket.baseTokenAllocation.toString());
  console.log('SOL cap:', bucket.allocationQuoteTokenCap.toString());
  console.log('Current deposits:', bucket.quoteTokenDepositTotal.toString());
}

runPricedSale().catch(console.error);
```

## Next Steps

- [Launch Pool](/smart-contracts/genesis/launch-pool) - Alternative with organic price discovery
- [Aggregation API](/smart-contracts/genesis/aggregation) - Query launch data via API
- [Getting Started](/smart-contracts/genesis/getting-started) - Genesis fundamentals
