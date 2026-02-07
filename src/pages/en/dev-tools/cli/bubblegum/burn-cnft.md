---
title: Burn Compressed NFT
metaTitle: Burn Compressed NFT | Metaplex CLI
description: Permanently destroy a compressed NFT
---

The `mplx bg nft burn` command permanently destroys a compressed NFT. This action is **irreversible**.

## Basic Usage

```bash
mplx bg nft burn <assetId>
```

## Arguments

| Argument | Description |
|----------|-------------|
| `ASSET_ID` | The compressed NFT asset ID to burn |

## Global Flags

| Flag | Description |
|------|-------------|
| `-c, --config <value>` | Path to config file. Default is `~/.config/mplx/config.json` |
| `-k, --keypair <value>` | Path to keypair file or ledger (e.g., `usb://ledger?key=0`) |
| `-r, --rpc <value>` | RPC URL for the cluster |
| `--json` | Format output as JSON |

## Examples

1. Burn a compressed NFT:
```bash
mplx bg nft burn CNFTAssetIdHere
```

2. Burn with JSON output:
```bash
mplx bg nft burn CNFTAssetIdHere --json
```

## Output

```
Fetching asset and proof data... ✓
Verifying ownership... ✓
Burning compressed NFT... ✓
Compressed NFT burned successfully!

--------------------------------
Compressed NFT Burned!

Asset ID: CNFTAssetIdHere
Owner: YourWalletAddressHere
Tree: 9hRvTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Signature: 5xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Explorer: https://solscan.io/tx/5xxx...
--------------------------------
```

## Authority Requirements

To burn a compressed NFT, you must be either:
- **Current Owner** - The wallet that currently owns the NFT
- **Delegate** - A wallet that has been delegated authority over the NFT

## Notes

- **Warning**: Burning is permanent and irreversible
- The RPC must support DAS API
- Burning does not recover rent from the Merkle tree
- The tree's capacity is not freed - the slot remains occupied (marked as burnt)
- Any associated metadata remains on storage but is no longer linked
