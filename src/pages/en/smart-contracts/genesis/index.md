---
title: Genesis - Solana Token Launchpad & Launch Platform
metaTitle: Genesis — Solana Token Launchpad for Fair Launches & Token Sales | Metaplex
description: Genesis is an on-chain Solana token launchpad for fair launches, presales, and auctions. Create and distribute SPL tokens with transparent, automated token generation events.
created: '01-15-2025'
updated: '04-02-2026'
keywords:
  - token launch
  - token launchpad
  - TGE
  - token generation event
  - fair launch
  - token offering
  - token sale
  - crowdsale
  - launch pool
  - presale
  - token sale platform
  - Solana token
  - SPL token
  - token distribution
  - token offering
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
    a: Genesis uses a bonding curve fee model. Pre-bond swaps have a 0.50% protocol fee and 0.60% creator revenue. Post-bond trading has a 0.40% protocol fee, 0.60% creator revenue, 0.17% LP fees, and 0.08% Raydium fee. Launch pool deposits are free (0% fee) with a 2% user withdraw fee.
  - q: Can I revoke token authorities after launch?
    a: Yes. Genesis provides instructions to revoke mint and freeze authorities, signaling to holders that no additional tokens can be minted.
  - q: What's the difference between Launch Pool and Presale?
    a: Presale has a fixed price set upfront. Launch Pool discovers price organically based on total deposits - more deposits means higher implied price per token.
  - q: How does the bonding curve work?
    a: The bonding curve handles pre-bond price discovery and collects a 0.50% protocol fee and 0.60% creator revenue on swaps. When the graduating market cap is reached, liquidity automatically migrates to a Raydium pool. Post-bond trading has a 0.40% protocol fee, 0.60% creator revenue, 0.17% LP fees, and 0.08% Raydium fee.
---

**Genesis** is a Solana token launchpad and smart contract for **Token Generation Events (TGE)**. Run a presale, fair launch, auction, or crowdsale with on-chain coordination for SPL token creation, token distribution, and fund collection. {% .lead %}

{% callout title="Choose Your Path" %}
- **No-code launch?** Use the [Metaplex token launchpad](https://www.metaplex.com) to launch a token with no coding required
- **Quick launch?** Use the bonding curve for automated price discovery and graduation to Raydium. See [Protocol Fees](#protocol-fees) for the fee breakdown
- **Build your own launchpad?** Use the Genesis SDK to build a custom token launch platform or host a token sale on your own website
- **New to Genesis?** Start with [Getting Started](/smart-contracts/genesis/getting-started) to understand the flow
- **Ready to build?** Jump to [Launch Pool](/smart-contracts/genesis/launch-pool) or [Presale](/smart-contracts/genesis/presale)
{% /callout %}

## What is Genesis?

Genesis is a decentralized token launch platform that provides on-chain infrastructure for launching SPL tokens on Solana. Whether you need to run a token sale, presale, or fair launch, Genesis handles:

- **Token creation** with metadata (name, symbol, image)
- **Fund collection** from participants (SOL deposits)
- **Distribution** based on your chosen mechanism
- **Time coordination** for deposit and claim windows

Think of Genesis as a token launchpad smart contract that sits between you (the launcher) and your participants, ensuring fair, transparent, and automated token distribution — a modern on-chain alternative to centralized token sale platforms.

## Launch Mechanisms

Genesis supports three mechanisms that can be combined:

| Mechanism | Price | Distribution | Best For |
|-----------|-------|--------------|----------|
| **[Launch Pool](/smart-contracts/genesis/launch-pool)** | Discovered at close | Proportional to deposit | Fair launches, community tokens, crowdsales |
| **[Presale](/smart-contracts/genesis/presale)** | Fixed upfront | First-come-first-served | Token sales, known valuation |
| **[Uniform Price Auction](/smart-contracts/genesis/uniform-price-auction)** | Clearing price | Highest bidders win | Large raises, institutional interest |

### Which Should I Use?

**Launch Pool** - You want organic price discovery and fair token distribution. Similar to a crowdsale, everyone who deposits gets tokens proportional to their share. No one gets sniped.

**Presale** - You know your valuation and want predictable pricing. Set a fixed price and let participants buy until the cap is reached. In Genesis, "presale" means tokens are sold immediately before initial trading — buyers receive tokens directly, not a future right to receive them.

**Auction** - You want competitive bidding from larger participants. A structured auction approach best suited for established projects with institutional interest.

## Core Concepts

### Bonding Curve

Every Genesis launch uses a **bonding curve** that manages price discovery and graduation to a Raydium liquidity pool. The bonding curve handles the pre-bond trading phase, collects protocol fees, and automatically migrates liquidity when the graduating market cap is reached.

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

Genesis uses a bonding curve fee model. Fees differ between the pre-bond phase (before graduation), post-bond trading, and the launch pool mechanism.

### Bonding Curve

| Fee | Amount |
|-----|--------|
| Protocol fee | 0.50% |
| Creator revenue | 0.60% |

### Post-Bond Trading

| Component | Amount |
|-----------|--------|
| Protocol fee | 0.40% |
| Creator revenue | 0.60% |
| LP fees | 0.17% |
| Raydium fee | 0.08% |

### Launch Pool

| Fee | Amount |
|-----|--------|
| User deposit fee | 0% |
| User withdraw fee | 2% |
| Creator withdraw fee | 5%* |

*This fee only applies when creators withdraw liquidity.

### Launch Pool Trading

| Parameter | Value |
|-----------|-------|
| Liquidity requirement | 20% |
| Lock period | 1 year with quarterly unlock |
| Protocol fee | 0.50% |
| LP fees | 0.42% |
| Raydium fee | 0.08% |

## Program Information

| Network | Program ID |
|---------|------------|
| Mainnet | `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B` |
| Devnet | `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B` |

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
Genesis uses a bonding curve fee model. Pre-bond swaps have a 0.50% protocol fee and 0.60% creator revenue. Post-bond trading has a 0.40% protocol fee, 0.60% creator revenue, 0.17% LP fees, and 0.08% Raydium fee. Launch pool deposits are free (0% fee) with a 2% user withdraw fee.

### Can I revoke token authorities after launch?
Yes. Genesis provides the `revokeV2` instruction to permanently revoke mint and/or freeze authority.

### What's the difference between Launch Pool and Presale?
**Presale** has a fixed price set upfront. **Launch Pool** discovers price organically—more deposits means higher implied price per token, with proportional distribution to all participants.

### How does the bonding curve work?
The bonding curve handles pre-bond price discovery and collects a 0.50% protocol fee and 0.60% creator revenue on swaps. When the graduating market cap is reached, liquidity automatically migrates to a Raydium pool. Post-bond trading has a 0.40% protocol fee, 0.60% creator revenue, 0.17% LP fees, and 0.08% Raydium fee. See [Protocol Fees](#protocol-fees) for the full breakdown.

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
| **Bonding Curve** | Pre-bond pricing mechanism that discovers price through swaps and automatically graduates liquidity to Raydium when the market cap target is reached |
| **Base Token** | The token being launched and distributed |

## Next Steps

1. **[Getting Started](/smart-contracts/genesis/getting-started)** - Understand the Genesis flow
2. **[JavaScript SDK](/smart-contracts/genesis/sdk/javascript)** - Installation and setup
3. **[Launch Pool](/smart-contracts/genesis/launch-pool)** - Build a proportional distribution launch
4. **[Presale](/smart-contracts/genesis/presale)** - Build a fixed-price sale
