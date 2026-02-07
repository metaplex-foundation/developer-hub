---
title: Add Metadata to Token
metaTitle: Add Metadata to Token | Metaplex CLI
description: Add metadata to an existing token that doesn't have a metadata account
---

The `mplx toolbox token add-metadata` command adds metadata to an existing token that was created without a metadata account. This is useful for tokens created via `spl-token` CLI or other tools that don't automatically create Token Metadata accounts.

## Basic Usage

```bash
mplx toolbox token add-metadata <mint> --name "My Token" --symbol "MTK" --image ./logo.png
```

## Arguments

| Argument | Description |
|----------|-------------|
| `MINT` | Mint address of the token |

## Options

| Option | Description |
|--------|-------------|
| `--name <value>` | Name of the token (required) |
| `--symbol <value>` | Token symbol, 2-6 characters (required) |
| `--uri <value>` | URI pointing to metadata JSON (exclusive with --image, --description) |
| `--description <value>` | Description of the token (used when uploading metadata) |
| `--image <value>` | Path to token image file (used when uploading metadata) |
| `--is-mutable` | Whether metadata can be updated later (default: true) |

## Global Flags

| Flag | Description |
|------|-------------|
| `-c, --config <value>` | Path to config file. Default is `~/.config/mplx/config.json` |
| `-k, --keypair <value>` | Path to keypair file or ledger (e.g., `usb://ledger?key=0`) |
| `-r, --rpc <value>` | RPC URL for the cluster |

## Examples

1. Add metadata with image and description (will upload automatically):
```bash
mplx toolbox token add-metadata <mintAddress> \
  --name "My Token" \
  --symbol "MTK" \
  --description "A great token" \
  --image ./logo.png
```

2. Add metadata with existing URI:
```bash
mplx toolbox token add-metadata <mintAddress> --name "My Token" --symbol "MTK" --uri "https://example.com/metadata.json"
```

3. Add immutable metadata. Be careful, this is not reversible!
```bash
mplx toolbox token add-metadata <mintAddress> --name "My Token" --symbol "MTK" --is-mutable false
```

## Output

```
--------------------------------

    Add Token Metadata

--------------------------------
Checking for existing metadata... ✓
No existing metadata found
Verifying mint authority... ✓
Mint authority verified
Uploading image... ✓
Uploading metadata JSON... ✓
Creating metadata account... ✓

--------------------------------
Metadata created successfully!

Token Details:
Name: My Token
Symbol: MTK

Mint Address: <mintAddress>
Explorer: https://solscan.io/account/<mintAddress>

Transaction Signature: <signature>
Explorer: https://solscan.io/tx/<signature>
--------------------------------
```

## Requirements

- **Mint Authority Required**: You must be the mint authority of the token to add metadata
- **No Existing Metadata**: The token must not already have a metadata account. Use `mplx toolbox token update` to modify existing metadata

## Notes

- If the token already has metadata, the command will display the existing metadata and suggest using the update command instead
- If mint authority has been revoked, metadata cannot be added
- When providing `--image` and/or `--description` without `--uri`, the CLI will automatically upload the metadata to storage
- The `--uri` flag is mutually exclusive with `--image` and `--description`
- Be careful with the `--is-mutable false` flag. It is irreversible
