---
title: Presale
metaTitle: Genesis Presale | Fixed-Price Token Sale on Solana | Metaplex
description: Run a fixed-price token presale on Solana. SPL token sale where users deposit SOL and receive tokens at a predetermined rate. On-chain token sale with the Genesis token launchpad.
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - presale
  - token presale
  - crypto presale
  - fixed price sale
  - token offering on Solana
  - token sale
  - token offering
  - initial token sale
  - SPL token sale
  - fixed pricing
  - token launchpad
about:
  - Presale mechanics
  - Fixed pricing
  - Token sales
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - Initialize a Genesis Account with your token allocation
  - Add a Presale bucket with price and cap configuration
  - Add an Unlocked bucket for collected funds
  - Finalize and open the presale for deposits
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: How is the token price calculated in a Presale?
    a: Price equals SOL cap divided by token allocation. For 1,000,000 tokens with a 100 SOL cap, the price is 0.0001 SOL per token.
  - q: What happens if the SOL cap isn't reached?
    a: Users still receive tokens proportional to their deposits. If only 50 SOL is deposited against a 100 SOL cap, depositors receive 50% of allocated tokens.
  - q: Can I set deposit limits per user?
    a: Yes. Use minimumDepositAmount for minimum per-transaction limits and depositLimit for maximum total deposit per user.
  - q: What's the difference between Presale and Launch Pool?
    a: Presale has a fixed price determined by token allocation and SOL cap. Launch Pool discovers price organically based on total deposits.
  - q: When should I use Presale vs Launch Pool?
    a: Use Presale when you want predictable pricing and know exactly how much you want to raise. Use Launch Pool for organic price discovery.
---

**Presales** offer fixed-price token distribution on Solana — set your SPL token price upfront based on allocation and SOL cap. Users know exactly what they're getting, and you know exactly what you'll raise. In Genesis, a "presale" means tokens are sold immediately before initial trading — buyers receive the tokens directly, not a future right to receive them. {% .lead %}

{% callout title="What You'll Learn" %}
This guide covers:
- How Presale pricing works (allocation + cap = price)
- Setting up deposit windows and claim periods
- Configuring deposit limits and cooldowns
- User operations: wrap SOL, deposit, and claim
{% /callout %}

## Summary

Presales sell tokens at a predetermined price. The price is calculated from the token allocation and SOL cap you configure, making it ideal for token launches with a known valuation.

- Fixed price = SOL cap / token allocation
- Users deposit SOL during the deposit window ({% fee product="genesis" config="presale" fee="deposit" /%} fee applies)
- First-come-first-served up to the SOL cap
- Optional: minimum/maximum deposit limits and cooldowns.

## Out of Scope

Organic price discovery (see [Launch Pool](/smart-contracts/genesis/launch-pool)), bid-based auctions (see [Uniform Price Auction](/smart-contracts/genesis/uniform-price-auction)), and vesting schedules.

## How It Works

1. You allocate tokens to the Presale with a SOL cap that determines the fixed price
2. Users deposit SOL during the deposit window at the fixed rate
3. After the deposit period ends, you run `triggerBehaviorsV2` to process end behaviors and move funds
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

{% protocol-fees program="genesis" config="presale" showTitle=false /%}

## Quick Start

{% totem %}
{% totem-accordion title="View complete setup Script" %}

This script sets up a Presale with start and end dates and was run on devnet. Minimum and maximum deposit amounts, cooldowns, an allowlist, or a backend signer are added with `addPresaleBucketV2Extensions` before `finalizeV2`. To build the user-facing app, see [User Operations](#user-operations).

{% code-tabs-imported from="genesis/presale_quick_start" frameworks="umi" filename="setupPresale" /%}

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

{% code-tabs-imported from="genesis/initialize_v2" frameworks="umi" filename="initializeV2" /%}

{% callout type="note" %}
The `totalSupplyBaseToken` should equal the sum of all bucket allocations.
{% /callout %}

### 2. Add the Presale Bucket

The Presale bucket collects deposits and distributes tokens. Configure timing and optional limits here.

{% code-tabs-imported from="genesis/add_presale_bucket_v2" frameworks="umi" filename="addPresaleBucket" /%}

### 3. Add the Unlocked Bucket

The Unlocked bucket receives SOL from the Presale after end behaviors are triggered.

{% code-tabs-imported from="genesis/add_unlocked_bucket_v2" frameworks="umi" filename="addUnlockedBucket" /%}

### 4. Finalize

Once all buckets are configured, finalize to activate the presale. This is irreversible.

{% code-tabs-imported from="genesis/finalize_presale_v2" frameworks="umi" filename="finalize" /%}

## User Operations

### Wrapping SOL

Users must wrap SOL to wSOL before depositing.

{% code-tabs-imported from="genesis/wrap_sol" frameworks="umi" filename="wrapSol" /%}

### Depositing

{% code-tabs-imported from="genesis/deposit_presale_v2" frameworks="umi" filename="depositPresale" /%}

Multiple deposits from the same user accumulate into a single deposit account.

### Claiming Tokens

After the deposit period ends and claims open:

{% code-tabs-imported from="genesis/claim_presale_v2" frameworks="umi" filename="claimPresale" /%}

Token allocation: `userTokens = (userDeposit / allocationQuoteTokenCap) * baseTokenAllocation`

## Admin Operations

### Triggering End Behaviors

After the deposit period ends, run `triggerBehaviorsV2` to process the end behaviors configured on the presale bucket — in this case, moving collected SOL to the unlocked bucket.

{% callout type="warning" title="Must wait for deposit period to end" %}
`triggerBehaviorsV2` can only be called after the presale's `depositEndCondition` has been met. Calling it early throws a `PresaleBucketNotEnded` error.
{% /callout %}

{% code-tabs-imported from="genesis/trigger_presale_v2" frameworks="umi" filename="triggerBehaviors" /%}

**Why this matters:** Without triggering end behaviors, collected SOL stays locked in the Presale bucket. Users can still claim tokens, but the team cannot access the raised funds.

## Reference

### Configuration Options

These options are Presale extensions, added with `addPresaleBucketV2Extensions` after `addPresaleBucketV2Base` and before `finalizeV2`. Each entry is a tagged object such as `{ __kind: 'MinimumDepositAmount', minimumDepositAmount: { amount } }`:

| Option | Description | Example |
|--------|-------------|---------|
| `minimumDepositAmount` | Minimum deposit per transaction | `{ amount: sol(0.1).basisPoints }` |
| `depositLimit` | Maximum total deposit per user | `{ limit: sol(10).basisPoints }` |
| `depositCooldown` | Time between deposits | `{ seconds: 60n }` |
| `perCooldownDepositLimit` | Max deposit per cooldown period | `{ amount: sol(1).basisPoints }` |

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

## Notes

- The {% fee product="genesis" config="presale" fee="deposit" /%} protocol fee applies to deposits
- Users must wrap SOL to wSOL before depositing
- Multiple deposits from the same user accumulate in one deposit account
- Run `triggerBehaviorsV2` after deposits close for the team to access raised funds; it cannot be called before the deposit period ends
- Finalization is permanent—double-check all configuration before calling `finalizeV2`

## FAQ

### How is the token price calculated in a Presale?
Price equals SOL cap divided by token allocation. For 1,000,000 tokens with a 100 SOL cap, the price is 0.0001 SOL per token.

### What happens if the SOL cap isn't reached?
Users still receive tokens proportional to their deposits. If only 50 SOL is deposited against a 100 SOL cap, depositors receive 50% of allocated tokens.

### Can I set deposit limits per user?
Yes. Use `minimumDepositAmount` for minimum per-transaction limits and `depositLimit` for maximum total deposit per user.

### What's the difference between Presale and Launch Pool?
Presale has a fixed price determined by token allocation and SOL cap. Launch Pool discovers price organically based on total deposits.

### When should I use Presale vs Launch Pool?
Use Presale when you want predictable pricing and know exactly how much you want to raise. Use Launch Pool for organic price discovery.

## Glossary

| Term | Definition |
|------|------------|
| **Presale** | Fixed-price token sale with predetermined rate |
| **SOL Cap** | Maximum SOL the presale will accept (determines price) |
| **Token Allocation** | Number of tokens available in the presale |
| **Deposit Limit** | Maximum total deposit allowed per user |
| **Minimum Deposit** | Minimum amount required per deposit transaction |
| **Cooldown** | Time users must wait between deposits |
| **End Behavior** | Automated action after deposit period ends |
| **Trigger** | `triggerBehaviorsV2` instruction that processes end behaviors after the deposit period ends |

## Next Steps

- [Launch Pool](/smart-contracts/genesis/launch-pool) - Fair launch with organic price discovery
- [Uniform Price Auction](/smart-contracts/genesis/uniform-price-auction) - Auction-style bid-based allocation
- [Launch a Token](/tokens/launch-token) - End-to-end token launch guide
- [Getting Started](/smart-contracts/genesis/getting-started) - Genesis launchpad fundamentals
