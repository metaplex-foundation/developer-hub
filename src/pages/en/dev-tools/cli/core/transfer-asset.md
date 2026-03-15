---
title: Transfer Asset
metaTitle: Transfer Asset | Metaplex CLI
description: Transfer ownership of an MPL Core Asset to a new wallet using the Metaplex CLI mplx core asset transfer command.
keywords:
  - mplx cli
  - core asset transfer
  - MPL Core
  - transfer NFT
  - metaplex cli transfer
  - core transfer
about:
  - MPL Core Asset transfer
  - Metaplex CLI
proficiencyLevel: Beginner
created: '03-15-2026'
updated: '03-15-2026'
---

## Summary

The `mplx core asset transfer` command transfers ownership of an [MPL Core Asset](/core) to a new wallet. The collection account is resolved automatically when the asset belongs to one — no extra flags are required.

- Transfers a single Core Asset to a specified public key
- Automatically detects and includes the collection if the asset belongs to one
- Requires the caller to be the current owner or an authorized transfer delegate
- Frozen assets must be thawed before they can be transferred

## Basic Usage

```bash {% title="Transfer an asset" %}
mplx core asset transfer <assetId> <newOwner>
```

## Arguments

| Argument | Description |
|----------|-------------|
| `ASSET_ID` | The address of the asset to transfer |
| `NEW_OWNER` | The public key of the new owner's wallet |

## Global Flags

| Flag | Description |
|------|-------------|
| `-c, --config <value>` | Path to config file. Default is `~/.config/mplx/config.json` |
| `-k, --keypair <value>` | Path to keypair file or ledger (e.g., `usb://ledger?key=0`) |
| `-p, --payer <value>` | Path to payer keypair file or ledger |
| `-r, --rpc <value>` | RPC URL for the cluster |
| `--commitment <option>` | Commitment level: `processed`, `confirmed`, or `finalized` |
| `--json` | Format output as JSON |
| `--log-level <option>` | Logging level: `debug`, `warn`, `error`, `info`, or `trace` (default: `info`) |

## Examples

### Transfer a Standalone Asset

```bash {% title="Transfer a standalone asset" %}
mplx core asset transfer 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa \
  9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM
```

### Transfer an Asset That Belongs to a Collection

The collection account is resolved automatically from the asset — no `--collection` flag is needed.

```bash {% title="Transfer a collection asset" %}
mplx core asset transfer BXBJbGGjMPBNKmRoUVGpMKFNMmvzfJTvEUqY1bBXqzNd \
  9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM
```

### Get Structured JSON Output

```bash {% title="Transfer with JSON output" %}
mplx core asset transfer <assetId> <newOwner> --json
```

Returns:

```json {% title="JSON response" %}
{
  "asset": "<assetId>",
  "newOwner": "<newOwner>",
  "signature": "<transactionSignature>",
  "explorer": "<explorerUrl>"
}
```

## Quick Reference

| Item | Value |
|------|-------|
| Command | `mplx core asset transfer` |
| Applies to | [MPL Core Assets](/core) only — not Token Metadata NFTs |
| Source | [GitHub — metaplex-foundation/cli](https://github.com/metaplex-foundation/cli) |

## Notes

- You must be the current owner of the asset (or an authorized [transfer delegate](/core/plugins)) to run this command
- Frozen assets cannot be transferred — they must be thawed first using the freeze/thaw [plugin](/core/plugins)
- The collection account is fetched automatically; no manual `--collection` flag is required for assets in a collection
- This command applies to [MPL Core Assets](/core) only — for Token Metadata NFTs, use a different transfer instruction

*Maintained by Metaplex Foundation · Last verified March 2026 · Applies to MPLX CLI 0.x*
