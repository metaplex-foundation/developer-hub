---
title: Fetch Asset or Collection
metaTitle: Fetch Asset or Collection | Metaplex CLI
description: Fetch MPL Core Assets or Collections by their mint address
---

The `mplx core fetch` command allows you to fetch MPL Core Assets or Collections by their mint address. You can view the metadata and optionally download the associated files.

## Fetch Asset

### Basic Usage
```bash
mplx core fetch asset <assetId>
```

### Download Options
```bash
mplx core fetch asset <assetId> --download --output ./assets
mplx core fetch asset <assetId> --download --image
mplx core fetch asset <assetId> --download --metadata
```

### Asset Fetch Options
- `--download`: Download asset files to disk (can select individual files also with additional flags)
- `--output <path>`: Directory path where to save the downloaded assets (requires --download)
- `--image`: Download the image file (requires --download)
- `--metadata`: Download the metadata file (requires --download)
- `--asset`: Download the asset data file (requires --download)

## Fetch Collection

### Basic Usage
```bash
mplx core fetch collection <collectionId>
```

### Download Options
```bash
mplx core fetch collection <collectionId> --output ./collections
```

### Collection Fetch Options
- `-o, --output <path>`: Output directory for the downloaded Collection files. If not specified, the current folder will be used.

## Examples

### Fetch Asset Examples
1. Fetch a single asset:
```bash
mplx core fetch asset 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa
```

2. Download asset files to a specific directory:
```bash
mplx core fetch asset 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa --download --output ./assets
```

3. Download only the image:
```bash
mplx core fetch asset 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa --download --image
```

### Fetch Collection Examples
1. Fetch a collection:
```bash
mplx core fetch collection HaKyubAWuTS9AZkpUHtFkTKAHs1KKAJ3onZPmaP9zBpe
```

2. Download collection files to a specific directory:
```bash
mplx core fetch collection HaKyubAWuTS9AZkpUHtFkTKAHs1KKAJ3onZPmaP9zBpe --output ./collections
```

## Output

### Asset Fetch Output
When downloading files, the following structure will be created:
```
<output_directory>/
  <assetId>/
    metadata.json
    image.<extension>
    asset.json
```

### Collection Fetch Output
When downloading files, the following structure will be created:
```
<output_directory>/
  <collectionId>/
    metadata.json
    image.<extension>
    collection.json
```

## Notes

- The fetch command will automatically detect the file type and use the appropriate extension
- If no output directory is specified for collections, files will be saved in the current directory
- The metadata JSON file will be pretty-printed for better readability
- Image files will maintain their original format and quality
- The command will create necessary directories if they don't exist
- For collections, both metadata and image files are downloaded together
- For assets, you can choose to download specific components (image, metadata, or asset data) 