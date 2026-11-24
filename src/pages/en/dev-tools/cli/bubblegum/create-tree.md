---
title: Create Tree
metaTitle: Create Merkle Tree | Metaplex CLI
description: Create a Bubblegum V2 Merkle tree for compressed NFTs with the Metaplex CLI mplx bg tree create command, including canopy depth options such as --canopyDepth 0.
keywords:
  - mplx cli
  - bg tree create
  - Bubblegum V2
  - merkle tree
  - canopy depth
  - compressed NFTs
  - cNFT tree
about:
  - Bubblegum V2 Merkle tree creation
  - Metaplex CLI
proficiencyLevel: Beginner
created: '02-23-2026'
updated: '10-28-2026'
---

## Summary

The `mplx bg tree create` command creates a [Bubblegum V2](/smart-contracts/bubblegum-v2) [Merkle tree](/smart-contracts/bubblegum-v2/concurrent-merkle-trees) that stores your compressed NFTs (cNFTs). You must create a tree before minting any compressed NFTs into it.

- Creates a tree interactively with `--wizard`, or directly with `--maxDepth`, `--maxBufferSize`, and `--canopyDepth`
- Accepts any integer `--canopyDepth`, including `0` for a tree with no canopy (CLI 0.4.5 and later)
- Warns, but still creates the tree, when the flag combination is not one of the recommended configurations
- Tree size and canopy depth are fixed at creation and cannot be changed afterward

{% callout type="note" %}
This creates a **Bubblegum V2** tree. V2 trees are not compatible with V1 and use [Metaplex Core collections](/smart-contracts/core/collections).
{% /callout %}

## Basic Usage

The command runs either as an interactive wizard or with all three tree-size flags passed directly.

### Interactive Wizard (Recommended)

```bash {% title="Create a tree with the wizard" %}
mplx bg tree create --wizard
```

### Direct Creation

```bash {% title="Create a tree with explicit flags" %}
mplx bg tree create --maxDepth 14 --maxBufferSize 64 --canopyDepth 8 --name "my-tree"
```

Direct creation requires `--maxDepth`, `--maxBufferSize`, and `--canopyDepth` together. If any of the three is missing, the command exits with `You must either use --wizard or provide all required flags: --maxDepth, --maxBufferSize, --canopyDepth`.

## Options

The tree-size flags cannot be combined with `--wizard`.

| Option | Description |
|--------|-------------|
| `--wizard` | Use interactive wizard to create tree |
| `--maxDepth <value>` | Maximum depth of the tree (determines max NFTs) |
| `--maxBufferSize <value>` | Maximum buffer size for concurrent changes |
| `--canopyDepth <value>` | Number of upper tree levels cached on-chain. `0` is valid and creates a tree with no canopy |
| `--public` | Make tree public (allows anyone to mint NFTs) |
| `--name <value>` | Short name for easy reference |

## Global Flags

These flags are shared by all `mplx` transaction commands and control the config, signer, and cluster used.

| Flag | Description |
|------|-------------|
| `-c, --config <value>` | Path to config file. Default is `~/.config/mplx/config.json` |
| `-k, --keypair <value>` | Path to keypair file or ledger (e.g., `usb://ledger?key=0`) |
| `-p, --payer <value>` | Path to payer keypair file or ledger |
| `-r, --rpc <value>` | RPC URL for the cluster |
| `--commitment <option>` | Commitment level: `processed`, `confirmed`, or `finalized` |
| `--json` | Format output as JSON |
| `--log-level <option>` | Logging level: `debug`, `warn`, `error`, `info`, or `trace` (default: `info`) |

## Recommended Tree Configurations

The CLI ships seven recommended configurations, which the wizard offers as choices:

| Max NFTs | Max Depth | Buffer Size | Canopy Depth | Proof Bytes per Tx | Estimated Cost |
|----------|-----------|-------------|--------------|--------------------|----------------|
| 16,384 | 14 | 64 | 8 | 192 | ~0.34 SOL |
| 65,536 | 16 | 64 | 10 | 192 | ~0.71 SOL |
| 262,144 | 18 | 64 | 12 | 192 | ~2.10 SOL |
| 1,048,576 | 20 | 1024 | 13 | 224 | ~8.50 SOL |
| 16,777,216 | 24 | 2048 | 15 | 288 | ~26.12 SOL |
| 67,108,864 | 26 | 2048 | 17 | 288 | ~70.82 SOL |
| 1,073,741,824 | 30 | 2048 | 17 | 416 | ~72.65 SOL |

Any other combination of flags still creates a tree, but the CLI first prints `This configuration is not in our recommended list. Use --wizard to see recommended configurations.`

## Tree Without a Canopy (`--canopyDepth 0`)

Passing `--canopyDepth 0` creates a tree that caches no proof nodes on-chain. This gives the smallest tree account and the lowest rent. The trade-off is that every transfer, burn, delegate, or update must send the full proof (`maxDepth` × 32 bytes). That uses more transaction space and makes it harder to combine Bubblegum instructions with other programs in one transaction. The [Merkle Tree Canopy](/smart-contracts/bubblegum-v2/merkle-tree-canopy) page compares costs across canopy depths.

```bash {% title="Create a tree with no canopy" %}
mplx bg tree create --maxDepth 14 --maxBufferSize 64 --canopyDepth 0 --name "no-canopy-tree"
```

{% callout type="note" %}
`--canopyDepth 0` requires `@metaplex-foundation/cli` 0.4.5 or later. A zero-canopy tree is not one of the recommended configurations, so the CLI prints the "not in our recommended list" warning before creating it.
{% /callout %}

## Examples

These are the most common ways to create a tree:

1. Create a tree using the wizard:

```bash {% title="Wizard" %}
mplx bg tree create --wizard
```

1. Create a small tree for testing:

```bash {% title="Small test tree" %}
mplx bg tree create --maxDepth 14 --maxBufferSize 64 --canopyDepth 8 --name "test-tree"
```

1. Create a public tree (anyone can mint):

```bash {% title="Public tree" %}
mplx bg tree create --maxDepth 14 --maxBufferSize 64 --canopyDepth 8 --public --name "public-tree"
```

## Tree Creation Output

A successful run prints the tree address, its parameters, and explorer links:

```text {% title="Example output" %}
--------------------------------
Tree Created Successfully!

Tree Name: my-collection-tree
Tree Address: 9hRvTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Max Depth: 14
Max Buffer Size: 64
Canopy Depth: 8
Public Tree: No
Max NFTs: 16,384

Transaction: 5xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Explorer: https://solscan.io/tx/5xxx...
Tree Explorer: https://solscan.io/account/9hRv...
--------------------------------
```

## Understanding Tree Parameters

Three parameters set a tree's capacity, how many changes it can take at once, and how much proof data each transaction needs:

- **Max Depth**: Determines the maximum number of NFTs: `2^maxDepth` (Depth 14 = 16,384 NFTs)
- **Max Buffer Size**: Controls how many concurrent modifications can happen
- **Canopy Depth**: Stores the top levels of the tree on-chain, so each transaction only sends `maxDepth - canopyDepth` proof nodes. `0` stores none

## Quick Reference

| Item | Value |
|------|-------|
| Command | `mplx bg tree create` |
| Required (direct mode) | `--maxDepth`, `--maxBufferSize`, `--canopyDepth` |
| Minimum `--canopyDepth` | `0` (CLI 0.4.5+) |
| Tree version | [Bubblegum V2](/smart-contracts/bubblegum-v2) only, not Bubblegum V1 |
| Next step | [Create a compressed NFT](/dev-tools/cli/bubblegum/create-cnft) |
| Source | [GitHub: metaplex-foundation/cli](https://github.com/metaplex-foundation/cli) |

## Notes

- Tree names must be unique per network (devnet/mainnet)
- Tree names can contain letters, numbers, hyphens, underscores, and spaces (1-50 characters)
- The rent cost is paid once when creating the tree
- Trees cannot be resized after creation, and the canopy depth cannot be changed either
- CLI versions before 0.4.5 reject `--canopyDepth 0`; run `mplx --version` to check yours
- **Warning**: Public trees allow anyone to mint NFTs - use with caution
