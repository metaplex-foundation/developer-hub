---
title: Getting Started
metaTitle: Getting Started with Genesis - Launch a Token on Solana
description: Learn how to launch an SPL token on Solana step by step. Plan your presale, fair launch, or token sale using the Genesis token launchpad.
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - Genesis tutorial
  - token launch flow
  - Genesis setup
  - TGE steps
  - launch planning
  - how to launch a token
  - SPL token launch
  - token launchpad
  - token sale guide
about:
  - Genesis flow
  - Launch lifecycle
  - Token distribution
proficiencyLevel: Beginner
faqs:
  - q: What does initializing a Genesis Account create?
    a: It creates a new SPL token with metadata, a master coordination account, and holds the total token supply in escrow for distribution.
  - q: Can I add more buckets after finalizing?
    a: No. Finalization is permanent. You cannot add more buckets or change configurations after finalizing.
  - q: What's the difference between inflow and outflow buckets?
    a: Inflow buckets collect SOL from users (Launch Pool, Presale). Outflow buckets receive tokens or SOL for team/treasury claims.
  - q: When does the launch become active?
    a: After finalization, the launch activates based on your bucket time conditions (start timestamps).
  - q: How do I calculate token supply with decimals?
    a: Multiply your desired supply by 10^decimals. For 1 million tokens with 9 decimals, use 1,000,000,000,000,000.
---

Understand the Genesis token launch flow before building. Whether you're planning a presale, fair launch, or token sale on Solana, this guide explains each step from SPL token creation to distribution. {% .lead %}

{% callout title="No-Code Option" %}
If you want to launch a token without writing code, use the [Metaplex token launchpad](https://www.metaplex.com). The guides below are for developers looking to build a custom launchpad platform or host a token sale on their own website.
{% /callout %}

{% callout title="Ready to Build?" %}
Once you understand the flow:
- **[JavaScript SDK](/smart-contracts/genesis/sdk/javascript)** - Installation and function reference
- **[Launch Pool](/smart-contracts/genesis/launch-pool)** - Complete tutorial for proportional distribution
- **[Presale](/smart-contracts/genesis/presale)** - Complete tutorial for fixed-price sales
{% /callout %}

## The Genesis Flow

Every Genesis launch follows this lifecycle:

```
┌─────────────────────────────────────────────────────────────────┐
│  1. INITIALIZE                                                   │
│     Create Genesis Account → Mint token → Hold supply in escrow │
└─────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│  2. ADD BUCKETS                                                  │
│     Configure distribution (Launch Pool, Presale, Treasury)     │
└─────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│  3. FINALIZE                                                     │
│     Lock configuration → Activate time conditions               │
└─────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│  4. DEPOSIT PERIOD                                               │
│     Users deposit SOL based on bucket type                      │
└─────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│  5. TRANSITION                                                   │
│     Execute end behaviors → Route funds to treasury             │
└─────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│  6. CLAIM PERIOD                                                 │
│     Users claim tokens → Team claims raised funds               │
└─────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│  7. POST-LAUNCH (Optional)                                       │
│     Revoke mint/freeze authorities for security                 │
└─────────────────────────────────────────────────────────────────┘
```

## Step 1: Initialize

**What happens:** You create a Genesis Account which mints your token and holds the entire supply in escrow.

**You provide:**
- Token metadata (name, symbol, URI)
- Total supply (with decimals)
- Quote token (usually wSOL)

**Result:** A new SPL token exists, controlled by the Genesis Account until distribution.

### Token Supply Planning

SPL tokens use 9 decimals by default:

| Desired Supply | With 9 Decimals |
|----------------|-----------------|
| 1 token | 1,000,000,000 |
| 1,000 tokens | 1,000,000,000,000 |
| 1 million tokens | 1,000,000,000,000,000 |
| 1 billion tokens | 1,000,000,000,000,000,000 |

**Important:** Your total supply must equal the sum of all bucket allocations.

## Step 2: Add Buckets

**What happens:** You configure how tokens will be distributed by adding buckets.

### Bucket Types

| Bucket | Type | Purpose |
|--------|------|---------|
| **Launch Pool** | Inflow | Proportional distribution based on deposits |
| **Presale** | Inflow | Fixed-price sale up to a cap |
| **Unlocked** | Outflow | Treasury that receives raised funds |

### Example Configuration

A typical launch uses:

1. **Inflow bucket** (Launch Pool OR Presale) - Collects SOL from participants
2. **Outflow bucket** (Unlocked) - Receives collected SOL for team/treasury

```
Token Allocation Example (1 million tokens):
├── Launch Pool: 800,000 tokens (80%)
└── Unlocked:    200,000 tokens (20% team allocation)

Fund Flow:
Users deposit SOL → Launch Pool → End Behavior → Unlocked Bucket → Team claims
```

### Time Conditions

Each bucket has four time conditions:

| Condition | Controls |
|-----------|----------|
| Deposit Start | When users can begin depositing |
| Deposit End | When deposits close |
| Claim Start | When users can claim tokens |
| Claim End | When claims close |

Use Unix timestamps (seconds, not milliseconds).

## Step 3: Finalize

**What happens:** Configuration locks permanently. The launch activates based on time conditions.

### Before vs After Finalization

| Before | After |
|--------|-------|
| Can add buckets | No more buckets |
| Can modify settings | Settings locked |
| Launch inactive | Launch active (per time conditions) |

{% callout type="warning" %}
**Finalization is irreversible.** Triple-check your bucket allocations, time conditions, and end behaviors before finalizing.
{% /callout %}

## Step 4: Deposit Period

**What happens:** Users deposit SOL into your inflow bucket(s).

- **Launch Pool:** Users deposit SOL, can withdraw with {% fee product="genesis" config="launchPool" fee="withdraw" /%} fee
- **Presale:** Users deposit SOL at fixed price, up to a per-user deposit cap (maximum amount each user can contribute)

A {% fee product="genesis" config="launchPool" fee="deposit" /%} protocol fee applies to all deposits.

## Step 5: Transition

**What happens:** After deposits close, execute end behaviors to route funds.

Common end behavior: Send 100% of collected SOL to the Unlocked bucket (treasury).

You can split funds across multiple destinations:
- 80% to treasury
- 20% to liquidity pool bucket

## Step 6: Claim Period

**What happens:**
- Users claim tokens based on their deposit
- Team claims raised SOL from the Unlocked bucket

### Token Distribution

**Launch Pool:** `userTokens = (userDeposit / totalDeposits) × bucketAllocation`

**Presale:** `userTokens = userDeposit / pricePerToken`

## Step 7: Post-Launch (Optional)

**What happens:** Revoke token authorities for security.

- **Mint authority** - Revoke so no more tokens can ever be minted
- **Freeze authority** - Revoke so tokens can never be frozen

This signals to holders and rug checkers that the token supply is fixed.

{% callout type="warning" %}
Authority revocation is irreversible. Only do this when your launch is complete.
{% /callout %}

## Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `already finalized` | Trying to modify after finalize | Create new Genesis Account |
| `invalid total supply` | Bucket allocations don't match supply | Ensure allocations sum to total |
| `time conditions overlap` | Conflicting timestamps | Use sequential time windows |
| `deposit period not active` | Outside deposit window | Check timestamps |

## Planning Checklist

Before you start building:

- [ ] Decide on launch mechanism (Launch Pool for fair launch/crowdsale, Presale for fixed-price token sale)
- [ ] Calculate total token supply with decimals
- [ ] Plan bucket allocations (must sum to total supply)
- [ ] Set time windows (deposit start/end, claim start/end)
- [ ] Decide end behaviors (where do raised funds go?)
- [ ] Prepare token metadata (name, symbol, image URI)

## FAQ

### What does initializing a Genesis Account create?
It creates a new SPL token with metadata, a master coordination account (the Genesis Account PDA), and mints the total supply to be held in escrow for distribution.

### Can I add more buckets after finalizing?
No. Finalization is permanent. You cannot add more buckets or change configurations. Plan your complete bucket structure before finalizing.

### What's the difference between inflow and outflow buckets?
**Inflow buckets** collect SOL from users (Launch Pool, Presale). **Outflow buckets** receive tokens or SOL via end behaviors—typically an Unlocked Bucket for team/treasury claims.

### When does the launch become active?
After finalization, the launch activates based on your bucket time conditions. Users can participate when the current time is within a bucket's deposit window.

### How do I calculate token supply with decimals?
Multiply your desired supply by 10^decimals. For 1 million tokens with 9 decimals: 1,000,000 × 1,000,000,000 = 1,000,000,000,000,000.

### Can I use a token other than SOL for deposits?
Yes. Set `quoteMint` to any SPL token. However, wSOL is standard for SOL-denominated launches.

## Glossary

| Term | Definition |
|------|------------|
| **Genesis Account** | PDA that coordinates the launch and holds tokens |
| **Inflow Bucket** | Bucket that collects deposits from users |
| **Outflow Bucket** | Bucket that receives funds via end behaviors |
| **Finalize** | Lock configuration and activate the launch |
| **Time Condition** | Unix timestamp controlling bucket phases |
| **End Behavior** | Automated action when deposit period ends |
| **Transition** | Instruction that executes end behaviors |
| **Quote Token** | Token users deposit (usually wSOL) |

## Next Steps

Ready to build? Choose your token launch type:

1. **[Launch a Token](/tokens/launch-token)** - End-to-end token launch guide
2. **[JavaScript SDK](/smart-contracts/genesis/sdk/javascript)** - Install and configure
3. **[Launch Pool Tutorial](/smart-contracts/genesis/launch-pool)** - Fair launch with proportional distribution
4. **[Presale Tutorial](/smart-contracts/genesis/presale)** - Fixed-price token sale
