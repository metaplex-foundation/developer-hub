---
title: Genesis - Solana Token Launch Smart Contract
metaTitle: Genesis | Solana TGE & Token Launch Platform | Fair Launch | Metaplex
description: Launch tokens on Solana with Genesis smart contract. Build token generation events (TGE), fair launches, ICOs, priced sales, and launch pools on-chain.
---

Genesis is a Metaplex smart contract that provides a flexible framework for **Token Generation Events (TGEs)** on the Solana blockchain. Whether you're launching a new token with a presale or building a custom token distribution system, Genesis provides the on-chain infrastructure to make it happen.

## What Can You Build with Genesis?

Genesis supports multiple launch mechanisms that can be combined to create custom token launch experiences:

| Mechanism | Description | Benefits |
|-----------|-------------|----------|
| **Presale** | Fixed price token sale | Fixed price reduces complexity and speculation. First-come, first-served dynamics encourage early participation. More predictable outcome with accurate demand forecasting. Caps and wallet gates can be implemented if desired. |
| **Launch Pool** | No fixed price–final price is implied by total deposits at close | Organic price discovery via no cap. Allows full ecosystem participation via no gate. Time-based launch pool prevents sniping and front-running with more open/accessible access. Caps and wallet gates can be implemented if desired. |
| **Uniform Price Auction** | Time-based auction where users bid for a specific quantity of tokens at a specific price. Bids can be public or private. All winners receive tokens at the clearing price. | Promotes price discovery especially among whales/funds. Can be gated/ungated. |

### Example Use Case: Launch Pool

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
Revoke mint/freeze authorities
```

## Revoking Authorities

After your launch is complete, you can revoke the mint and freeze authorities on your token. This signals to holders and rug checkers that no additional tokens can be minted and tokens cannot be frozen.

{% callout type="warning" %}
**Authority revocation is irreversible.** Once revoked, you can never mint additional tokens or freeze token accounts. Only do this when you're certain the token launch is complete.
{% /callout %}

```typescript
import { revokeMintAuthorityV2, revokeFreezeAuthorityV2 } from '@metaplex-foundation/genesis';

// Revoke mint authority - no more tokens can ever be minted
await revokeMintAuthorityV2(umi, {
  baseMint: baseMint.publicKey,
}).sendAndConfirm(umi);

// Revoke freeze authority - tokens can never be frozen
await revokeFreezeAuthorityV2(umi, {
  baseMint: baseMint.publicKey,
}).sendAndConfirm(umi);
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

## Next Steps

Ready to build your token launch? Start here:

- [Getting Started](/smart-contracts/genesis/getting-started) - Understand the launch flow and initialize your first Genesis Account
- [JavaScript SDK](/smart-contracts/genesis/sdk/javascript) - Install and configure the SDK

Then choose your launch type:

- [Launch Pool](/smart-contracts/genesis/launch-pool) - Best when you want organic price discovery and to accept all deposits regardless of amount
- [Presale](/smart-contracts/genesis/presale) - Best when you want a fixed, known price per token and have a specific funding target
- [Uniform Price Auction](/smart-contracts/genesis/uniform-price-auction) - Best for price discovery among larger participants with bid-based allocation
