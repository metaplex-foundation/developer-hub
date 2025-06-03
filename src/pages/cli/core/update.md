---
title: Update Asset
description: Update MPL Core Asset metadata and properties
---

The `mplx core update` command allows you to update MPL Core Assets by modifying their metadata, name, URI, or image. You can update a single asset or multiple assets at once.

## Basic Usage

### Update Single Asset
```bash
mplx core update <assetId> [options]
```

### Update Options
- `--name <string>`: New name for the asset
- `--uri <string>`: New URI for the asset metadata
- `--image <path>`: Path to new image file
- `--json <path>`: Path to JSON file containing new metadata
- `--edit`: Download metadata JSON, open for editing, then use for update

## Update Methods

### 1. Update Name and URI
```bash
mplx core update <assetId> --name "Updated Asset" --uri "https://example.com/metadata.json"
```

### 2. Update with JSON File
```bash
mplx core update <assetId> --json ./asset/metadata.json
```

### 3. Update with Image
```bash
mplx core update <assetId> --image ./asset/image.jpg
```

### 4. Update with JSON and Image
```bash
mplx core update <assetId> --json ./asset/metadata.json --image ./asset/image.jpg
```

### 5. Interactive Edit
```bash
mplx core update <assetId> --edit
```

## Examples

### Update Asset Name
```bash
mplx core update 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa --name "New Asset Name"
```

### Update Asset with New Image
```bash
mplx core update 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa --image ./images/new-image.png
```

### Update Asset with New Metadata
```bash
mplx core update 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa --json ./metadata/new-metadata.json
```

### Interactive Metadata Update
```bash
mplx core update 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa --edit
```

## Output

After a successful update, the command will display:
```
--------------------------------
  Asset: <assetId>
  Signature: <transactionSignature>
  Explorer: <explorerUrl>
  Core Explorer: https://core.metaplex.com/explorer/<assetId>
--------------------------------
```

## Notes

- You must provide at least one update flag: `--name`, `--uri`, `--image`, `--json`, or `--edit`
- The `--name` and `--uri` flags cannot be used together with `--json` or `--edit`
- When using `--json`, the metadata file must contain a valid `name` field
- The `--image` flag will update both the image URI in the metadata and the image file reference
- When using `--edit`, the command will:
  1. Download the current metadata
  2. Open it for editing in your default text editor
  3. Wait for you to save and close the file
  4. Upload the updated metadata
- The command will automatically handle:
  - File uploads to the appropriate storage
  - Metadata JSON formatting
  - Image file type detection
  - Collection authority validation 