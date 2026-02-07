---
title: Transfer Compressed NFT
metaTitle: Transfer Compressed NFT | Metaplex CLI
description: Transfer a compressed NFT to a new owner
---

The `mplx bg nft transfer` command transfers ownership of a compressed NFT to a new wallet address.

## Basic Usage

```bash
mplx bg nft transfer <assetId> <newOwner>
```

## Arguments

| Argument | Description |
|----------|-------------|
| `ASSET_ID` | The compressed NFT asset ID to transfer |
| `NEW_OWNER` | The public key of the new owner |

## Global Flags

| Flag | Description |
|------|-------------|
| `-c, --config <value>` | Path to config file. Default is `~/.config/mplx/config.json` |
| `-k, --keypair <value>` | Path to keypair file or ledger (e.g., `usb://ledger?key=0`) |
| `-r, --rpc <value>` | RPC URL for the cluster |
| `--json` | Format output as JSON |

## Example

Transfer to a new owner:
```bash
mplx bg nft transfer CNFTAssetIdHere RecipientWalletAddressHere
```


## Output

```
Fetching asset and proof data... ✓
Verifying ownership... ✓
Executing transfer... ✓
Compressed NFT transferred successfully!

--------------------------------
Compressed NFT Transferred!

Asset ID: CNFTAssetIdHere
From: OriginalOwnerAddressHere
To: NewOwnerAddressHere
Tree: 9hRvTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Signature: 5xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Explorer: https://solscan.io/tx/5xxx...
--------------------------------
```

## Authority Requirements

To transfer a compressed NFT, you must be either:
- **Current Owner** - The wallet that currently owns the NFT
- **Delegate** - A wallet that has been delegated authority over the NFT

## Notes

- The RPC must support DAS API
- The transfer is atomic - either it completes fully or fails entirely
- The new owner immediately gains full ownership rights
- Unlike traditional NFTs, compressed NFT transfers don't create new token accounts
- The asset ID remains the same after transfer (only the owner changes)
