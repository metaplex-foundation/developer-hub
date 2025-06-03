---
title: Create Asset
description: Create an MPL Core Asset using different methods
---

The `mplx core asset create` command allows you to create MPL Core Assets using three different methods: simple creation, file-based creation, or an interactive wizard. This command provides flexibility in how you want to create your assets while maintaining a consistent output format.

## Methods

### 1. Simple Creation
Create a single Asset by providing the name and URI of the metadata directly through command line arguments.

```bash
mplx core asset create --name "My NFT" --uri "https://example.com/metadata.json"
```

### 2. File-based Creation
Create a single Asset by providing an image file and a JSON metadata file. The command will handle uploading both files and creating the asset.

```bash
mplx core asset create --files --image "./my-nft.png" --json "./metadata.json"
```

### 3. Interactive Wizard
Create an Asset using the interactive wizard which guides you through the entire process, including file uploads and metadata creation.

```bash
mplx core asset create --wizard
```

## Options

### Basic Options
- `--name <string>`: Asset name (required for simple creation)
- `--uri <string>`: URI of the Asset metadata (required for simple creation)
- `--collection <string>`: Collection ID for the asset

### File-based Options
- `--files`: Flag to indicate file-based creation
- `--image <path>`: Path to image file to upload and assign to Asset
- `--json <path>`: Path to JSON metadata file

### Plugin Options
- `--plugins`: Use interactive plugin selection
- `--pluginsFile <path>`: Path to a JSON file with plugin data

## Examples

1. Create an asset using the interactive wizard:
```bash
mplx core asset create --wizard
```

2. Create an asset with name and URI:
```bash
mplx core asset create --name "My NFT" --uri "https://example.com/metadata.json"
```

3. Create an asset from files:
```bash
mplx core asset create --files --image "./my-nft.png" --json "./metadata.json"
```

4. Create an asset with a collection:
```bash
mplx core asset create --name "My NFT" --uri "https://example.com/metadata.json" --collection "collection_id_here"
```

5. Create an asset with files and a collection:
```bash
mplx core asset create --files --image "./my-nft.png" --json "./metadata.json" --collection "collection_id_here"
```

## Output

The command will output the following information upon successful creation:
```
--------------------------------
  Asset: <asset_address>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
  Core Explorer: https://core.metaplex.com/explorer/<asset_address>
--------------------------------
```

## Notes

- When using the file-based creation method, both `--image` and `--json` flags are required
- The wizard method provides a guided experience for creating assets, including file uploads and metadata creation
- Plugin configuration can be done either interactively or through a JSON file
- The command supports various file types for images and animations
- Collection assignment is optional and can be used with any creation method
