---
title: Create Tree
metaTitle: Create Merkle Tree | Metaplex CLI
description: Create a Merkle tree for compressed NFTs
---

The `mplx bg tree create` command creates a Merkle tree that will store your compressed NFTs. You must create a tree before minting any compressed NFTs.

{% callout type="note" %}
This creates a **Bubblegum V2** tree. V2 trees are not compatible with V1 and use [Metaplex Core collections](/smart-contracts/core/collections).
{% /callout %}

## Basic Usage

### Interactive Wizard (Recommended)
```bash
mplx bg tree create --wizard
```

### Direct Creation
```bash
mplx bg tree create --maxDepth 14 --maxBufferSize 64 --canopyDepth 8 --name "my-tree"
```

## Options

| Option | Description |
|--------|-------------|
| `--wizard` | Use interactive wizard to create tree |
| `--maxDepth <value>` | Maximum depth of the tree (determines max NFTs) |
| `--maxBufferSize <value>` | Maximum buffer size for concurrent changes |
| `--canopyDepth <value>` | Canopy depth for verification optimization |
| `--public` | Make tree public (allows anyone to mint NFTs) |
| `--name <value>` | Short name for easy reference |

## Global Flags

| Flag | Description |
|------|-------------|
| `-c, --config <value>` | Path to config file. Default is `~/.config/mplx/config.json` |
| `-k, --keypair <value>` | Path to keypair file or ledger (e.g., `usb://ledger?key=0`) |
| `-r, --rpc <value>` | RPC URL for the cluster |
| `--json` | Format output as JSON |

## Tree Configurations

The CLI provides recommended configurations optimized for different collection sizes:

| Max NFTs | Max Depth | Buffer Size | Canopy Depth | Estimated Cost |
|----------|-----------|-------------|--------------|----------------|
| 16,384 | 14 | 64 | 8 | ~0.34 SOL |
| 65,536 | 16 | 64 | 10 | ~0.71 SOL |
| 262,144 | 18 | 64 | 12 | ~2.10 SOL |
| 1,048,576 | 20 | 1024 | 13 | ~8.50 SOL |
| 16,777,216 | 24 | 2048 | 15 | ~26.12 SOL |

## Examples

1. Create a tree using the wizard:
```bash
mplx bg tree create --wizard
```

2. Create a small tree for testing:
```bash
mplx bg tree create --maxDepth 14 --maxBufferSize 64 --canopyDepth 8 --name "test-tree"
```

3. Create a public tree (anyone can mint):
```bash
mplx bg tree create --maxDepth 14 --maxBufferSize 64 --canopyDepth 8 --public --name "public-tree"
```

## Output

```
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

- **Max Depth**: Determines the maximum number of NFTs: `2^maxDepth` (Depth 14 = 16,384 NFTs)
- **Max Buffer Size**: Controls how many concurrent modifications can happen
- **Canopy Depth**: Stores part of the proof on-chain, reducing transaction size

## Notes

- Tree names must be unique per network (devnet/mainnet)
- Tree names can contain letters, numbers, hyphens, underscores, and spaces (1-50 characters)
- The rent cost is paid once when creating the tree
- Trees cannot be resized after creation
- **Warning**: Public trees allow anyone to mint NFTs - use with caution
