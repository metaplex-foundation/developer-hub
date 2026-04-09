---
title: Programs & Operations
metaTitle: Programs & Operations | Metaplex Skill
description: Detailed breakdown of programs and operations covered by the Metaplex Skill.
created: '02-23-2026'
updated: '04-08-2026'
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

The Metaplex Skill covers five programs across CLI, Umi SDK, and Kit SDK. This page provides a detailed breakdown of what each program supports and when to use it. {% .lead %}

## Summary

The Metaplex Skill provides AI agents with knowledge of five Metaplex programs and their available tooling across CLI, Umi SDK, and Kit SDK.

- All five programs (Core, Token Metadata, Bubblegum, Candy Machine, Genesis) support both CLI and Umi SDK
- Kit SDK is available for Token Metadata only
- The `mplx` CLI handles most operations without writing code
- Use this page to determine which program and tooling approach fits your task

## Program Coverage

| Program | CLI | Umi SDK | Kit SDK |
|---------|-----|---------|---------|
| **Core** | Yes | Yes | — |
| **Token Metadata** | Yes | Yes | Yes |
| **Bubblegum** | Yes | Yes | — |
| **Candy Machine** | Yes | Yes | — |
| **Genesis** | Yes | Yes | — |

## Core

The next-generation NFT standard on Solana. Core NFTs are significantly cheaper than Token Metadata NFTs and support a plugin system for royalty enforcement, freeze delegates, attributes, and more.

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

Token launch protocol with fair distribution and automatic liquidity graduation to Raydium. Supports two launch types: **launchpool** (48-hour deposit window with proportional distribution) and **bonding curve** (instant trading with automatic Raydium CPMM graduation).

**CLI** (`mplx genesis`): Create and manage token launches. The `genesis launch create` command provides an all-in-one API flow for both launchpool and bonding curve launches — including optional [agent integration](/agents/mint-agent) via `--agentMint`.

**Umi SDK**: Full programmatic access for creating and managing token launches, including bonding curve configuration and agent token linking.

## CLI Capabilities

The `mplx` CLI can handle most Metaplex operations directly without writing code:

| Task | CLI Support |
|------|-------------|
| Create fungible token | Yes |
| Create Core NFT/Collection | Yes |
| Create TM NFT/pNFT | Yes |
| Transfer TM NFTs | Yes |
| Transfer fungible tokens | Yes |
| Transfer Core NFTs | Yes |
| Upload to Irys | Yes |
| Candy Machine drop | Yes (setup/config/insert — minting requires SDK) |
| Compressed NFTs (cNFTs) | Yes (batch limit ~100, use SDK for larger) |
| Check SOL balance / Airdrop | Yes |
| Query assets by owner/collection | SDK only (DAS API) |
| Token launch (Genesis) | Yes (launchpool and bonding curve) |
| Agent token launch | Yes (`--agentMint` flag) |
| Burn Core NFTs | Yes |
| Update Core NFT metadata | Yes |

## Decision Guide

Use the following guidance to choose the right program and tooling for your task.

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

## Notes

- Compressed NFT (Bubblegum) operations require a DAS-enabled RPC endpoint; standard Solana RPC does not support the Digital Asset Standard API
- Candy Machine minting requires the SDK — the CLI handles setup, configuration, and item insertion only
- Querying assets by owner or collection requires the DAS API (SDK only)
- Kit SDK support is limited to Token Metadata; all other programs use Umi
