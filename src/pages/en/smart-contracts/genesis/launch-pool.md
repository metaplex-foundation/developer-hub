---
title: Launch Pool
metaTitle: Genesis - Launch Pool | Fair Token Distribution | Metaplex
description: Token distribution where users deposit during a window and receive tokens proportionally. Organic price discovery with anti-sniping design.
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - launch pool
  - token distribution
  - fair launch
  - proportional distribution
  - deposit window
  - price discovery
about:
  - Launch pools
  - Price discovery
  - Token distribution
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - Initialize a Genesis Account with your token
  - Add a Launch Pool bucket with deposit window configuration
  - Add an Unlocked bucket to receive collected funds
  - Finalize and let users deposit during the window
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: How is the token price determined in a Launch Pool?
    a: The price is discovered organically based on total deposits. Final price equals total SOL deposited divided by tokens allocated. More deposits means higher implied price per token.
  - q: Can users withdraw their deposits?
    a: Yes, users can withdraw during the deposit period. A {% fee product="genesis" config="launchPool" fee="withdraw" /%} withdrawal fee applies to discourage gaming the system.
  - q: What happens if I deposit multiple times?
    a: Multiple deposits from the same wallet accumulate into a single deposit account. Your total share is based on your combined deposits.
  - q: When can users claim their tokens?
    a: After the deposit period ends and the claim window opens (defined by claimStartCondition). The transition must be executed first to process end behaviors.
  - q: What's the difference between Launch Pool and Presale?
    a: Launch Pool discovers price organically based on deposits with proportional distribution. Presale has a fixed price set upfront with first-come-first-served allocation up to the cap.
---

**Launch Pools** provide organic price discovery for token launches. Users deposit during a window and receive tokens proportional to their share of total deposits - no sniping, no front-running, fair distribution for everyone. {% .lead %}

{% callout title="What You'll Learn" %}
This guide covers:
- How Launch Pool pricing and distribution works
- Setting up deposit and claim windows
- Configuring end behaviors for fund collection
- User operations: Deposit, withdraw, and claim
{% /callout %}

## Summary

Launch Pools accept deposits during a defined window, then distribute tokens proportionally. The final token price is determined by total deposits divided by token allocation.

- Users deposit SOL during the deposit window ({% fee product="genesis" config="launchPool" fee="deposit" /%} fee applies)
- Withdrawals allowed during deposit period ({% fee product="genesis" config="launchPool" fee="withdraw" /%} fee)
- Token distribution is proportional to deposit share
- End behaviors route collected SOL to treasury buckets

## Out of Scope

Fixed-price sales (see [Presale](/smart-contracts/genesis/presale)), bid-based auctions (see [Uniform Price Auction](/smart-contracts/genesis/uniform-price-auction)), and liquidity pool creation (use Raydium/Orca).

## Quick Start

{% totem %}
{% totem-accordion title="View complete setup script" %}

This shows how to set up a Launch Pool with deposit and claim windows. To build the user-facing app, see [User Operations](#user-operations).

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox';
import {
  genesis,
  initializeV2,
  findGenesisAccountV2Pda,
  addLaunchPoolBucketV2,
  findLaunchPoolBucketV2Pda,
  addUnlockedBucketV2,
  findUnlockedBucketV2Pda,
  finalizeV2,
} from '@metaplex-foundation/genesis';
import { generateSigner, publicKey } from '@metaplex-foundation/umi';

async function setupLaunchPool() {
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
  const depositEnd = now + 86400n; // 24 hours
  const claimStart = depositEnd + 1n;
  const claimEnd = claimStart + 604800n; // 1 week

  // 3. Derive bucket PDAs
  const [launchPoolBucket] = findLaunchPoolBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 });
  const [unlockedBucket] = findUnlockedBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 });

  // 4. Add Launch Pool bucket
  await addLaunchPoolBucketV2(umi, {
    genesisAccount,
    baseMint: baseMint.publicKey,
    baseTokenAllocation: TOTAL_SUPPLY,
    depositStartCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: depositStart,
      triggeredTimestamp: null,
    },
    depositEndCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: depositEnd,
      triggeredTimestamp: null,
    },
    claimStartCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: claimStart,
      triggeredTimestamp: null,
    },
    claimEndCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: claimEnd,
      triggeredTimestamp: null,
    },
    minimumDepositAmount: null,
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
      triggeredTimestamp: null,
    },
    claimEndCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: claimEnd,
      triggeredTimestamp: null,
    },
    backendSigner: { signer: backendSigner.publicKey },
  }).sendAndConfirm(umi);

  // 6. Finalize
  await finalizeV2(umi, {
    baseMint: baseMint.publicKey,
    genesisAccount,
  }).sendAndConfirm(umi);

  console.log('Launch Pool active!');
  console.log('Token:', baseMint.publicKey);
  console.log('Genesis:', genesisAccount);
}

setupLaunchPool().catch(console.error);
```

{% /totem-accordion %}
{% /totem %}

## How It Works

1. A specific quantity of tokens is allocated to the Launch Pool bucket
2. Users deposit SOL during the deposit window (withdrawals allowed with fee)
3. When the window closes, tokens distribute proportionally based on deposit share

### Price Discovery

The token price emerges from total deposits:

```
tokenPrice = totalDeposits / tokenAllocation
userTokens = (userDeposit / totalDeposits) * tokenAllocation
```

**Example:** 1,000,000 tokens allocated, 100 SOL total deposits = 0.0001 SOL per token

### Lifecycle

1. **Deposit Period** - Users deposit SOL during a defined window
2. **Transition** - End behaviors execute (e.g., send collected SOL to another bucket)
3. **Claim Period** - Users claim tokens proportional to their deposit weight

## Fees

{% protocol-fees program="genesis" config="launchPool" showTitle=false /%}

Deposit Fee Example: A user deposit of 10 SOL results in 9.8 SOL credited to the user's deposit account.

## Setup Guide

### Prerequisites

{% totem %}

```bash
npm install @metaplex-foundation/genesis @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-toolbox
```

{% /totem %}

### 1. Initialize the Genesis Account

The Genesis Account creates your token and coordinates all distribution buckets.

{% code-tabs-imported from="genesis/initialize_v2" frameworks="umi" filename="initializeV2" /%}

{% callout type="note" %}
The `totalSupplyBaseToken` should equal the sum of all bucket allocations.
{% /callout %}

### 2. Add the Launch Pool Bucket

The Launch Pool bucket collects deposits and distributes tokens proportionally. Configure timing here.

{% code-tabs-imported from="genesis/add_launch_pool_bucket_v2" frameworks="umi" filename="addLaunchPoolBucket" /%}

### 3. Add the Unlocked Bucket

The Unlocked bucket receives SOL from the Launch Pool after the transition.

{% code-tabs-imported from="genesis/add_unlocked_bucket_v2" frameworks="umi" filename="addUnlockedBucket" /%}

### 4. Finalize

Once all buckets are configured, finalize to activate the launch. This is irreversible.

{% code-tabs-imported from="genesis/finalize_v2" frameworks="umi" filename="finalize" /%}

## User Operations

### Wrapping SOL

Users must wrap SOL to wSOL before depositing.

{% code-tabs-imported from="genesis/wrap_sol" frameworks="umi" filename="wrapSol" /%}

### Depositing

{% code-tabs-imported from="genesis/deposit_launch_pool_v2" frameworks="umi" filename="depositLaunchPool" /%}

Multiple deposits from the same user accumulate into a single deposit account.

### Withdrawing

Users can withdraw during the deposit period. A {% fee product="genesis" config="launchPool" fee="withdraw" /%} fee applies.

{% code-tabs-imported from="genesis/withdraw_launch_pool_v2" frameworks="umi" filename="withdrawLaunchPool" /%}

If a user withdraws their entire balance, the deposit PDA is closed.

### Claiming Tokens

After the deposit period ends and claims open:

{% code-tabs-imported from="genesis/claim_launch_pool_v2" frameworks="umi" filename="claimLaunchPool" /%}

Token allocation: `userTokens = (userDeposit / totalDeposits) * bucketTokenAllocation`

## Admin Operations

### Executing the Transition

After deposits close, execute the transition to move collected SOL to the unlocked bucket.

{% code-tabs-imported from="genesis/transition_launch_pool_v2" frameworks="umi" filename="transitionLaunchPool" /%}

**Why this matters:** Without transition, collected SOL stays locked in the Launch Pool bucket. Users can still claim tokens, but the team cannot access the raised funds.

## Reference

### Time Conditions

Four conditions control Launch Pool timing:

| Condition | Purpose |
|-----------|---------|
| `depositStartCondition` | When deposits open |
| `depositEndCondition` | When deposits close |
| `claimStartCondition` | When claims open |
| `claimEndCondition` | When claims close |

Use `TimeAbsolute` with a Unix timestamp:

{% totem %}

```typescript
const condition = {
  __kind: 'TimeAbsolute',
  padding: Array(47).fill(0),
  time: BigInt(Math.floor(Date.now() / 1000) + 3600), // 1 hour from now
  triggeredTimestamp: null,
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

You can split funds across multiple buckets:

{% totem %}

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

{% /totem %}

### Fetching State

**Bucket state:**

{% totem %}

```typescript
import { fetchLaunchPoolBucketV2 } from '@metaplex-foundation/genesis';

const bucket = await fetchLaunchPoolBucketV2(umi, launchPoolBucket);
console.log('Total deposits:', bucket.quoteTokenDepositTotal);
console.log('Deposit count:', bucket.depositCount);
console.log('Claim count:', bucket.claimCount);
console.log('Token allocation:', bucket.bucket.baseTokenAllocation);
```

{% /totem %}

**Deposit state:**

{% totem %}

```typescript
import { fetchLaunchPoolDepositV2, safeFetchLaunchPoolDepositV2 } from '@metaplex-foundation/genesis';

const deposit = await fetchLaunchPoolDepositV2(umi, depositPda); // throws if not found
const maybeDeposit = await safeFetchLaunchPoolDepositV2(umi, depositPda); // returns null

if (deposit) {
  console.log('Amount deposited:', deposit.amountQuoteToken);
  console.log('Claimed:', deposit.claimed);
}
```

{% /totem %}

## Notes

- The {% fee product="genesis" config="launchPool" fee="deposit" /%} protocol fee applies to both deposits and withdrawals
- Multiple deposits from the same user accumulate in one deposit account
- If a user withdraws their entire balance, the deposit PDA closes
- Transitions must be executed after deposits close for end behaviors to process
- Users must have wSOL (wrapped SOL) to deposit

## FAQ

### How is the token price determined in a Launch Pool?
The price is discovered organically based on total deposits. Final price equals total SOL deposited divided by tokens allocated. More deposits means higher implied price per token.

### Can users withdraw their deposits?
Yes, users can withdraw during the deposit period. A {% fee product="genesis" config="launchPool" fee="withdraw" /%} withdrawal fee applies to discourage gaming the system.

### What happens if I deposit multiple times?
Multiple deposits from the same wallet accumulate into a single deposit account. Your total share is based on your combined deposits.

### When can users claim their tokens?
After the deposit period ends and the claim window opens (defined by `claimStartCondition`). The transition must be executed first to process end behaviors.

### What's the difference between Launch Pool and Presale?
Launch Pool discovers price organically based on deposits with proportional distribution. Presale has a fixed price set upfront with first-come-first-served allocation up to the cap.

## Glossary

| Term | Definition |
|------|------------|
| **Launch Pool** | Deposit-based distribution where price is discovered at close |
| **Deposit Window** | Time period when users can deposit and withdraw SOL |
| **Claim Window** | Time period when users can claim their proportional tokens |
| **End Behavior** | Automated action executed after deposit period ends |
| **Transition** | Instruction that processes end behaviors and routes funds |
| **Proportional Distribution** | Token allocation based on user's share of total deposits |
| **Quote Token** | The token users deposit (usually wSOL) |
| **Base Token** | The token being distributed |

## Next Steps

- [Presale](/smart-contracts/genesis/presale) - Fixed-price token sales
- [Uniform Price Auction](/smart-contracts/genesis/uniform-price-auction) - Bid-based allocation
- [Aggregation API](/smart-contracts/genesis/aggregation) - Query launch data via API
