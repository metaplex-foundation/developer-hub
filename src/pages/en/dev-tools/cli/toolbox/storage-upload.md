---
# Remember to also update the date in src/components/products/guides/index.js
title: Storage Upload
metaTitle: Storage Upload | Metaplex CLI
description: Upload a file or a directory of files to the configured storage provider.
keywords:
  - mplx CLI
  - storage upload
  - Irys
  - Arweave
  - upload file
  - upload directory
about:
  - Metaplex CLI
  - Storage Providers
proficiencyLevel: Beginner
created: '04-20-2026'
updated: '04-20-2026'
---

## Summary

The `mplx toolbox storage upload` command uploads a single file or a whole directory to the configured storage provider.

- Uploads one file by default, or every file under a directory with `--directory`.
- Directory uploads produce an `uploadCache.json` mapping each file to its URI.
- Auto-funds the storage account if the balance is insufficient.
- Returns the URI(s) and MIME type of the uploaded content.

## Quick Reference

The table below summarizes the command's inputs, flags, and side effects.

| Item | Value |
|------|-------|
| Command | `mplx toolbox storage upload <path> [--directory]` |
| Required arg | `path` — file path, or directory path with `--directory` |
| Optional flag | `--directory` |
| Directory output | Writes `uploadCache.json` in the current directory |
| Provider | Active storage provider (e.g. Irys) |

## Basic Usage

Pass a file path to upload a single file, or add `--directory` to upload every file in a directory.

```bash
# Upload a single file
mplx toolbox storage upload <path>

# Upload every file in a directory
mplx toolbox storage upload <directory> --directory
```

## Arguments

The single positional argument is the path being uploaded.

- `path` *(required)*: Path to a file, or path to a directory when combined with `--directory`.

## Flags

The optional flag switches to directory mode.

- `--directory`: Upload every file in the given directory.

## Examples

These examples show a single-file and a directory upload.

```bash
mplx toolbox storage upload ./metadata.json
mplx toolbox storage upload ./assets --directory
```

## Output

Single-file uploads print the resulting URI. Directory uploads report the count and the cache file path.

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
