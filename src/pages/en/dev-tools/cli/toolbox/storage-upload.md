---
title: Storage Upload
metaTitle: Storage Upload | Metaplex CLI
description: Upload a file or a directory of files to the configured storage provider.
---

The `mplx toolbox storage upload` command uploads a single file or a whole directory to the configured storage provider (e.g. Irys/Arweave). Directory uploads produce a `uploadCache.json` mapping each file to its URI.

## Basic Usage

```bash
# Upload a single file
mplx toolbox storage upload <path>

# Upload every file in a directory
mplx toolbox storage upload <directory> --directory
```

## Arguments

- `path` *(required)*: Path to a file, or path to a directory when combined with `--directory`.

## Flags

- `--directory`: Upload every file in the given directory.

## Examples

```bash
mplx toolbox storage upload ./metadata.json
mplx toolbox storage upload ./assets --directory
```

## Output

Single file:
```
--------------------------------
    Uploaded <path>
    URI: <uri>
---------------------------------
```

Directory:
```
--------------------------------
    Successfully uploaded <N> files

    Upload cache saved to uploadCache.json
---------------------------------
```

## Notes

- Storage is funded and billed through the active storage provider. If your storage balance is low, the command will automatically fund it before upload.
- Check your storage balance with [`toolbox storage balance`](/dev-tools/cli/toolbox/storage-balance).
- Fund the storage account with [`toolbox storage fund`](/dev-tools/cli/toolbox/storage-fund).
