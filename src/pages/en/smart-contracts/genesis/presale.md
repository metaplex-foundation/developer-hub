---
title: Presale
metaTitle: Genesis - Presale
description: Fixed-price token sale where users deposit SOL and receive tokens at a predetermined rate.
---

Presales are a token launch mechanism where tokens are sold at a fixed, predetermined price. Unlike Launch Pools where the final price depends on total deposits, Presales let you set the exact price per token upfront. {% .lead %}

## How It Works

1. You allocate tokens to the Presale with a SOL cap that determines the fixed price
2. Users deposit SOL during the deposit window at the fixed rate
3. After the deposit period ends, you execute the transition to move funds
4. Users claim their tokens based on their deposit amount

### Price Calculation

The token price is determined by the ratio of allocated tokens to the SOL cap:

```
price = allocationQuoteTokenCap / baseTokenAllocation
tokens = deposit / price
```

For example, if you allocate 1,000,000 tokens with a 100 SOL cap:
- Price = 100 SOL / 1,000,000 tokens = 0.0001 SOL per token
- A 10 SOL deposit receives 100,000 tokens

### Fees

A fee is applied to user deposits. See [Protocol Fees](/protocol-fees) for more details.

## Quick Start

{% totem %}
{% totem-accordion title="View complete setup Script" %}

This shows how to setup a Presale with Start and End Dates. You can also add a minimum deposit amount and a maximum deposit amount or a backend signer. To build the user facing app, see [User Operations](#user-operations).

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox';
import {
  genesis,
  initializeV2,
  findGenesisAccountV2Pda,
  addPresaleBucketV2,
  findPresaleBucketV2Pda,
  addUnlockedBucketV2,
  findUnlockedBucketV2Pda,
  finalizeV2,
  NOT_TRIGGERED_TIMESTAMP,
} from '@metaplex-foundation/genesis';
import { generateSigner, publicKey, sol } from '@metaplex-foundation/umi';

async function setupPresale() {
  const umi = createUmi('https://api.mainnet-beta.solana.com')
    .use(mplToolbox())
    .use(genesis());

  // umi.use(keypairIdentity(yourKeypair));

  const baseMint = generateSigner(umi);
  const backendSigner = generateSigner(umi);
  const TOTAL_SUPPLY = 1_000_000_000_000_000n; // 1 million tokens (9 decimals)

  // 1. Initialize
  const [genesisAccount] = findGenesisAccountV2Pda(umi, {
    baseMint: baseMint.publicKey,
    genesisIndex: 0,
  });

  await initializeV2(umi, {
    baseMint,
    fundingMode: 0,
    totalSupplyBaseToken: TOTAL_SUPPLY,
    name: 'My Token',
    symbol: 'MTK',
    uri: 'https://example.com/metadata.json',
  }).sendAndConfirm(umi);

  // 2. Define timing
  const now = BigInt(Math.floor(Date.now() / 1000));
  const depositStart = now + 60n;
  const depositEnd = now + 86400n;
  const claimStart = depositEnd + 1n;
  const claimEnd = claimStart + 604800n;

  // 3. Derive bucket PDAs
  const [presaleBucket] = findPresaleBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 });
  const [unlockedBucket] = findUnlockedBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 });

  // 4. Add Presale bucket
  await addPresaleBucketV2(umi, {
    genesisAccount,
    baseMint: baseMint.publicKey,
    baseTokenAllocation: TOTAL_SUPPLY,
    allocationQuoteTokenCap: sol(100).basisPoints, // 100 SOL cap
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
    endBehaviors: [
      {
        __kind: 'SendQuoteTokenPercentage',
        padding: Array(4).fill(0),
        destinationBucket: publicKey(unlockedBucket),
        percentageBps: 10000,
        processed: false,
      },
    ],
  }).sendAndConfirm(umi);

  // 5. Add Unlocked bucket (receives SOL after transition)
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

  // 6. Finalize
  await finalizeV2(umi, {
    baseMint: baseMint.publicKey,
    genesisAccount,
  }).sendAndConfirm(umi);

  console.log('Presale active!');
  console.log('Token:', baseMint.publicKey);
  console.log('Genesis:', genesisAccount);
}

setupPresale().catch(console.error);
```

{% /totem-accordion %}
{% /totem %}

## Setup Guide

### Prerequisites

{% totem %}

```bash
npm install @metaplex-foundation/genesis @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-toolbox
```

{% /totem %}

### 1. Initialize the Genesis Account

The Genesis Account creates your token and coordinates all distribution buckets.

{% totem %}

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox';
import {
  genesis,
  initializeV2,
  findGenesisAccountV2Pda,
} from '@metaplex-foundation/genesis';
import { generateSigner, keypairIdentity } from '@metaplex-foundation/umi';

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplToolbox())
  .use(genesis());

// umi.use(keypairIdentity(yourKeypair));

const baseMint = generateSigner(umi);
const TOTAL_SUPPLY = 1_000_000_000_000_000n; // 1 million tokens (9 decimals)

const [genesisAccount] = findGenesisAccountV2Pda(umi, {
  baseMint: baseMint.publicKey,
  genesisIndex: 0,
});

await initializeV2(umi, {
  baseMint,
  fundingMode: 0,
  totalSupplyBaseToken: TOTAL_SUPPLY,
  name: 'My Token',
  symbol: 'MTK',
  uri: 'https://example.com/metadata.json',
}).sendAndConfirm(umi);
```

{% /totem %}

{% callout type="note" %}
The `totalSupplyBaseToken` should equal the sum of all bucket allocations.
{% /callout %}

### 2. Add the Presale Bucket

The Presale bucket collects deposits and distributes tokens. Configure timing and optional limits here.

{% totem %}

```typescript
import {
  addPresaleBucketV2,
  findPresaleBucketV2Pda,
  findUnlockedBucketV2Pda,
  NOT_TRIGGERED_TIMESTAMP,
} from '@metaplex-foundation/genesis';
import { publicKey, sol } from '@metaplex-foundation/umi';

const [presaleBucket] = findPresaleBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 });
const [unlockedBucket] = findUnlockedBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 });

const now = BigInt(Math.floor(Date.now() / 1000));
const depositStart = now;
const depositEnd = now + 86400n; // 24 hours
const claimStart = depositEnd + 1n;
const claimEnd = claimStart + 604800n; // 1 week

await addPresaleBucketV2(umi, {
  genesisAccount,
  baseMint: baseMint.publicKey,
  baseTokenAllocation: TOTAL_SUPPLY,
  allocationQuoteTokenCap: 100_000_000_000n, // 100 SOL cap (sets price)

  // Timing
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

  // Optional: Deposit limits
  minimumDepositAmount: null, // or { amount: sol(0.1).basisPoints }
  depositLimit: null, // or { limit: sol(10).basisPoints }

  // Where collected SOL goes after transition
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
```

{% /totem %}

### 3. Add the Unlocked Bucket

The Unlocked bucket receives SOL from the Presale after the transition.

{% totem %}

```typescript
import { addUnlockedBucketV2 } from '@metaplex-foundation/genesis';
import { generateSigner } from '@metaplex-foundation/umi';

const backendSigner = generateSigner(umi);

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
```

{% /totem %}

### 4. Finalize

Once all buckets are configured, finalize to activate the presale. This is irreversible.

{% totem %}

```typescript
import { finalizeV2 } from '@metaplex-foundation/genesis';

await finalizeV2(umi, {
  baseMint: baseMint.publicKey,
  genesisAccount,
}).sendAndConfirm(umi);
```

{% /totem %}

## User Operations

### Wrapping SOL

Users must wrap SOL to wSOL before depositing.

{% totem %}

```typescript
import {
  findAssociatedTokenPda,
  createTokenIfMissing,
  transferSol,
  syncNative,
} from '@metaplex-foundation/mpl-toolbox';
import { WRAPPED_SOL_MINT } from '@metaplex-foundation/genesis';
import { publicKey, sol } from '@metaplex-foundation/umi';

const userWsolAccount = findAssociatedTokenPda(umi, {
  owner: umi.identity.publicKey,
  mint: WRAPPED_SOL_MINT,
});

await createTokenIfMissing(umi, {
  mint: WRAPPED_SOL_MINT,
  owner: umi.identity.publicKey,
  token: userWsolAccount,
})
  .add(
    transferSol(umi, {
      destination: publicKey(userWsolAccount),
      amount: sol(1),
    })
  )
  .add(syncNative(umi, { account: userWsolAccount }))
  .sendAndConfirm(umi);
```

{% /totem %}

### Depositing

{% totem %}

```typescript
import {
  depositPresaleV2,
  findPresaleDepositV2Pda,
  fetchPresaleDepositV2,
} from '@metaplex-foundation/genesis';
import { sol } from '@metaplex-foundation/umi';

await depositPresaleV2(umi, {
  genesisAccount,
  bucket: presaleBucket,
  baseMint: baseMint.publicKey,
  amountQuoteToken: sol(1).basisPoints,
}).sendAndConfirm(umi);

// Verify
const [depositPda] = findPresaleDepositV2Pda(umi, {
  bucket: presaleBucket,
  recipient: umi.identity.publicKey,
});
const deposit = await fetchPresaleDepositV2(umi, depositPda);
console.log('Deposited (after fee):', deposit.amountQuoteToken);
```

{% /totem %}

Multiple deposits from the same user accumulate into a single deposit account.

### Claiming Tokens

After the deposit period ends and claims open:

{% totem %}

```typescript
import { claimPresaleV2 } from '@metaplex-foundation/genesis';

await claimPresaleV2(umi, {
  genesisAccount,
  bucket: presaleBucket,
  baseMint: baseMint.publicKey,
  recipient: umi.identity.publicKey,
}).sendAndConfirm(umi);
```

{% /totem %}

Token allocation: `userTokens = (userDeposit / allocationQuoteTokenCap) * baseTokenAllocation`

## Admin Operations

### Executing the Transition

After deposits close, execute the transition to move collected SOL to the unlocked bucket.

{% totem %}

```typescript
import { transitionV2, WRAPPED_SOL_MINT } from '@metaplex-foundation/genesis';
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox';
import { publicKey } from '@metaplex-foundation/umi';

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
    { pubkey: unlockedBucket, isSigner: false, isWritable: true },
    { pubkey: publicKey(unlockedBucketQuoteTokenAccount), isSigner: false, isWritable: true },
  ])
  .sendAndConfirm(umi);
```

{% /totem %}

**Why this matters:** Without transition, collected SOL stays locked in the Presale bucket. Users can still claim tokens, but the team cannot access the raised funds.

## Reference

### Configuration Options

These options are set when creating the Presale bucket:

| Option | Description | Example |
|--------|-------------|---------|
| `minimumDepositAmount` | Minimum deposit per transaction | `{ amount: sol(0.1).basisPoints }` |
| `depositLimit` | Maximum total deposit per user | `{ limit: sol(10).basisPoints }` |
| `depositCooldown` | Time between deposits | `{ seconds: 60n }` |
| `perCooldownDepositLimit` | Max deposit per cooldown period | `{ amount: sol(1).basisPoints }` |
| `backendSigner` | Require backend authorization | `{ signer: publicKey }` |

### Time Conditions

Four conditions control presale timing:

| Condition | Purpose |
|-----------|---------|
| `depositStartCondition` | When deposits open |
| `depositEndCondition` | When deposits close |
| `claimStartCondition` | When claims open |
| `claimEndCondition` | When claims close |

Use `TimeAbsolute` with a Unix timestamp:

{% totem %}

```typescript
import { NOT_TRIGGERED_TIMESTAMP } from '@metaplex-foundation/genesis';

const condition = {
  __kind: 'TimeAbsolute',
  padding: Array(47).fill(0),
  time: BigInt(Math.floor(Date.now() / 1000) + 3600), // 1 hour from now
  triggeredTimestamp: NOT_TRIGGERED_TIMESTAMP,
};
```

{% /totem %}

### End Behaviors

Define what happens to collected SOL after the deposit period:

{% totem %}

```typescript
endBehaviors: [
  {
    __kind: 'SendQuoteTokenPercentage',
    padding: Array(4).fill(0),
    destinationBucket: publicKey(unlockedBucket),
    percentageBps: 10000, // 100% = 10000 basis points
    processed: false,
  },
]
```

{% /totem %}

### Fetching State

**Bucket state:**

{% totem %}

```typescript
import { fetchPresaleBucketV2 } from '@metaplex-foundation/genesis';

const bucket = await fetchPresaleBucketV2(umi, presaleBucket);
console.log('Total deposits:', bucket.quoteTokenDepositTotal);
console.log('Deposit count:', bucket.depositCount);
console.log('Token allocation:', bucket.bucket.baseTokenAllocation);
console.log('SOL cap:', bucket.allocationQuoteTokenCap);
```

{% /totem %}

**Deposit state:**

{% totem %}

```typescript
import { fetchPresaleDepositV2, safeFetchPresaleDepositV2 } from '@metaplex-foundation/genesis';

const deposit = await fetchPresaleDepositV2(umi, depositPda); // throws if not found
const maybeDeposit = await safeFetchPresaleDepositV2(umi, depositPda); // returns null

if (deposit) {
  console.log('Amount deposited:', deposit.amountQuoteToken);
  console.log('Amount claimed:', deposit.amountClaimed);
  console.log('Fully claimed:', deposit.claimed);
}
```

{% /totem %}

## Next Steps

- [Launch Pool](/smart-contracts/genesis/launch-pool) - Alternative with organic price discovery
- [Aggregation API](/smart-contracts/genesis/aggregation) - Query launch data via API
- [Getting Started](/smart-contracts/genesis/getting-started) - Genesis fundamentals
