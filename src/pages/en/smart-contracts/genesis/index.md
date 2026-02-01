---
title: Genesis - Solana Token Launch Smart Contract
metaTitle: Genesis | Solana TGE & Token Launch Platform | Fair Launch | Metaplex
description: Launch tokens on Solana with Genesis smart contract. Build token generation events (TGE), fair launches, ICOs, priced sales, and launch pools on-chain.
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - token launch
  - TGE
  - token generation event
  - fair launch
  - ICO
  - launch pool
  - presale
  - Solana token
about:
  - Token launches
  - Genesis protocol
  - Fair distribution
proficiencyLevel: Beginner
faqs:
  - q: What is Genesis?
    a: Genesis is a Metaplex smart contract for Token Generation Events (TGE) on Solana. It provides on-chain infrastructure for presales, launch pools, and auctions.
  - q: What launch mechanisms does Genesis support?
    a: Genesis supports three mechanisms - Presale (fixed price), Launch Pool (proportional distribution with price discovery), and Uniform Price Auction (bid-based with clearing price).
  - q: How much does it cost to use Genesis?
    a: Genesis charges a 2% protocol fee on deposits. There are no upfront costs - you only pay Solana transaction fees plus the protocol fee on funds raised.
  - q: Can I revoke token authorities after launch?
    a: Yes. Genesis provides instructions to revoke mint and freeze authorities, signaling to holders that no additional tokens can be minted.
  - q: What's the difference between Launch Pool and Presale?
    a: Presale has a fixed price set upfront. Launch Pool discovers price organically based on total deposits - more deposits means higher implied price per token.
---

**Genesis** is a Metaplex smart contract for **Token Generation Events (TGE)** on Solana. Build presales, launch pools, and auctions with on-chain coordination for token creation, distribution, and fund collection. {% .lead %}

{% callout title="Choose Your Path" %}
- **New to Genesis?** Start with [Getting Started](/smart-contracts/genesis/getting-started) to understand the flow
- **Ready to build?** Jump to [Launch Pool](/smart-contracts/genesis/launch-pool) or [Presale](/smart-contracts/genesis/presale)
- **Need SDK reference?** See [JavaScript SDK](/smart-contracts/genesis/sdk/javascript)
{% /callout %}

## What is Genesis?

Genesis provides on-chain infrastructure for launching tokens on Solana. It handles:

- **Token creation** with metadata (name, symbol, image)
- **Fund collection** from participants (SOL deposits)
- **Distribution** based on your chosen mechanism
- **Time coordination** for deposit and claim windows

Think of Genesis as a smart contract that sits between you (the launcher) and your participants, ensuring fair, transparent, and automated token distribution.

## Launch Mechanisms

Genesis supports three mechanisms that can be combined:

| Mechanism | Price | Distribution | Best For |
|-----------|-------|--------------|----------|
| **[Launch Pool](/smart-contracts/genesis/launch-pool)** | Discovered at close | Proportional to deposit | Fair launches, community tokens |
| **[Presale](/smart-contracts/genesis/presale)** | Fixed upfront | First-come-first-served | Predictable raises, known valuation |
| **[Uniform Price Auction](/smart-contracts/genesis/uniform-price-auction)** | Clearing price | Highest bidders win | Large raises, institutional interest |

### Which Should I Use?

**Launch Pool** - You want organic price discovery and fair distribution. Everyone who deposits gets tokens proportional to their share. No one gets sniped.

**Presale** - You know your valuation and want predictable pricing. Set a fixed price and let participants buy until the cap is reached.

**Auction** - You want competitive bidding from larger participants. Best for established projects with institutional interest.

## Core Concepts

### Genesis Account

The central coordinator for your launch. When you initialize a Genesis Account, it:

- Creates your SPL token with metadata
- Mints the total supply to escrow
- Provides the foundation for adding distribution buckets

### Buckets

Modular components that define how tokens and funds flow:

| Type | Purpose | Examples |
|------|---------|----------|
| **Inflow** | Collect SOL from users | Launch Pool, Presale |
| **Outflow** | Receive funds for team/treasury | Unlocked Bucket |

### Time Conditions

Every bucket has time windows that control when actions are allowed:

- **Deposit window** - When users can deposit SOL
- **Claim window** - When users can claim tokens

## Protocol Fees

| Action | Fee |
|--------|-----|
| Deposit | 2% of deposit amount |
| Withdraw | 2% of withdrawal amount |
| Claim | Transaction fee only |

No upfront costs. You only pay fees on funds raised.

## Program Information

| Network | Program ID |
|---------|------------|
| Mainnet | `GENSkbxvLc7iBQvEAJv3Y5wVMHGD3RjfCNwWgU8Tqgkc` |
| Devnet | `GENSkbxvLc7iBQvEAJv3Y5wVMHGD3RjfCNwWgU8Tqgkc` |

## Security

After your launch completes, revoke token authorities to signal that no additional tokens can be minted:

- **Mint authority** - Revoke to prevent new token minting
- **Freeze authority** - Revoke to prevent token freezing

See [Getting Started](/smart-contracts/genesis/getting-started) for details on authority management.

## FAQ

### What is Genesis?
Genesis is a Metaplex smart contract for Token Generation Events (TGE) on Solana. It provides on-chain infrastructure for presales, launch pools, and auctions with coordinated token creation and distribution.

### What launch mechanisms does Genesis support?
Genesis supports three mechanisms: **Launch Pool** (proportional distribution with price discovery), **Presale** (fixed price), and **Uniform Price Auction** (bid-based with clearing price).

### How much does it cost to use Genesis?
Genesis charges a 2% protocol fee on deposits. There are no upfront costs—you only pay Solana transaction fees plus the protocol fee on funds raised.

### Can I revoke token authorities after launch?
Yes. Genesis provides `revokeMintAuthorityV2` and `revokeFreezeAuthorityV2` instructions to permanently revoke authorities.

### What's the difference between Launch Pool and Presale?
**Presale** has a fixed price set upfront. **Launch Pool** discovers price organically—more deposits means higher implied price per token, with proportional distribution to all participants.

### Can I combine multiple launch mechanisms?
Yes. Genesis uses a bucket system where you can add multiple inflow buckets and configure outflow buckets for treasury or vesting.

## Glossary

| Term | Definition |
|------|------------|
| **Genesis Account** | Central coordinator that creates the token and manages all buckets |
| **Bucket** | Modular component that defines token/SOL flow |
| **Inflow Bucket** | Bucket that collects SOL from users |
| **Outflow Bucket** | Bucket that receives funds via end behaviors |
| **Launch Pool** | Deposit-based distribution where price is discovered at close |
| **Presale** | Fixed-price sale at a predetermined rate |
| **Quote Token** | The token users deposit (usually wSOL) |
| **Base Token** | The token being launched and distributed |

## Next Steps

1. **[Getting Started](/smart-contracts/genesis/getting-started)** - Understand the Genesis flow
2. **[JavaScript SDK](/smart-contracts/genesis/sdk/javascript)** - Installation and setup
3. **[Launch Pool](/smart-contracts/genesis/launch-pool)** - Build a proportional distribution launch
4. **[Presale](/smart-contracts/genesis/presale)** - Build a fixed-price sale
