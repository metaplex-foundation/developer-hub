---
title: Fungible Tokens
metaTitle: Fungible Tokens | Metaplex
description: Learn how to create and manage fungible tokens on Solana using Metaplex SDKs.
---

Create and manage fungible tokens (SPL tokens) on Solana using Metaplex SDKs. {% .lead %}

## Overview

Fungible tokens are interchangeable digital assets where each unit is identical to another. Common examples include cryptocurrencies, loyalty points, and in-game currencies. On Solana, fungible tokens are created using the SPL Token program with metadata managed by the Token Metadata program.

## What You Can Do

This section provides beginner-friendly guides for common token operations:

- **[Create a Token](/tokens/create-a-token)** - Create a new fungible token with custom metadata
- **[Read Token Data](/tokens/read-token)** - Fetch token information from the blockchain or DAS API
- **[Mint Tokens](/tokens/mint-tokens)** - Mint additional tokens to increase supply
- **[Transfer Tokens](/tokens/transfer-a-token)** - Transfer tokens between wallets
- **[Update Token Metadata](/tokens/update-token)** - Update token name, symbol, or image
- **[Burn Tokens](/tokens/burn-tokens)** - Permanently remove tokens from circulation

## Prerequisites

Before getting started, make sure you have:

- Node.js 16+ installed
- A Solana wallet with some SOL for transaction fees
- Basic JavaScript/TypeScript knowledge

## Quick Start

Install the required packages:

```bash
npm install @metaplex-foundation/mpl-token-metadata @metaplex-foundation/mpl-toolbox @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults
```

Then follow the [Create a Token](/tokens/create-a-token) guide to create your first fungible token.

## Learn More

For more advanced token functionality, check out:

- [Token Metadata Program](/token-metadata) - Full documentation for the Token Metadata program
- [MPL Toolbox](https://github.com/metaplex-foundation/mpl-toolbox) - Low-level token operations
