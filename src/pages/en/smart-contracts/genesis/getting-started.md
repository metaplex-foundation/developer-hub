---
title: Getting Started
metaTitle: Genesis - Getting Started
description: Learn the fundamentals of launching a token with Genesis on Solana.
---

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

5. Transition
   └── Execute end behaviors (e.g., send funds to outflow buckets)
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
| **Launch Pool** | Deposit window with proportional distribution |
| **Priced Sale** | Pre-deposit collection before token distribution |

### Outflow Buckets
Receive tokens or quote tokens via end behaviors:

| Bucket Type | Use Case |
|-------------|----------|
| **Unlocked Bucket** | Receives funds for team/treasury claims |

### Choose Your Launch Type

{% callout type="note" %}
**[Launch Pool](/smart-contracts/genesis/launch-pool)** - Users deposit during a window and receive tokens proportional to their share of total deposits.
{% /callout %}

{% callout type="note" %}
**[Priced Sale](/smart-contracts/genesis/priced-sale)** - Collect commitments before trading begins, then distribute tokens based on custom criteria.
{% /callout %}

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

1. **[Launch Pool](/smart-contracts/genesis/launch-pool)** - Token distribution with deposit windows
2. **[Priced Sale](/smart-contracts/genesis/priced-sale)** - Pre-deposit collection before trading

Each guide includes complete setup code, user operations, and configuration.
