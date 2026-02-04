---
title: List Trees
metaTitle: List Merkle Trees | Metaplex CLI
description: View all saved Bubblegum Merkle trees
---

The `mplx bg tree list` command displays all Merkle trees you've created and saved locally.

## Basic Usage

```bash
mplx bg tree list
```

### Filter by Network
```bash
mplx bg tree list --network devnet
```

## Options

| Option | Description |
|--------|-------------|
| `--network <value>` | Filter trees by network (mainnet, devnet, testnet, localnet) |

## Global Flags

| Flag | Description |
|------|-------------|
| `-c, --config <value>` | Path to config file. Default is `~/.config/mplx/config.json` |
| `--json` | Format output as JSON |

## Examples

1. List all trees:
```bash
mplx bg tree list
```

2. List only devnet trees:
```bash
mplx bg tree list --network devnet
```

3. List only mainnet trees:
```bash
mplx bg tree list --network mainnet
```

## Output

```
Saved Trees:
┌─────────┬────────────────────────────────────────────┬─────────┬───────────┬────────┬────────────┐
│ Name    │ Address                                    │ Network │ Max NFTs  │ Public │ Created    │
├─────────┼────────────────────────────────────────────┼─────────┼───────────┼────────┼────────────┤
│ my-tree │ 9hRvTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   │ devnet  │ 16,384    │ No     │ 1/15/2025  │
│ prod    │ 7kPqYxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   │ mainnet │ 1,048,576 │ No     │ 1/10/2025  │
└─────────┴────────────────────────────────────────────┴─────────┴───────────┴────────┴────────────┘

Total: 2 trees
```

## Using Tree Names

Once you've saved a tree with a name, you can reference it by name in other commands:

```bash
# Using tree name
mplx bg nft create my-tree --wizard

# Using tree address (also works)
mplx bg nft create 9hRvTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx --wizard
```

## Notes

- Trees are saved per-network, so the same name can exist on different networks
- Tree data is stored locally in `~/.config/mplx/trees.json`
- If no trees are found, the command will suggest creating one with `mplx bg tree create --wizard`
