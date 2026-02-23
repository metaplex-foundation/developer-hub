---
title: Programs & Operations
metaTitle: Programs & Operations | Metaplex Skill
description: Detailed breakdown of programs and operations covered by the Metaplex Skill.
keywords:
  - Core
  - Token Metadata
  - Bubblegum
  - Candy Machine
  - Genesis
  - mplx CLI
  - Umi SDK
  - Kit SDK
about:
  - Metaplex programs
  - CLI operations
  - SDK operations
proficiencyLevel: Beginner
---

# Programs & Operations

The Metaplex Skill covers five programs across CLI, Umi SDK, and Kit SDK. This page provides a detailed breakdown of what each program supports and when to use it.

## Program Coverage

| Program | CLI | Umi SDK | Kit SDK |
|---------|-----|---------|---------|
| **Core** | Yes | Yes | — |
| **Token Metadata** | Yes | Yes | Yes |
| **Bubblegum** | Yes | Yes | — |
| **Candy Machine** | Yes | Yes | — |
| **Genesis** | Yes | Yes | — |

## Core

The next-generation NFT standard on Solana. Core NFTs are **87% cheaper** than Token Metadata NFTs and support a plugin system for royalty enforcement, freeze delegates, attributes, and more.

**CLI** (`mplx core`): Create and update collections and assets, manage plugins.

**Umi SDK**: Full programmatic access including fetches by owner/collection/creator, plugin configuration, and delegate management.

## Token Metadata

The original Metaplex NFT standard. Supports fungible tokens, NFTs, Programmable NFTs (pNFTs), and editions.

**CLI** (`mplx tm`): Create fungible tokens, NFTs, pNFTs, and editions. Transfer and burn assets.

**Umi SDK**: Full programmatic access to all Token Metadata operations.

**Kit SDK**: Token Metadata operations using `@solana/kit` with minimal dependencies. Useful when you want to avoid the Umi framework.

## Bubblegum (Compressed NFTs)

Create NFTs at massive scale using Merkle trees for state compression. Compressed NFTs cost a fraction of traditional NFTs after the initial tree creation.

**CLI** (`mplx bg`): Create Merkle trees, mint cNFTs (batch limit ~100), fetch, update, transfer, and burn.

**Umi SDK**: Full programmatic access. Use the SDK for batches larger than ~100 or for DAS API queries.

{% callout type="note" %}
Compressed NFT operations require a DAS-enabled RPC endpoint. Standard Solana RPC endpoints do not support the Digital Asset Standard API needed for cNFT operations.
{% /callout %}

## Candy Machine

Deploy NFT drops with configurable minting rules (guards). Guards control who can mint, when, at what price, and how many.

**CLI** (`mplx cm`): Set up Candy Machine configuration, insert items, and deploy. Minting requires the SDK.

**Umi SDK**: Full programmatic access including minting operations and guard configuration.

## Genesis

Token launch protocol with fair distribution and automatic liquidity graduation to Raydium.

**Umi SDK**: Full programmatic access for creating and managing token launches.

## CLI Capabilities

The `mplx` CLI can handle most Metaplex operations directly without writing code:

| Task | CLI Support |
|------|-------------|
| Create fungible token | Yes |
| Create Core NFT/Collection | Yes |
| Create TM NFT/pNFT | Yes |
| Transfer TM NFTs | Yes |
| Transfer fungible tokens | Yes |
| Transfer Core NFTs | SDK only |
| Upload to Irys | Yes |
| Candy Machine drop | Yes (setup/config/insert — minting requires SDK) |
| Compressed NFTs (cNFTs) | Yes (batch limit ~100, use SDK for larger) |
| Check SOL balance / Airdrop | Yes |
| Query assets by owner/collection | SDK only (DAS API) |
| Token launch (Genesis) | Yes |

## Decision Guide

### NFTs: Core vs Token Metadata

| Choose | When |
|--------|------|
| **Core** | New NFT projects, lower cost, plugins, royalty enforcement |
| **Token Metadata** | Existing TM collections, need editions, pNFTs for legacy compatibility |

### When to Use Compressed NFTs

Use **Bubblegum** when minting thousands or more NFTs at minimal cost. The upfront cost is the Merkle tree creation; after that, each mint costs only the transaction fee.

### When to Use Candy Machine

Use **Core Candy Machine** for NFT drops where you need to control minting rules — allowlists, start/end dates, mint limits, payment tokens, and more.

### Fungible Tokens

Always use **Token Metadata** for fungible tokens.

### Token Launches

Use **Genesis** for token generation events with fair distribution mechanics and automatic Raydium liquidity graduation.

### CLI vs SDK

| Choose | When |
|--------|------|
| **CLI** | Default choice — direct execution, no code needed |
| **Umi SDK** | You need code, or the operation isn't supported by CLI |
| **Kit SDK** | You specifically use `@solana/kit` and want minimal dependencies (Token Metadata only) |
