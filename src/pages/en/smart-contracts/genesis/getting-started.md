---
title: Getting Started
metaTitle: Genesis - Getting Started
description: Learn the fundamentals of launching a token with Genesis on Solana.
---

# Getting Started

This guide introduces the core concepts and workflow for launching a token with Genesis. You'll learn how to initialize a Genesis Account, understand the bucket system, and finalize your launch configuration.

## Prerequisites

Before you begin, make sure you have:
- Node.js 16+ installed
- A Solana wallet with SOL for transaction fees
- The Genesis SDK installed and configured (see [JavaScript SDK](/smart-contracts/genesis/sdk/javascript))

## The Genesis Launch Flow

Every Genesis token launch follows the same fundamental flow:

```
1. Initialize Genesis Account
   └── Creates your token and master coordination account

2. Add Buckets
   └── Configure how tokens are distributed (your launch type)

3. Finalize
   └── Lock configuration and activate the launch

4. Active Period
   └── Users participate based on your bucket configuration

5. Graduate to DEX
   └── Transition to permanent liquidity on Raydium
```

## Step 1: Initialize a Genesis Account

The Genesis Account is the foundation of your token launch. Initialization creates:
- A new SPL token with metadata
- A master account that coordinates all distribution buckets
- The total token supply held in escrow

```typescript
import {
  findGenesisAccountV2Pda,
  initializeV2,
} from '@metaplex-foundation/genesis';
import { generateSigner, publicKey } from '@metaplex-foundation/umi';

// Generate a new mint keypair for your token
const baseMint = generateSigner(umi);

// wSOL is the standard quote token
const WSOL_MINT = publicKey('So11111111111111111111111111111111111111112');

// Derive the Genesis Account PDA
const [genesisAccount] = findGenesisAccountV2Pda(umi, {
  baseMint: baseMint.publicKey,
  genesisIndex: 0,  // Use 0 for your first campaign
});

// Initialize the Genesis Account
await initializeV2(umi, {
  baseMint,
  quoteMint: WSOL_MINT,
  fundingMode: 0,
  totalSupplyBaseToken: 1_000_000_000_000_000n,  // 1 million tokens (9 decimals)
  name: 'My Token',
  symbol: 'MTK',
  uri: 'https://example.com/metadata.json',
}).sendAndConfirm(umi);

console.log('Genesis Account created:', genesisAccount);
console.log('Token Mint:', baseMint.publicKey);
```

### Understanding Token Supply

When specifying `totalSupplyBaseToken`, account for decimals. SPL tokens typically use 9 decimals:

```typescript
const ONE_TOKEN = 1_000_000_000n;           // 1 token
const ONE_MILLION = 1_000_000_000_000_000n; // 1,000,000 tokens
const ONE_BILLION = 1_000_000_000_000_000_000n; // 1,000,000,000 tokens
```

{% callout type="note" %}
The `totalSupplyBaseToken` should equal the sum of all bucket allocations. Plan your token distribution across buckets before initialization.
{% /callout %}

## Step 2: Add Buckets

Buckets are modular components that define how tokens flow during your launch. There are two categories:

### Inflow Buckets
Collect quote tokens (SOL) from users:

| Bucket Type | Use Case |
|-------------|----------|
| **Vault** | Presales and pre-deposits before trading |
| **Bonding Curve** | Automated price discovery with buy/sell trading |
| **Launch Pool** | Gamified distribution with rankings |

### Outflow Buckets
Receive tokens and liquidity for DEX creation:

| Bucket Type | Use Case |
|-------------|----------|
| **Raydium CPMM** | Graduate to permanent Raydium liquidity |

### Choose Your Launch Type

Each launch type guide includes complete setup instructions for both the inflow bucket and Raydium graduation:

{% callout type="note" %}
**[Launch Pools](/smart-contracts/genesis/launch-pools)** - Gamified launches where user rankings determine token allocation. Users deposit during a window, then your backend processes deposits in ranked order.
{% /callout %}

{% callout type="note" %}
**[Presales](/smart-contracts/genesis/presales)** - Collect commitments before trading begins. Users deposit SOL, then deposits are swapped to the bonding curve based on your criteria.
{% /callout %}

{% callout type="note" %}
**[Bonding Curves](/smart-contracts/genesis/bonding-curves)** - Immediate trading with automatic price discovery. Users can buy and sell freely, with price adjusting based on supply and demand.
{% /callout %}

For details on graduating to Raydium after your launch, see [Raydium Graduation](/smart-contracts/genesis/raydium-graduation).

## Step 3: Finalize

Once all buckets are configured, finalize the Genesis Account to lock the configuration:

```typescript
import { finalizeV2 } from '@metaplex-foundation/genesis';

await finalizeV2(umi, {
  baseMint: baseMint.publicKey,
}).sendAndConfirm(umi);

console.log('Genesis Account finalized!');
```

### What Finalization Does

After finalization:
- No more buckets can be added
- Bucket configurations are locked
- The launch becomes active based on your time conditions
- Users can start participating

{% callout type="warning" %}
**Finalization is irreversible.** Double-check all bucket configurations, time conditions, and token allocations before finalizing.
{% /callout %}

## Next Steps

Choose your launch type and follow the detailed guide:

1. **[Launch Pools](/smart-contracts/genesis/launch-pools)** - Gamified token distribution with rankings
2. **[Presales](/smart-contracts/genesis/presales)** - Pre-deposit collection before trading
3. **[Bonding Curves](/smart-contracts/genesis/bonding-curves)** - Immediate trading with price discovery

Each guide includes complete setup code, user operations, and backend management.
