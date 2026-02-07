---
title: Update Token Metadata
metaTitle: Update Token Metadata | Metaplex CLI
description: Update the metadata of an existing token
---

The `mplx toolbox token update` command updates the metadata of an existing token. You can update individual fields or use the interactive editor to modify the full metadata JSON.

## Basic Usage

### Update Individual Fields
```bash
mplx toolbox token update <mint> --name "New Name"
```

### Update Multiple Fields
```bash
mplx toolbox token update <mint> --name "New Name" --description "New Description" --image ./new-image.png
```

### Interactive Editor
```bash
mplx toolbox token update <mint> --editor
```

## Arguments

| Argument | Description |
|----------|-------------|
| `MINT` | Mint address of the token to update |

## Options

| Option | Description |
|--------|-------------|
| `--name <value>` | New name for the token |
| `--symbol <value>` | New symbol for the token |
| `--description <value>` | New description for the token |
| `--image <value>` | Path to new image file |
| `-e, --editor` | Open metadata JSON in your default editor |

## Global Flags

| Flag | Description |
|------|-------------|
| `-c, --config <value>` | Path to config file. Default is `~/.config/mplx/config.json` |
| `-k, --keypair <value>` | Path to keypair file or ledger (e.g., `usb://ledger?key=0`) |
| `-r, --rpc <value>` | RPC URL for the cluster |

## Examples

1. Update the name:
```bash
mplx toolbox token update <mintAddress> --name "Updated Token Name"
```

2. Update name and description:
```bash
mplx toolbox token update <mintAddress> \
  --name "New Name" \
  --description "This token has been updated"
```

3. Update with new image:
```bash
mplx toolbox token update <mintAddress> \
  --name "Refreshed Token" \
  --image ./new-logo.png
```

4. Update all fields:
```bash
mplx toolbox token update <mintAddress> \
  --name "New Name" \
  --symbol "NEW" \
  --description "Updated description" \
  --image ./new-image.png
```

5. Use interactive editor:
```bash
mplx toolbox token update <mintAddress> --editor
```

## Output

```
--------------------------------

    Token Update

--------------------------------
Fetching token data... ✓
Token data fetched: My Token
Uploading Image... ✓
Uploading JSON file... ✓
Updating Token... ✓
Update transaction sent and confirmed.
Token successfully updated!
```

## Interactive Editor Mode

When using `--editor`, the CLI will:
1. Fetch the current metadata JSON from the token's URI
2. Write it to a temporary file
3. Open the file in your default editor (`$EDITOR` environment variable, or `nano`/`notepad` as fallback)
4. Wait for you to save and close the editor
5. Parse the modified JSON and upload it
6. Update the on-chain metadata

This is useful for making complex changes to the metadata structure or attributes.

## Notes

- You must provide at least one update flag (`--name`, `--description`, `--symbol`, `--image`, or `--editor`)
- The `--editor` flag is mutually exclusive with all other update flags
- If updating fields (not using editor), the existing metadata is fetched and merged with your changes
- If metadata fetch fails, you must provide all fields to create new metadata
- Editor uses `$EDITOR` environment variable, or defaults to `nano` (Linux/macOS) or `notepad` (Windows)
- You must be the update authority of the token to update its metadata
