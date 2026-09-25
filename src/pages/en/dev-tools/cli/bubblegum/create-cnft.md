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
| `--royalties <value>` | Explicit leaf royalty % (0–100, decimals allowed e.g. `7.5`). Opts out of collection inherit |
| `--inherit-royalties` | Store inherit sentinel `65535` and empty leaf creators. Requires `--collection` with a Royalties plugin. Default when the collection has Royalties and you omit `--royalties`, `--creator`, and JSON `seller_fee_basis_points` |
| `--creator <address>:<share>` | Leaf payout split (repeatable; shares must sum to 100). For explicit-leaf mints, the default is payer @ 100%. Opts out of inherit even if `--royalties` is omitted. Incompatible with `--inherit-royalties` |
| `--collection <value>` | Core collection address (must have BubblegumV2). [Metaplex Core collections](/smart-contracts/core/collections) |
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

1. Create in a collection (auto-inherits royalties when the collection has a Royalties plugin):

```bash
mplx bg nft create my-tree \
  --name "Collection Item #1" \
  --image ./nft.png \
  --collection 7kPqYxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

1. Force inherit from the collection Royalties plugin:

```bash
mplx bg nft create my-tree \
  --name "Inherited cNFT" \
  --uri "https://arweave.net/xxx" \
  --collection 7kPqYxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx \
  --inherit-royalties
```

1. Explicit leaf royalties with creator splits (opts out of inherit):

```bash
mplx bg nft create my-tree \
  --name "Split cNFT" \
  --uri "https://arweave.net/xxx" \
  --collection 7kPqYxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx \
  --royalties 7.5 \
  --creator Addr111111111111111111111111111111111111111:60 \
  --creator Addr222222222222222222222222222222222222222:40
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
Royalties: inherited (leaf sentinel 65535)

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

If `seller_fee_basis_points` is set, the CLI treats it as an explicit leaf rate and **does not inherit** from the collection.

## Inherited royalties

When minting into a Core collection that has a [Royalties plugin](/smart-contracts/core/plugins/royalties), the CLI can store the inherit sentinel (`65535`) and empty leaf creators instead of copying the collection rate onto every cNFT. DAS then resolves the collection rate for display. See [Reading Inherited Royalties](/smart-contracts/bubblegum-v2/reading-inherited-royalties).

Create a Bubblegum-ready collection with royalties:

```bash
mplx bg collection create \
  --name "My Compressed Collection" \
  --uri "https://example.com/collection.json" \
  --royalties 5
```

| Intent | Flags |
|--------|--------|
| Auto-inherit | `--collection <COL>` and omit `--royalties`, `--creator`, and JSON `seller_fee_basis_points` |
| Force inherit | `--collection <COL> --inherit-royalties` |
| Explicit leaf rate | `--royalties <0-100>` (decimals ok). Opts out of inherit |
| Explicit splits | `--creator <ADDR>:<share>` (repeatable; shares sum to 100). Opts out of inherit even without `--royalties` (leaf rate is then `0%`) |

`--inherit-royalties` requires `--collection` with a Royalties plugin and cannot be combined with `--royalties`, `--creator`, or JSON `seller_fee_basis_points`. A plain `mplx core collection create` is not enough — the collection needs `BubblegumV2` (and Royalties, to inherit).

## Notes

- The tree argument can be either a saved tree name or a public key address
- If the tree is private, you must be the tree authority to mint
- If the tree is public, anyone can mint NFTs to it
- The RPC must support DAS API
- **Bubblegum V2 only** - These commands work with Bubblegum V2 trees and use [Metaplex Core collections](/smart-contracts/core/collections) (not Token Metadata collections)
- Attributes format: `"trait:value,trait:value"` - colons separate trait from value, commas separate pairs
- The wizard offers inherit vs explicit royalties when the selected collection has a Royalties plugin
