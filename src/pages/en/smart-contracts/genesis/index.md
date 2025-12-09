---
title: Overview
metaTitle: Genesis - Overview
description: A smart contract for launching tokens on Solana via presale launches and launch pools.
---

Genesis is a Metaplex smart contract that provides a flexible framework for **Token Generation Events (TGEs)** on the Solana blockchain. Whether you're launching a new token with a presale or building a custom token distribution system, Genesis provides the on-chain infrastructure to make it happen.

{% callout type="note" %}
Genesis is currently undergoing a security audit.
{% /callout %}

## What Can You Build with Genesis?

Genesis supports multiple launch mechanisms that can be combined to create custom token launch experiences:

- **Launch Pools**: Token distribution where users deposit during a window and receive tokens proportional to their share
- **Presales**: Collect deposits from users before trading begins, then distribute tokens based on custom criteria

### Example Use Case: Token Launch

A project wants to launch a token where:
1. Users deposit SOL during a launch pool period
2. After the deposit period ends, tokens are distributed proportionally to deposits
3. Collected SOL is sent to an unlocked bucket for the team to claim

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
- **Launch Pool Bucket**: Collects deposits during a window, distributes tokens proportionally

**Outflow Buckets** receive tokens or quote tokens:
- **Unlocked Bucket**: Receives quote tokens via end behaviors for team/treasury claims

Each bucket has configurable time conditions that control when it's active, and behaviors that execute when conditions are met.

### Token Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     Genesis Account                         │
│                   (Holds all tokens)                        │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
         ┌─────────────┐         ┌─────────────┐
         │ Launch Pool │────────▶│  Unlocked   │
         │   Bucket    │         │   Bucket    │
         │ (Deposits)  │         │ (Treasury)  │
         └─────────────┘         └─────────────┘
                │                       │
                ▼                       ▼
             Users                    Team
          deposit SOL            claims SOL
```

## Typical Launch Flow

Here's how a typical token launch progresses:

### 1. Setup Phase
```
Initialize Genesis Account
        ↓
Add Inflow Bucket (e.g., Launch Pool)
        ↓
Add Outflow Bucket (e.g., Unlocked Bucket for treasury)
        ↓
Finalize Genesis Account
```

### 2. Active Phase
```
Deposit Period: Users deposit SOL
        ↓
Deposit Period Ends
        ↓
Transition: Execute end behaviors (send SOL to unlocked bucket)
        ↓
Claim Period: Users claim tokens
```

### 3. Post-Launch
```
Team claims SOL from unlocked bucket
        ↓
(Optional) Revoke mint/freeze authorities
```

## Key Features

### Time-Based Conditions
Every bucket has configurable start and end conditions based on absolute timestamps. This allows you to:
- Schedule exact launch times
- Create timed phases (deposit period, claim period, etc.)
- Coordinate multiple buckets with precise timing

### End Behaviors
Automated actions that execute when a bucket's end condition is met:
- **SendQuoteTokenPercentage**: Transfer a percentage of collected SOL to another bucket

## Security Considerations

{% callout type="warning" %}
**Finalization is Permanent**: Once you finalize a Genesis Account, you cannot add more buckets. Make sure your configuration is complete before finalizing.
{% /callout %}

{% callout type="warning" %}
**Authority Revocation is Irreversible**: Revoking mint or freeze authority is permanent. Only do this when you're certain the token launch is complete.
{% /callout %}

## Next Steps

Ready to build your token launch? Start here:

- [Getting Started](/smart-contracts/genesis/getting-started) - Understand the launch flow and initialize your first Genesis Account
- [JavaScript SDK](/smart-contracts/genesis/sdk/javascript) - Install and configure the SDK

Then choose your launch type:

- [Launch Pools](/smart-contracts/genesis/launch-pools) - Token distribution with deposit windows
- [Presales](/smart-contracts/genesis/presales) - Pre-deposits before trading begins
