---
title: Bubblegum Overview
metaTitle: Bubblegum V2 (Compressed NFTs) | Metaplex CLI
description: Create and manage compressed NFTs using the Bubblegum V2 program
---

# Bubblegum (Compressed NFTs)

{% callout type="note" %}
These CLI commands are for **Bubblegum V2** only. Bubblegum V2 uses [Metaplex Core collections](/smart-contracts/core/collections) and is not compatible with Bubblegum V1 trees or Token Metadata collections.
{% /callout %}

Bubblegum is Metaplex's compressed NFT (cNFT) program that allows you to create NFTs at a fraction of the cost of traditional NFTs. By using concurrent Merkle trees for state compression, compressed NFTs can be minted just the transaction costs after the initial tree creation cost.

## Key Concepts

### Merkle Trees
Compressed NFTs are stored in Merkle trees rather than individual on-chain accounts. You must create a tree before minting any compressed NFTs. Tree size determines:
- Maximum number of NFTs that can be stored
- Upfront rent cost (paid once when creating the tree)
- Proof size required for operations

### Collections
Bubblegum V2 uses [Metaplex Core collections](/smart-contracts/core/collections) (not Token Metadata collections). Create a Core collection first:

```bash
mplx core collection create --wizard
```

### RPC Requirements

Compressed NFT operations require an RPC endpoint that supports the [DAS (Digital Asset Standard) API](/rpc-providers#metaplex-das-api). Standard Solana RPC endpoints do not support DAS and will not work for fetching, updating, transferring, or burning compressed NFTs.

## Command Structure

All Bubblegum commands follow this pattern:

```bash
mplx bg <resource> <command> [options]
```

### Available Commands

**Tree Management**
- `mplx bg tree create` - Create a new Merkle tree
- `mplx bg tree list` - List all saved trees

**NFT Operations**
- `mplx bg nft create` - Mint a compressed NFT
- `mplx bg nft fetch` - Fetch NFT data and merkle proof
- `mplx bg nft update` - Update NFT metadata
- `mplx bg nft transfer` - Transfer NFT to new owner
- `mplx bg nft burn` - Permanently destroy NFT

## Quick Start

1. Configure a DAS-enabled RPC:
```bash
mplx config rpcs add <name> <url>
```

2. Create a Merkle tree:
```bash
mplx bg tree create --wizard
```

3. Create a collection (optional but recommended):
```bash
mplx core collection create --wizard
```

4. Mint compressed NFTs:
```bash
mplx bg nft create my-tree --wizard
```

## Authority Model

| Operation | Required Authority |
|-----------|-------------------|
| Create NFT | Tree authority (or anyone if tree is public) |
| Update NFT | Tree authority OR Collection update authority |
| Transfer NFT | Current owner OR delegate |
| Burn NFT | Current owner OR delegate |

## Next Steps

- [Create a Merkle Tree](/dev-tools/cli/bubblegum/create-tree)
- [Create Compressed NFT](/dev-tools/cli/bubblegum/create-cnft)
- [Fetch Compressed NFT](/dev-tools/cli/bubblegum/fetch-cnft)
