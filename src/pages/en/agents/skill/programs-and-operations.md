---
title: Programs & Operations
metaTitle: Programs & Operations | Metaplex Skill
description: Detailed breakdown of programs and operations covered by the Metaplex Skill.
created: '02-23-2026'
updated: '04-08-2026'
keywords:
  - Agent Registry
  - Core
  - Token Metadata
  - Bubblegum
  - Candy Machine
  - Genesis
  - bonding curve
  - mplx CLI
  - Umi SDK
  - Kit SDK
about:
  - Metaplex programs
  - CLI operations
  - SDK operations
proficiencyLevel: Beginner
---

The Metaplex Skill covers six programs across CLI, Umi SDK, and Kit SDK. This page provides a detailed breakdown of what each program supports and when to use it. {% .lead %}

## Summary

The Metaplex Skill provides AI agents with knowledge of six Metaplex programs and their available tooling across CLI, Umi SDK, and Kit SDK.

- All six programs (Agent Registry, Genesis, Core, Token Metadata, Bubblegum, Candy Machine) support both CLI and Umi SDK
- Kit SDK is available for Token Metadata only
- The `mplx` CLI handles most operations without writing code
- Use this page to determine which program and tooling approach fits your task

## Program Coverage

The following table shows which tooling approaches are available for each program.

| Program | CLI | Umi SDK | Kit SDK |
|---------|-----|---------|---------|
| **Agent Registry** | Yes | Yes | — |
| **Genesis** | Yes | Yes | — |
| **Core** | Yes | Yes | — |
| **Token Metadata** | Yes | Yes | Yes |
| **Bubblegum** | Yes | Yes | — |
| **Candy Machine** | Yes | Yes | — |

## Agent Registry

The [Agent Registry](/agents) provides on-chain agent identity, wallets, and execution delegation for MPL Core assets.

**CLI** (`mplx agents`): Register agent identity, delegate and revoke execution, fetch agent data, and link a Genesis token to an agent. For the full agent token creation flow, use `mplx genesis launch create --agentMint --agentSetToken` to launch and link in one step.

**Umi SDK**: Full programmatic access including the Mint Agent API (`mintAndSubmitAgent`) that creates a Core asset and registers identity in a single transaction. Supports `registerIdentityV1` for existing assets, execution delegation, and the full [agent token creation](/agents/create-agent-token) flow — launching a token via Genesis and linking it with `setAgentTokenV1`.

{% callout type="note" %}
Every Core asset has a built-in wallet (Asset Signer PDA) via Core's Execute hook. The Agent Registry adds discoverable identity records and lets owners delegate an off-chain executive to operate the agent.
{% /callout %}

## Core

The next-generation NFT standard on Solana. Core NFTs are significantly cheaper than Token Metadata NFTs and support a plugin system for royalty enforcement, freeze delegates, attributes, and more.

**CLI** (`mplx core`): Create and update collections and assets, manage plugins.

**Umi SDK**: Full programmatic access including fetches by owner/collection/creator, plugin configuration, and delegate management.

## Token Metadata

The original Metaplex NFT standard. Supports fungible tokens, NFTs, Programmable NFTs (pNFTs), and editions.

**CLI** (`mplx tm`): Create NFTs and pNFTs. Transfer and update assets. For fungible tokens, use `mplx toolbox token`.

**Umi SDK**: Full programmatic access to all Token Metadata operations.

**Kit SDK**: Token Metadata operations using `@solana/kit` with minimal dependencies. Useful when you want to avoid the Umi framework.

## Bubblegum (Compressed NFTs)

[Bubblegum](/smart-contracts/bubblegum-v2) lets you create NFTs at massive scale using Merkle trees for state compression. Compressed NFTs cost a fraction of traditional NFTs after the initial tree creation.

**CLI** (`mplx bg`): Create Merkle trees, mint cNFTs (batch limit ~100), fetch, update, transfer, and burn.

**Umi SDK**: Full programmatic access. Use the SDK for batches larger than ~100 or for DAS API queries.

{% callout type="note" %}
Compressed NFT operations require a DAS-enabled RPC endpoint. Standard Solana RPC endpoints do not support the Digital Asset Standard API needed for cNFT operations.
{% /callout %}

## Candy Machine

[Core Candy Machine](/smart-contracts/core-candy-machine) deploys NFT drops with configurable minting rules (guards). Guards control who can mint, when, at what price, and how many.

**CLI** (`mplx cm`): Set up Candy Machine configuration, insert items, and deploy. Minting requires the SDK.

**Umi SDK**: Full programmatic access including minting operations and guard configuration.

## Genesis

[Genesis](/smart-contracts/genesis) is a token launch protocol with fair distribution and automatic liquidity graduation to Raydium. It supports two launch types: **launchpool** (configurable allocations with a 48-hour deposit window and optional team vesting) and **bonding curve** (instant constant-product AMM where trading starts immediately and auto-graduates to Raydium CPMM on sell-out).

**CLI** (`mplx genesis`): Create and manage token launches via launchpool or bonding curve. Supports creator fees, first buy, and agent mode for bonding curve launches.

**Umi SDK**: Full programmatic access via the Launch API (`createAndRegisterLaunch`). Includes bonding curve swap integration with state fetching, lifecycle helpers, quote calculation with slippage, and swap execution. Also supports agent launch flows where a Genesis token is linked to an Agent Registry identity.

## CLI Capabilities

The `mplx` CLI can handle most Metaplex operations directly without writing code:

| Task | CLI Support |
|------|-------------|
| Register agent identity | Yes (`mplx agents register`) |
| Register executive profile | Yes (`mplx agents executive register`) |
| Delegate / revoke execution | Yes (`mplx agents executive delegate` / `revoke`) |
| Fetch agent data | Yes (`mplx agents fetch`) |
| Set agent token (Genesis link) | Yes (`mplx agents set-agent-token`, requires asset-signer mode) |
| Create fungible token | Yes (`mplx toolbox token create`) |
| Create Core NFT/Collection | Yes (`mplx core`) |
| Create TM NFT/pNFT | Yes (`mplx tm create`) |
| Transfer TM NFTs | Yes (`mplx tm transfer`) |
| Transfer fungible tokens | Yes (`mplx toolbox token transfer`) |
| Transfer Core NFTs | Yes (`mplx core asset transfer`) |
| Upload to storage | Yes (`mplx toolbox storage upload`) |
| Candy Machine drop | Yes (setup/config/insert — minting requires SDK) |
| Compressed NFTs (cNFTs) | Yes (batch limit ~100, use SDK for larger) |
| Execute (asset-signer wallets) | Yes (`mplx core asset execute`) |
| Check SOL balance / Airdrop | Yes (`mplx toolbox sol`) |
| Query assets by owner/collection | SDK only (DAS API) |
| Token launch — launchpool (Genesis) | Yes (`mplx genesis launch create`) |
| Token launch — bonding curve (Genesis) | Yes (`mplx genesis launch create --launchType bonding-curve`) |
| Agent token launch (Genesis + link) | Yes (`mplx genesis launch create --agentMint --agentSetToken`) |

## Decision Guide

Use the following guidance to choose the right program and tooling for your task.

### Autonomous Agents

Use **[Agent Registry](/agents)** to register on-chain identity and execution delegation for MPL Core assets. The Mint Agent API (`mintAndSubmitAgent`) creates the Core asset and registers identity in a single transaction. For existing assets, use `mplx agents register <asset> --use-ix` (CLI) or `registerIdentityV1` (SDK). Agents can [create and link an agent token](/agents/create-agent-token) by launching via Genesis and linking it with `setAgentTokenV1`.

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

Use **[Genesis](/smart-contracts/genesis)** for token generation events with fair distribution and automatic Raydium liquidity graduation. Two launch types are available:

- **Launchpool** (default) — Configurable allocations with a 48-hour deposit window and optional team vesting support.
- **Bonding curve** — Instant constant-product AMM where trading starts immediately. Supports creator fees, first buy, and agent mode. Auto-graduates to Raydium CPMM on sell-out.

### Asset as Agent / Vault / Wallet (Execute)

Use **Core Execute** when an asset (NFT, agent, vault) needs to hold SOL or tokens, transfer funds, sign transactions, or own other assets. Every Core asset has a signer PDA that can act as an autonomous wallet.

### CLI vs SDK

| Choose | When |
|--------|------|
| **CLI** | Default choice — direct execution, no code needed |
| **Umi SDK** | You need code, or the operation isn't supported by CLI |
| **Kit SDK** | You specifically use `@solana/kit` and want minimal dependencies (Token Metadata only) |

## Quick Reference

| Tool | Package |
|------|---------|
| CLI | [`@metaplex-foundation/cli`](https://github.com/metaplex-foundation/cli) (`mplx`) |
| Umi SDK | [`@metaplex-foundation/umi`](https://github.com/metaplex-foundation/umi) |
| Agent Registry SDK | [`@metaplex-foundation/mpl-agent-registry`](https://github.com/metaplex-foundation/mpl-agent-registry) |
| Core SDK | [`@metaplex-foundation/mpl-core`](https://github.com/metaplex-foundation/mpl-core) |
| Token Metadata SDK | [`@metaplex-foundation/mpl-token-metadata`](https://github.com/metaplex-foundation/mpl-token-metadata) |
| Bubblegum SDK | [`@metaplex-foundation/mpl-bubblegum`](https://github.com/metaplex-foundation/mpl-bubblegum) |
| Candy Machine SDK | [`@metaplex-foundation/mpl-core-candy-machine`](https://github.com/metaplex-foundation/mpl-core-candy-machine) |
| Genesis SDK | [`@metaplex-foundation/genesis`](https://github.com/metaplex-foundation/genesis) |
| Kit SDK (TM only) | [`@metaplex-foundation/mpl-token-metadata-kit`](https://github.com/metaplex-foundation/mpl-token-metadata) |

## Notes

- Compressed NFT (Bubblegum) operations require a DAS-enabled RPC endpoint; standard Solana RPC does not support the Digital Asset Standard API
- Candy Machine minting requires the SDK — the CLI handles setup, configuration, and item insertion only
- Querying assets by owner or collection requires the DAS API (SDK only)
- Kit SDK support is limited to Token Metadata; all other programs use Umi
- Setting an agent token (`setAgentTokenV1`) requires asset-signer mode for the Core asset
- Bonding curve launches auto-graduate to Raydium CPMM when all tokens are sold
