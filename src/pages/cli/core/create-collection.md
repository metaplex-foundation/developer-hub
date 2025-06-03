---
title: Create Collection
description: Create an MPL Core Collection using different methods
---

The `mplx core collection create` command allows you to create MPL Core Collections using three different methods: simple creation, file-based creation, or an interactive wizard. This command provides flexibility in how you want to create your collections while maintaining a consistent output format.

## Methods

### 1. Simple Creation
Create a single Collection by providing the name and URI of the metadata directly through command line arguments.

```bash
mplx core collection create --name "My Collection" --uri "https://example.com/metadata.json"
```

### 2. File-based Creation
Create a single Collection by providing an image file and a JSON metadata file. The command will handle uploading both files and creating the collection.

```bash
mplx core collection create --files --image "./my-collection.png" --json "./metadata.json"
```

### 3. Interactive Wizard
Create a Collection using the interactive wizard which guides you through the entire process, including file uploads and metadata creation.

```bash
mplx core collection create --wizard
```

## Options

### Basic Options
- `-n, --name <string>`: Collection name (required for simple creation)
- `-u, --uri <string>`: URI of the Collection metadata (required for simple creation)

### File-based Options
- `-f, --files`: Flag to indicate file-based creation
- `-i, --image <path>`: Path to image file to upload and assign to Collection
- `-j, --json <path>`: Path to JSON metadata file

### Plugin Options
- `--plugins`: Use interactive plugin selection
- `--pluginsFile <path>`: Path to a JSON file with plugin data

## Examples

1. Create a collection using the interactive wizard:
```bash
mplx core collection create --wizard
```

2. Create a collection with name and URI:
```bash
mplx core collection create --name "My Collection" --uri "https://example.com/metadata.json"
```

3. Create a collection from files:
```bash
mplx core collection create --files --image "./my-collection.png" --json "./metadata.json"
```

## Output

The command will output the following information upon successful creation:
```
--------------------------------
  Collection: <collection_address>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
  Core Explorer: https://core.metaplex.com/explorer/<collection_address>
--------------------------------
```

## Notes

- When using the file-based creation method, both `--image` and `--json` flags are required
- The wizard method provides a guided experience for creating collections, including file uploads and metadata creation
- Plugin configuration can be done either interactively or through a JSON file
- The JSON metadata file must include a `name` field for the collection
- The command will automatically handle file uploads and metadata creation when using the file-based or wizard methods
- Collection metadata follows the standard NFT metadata format with additional collection-specific fields 