---
title: Launch Pool
metaTitle: Genesis Launch Pool | Fair Launch & Token Distribution on Solana | Metaplex
description: Fair launch token distribution on Solana. Users deposit SOL and receive SPL tokens proportionally — an on-chain crowdsale with organic price discovery on the Genesis token launchpad.
created: '01-15-2025'
updated: '09-18-2026'
keywords:
  - launch pool
  - token distribution
  - fair launch
  - fair launch crypto
  - proportional distribution
  - deposit window
  - price discovery
  - token launchpad
  - crowdsale
  - token launchpad alternative
  - SPL token launch
  - on-chain token launch
  - soft cap
  - oversubscription
  - pro-rata refund
  - minimum quote token threshold
about:
  - Launch pools
  - Price discovery
  - Token distribution
  - Soft caps
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
    a: After the deposit period ends and the claim window opens (defined by claimStartCondition). triggerBehaviorsV2 must be executed first to process end behaviors.
  - q: What's the difference between Launch Pool and Presale?
    a: Launch Pool discovers price organically based on deposits with proportional distribution. Presale has a fixed price set upfront with first-come-first-served allocation up to the cap.
  - q: What is a Launch Pool soft cap?
    a: A soft cap is a ceiling on the quote tokens a Launch Pool keeps, set with the softCap extension. Deposits above the cap are still accepted, the launch still succeeds, and the excess is refunded pro-rata after the deposit window closes.
  - q: What is the difference between a soft cap and a minimum quote token threshold?
    a: A soft cap is a ceiling on capital raised and never causes a launch to fail. A minimum quote token threshold is a floor — if total deposits fall below it, the launch fails and every depositor can take a full refund. They are separate extensions and can be used together.
  - q: Do depositors receive fewer tokens when a Launch Pool is oversubscribed?
    a: No. The full base token allocation is still distributed pro-rata across all deposits. Oversubscription refunds excess quote tokens instead of cutting token allocations, so the effective price is capped at softCap divided by baseTokenAllocation.
  - q: Does a soft cap change the Raydium graduation start price?
    a: Yes. When a Launch Pool is oversubscribed, the graduation start price is derived from the capped proceeds rather than the raw deposit total, so it matches the amount actually forwarded by SendQuoteTokenPercentage.
---

**Launch Pools** provide organic price discovery for fair token launches on Solana. Users deposit SOL during a window and receive SPL tokens proportional to their share of total deposits. No sniping, no front-running, fair distribution for everyone. {% .lead %}

{% callout title="What You'll Learn" %}
This guide covers:
- How Launch Pool pricing and distribution works
- Setting up deposit and claim windows
- Configuring end behaviors for fund collection
- User operations: Deposit, withdraw, and claim
{% /callout %}

## Summary

Launch Pools are a crowdsale-style token launch mechanism that accepts deposits during a defined window, then distributes tokens proportionally. The final token price is determined by total deposits divided by token allocation — enabling transparent, on-chain price discovery for your token generation event (TGE).

- Users deposit SOL during the deposit window ({% fee product="genesis" config="launchPool" fee="deposit" /%} fee applies)
- Withdrawals allowed during deposit period ({% fee product="genesis" config="launchPool" fee="withdraw" /%} fee)
- Token distribution is proportional to deposit share
- An optional [soft cap](#launch-pool-soft-cap) bounds how much the launch keeps, refunding the excess pro-rata
- End behaviors route collected SOL to treasury buckets

{% callout type="note" %}
Launch Pools discover price from deposits. For a fixed price set upfront, use [Presale](/smart-contracts/genesis/presale); for bid-based clearing, use [Uniform Price Auction](/smart-contracts/genesis/uniform-price-auction). Liquidity pool creation is handled by the Raydium graduation buckets, not by the Launch Pool bucket itself.
{% /callout %}

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

Price discovery is unbounded by default — the more the pool is subscribed, the higher the implied price. Set a [soft cap](#launch-pool-soft-cap) to put a ceiling on it.

### Lifecycle

1. **Deposit Period** - Users deposit SOL during a defined window
2. **`triggerBehaviorsV2`** - End behaviors execute (e.g., send collected SOL to another bucket)
3. **Claim Period** - Users claim tokens proportional to their deposit weight
4. **Refund Period** (conditional) - If a [soft cap](#launch-pool-soft-cap) was exceeded or a [minimum quote token threshold](#soft-cap-and-minimum-quote-token-threshold-together) was missed, depositors call `refundLaunchPoolV2`

## Launch Pool Soft Cap

A **soft cap** is a ceiling on the quote tokens a Launch Pool keeps, configured with the `softCap` extension on `addLaunchPoolBucketV2`. Deposits above the cap are still accepted during the deposit window, the launch still succeeds, and the excess quote tokens are refunded pro-rata once the window closes.

Without a soft cap, price discovery is unbounded: every deposit is kept and the implied token price rises with subscription. A soft cap fixes the maximum the launch raises, so the effective price is `softCap / baseTokenAllocation` no matter how far deposits overshoot.

| Property | Behaviour when a soft cap is configured |
|----------|------------------------------------------|
| Deposits above the cap | Accepted during the deposit window — deposits are never rejected at the cap |
| Launch outcome | Succeeds — a soft cap is a ceiling, never a failure condition |
| Base token distribution | Full `baseTokenAllocation` distributed pro-rata across all deposits |
| Excess quote tokens | Refunded pro-rata via `refundLaunchPoolV2` after the deposit window ends |
| Proceeds seen by end behaviors | Clamped to the soft cap, so `SendQuoteTokenPercentage` forwards at most `softCap` |
| Raydium graduation start price | Derived from the capped proceeds, not the raw deposit total |

{% callout type="note" %}
A soft cap is a ceiling on capital raised, not a floor. The floor is a separate extension, `minimumQuoteTokenThreshold` — see [Soft Cap and Minimum Quote Token Threshold Together](#soft-cap-and-minimum-quote-token-threshold-together).
{% /callout %}

### Configuring a Soft Cap on a Launch Pool Bucket

Pass a `softCap` value to `addLaunchPoolBucketV2` when you add the bucket. The amount is denominated in quote token quantum units (lamports for wSOL).

{% totem %}

```typescript {% title="Add a Launch Pool bucket with a 100 SOL soft cap" %}
import { sol } from '@metaplex-foundation/umi';

await addLaunchPoolBucketV2(umi, {
  genesisAccount,
  baseMint: baseMint.publicKey,
  baseTokenAllocation: TOTAL_SUPPLY,
  // ...time conditions and end behaviors...

  // Floor: the launch fails below this and everyone can take a full refund.
  minimumQuoteTokenThreshold: { amount: sol(10).basisPoints },

  // Ceiling: the launch keeps at most this much; the rest is refunded pro-rata.
  softCap: { amount: sol(100).basisPoints },
}).sendAndConfirm(umi);
```

{% /totem %}

{% callout type="warning" %}
`softCap` is a **required** argument on `addLaunchPoolBucketV2` in `@metaplex-foundation/genesis` 0.42.0. Unlike the other Launch Pool extensions it has no default, so pass `softCap: null` explicitly when you do not want a cap.
{% /callout %}

Soft caps are validated when the extension is set and again at `finalizeV2`:

| Rule | Error if violated |
|------|-------------------|
| `softCap.amount` must be greater than zero | `InvalidSoftCap` (221) |
| `softCap.amount` must be greater than or equal to `minimumQuoteTokenThreshold.amount` | `SoftCapBelowThreshold` (222) |
| Extensions can only be added or removed before `finalizeV2` | Account is rejected as already finalized |

A soft cap can also be set or cleared on an existing bucket with `addLaunchPoolBucketV2Extensions` and `removeLaunchPoolBucketV2Extensions` using the `SoftCap` member of `LaunchPoolV2ExtensionType` — but only while the Genesis Account is unfinalized.

### Oversubscription and Pro-Rata Refund Math

A Launch Pool is **oversubscribed** when `quoteTokenDepositTotal` is strictly greater than `softCap.amount`. Each deposit is then split into a *filled* portion that counts toward the cap and an *excess* portion that is refundable:

{% totem %}

```text {% title="Per-depositor split in an oversubscribed Launch Pool" %}
filled_i = ceil(deposit_i * softCap / totalDeposits)
excess_i = deposit_i - filled_i
tokens_i = (weighted_i / weightedQuoteTokenTotal) * baseTokenAllocation
```

{% /totem %}

`filled` rounds **up** so that the sum of all filled portions is always at least the soft cap. This keeps the bucket solvent against the capped graduation transfer regardless of whether refunds or graduation are cranked first; the rounding leaves at most a few quantum units of dust in the bucket.

Token allocation is unaffected by the cap. Refunding excess does not remove a depositor's weighted contribution, so everyone still receives tokens proportional to their **full** deposit.

**Worked example** — 1,000,000 tokens allocated, a 100 SOL soft cap, and 150 SOL deposited:

| Depositor | Deposited | Filled (kept) | Refunded | Tokens received |
|-----------|-----------|---------------|----------|-----------------|
| Alice | 50 SOL | ~33.33 SOL | ~16.67 SOL | 333,333 (1/3) |
| Bob | 100 SOL | ~66.67 SOL | ~33.33 SOL | 666,667 (2/3) |
| **Total** | **150 SOL** | **100 SOL** | **50 SOL** | **1,000,000** |

The effective price is 0.0001 SOL per token (100 SOL / 1,000,000), not the 0.00015 SOL per token the uncapped deposit total would have implied. On-chain values are computed in lamports with `filled` rounded up, so real figures differ from the rounded SOL amounts above by a few lamports.

### Refunding Excess Deposits with refundLaunchPoolV2

`refundLaunchPoolV2` returns a depositor's excess quote tokens after an oversubscribed deposit window closes. It takes no amount argument — the program computes the refundable amount from the deposit, the soft cap, and the bucket's deposit total.

{% code-tabs-imported from="genesis/refund_launch_pool_v2" frameworks="umi" filename="refundLaunchPool" /%}

Key properties of the refund path:

- **Cranking is permissionless.** Only `payer` must sign. If the depositor also signs, their empty base token account is closed for them.
- **No fee and no penalty** are applied to a refund; deposit and withdraw penalty schedules do not affect it.
- **Claim order does not matter.** An excess refund is allowed before or after `claimLaunchPoolV2`; both orderings converge on the same final state.
- **One refund per deposit.** A second call returns `DepositAlreadyRefunded`.
- **Refunds are gated on the deposit window ending.** Calling earlier returns `LaunchPoolNotEnded`.
- **Refunds require a failed floor or an exceeded cap.** If neither applies, the call returns `LaunchPoolThresholdMet`.

### Soft Cap and Minimum Quote Token Threshold Together

`softCap` and `minimumQuoteTokenThreshold` are independent extensions that bound a Launch Pool from opposite directions, and `refundLaunchPoolV2` serves both. When the floor fails, that takes precedence and the refund is a full one.

| Configuration | Deposits below the floor | Deposits between floor and cap | Deposits above the cap |
|---------------|--------------------------|--------------------------------|------------------------|
| Neither set | Launch succeeds, no refunds | Launch succeeds, no refunds | Launch succeeds, no refunds |
| Floor only | Launch fails, full refunds | Launch succeeds, no refunds | Launch succeeds, no refunds |
| Cap only | Launch succeeds, no refunds | Launch succeeds, no refunds | Launch succeeds, excess refunded pro-rata |
| Floor and cap | Launch fails, full refunds | Launch succeeds, no refunds | Launch succeeds, excess refunded pro-rata |

{% callout type="note" %}
A full refund removes the depositor's weighted contribution from the bucket and cannot follow a claim — a failed floor means no claim was possible. An excess refund leaves the weighted contribution intact so the pro-rata claim formula stays correct.
{% /callout %}

## Fees

{% protocol-fees program="genesis" config="launchPool" showTitle=false /%}

Each deposit increases your credited balance by the SOL left after the user deposit fee ({% fee product="genesis" config="launchPool" fee="deposit" /%}) is withheld from the deposit.

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

The Unlocked bucket receives SOL from the Launch Pool after `triggerBehaviorsV2` executes.

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

### Refunding a Deposit

Refunds are available in two cases: the launch missed its `minimumQuoteTokenThreshold` (full refund), or it exceeded its `softCap` (excess-only refund). Both use the same instruction — see [Refunding Excess Deposits with refundLaunchPoolV2](#refunding-excess-deposits-with-refund-launch-pool-v2).

## Admin Operations

### Executing `triggerBehaviorsV2`

After deposits close, run `triggerBehaviorsV2` to move collected SOL to the unlocked bucket.

{% code-tabs-imported from="genesis/trigger_launch_pool_v2" frameworks="umi" filename="triggerBehaviors" /%}

**Why this matters:** Without running `triggerBehaviorsV2`, collected SOL stays locked in the Launch Pool bucket. Users can still claim tokens, but the team cannot access the raised funds.

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

### Launch Pool Extensions

Extensions are optional guards configured on the Launch Pool bucket. All are set through `addLaunchPoolBucketV2`, or added and removed individually with `addLaunchPoolBucketV2Extensions` and `removeLaunchPoolBucketV2Extensions` before `finalizeV2`.

| Extension | Type | Purpose |
|-----------|------|---------|
| `softCap` | `{ amount: bigint }` | Ceiling on quote tokens kept; excess refunded pro-rata |
| `minimumQuoteTokenThreshold` | `{ amount: bigint }` | Floor below which the launch fails and full refunds open |
| `minimumDepositAmount` | `{ amount: bigint }` | Minimum quote tokens per deposit |
| `depositLimit` | `{ limit: bigint }` | Maximum quote tokens per account |
| `allowlist` | `Allowlist` | Gates deposits to an allowlisted set of wallets |
| `claimSchedule` | `ClaimSchedule` | Vests claimed base tokens over time |
| `bonusSchedule` | `LinearBpsScheduleV2` | Time-weighted deposit bonus |
| `depositPenalty` | `LinearBpsScheduleV2` | Time-weighted deposit penalty |
| `withdrawPenalty` | `LinearBpsScheduleV2` | Time-weighted withdrawal penalty |
| `backendSigner` | `BackendSigner` | Requires a backend co-signer on user actions |

### Common Errors

| Error | Code | Cause |
|-------|------|-------|
| `InvalidSoftCap` | 221 | `softCap.amount` is zero — omit the extension instead of setting it to `0` |
| `SoftCapBelowThreshold` | 222 | `softCap.amount` is below `minimumQuoteTokenThreshold.amount` |
| `LaunchPoolNotEnded` | — | `refundLaunchPoolV2` called before the deposit window closed |
| `LaunchPoolThresholdMet` | 173 | Refund requested when the floor was met and the cap was not exceeded |
| `DepositAlreadyRefunded` | — | `refundLaunchPoolV2` called twice for the same deposit |
| `DepositAlreadyClaimed` | — | Full refund requested after the depositor already claimed tokens |

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

// Soft cap state (Option<SoftCap>)
console.log('Soft cap:', bucket.extensions.softCap);
console.log('Floor:', bucket.extensions.minimumQuoteTokenThreshold);
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
  console.log('Refunded:', deposit.refunded);
}
```

{% /totem %}

## Notes

- User deposit and withdraw fees for Launch Pool are shown in [Fees](#fees) above.
- Multiple deposits from the same user accumulate in one deposit account
- If a user withdraws their entire balance, the deposit PDA closes
- `triggerBehaviorsV2` must be executed after deposits close for end behaviors to process
- Users must have wSOL (wrapped SOL) to deposit
- `softCap` is a required argument on `addLaunchPoolBucketV2` in `@metaplex-foundation/genesis` 0.42.0 — pass `softCap: null` when no cap is wanted
- Launch Pool extensions, including `softCap`, can only be added or removed before `finalizeV2`
- Soft caps are supported by the Genesis program, the JavaScript SDK, and the [`mplx` CLI](/dev-tools/cli/genesis/launch-pool)
- An oversubscribed Launch Pool leaves a few quantum units of rounding dust in the bucket, because each depositor's filled portion rounds up
- `quoteTokenDepositTotal` and `depositCount` are preserved as historical records after refunds; `refundCount` tracks refunds processed

## FAQ

### How is the token price determined in a Launch Pool?
The price is discovered organically based on total deposits. Final price equals total SOL deposited divided by tokens allocated. More deposits means higher implied price per token.

### Can users withdraw their deposits?
Yes, users can withdraw during the deposit period. A {% fee product="genesis" config="launchPool" fee="withdraw" /%} withdrawal fee applies to discourage gaming the system.

### What happens if I deposit multiple times?
Multiple deposits from the same wallet accumulate into a single deposit account. Your total share is based on your combined deposits.

### When can users claim their tokens?
After the deposit period ends and the claim window opens (defined by `claimStartCondition`). `triggerBehaviorsV2` must be executed first to process end behaviors.

### What's the difference between Launch Pool and Presale?
Launch Pool discovers price organically based on deposits with proportional distribution. Presale has a fixed price set upfront with first-come-first-served allocation up to the cap.

### What is a Launch Pool soft cap?
A soft cap is a ceiling on the quote tokens a Launch Pool keeps, set with the `softCap` extension. Deposits above the cap are still accepted, the launch still succeeds, and the excess is refunded pro-rata after the deposit window closes.

### What is the difference between a soft cap and a minimum quote token threshold?
A soft cap is a ceiling on capital raised and never causes a launch to fail. A `minimumQuoteTokenThreshold` is a floor — if total deposits fall below it, the launch fails and every depositor can take a full refund. They are separate extensions and can be used together.

### Do depositors receive fewer tokens when a Launch Pool is oversubscribed?
No. The full base token allocation is still distributed pro-rata across all deposits. Oversubscription refunds excess quote tokens instead of cutting token allocations, so the effective price is capped at `softCap / baseTokenAllocation`.

### Does a soft cap change the Raydium graduation start price?
Yes. When a Launch Pool is oversubscribed, the graduation start price is derived from the capped proceeds rather than the raw deposit total, so it matches the amount actually forwarded by `SendQuoteTokenPercentage`.

## Glossary

| Term | Definition |
|------|------------|
| **Launch Pool** | Deposit-based distribution where price is discovered at close |
| **Deposit Window** | Time period when users can deposit and withdraw SOL |
| **Claim Window** | Time period when users can claim their proportional tokens |
| **End Behavior** | Automated action executed after deposit period ends |
| **`triggerBehaviorsV2`** | Instruction that processes end behaviors and routes funds |
| **Proportional Distribution** | Token allocation based on user's share of total deposits |
| **Quote Token** | The token users deposit (usually wSOL) |
| **Base Token** | The token being distributed |
| **Soft Cap** | Ceiling on the quote tokens a Launch Pool keeps; excess is refunded pro-rata |
| **Minimum Quote Token Threshold** | Floor below which a Launch Pool fails and full refunds open |
| **Oversubscription** | State where total deposits exceed the configured soft cap |
| **Filled Portion** | The part of a deposit that counts toward the soft cap and is kept by the launch |
| **Excess Refund** | Return of the portion of a deposit above the soft cap, leaving token allocation intact |

## Next Steps

- [Presale](/smart-contracts/genesis/presale) - Fixed-price token sale
- [Uniform Price Auction](/smart-contracts/genesis/uniform-price-auction) - Bid-based token offering
- [Launch a Token](/tokens/launch-token) - End-to-end token launch guide
- [Integration APIs](/smart-contracts/genesis/integration-apis) - Query launch and token sale data via API
