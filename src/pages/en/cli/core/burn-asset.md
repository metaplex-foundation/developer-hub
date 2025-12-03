---
title: Burn Asset
description: Burn MPL Core Assets using the Metaplex CLI
---

The `mplx core asset burn` command allows you to permanently destroy MPL Core Assets and reclaim rent fees. You can burn a single asset or multiple assets at once using a JSON list file.

## Basic Usage

### Burn Single Asset
```bash
mplx core asset burn <assetId>
```

### Burn Asset from Collection
```bash
mplx core asset burn <assetId> --collection <collectionId>
```

### Burn Multiple Assets
```bash
mplx core asset burn --list ./assets-to-burn.json
```

## Arguments

| Argument | Description |
|----------|-------------|
| `ASSET` | The mint address of the asset to burn |

## Options

| Option | Description |
|--------|-------------|
| `--collection <value>` | Collection ID to burn the asset from |
| `--list <value>` | File path to a JSON list of assets to burn (e.g., `["asset1", "asset2"]`) |

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

### Burn a Single Asset
```bash
mplx core asset burn 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa
```

### Burn an Asset from a Collection
```bash
mplx core asset burn 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa --collection HaKyubAWuTS9AZkpUHtFkTKAHs1KKAJ3onZPmaP9zBpe
```

### Burn Multiple Assets from a List
Create a JSON file `assets-to-burn.json`:
```json
[
  "5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa",
  "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
]
```

Then run:
```bash
mplx core asset burn --list ./assets-to-burn.json
```

## Notes

- **Warning**: Burning is permanent and cannot be reversed
- You must be the owner of the asset to burn it
- When you burn an asset, most of the rent SOL is returned to the owner
- A small amount (~0.00089784 SOL) remains to prevent account reuse
- Use the `--collection` flag when burning assets that belong to a collection
