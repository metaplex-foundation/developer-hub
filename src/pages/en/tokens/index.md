---
title: Solana Tokens
metaTitle: Create & Launch Tokens on Solana | Token Generation Event (TGE) | Metaplex
description: Create, launch, and manage fungible tokens on Solana. Build token generation events (TGE), fair launches, and token sales using Metaplex Genesis and SDKs.
tableOfContents: false
---

Create, launch, and manage fungible tokens on Solana using Metaplex SDKs. {% .lead %}

{% product-card-grid category="Tokens" /%}

## Token Launch & Creation on Solana

Metaplex provides the complete infrastructure for launching tokens on Solana. Whether you're creating a simple SPL token or orchestrating a full token generation event (TGE), our tools handle everything from token creation to fair launch distribution.

### Token Generation Events (TGE)

A Token Generation Event is the process of creating and distributing a new cryptocurrency token. On Solana, Metaplex Genesis provides the smart contract infrastructure for running TGEs with multiple launch mechanisms:

- **Launch Pools** - Users deposit SOL during a window and receive tokens proportional to their share. This creates organic price discovery and prevents sniping.
- **Priced Sales** - Fixed-price token sales with optional caps and wallet gates. Predictable outcomes with first-come, first-served dynamics.
- **Uniform Price Auctions** - Time-based auctions where all winners receive tokens at the clearing price.

### Why Launch on Solana with Metaplex?

Solana's high throughput and low transaction costs make it ideal for token launches. Combined with Metaplex Genesis, you get:

- **On-chain transparency** - All launch mechanics are verifiable on-chain
- **Fair distribution** - Time-based windows prevent front-running and bot manipulation
- **Flexible configuration** - Customize deposit periods, claim windows, and distribution rules
- **Built-in metadata** - Tokens include rich metadata (name, symbol, image) from day one

### Getting Started

New to token creation? Start with these guides:

1. **[Create a Token](/tokens/create-a-token)** - Create a basic SPL token with metadata
2. **[Launch a Token](/tokens/launch-token)** - Run a full token launch with Genesis Launch Pools
3. **[Mint Tokens](/tokens/mint-tokens)** - Mint additional supply to your token

For advanced launch configurations, see the [Genesis smart contract documentation](/smart-contracts/genesis).
