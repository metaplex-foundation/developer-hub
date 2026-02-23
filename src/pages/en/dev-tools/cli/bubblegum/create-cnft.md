---
title: Create Compressed NFT
metaTitle: Create Compressed NFT | Metaplex CLI
description: Mint a compressed NFT into a Merkle tree
---

The `mplx bg nft create` command mints a compressed NFT into an existing Merkle tree. If you do not have a Merkle Tree yet [create](/dev-tools/cli/bubblegum/create-tree) one first.

## Basic Usage

### Interactive Wizard (Recommended)

```bash
mplx bg nft create --wizard
```

### With Specific Tree

```bash
mplx bg nft create my-tree --wizard
```

### File-Based Creation

```bash
mplx bg nft create my-tree --image ./nft.png --json ./metadata.json
```

### URI-Based Creation

```bash
mplx bg nft create my-tree --name "My NFT" --uri "https://example.com/metadata.json"
```

## Arguments

| Argument | Description |
|----------|-------------|
| `TREE` | Tree name (saved) or Merkle tree address (optional in wizard mode) |

## Options

| Option | Description |
|--------|-------------|
| `--wizard` | Use interactive wizard |
| `--name <value>` | NFT name |
| `--uri <value>` | Existing metadata URI |
| `--json <value>` | Path to JSON metadata file (requires `--image`) |
| `--image <value>` | Path to image file |
| `--description <value>` | NFT description |
| `--attributes <value>` | Attributes in "trait:value,trait:value" format |
| `--animation <value>` | Path to animation/video file |
| `--project-url <value>` | External project URL |
| `--symbol <value>` | On-chain symbol |
| `--royalties <value>` | Royalty percentage (0-100) |
| `--collection <value>` | Collection mint address ([Metaplex Core collection](/smart-contracts/core/collections)) |
| `--owner <value>` | Leaf owner public key (defaults to payer) |

## Global Flags

| Flag | Description |
|------|-------------|
| `-c, --config <value>` | Path to config file. Default is `~/.config/mplx/config.json` |
| `-k, --keypair <value>` | Path to keypair file or ledger (e.g., `usb://ledger?key=0`) |
| `-r, --rpc <value>` | RPC URL for the cluster |
| `--json` | Format output as JSON |

## Examples

1. Create using the wizard:

```bash
mplx bg nft create --wizard
```

1. Create with specific tree using wizard:

```bash
mplx bg nft create my-tree --wizard
```

1. Create with existing metadata URI:

```bash
mplx bg nft create my-tree --name "My NFT" --uri "https://arweave.net/xxx"
```

1. Create with local files:

```bash
mplx bg nft create my-tree --image ./artwork.png --json ./metadata.json
```

1. Create with metadata flags:

```bash
mplx bg nft create my-tree \
  --name "Cool NFT #1" \
  --image ./nft.png \
  --description "A very cool compressed NFT" \
  --attributes "Background:Blue,Eyes:Laser,Hat:Crown" \
  --royalties 5
```

1. Create in a collection:

```bash
mplx bg nft create my-tree \
  --name "Collection Item #1" \
  --image ./nft.png \
  --collection 7kPqYxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Output

```text
Uploading image... ✓
Uploading metadata... ✓
Creating compressed NFT... ✓

--------------------------------
Compressed NFT Created!

Tree: my-tree
Owner: YourWalletAddressHere
Asset ID: CNFTAssetIdHere

Signature: 5xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Explorer: https://solscan.io/tx/5xxx...
--------------------------------
```

## Metadata JSON Format

When using `--json`, your metadata file should follow this structure:

```json
{
  "name": "My NFT",
  "symbol": "MNFT",
  "description": "Description of the NFT",
  "seller_fee_basis_points": 500,
  "attributes": [
    { "trait_type": "Background", "value": "Blue" },
    { "trait_type": "Rarity", "value": "Rare" }
  ],
  "properties": {
    "files": [
      { "uri": "", "type": "image/png" }
    ]
  }
}
```

The `image` field will be automatically populated with the uploaded image URI.

## Notes

- The tree argument can be either a saved tree name or a public key address
- If the tree is private, you must be the tree authority to mint
- If the tree is public, anyone can mint NFTs to it
- The RPC must support DAS API
- **Bubblegum V2 only** - These commands work with Bubblegum V2 trees and use [Metaplex Core collections](/smart-contracts/core/collections) (not Token Metadata collections)
- Attributes format: `"trait:value,trait:value"` - colons separate trait from value, commas separate pairs
