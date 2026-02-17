---
title: Genesis - Solana Token Launchpad & Launch Platform
metaTitle: Genesis — Solana Token Launchpad for Fair Launches & Token Sales | Metaplex
description: Genesis is an on-chain Solana token launchpad for fair launches, presales, and auctions. Create and distribute SPL tokens with transparent, automated token generation events.
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - token launch
  - token launchpad
  - TGE
  - token generation event
  - fair launch
  - ICO
  - IDO
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
    a: Genesis charges a {% fee product="genesis" config="launchPool" fee="deposit" /%} protocol fee on deposits. There are no upfront costs - you only pay Solana transaction fees plus the protocol fee on funds raised.
  - q: Can I revoke token authorities after launch?
    a: Yes. Genesis provides instructions to revoke mint and freeze authorities, signaling to holders that no additional tokens can be minted.
  - q: What's the difference between Launch Pool and Presale?
    a: Presale has a fixed price set upfront. Launch Pool discovers price organically based on total deposits - more deposits means higher implied price per token.
---

**Genesis** is a Solana token launchpad and smart contract for **Token Generation Events (TGE)**. Run an ICO, IDO, presale, fair launch, or crowdsale with on-chain coordination for SPL token creation, token distribution, and fund collection. {% .lead %}

{% callout title="Choose Your Path" %}
- **No-code launch?** Use the [Metaplex token launchpad](https://www.metaplex.com) to launch a token with no coding required
- **Build your own launchpad?** Use the Genesis SDK to build a custom token launch platform or host a token sale on your own website
- **New to Genesis?** Start with [Getting Started](/smart-contracts/genesis/getting-started) to understand the flow
- **Ready to build?** Jump to [Launch Pool](/smart-contracts/genesis/launch-pool) or [Presale](/smart-contracts/genesis/presale)
{% /callout %}

## What is Genesis?

Genesis is a decentralized token launch platform that provides on-chain infrastructure for launching SPL tokens on Solana. Whether you need to run an ICO, IDO, token presale, or fair launch, Genesis handles:

- **Token creation** with metadata (name, symbol, image)
- **Fund collection** from participants (SOL deposits)
- **Distribution** based on your chosen mechanism
- **Time coordination** for deposit and claim windows

Think of Genesis as a token launchpad smart contract that sits between you (the launcher) and your participants, ensuring fair, transparent, and automated token distribution — a modern on-chain alternative to traditional ICO and IDO platforms.

## Launch Mechanisms

Genesis supports three mechanisms that can be combined:

| Mechanism | Price | Distribution | Best For |
|-----------|-------|--------------|----------|
| **[Launch Pool](/smart-contracts/genesis/launch-pool)** | Discovered at close | Proportional to deposit | Fair launches, community tokens, crowdsales |
| **[Presale](/smart-contracts/genesis/presale)** | Fixed upfront | First-come-first-served | ICOs, token sales, known valuation |
| **[Uniform Price Auction](/smart-contracts/genesis/uniform-price-auction)** | Clearing price | Highest bidders win | IDOs, large raises, institutional interest |

### Which Should I Use?

**Launch Pool** - You want organic price discovery and fair token distribution. Similar to a crowdsale, everyone who deposits gets tokens proportional to their share. No one gets sniped.

**Presale** - You know your valuation and want predictable pricing. Works like a traditional ICO or token sale — set a fixed price and let participants buy until the cap is reached.

**Auction** - You want competitive bidding from larger participants. An IDO-style approach best suited for established projects with institutional interest.

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
| Deposit | {% fee product="genesis" config="launchPool" fee="deposit" /%} of deposit amount |
| Withdraw | {% fee product="genesis" config="launchPool" fee="withdraw" /%} of withdrawal amount |
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
Genesis charges a {% fee product="genesis" config="launchPool" fee="deposit" /%} protocol fee on deposits. There are no upfront costs—you only pay Solana transaction fees plus the protocol fee on funds raised.

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
