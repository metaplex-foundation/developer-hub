---
title: Update Asset
metaTitle: Update Asset | Metaplex CLI
description: Update MPL Core Asset metadata, name, URI, image, or collection membership using the Metaplex CLI mplx core asset update command.
keywords:
  - mplx cli
  - core asset update
  - MPL Core
  - update NFT
  - metaplex cli update
  - core update
  - collection management
  - add to collection
  - remove from collection
  - move collection
about:
  - MPL Core Asset update
  - Metaplex CLI
  - collection management
proficiencyLevel: Beginner
created: '03-15-2026'
updated: '04-17-2026'
---

## Summary

The `mplx core asset update` command modifies an [MPL Core Asset's](/core) on-chain name, URI, image, off-chain metadata, or [collection](/core/collections) membership.

- Updates metadata fields individually (`--name`, `--uri`) or from a JSON file (`--offchain`)
- Uploads and assigns a new image with `--image`
- Adds an asset to a collection, moves it between collections, or removes it from a collection
- Requires the caller to be the current [update authority](/core/update) of the asset (or the collection's update authority for collection assets)

## Basic Usage

```bash {% title="Update an asset" %}
mplx core asset update <assetId> [options]
```

You must provide at least one update flag. Multiple flags can be combined in a single command — for example, updating the name and adding to a collection at the same time.

## Update Options

| Flag | Description |
|------|-------------|
| `--name <string>` | New name for the asset (cannot be used with `--offchain`) |
| `--uri <string>` | New URI for the asset metadata (cannot be used with `--offchain`) |
| `--image <path>` | Path to a new image file to upload |
| `--offchain <path>` | Path to a JSON metadata file (cannot be used with `--name` or `--uri`) |
| `--collection <collectionId>` | Add the asset to a collection or move it to a different one (cannot be used with `--remove-collection`) |
| `--remove-collection` | Remove the asset from its current collection (cannot be used with `--collection`) |

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

## Update Metadata

Update the asset's name, URI, image, or off-chain metadata. The `--offchain` flag reads a local JSON file and syncs the on-chain name from its `name` field. The `--image` flag uploads the file and updates the image URI in the metadata.

{% code-tabs-imported from="core/update-asset" frameworks="cli" /%}

## Manage Collection Membership

The `--collection` and `--remove-collection` flags control which [collection](/core/collections) an asset belongs to. These flags can be used alone or combined with metadata update flags in a single transaction.

### Add an Asset to a Collection

The `--collection` flag assigns a standalone asset to a collection. The asset's [update authority](/core/update) changes from an address to the collection.

{% code-tabs-imported from="core/add-to-collection" frameworks="cli" /%}

Output:

```
✔ Asset added to collection (Tx: <transactionSignature>)
```

{% callout type="note" %}
You must be the update authority of both the asset and the target collection to add an asset to a collection.
{% /callout %}

### Move an Asset to a Different Collection

Use the same `--collection` flag on an asset that already belongs to a collection. The CLI detects the existing collection and moves the asset to the new one.

{% code-tabs-imported from="core/change-collection" frameworks="cli" /%}

Output:

```
✔ Asset moved to new collection (Tx: <transactionSignature>)
```

{% callout type="note" %}
You must be the update authority of the asset's current collection and the target collection.
{% /callout %}

### Remove an Asset from a Collection

The `--remove-collection` flag detaches the asset from its current collection. The asset's update authority reverts from the collection back to the signer's address.

{% code-tabs-imported from="core/remove-from-collection" frameworks="cli" /%}

Output:

```
✔ Asset removed from collection (Tx: <transactionSignature>)
```

Running `--remove-collection` on an asset that is not in a collection produces an error:

```
✖ Asset is not in a collection
  Error: Cannot remove from collection: asset does not belong to a collection
```

{% callout type="note" %}
Collection flags can be combined with metadata flags in a single transaction — for example, `mplx core asset update <assetId> --name "New Name" --collection <collectionId>`.
{% /callout %}

## Output

After a successful metadata update, the command displays:

```
--------------------------------
  Asset: <assetId>
  Signature: <transactionSignature>
  Explorer: <explorerUrl>
  Core Explorer: https://core.metaplex.com/explorer/<assetId>
--------------------------------
```

For collection-only operations, the output is a single confirmation line:

```
✔ Asset added to collection (Tx: <transactionSignature>)
```

Use `--json` for structured output:

```json {% title="JSON response" %}
{
  "asset": "<assetId>",
  "signature": "<transactionSignature>",
  "explorer": "<explorerUrl>"
}
```

## Quick Reference

| Item | Value |
|------|-------|
| Update command | `mplx core asset update` |
| Alias (collection) | `mplx core collection add` |
| Applies to | [MPL Core Assets](/core) only — not Token Metadata NFTs |
| Source | [GitHub — metaplex-foundation/cli](https://github.com/metaplex-foundation/cli) |

## Notes

- You must provide at least one update flag: `--name`, `--uri`, `--image`, `--offchain`, `--collection`, or `--remove-collection`
- The `--name` and `--uri` flags cannot be used together with `--offchain`
- The `--collection` and `--remove-collection` flags are mutually exclusive
- When using `--offchain`, the JSON metadata file must contain a valid `name` field — the on-chain name is synced from it
- The `--image` flag uploads the file and updates the image URI in the metadata automatically
- Collection operations change the asset's [update authority](/core/update): adding to a collection sets it to the collection address; removing reverts it to the signer's wallet address
- The caller must be the update authority of the asset (or the collection's update authority for collection assets) to perform any update
- This command applies to [MPL Core Assets](/core) only — for Token Metadata NFTs, use a different update instruction
