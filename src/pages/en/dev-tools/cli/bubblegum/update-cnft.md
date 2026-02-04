---
title: Update Compressed NFT
metaTitle: Update Compressed NFT | Metaplex CLI
description: Update the metadata of a compressed NFT
---

The `mplx bg nft update` command updates the off-chain metadata of a compressed NFT. You can update individual fields or use the interactive editor to modify the full metadata JSON.

## Basic Usage

### Update Individual Fields
```bash
mplx bg nft update <assetId> --name "New Name"
```

### Update Multiple Fields
```bash
mplx bg nft update <assetId> --name "New Name" --description "New Description" --image ./new-image.png
```

### Interactive Editor
```bash
mplx bg nft update <assetId> --editor
```

## Arguments

| Argument | Description |
|----------|-------------|
| `ASSET_ID` | The compressed NFT asset ID to update |

## Options

| Option | Description |
|--------|-------------|
| `--name <value>` | New name for the NFT |
| `--symbol <value>` | New symbol for the NFT |
| `--description <value>` | New description for the NFT |
| `--image <value>` | Path to new image file |
| `--uri <value>` | New metadata URI (alternative to updating fields) |
| `-e, --editor` | Open metadata JSON in your default editor |

## Global Flags

| Flag | Description |
|------|-------------|
| `-c, --config <value>` | Path to config file. Default is `~/.config/mplx/config.json` |
| `-k, --keypair <value>` | Path to keypair file or ledger (e.g., `usb://ledger?key=0`) |
| `-r, --rpc <value>` | RPC URL for the cluster |
| `--json` | Format output as JSON |

## Examples

1. Update the name:
```bash
mplx bg nft update CNFTAssetIdHere --name "Updated NFT Name"
```

2. Update name and description:
```bash
mplx bg nft update CNFTAssetIdHere \
  --name "New Name" \
  --description "This NFT has been updated"
```

3. Update with new image:
```bash
mplx bg nft update CNFTAssetIdHere \
  --name "Refreshed NFT" \
  --image ./new-artwork.png
```

4. Replace entire metadata URI:
```bash
mplx bg nft update CNFTAssetIdHere --uri "https://arweave.net/xxx"
```

5. Use interactive editor:
```bash
mplx bg nft update CNFTAssetIdHere --editor
```

## Output

```
--------------------------------

  Compressed NFT Update

--------------------------------
Fetching asset and proof data... ✓
Uploading Image... ✓
Uploading JSON file... ✓
Updating compressed NFT... ✓

--------------------------------
  Compressed NFT: Updated NFT Name
  Asset ID: CNFTAssetIdHere
  Signature: 5xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  Explorer: https://solscan.io/tx/5xxx...
--------------------------------
```

## Authority Requirements

To update a compressed NFT, you must be either:
- **Tree Authority** - If the NFT is not in a collection
- **Collection Update Authority** - If the NFT belongs to a [Metaplex Core collection](/smart-contracts/core/collections)

**Note**: The owner of the NFT cannot update it - this is different from traditional NFTs.

## Notes

- The RPC must support DAS API
- If updating fields (not URI), the existing metadata is fetched and merged with your changes
- If metadata fetch fails, you must provide all fields to create new metadata
- The `--uri` flag is mutually exclusive with `--image`, `--description`, and `--editor`
- The `--editor` flag is mutually exclusive with all other update flags
- Editor uses `$EDITOR` environment variable, or defaults to nano/notepad
