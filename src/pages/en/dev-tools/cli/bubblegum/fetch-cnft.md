---
title: Fetch Compressed NFT
metaTitle: Fetch Compressed NFT | Metaplex CLI
description: Retrieve compressed NFT data and merkle proof
---

The `mplx bg nft fetch` command retrieves the asset data and merkle proof for a compressed NFT using the DAS (Digital Asset Standard) API.

## Basic Usage

```bash
mplx bg nft fetch <assetId>
```

### Download to Files
```bash
mplx bg nft fetch <assetId> --download --output ./nfts
```

### Fetch Proof Only
```bash
mplx bg nft fetch <assetId> --proof-only
```

## Arguments

| Argument | Description |
|----------|-------------|
| `ASSET_ID` | The compressed NFT asset ID (leaf asset ID) |

## Options

| Option | Description |
|--------|-------------|
| `--download` | Download asset data and proof to files |
| `--output <value>` | Directory path for downloaded files (requires `--download`) |
| `--proof-only` | Only fetch and display the merkle proof |

## Global Flags

| Flag | Description |
|------|-------------|
| `-c, --config <value>` | Path to config file. Default is `~/.config/mplx/config.json` |
| `-r, --rpc <value>` | RPC URL for the cluster |
| `--json` | Format output as JSON |

## Examples

1. Fetch and display NFT information:
```bash
mplx bg nft fetch CNFTAssetIdHere
```

2. Download asset data to files:
```bash
mplx bg nft fetch CNFTAssetIdHere --download
```

3. Download to specific directory:
```bash
mplx bg nft fetch CNFTAssetIdHere --download --output ./nft-data
```

4. Fetch only the merkle proof:
```bash
mplx bg nft fetch CNFTAssetIdHere --proof-only
```

5. Output as JSON:
```bash
mplx bg nft fetch CNFTAssetIdHere --json
```

## Output

```
--------------------------------
Compressed NFT Details

Asset ID: CNFTAssetIdHere
Name: My Compressed NFT
Symbol: CNFT
Description: A beautiful compressed NFT

Compressed: true
Tree: 9hRvTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Leaf ID: 42
Owner: OwnerWalletAddressHere
Collection: CollectionAddressHere

Metadata URI: https://arweave.net/xxx
Image: https://arweave.net/yyy

Mutable: true
Burnt: false

Merkle Proof:
  Root: RootHashHere
  Node Index: 42
  Proof Length: 6 nodes
  Tree ID: 9hRvTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Royalty:
  Basis Points: 500 (5%)
  Primary Sale: No

Creators:
  CreatorAddress1 (100%) ✓

--------------------------------
```

## Downloaded Files

When using `--download`, two files are created:

- `<assetId>-asset.json` - Full asset data including metadata, ownership, compression info
- `<assetId>-proof.json` - Merkle proof required for write operations (transfer, burn, update)

## Notes

- The RPC must support DAS API
- Standard Solana RPC endpoints will fail with "Asset not found or RPC does not support DAS API"
- The merkle proof is essential for transfer, burn, and update operations
- The `--json` flag outputs machine-readable JSON for scripting
