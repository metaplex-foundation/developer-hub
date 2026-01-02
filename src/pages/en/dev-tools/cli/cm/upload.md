---
title: "Upload Assets"
metaTitle: "MPLX CLI - Upload Assets Command"
description: "Upload candy machine assets to decentralized storage using the MPLX CLI. Intelligent caching, progress tracking, and comprehensive validation."
---

The `mplx cm upload` command uploads assets to a decentralized storage and generates an `asset-cache.json` file containing upload URIs and metadata. This command provides intelligent caching, progress tracking, and comprehensive validation.

## Usage

```bash
# Upload assets from current candy machine directory
mplx cm upload

# Upload assets from specific candy machine directory
mplx cm upload <directory>
```

### Directory Structure

```text
my-candy-machine/
├── assets/
│   ├── 0.png              # Image files (PNG, JPG)
│   ├── 0.json             # Metadata files
│   ├── 1.png
│   ├── 1.json
│   ├── ...
│   ├── collection.png      # Collection image
│   └── collection.json     # Collection metadata
└── asset-cache.json        # Generated after upload
```

## Upload Process

1. Asset Discovery: The command automatically scans the `assets/` directory and identifies image, metadata and collection files.
2. Validation Phase: Verifies the integrity of your files, for example if all image files have matching metadata files and that the metadata is valid json.
3. Cache Check: To identify which files were already uploaded the `asset-cache.json` file is validated.
4. Upload: The actual upload is done.
5. Cache Generation: The `asset-cache.json` file is generated

## Generated Asset Cache

The `asset-cache.json` file contains detailed information about uploaded assets. Manually inspecting and using it is only recommended for advanced users.

Example:

```json
{
  "candyMachineId": null,
  "collection": null,
  "assetItems": {
    "0": {
      "name": "Asset #0",
      "image": "0.png",
      "imageUri": "https://gateway.irys.xyz/ABC123...",
      "imageType": "image/png",
      "json": "0.json",
      "jsonUri": "https://gateway.irys.xyz/DEF456...",
      "loaded": false
    },
    "1": {
      "name": "Asset #1",
      "image": "1.png",
      "imageUri": "https://gateway.irys.xyz/GHI789...",
      "imageType": "image/png",
      "json": "1.json",
      "jsonUri": "https://gateway.irys.xyz/JKL012...",
      "loaded": false
    }
  }
}
```

## Related Commands

- [`mplx cm create`](/dev-tools/cli/cm/create) - Create candy machine (can upload automatically)
- [`mplx cm validate`](/dev-tools/cli/cm/validate) - Validate uploaded assets
- [`mplx cm insert`](/dev-tools/cli/cm/insert) - Insert uploaded assets into candy machine
- [`mplx cm fetch`](/dev-tools/cli/cm/fetch) - View candy machine and asset information

## Next Steps

1. **[Validate your uploads](/dev-tools/cli/cm/validate)** to ensure everything uploaded correctly
2. **[Create your candy machine](/dev-tools/cli/cm/create)** using the uploaded assets
3. **[Insert items](/dev-tools/cli/cm/insert)** to load assets into the candy machine
4. **[Monitor your setup](/dev-tools/cli/cm/fetch)** to verify everything is working
