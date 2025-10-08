---
title: "Validate Cache"
metaTitle: "MPLX CLI - Validate Cache Command"
description: "Validate candy machine asset cache and uploads using the MPLX CLI. Comprehensive validation, error detection, and cache integrity verification."
---

The `mplx cm validate` command validates the asset cache file to ensure all assets are properly uploaded and accessible. It provides comprehensive validation, error detection, and cache integrity verification.

## Usage

```bash
# Validate cache in current candy machine directory
mplx cm validate

# Validate specific cache file
mplx cm validate <path_to_asset_cache>

# Validate on-chain insertions (requires candy machine to exist)
mplx cm validate --onchain
```

If the validation command shows issues, depending on the error you might want to check the issues with your assets or run the upload or insert command.

## Related Commands

- [`mplx cm upload`](/cli/cm/upload) - Upload assets and create cache
- [`mplx cm create`](/cli/cm/create) - Create candy machine
- [`mplx cm insert`](/cli/cm/insert) - Insert validated assets
- [`mplx cm fetch`](/cli/cm/fetch) - Check candy machine status

## Next Steps

1. **[Fix any issues](/cli/cm/upload)** found during validation
2. **[Create candy machine](/cli/cm/create)** if cache is valid
3. **[Insert items](/cli/cm/insert)** to load assets
4. **[Monitor deployment](/cli/cm/fetch)** to ensure success
