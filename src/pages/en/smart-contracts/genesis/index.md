---
title: Overview
metaTitle: Genesis - Overview
description: A smart contract for launching tokens on Solana via presale launches, launch pools, and bonding curves.
---

# Genesis

Genesis is a Metaplex smart contract that provides a flexible framework for **Token Generation Events (TGEs)** on the Solana blockchain. Whether you're launching a new token with a presale, creating a fair launch with bonding curves, or building a gamified token distribution system, Genesis provides the on-chain infrastructure to make it happen.

## What Can You Build with Genesis?

Genesis supports multiple launch mechanisms that can be combined to create custom token launch experiences:

- **Presale/Vault Launches**: Collect deposits from users before trading begins, then distribute tokens based on custom criteria (rankings, allocations, etc.)
- **Bonding Curve Launches**: Allow users to buy and sell tokens with automatic price discovery based on supply and demand
- **DEX Graduation**: Seamlessly transition from a bonding curve to a Raydium liquidity pool, maintaining price continuity

### Example Use Case: Gamified Token Launch

A gaming platform wants to launch a token where:
1. Users pre-deposit SOL during a "vault" period
2. Based on in-game performance, the backend ranks players
3. Top-ranked players get their deposits swapped to the bonding curve first (getting the best prices)
4. After the game ends, the bonding curve opens for public trading
5. Finally, the token graduates to Raydium for permanent liquidity

Genesis makes this entire flow possible with a single, coordinated on-chain system.

## Core Concepts

### The Genesis Account

The Genesis Account is the central coordinator for your token launch. When you initialize a Genesis Account, you're creating:

- A new SPL token with metadata (name, symbol, URI)
- A master account that holds all minted tokens
- The foundation for adding "buckets" that control how tokens are distributed

Think of the Genesis Account as the "brain" of your token launch—it manages the token supply and coordinates all the different distribution mechanisms.

### Buckets

Buckets are modular components that define how tokens flow in and out of your launch. There are two types:

**Inflow Buckets** collect quote tokens (usually SOL) from users:
- **Vault Bucket**: A holding area for pre-deposits before trading begins
- **Bonding Curve Bucket**: An automated market maker that sells tokens at dynamically-adjusted prices

**Outflow Buckets** receive tokens and liquidity to create trading venues:
- **Raydium CPMM Bucket**: Creates a permanent liquidity pool on Raydium DEX

Each bucket has configurable time conditions that control when it's active, and behaviors that execute when conditions are met.

### Token Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     Genesis Account                         │
│                   (Holds all tokens)                        │
└─────────────────────────────────────────────────────────────┘
                            │
           ┌────────────────┼────────────────┐
           ▼                ▼                ▼
    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
    │   Vault     │  │  Bonding    │  │  Raydium    │
    │   Bucket    │──│   Curve     │──│   CPMM      │
    │ (Deposits)  │  │  (Trading)  │  │  (DEX)      │
    └─────────────┘  └─────────────┘  └─────────────┘
           │                │                │
           ▼                ▼                ▼
        Users            Users           Traders
      deposit SOL     buy/sell        trade on DEX
```

## V2 Architecture

Genesis V2 introduces several improvements over V1:

### Centralized Token Storage
All base tokens are held in the Genesis Account's token account, not in individual bucket accounts. This provides:
- Better security through centralized control
- Simpler token management
- Clearer accounting of token allocations

### Multiple Campaigns Per Token
The Genesis PDA is derived from `[PREFIX, base_mint, genesis_index]`, allowing you to create multiple TGE campaigns for the same token if needed. This is useful for:
- Running multiple rounds of token sales
- Creating separate distribution events
- Testing configurations before going live

### Improved SDK
The V2 SDK automatically derives most PDAs, reducing the number of accounts you need to manually specify. Instruction names are suffixed with `V2` for clarity.

## Typical Launch Flow

Here's how a typical token launch progresses:

### 1. Setup Phase
```
Initialize Genesis Account
        ↓
Add Vault Bucket (optional)
        ↓
Add Bonding Curve Bucket
        ↓
Add Raydium CPMM Bucket
        ↓
Finalize Genesis Account
```

### 2. Active Phase
```
Vault Period: Users deposit SOL
        ↓
Backend swaps vault deposits to bonding curve (ranked order)
        ↓
Bonding Curve Period: Public trading (buy/sell)
        ↓
Transition: Execute end behaviors
        ↓
Graduate to Raydium CPMM
```

### 3. Post-Launch
```
Trading continues on Raydium
        ↓
(Optional) Revoke mint/freeze authorities
```

## Key Features

### Time-Based Conditions
Every bucket has configurable start and end conditions based on absolute timestamps. This allows you to:
- Schedule exact launch times
- Create timed phases (deposit period, trading period, etc.)
- Coordinate multiple buckets with precise timing

### Actions Authority
A designated wallet (typically your backend) that can perform privileged operations:
- Swap vault deposits to the bonding curve in ranked order
- Pause and unpause bonding curve trading
- Process refunds for vault depositors

### End Behaviors
Automated actions that execute when a bucket's end condition is met:
- **SendStartPrice**: Transfer the final price ratio to another bucket
- **SendQuoteTokenPercentage**: Transfer a percentage of collected SOL to another bucket

### Price Continuity
When graduating from a bonding curve to Raydium, Genesis calculates the exact token/SOL ratio to maintain price continuity. Traders moving between venues see minimal price disruption.

## Security Considerations

{% callout type="warning" %}
**Backend Security**: The Actions Authority and Backend Signer keypairs must be kept secure on your server. Never expose these to the frontend or commit them to version control.
{% /callout %}

{% callout type="warning" %}
**Finalization is Permanent**: Once you finalize a Genesis Account, you cannot add more buckets. Make sure your configuration is complete before finalizing.
{% /callout %}

{% callout type="warning" %}
**Authority Revocation is Irreversible**: Revoking mint or freeze authority is permanent. Only do this when you're certain the token launch is complete.
{% /callout %}

## Next Steps

Ready to build your token launch? Start with these guides:

- [Getting Started](/smart-contracts/genesis/getting-started) - Install the SDK and initialize your first Genesis Account
- [Vault Deposits](/smart-contracts/genesis/vault-deposits) - Set up pre-deposits and backend-controlled swaps
- [Bonding Curves](/smart-contracts/genesis/bonding-curves) - Configure automatic price discovery
- [Raydium Graduation](/smart-contracts/genesis/raydium-graduation) - Graduate to permanent DEX liquidity
