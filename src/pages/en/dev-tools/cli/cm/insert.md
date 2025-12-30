---
title: "Insert Items"
metaTitle: "MPLX CLI - Insert Items Command"
description: "Insert uploaded assets into your MPL Core Candy Machine using the MPLX CLI."
---

The `mplx cm insert` command inserts uploaded assets from your cache file into the on-chain candy machine, making them available for minting. It features smart loading detection, efficient batch processing, and detailed transaction tracking.

## Usage

```bash
# Insert items from current candy machine directory
mplx cm insert

# Insert items from specific candy machine directory
mplx cm insert <directory>
```

## Requirements

Before running the insert command, ensure you have:

1. **Asset Cache**: Valid `asset-cache.json` with uploaded URIs
2. **Candy Machine**: Created candy machine with ID in cache
3. **Wallet Balance**: Sufficient SOL for transaction fees
4. **Network Access**: Stable connection to Solana network

### Prerequisites

```bash
# 1. Candy machine must be created
mplx cm create

# 2. Upload the assets
mplx cm upload

# 3. Then insert items
mplx cm insert
```

## Related Commands

- [`mplx cm upload`](/dev-tools/cli/cm/upload) - Upload assets (required before insert)
- [`mplx cm create`](/dev-tools/cli/cm/create) - Create candy machine (required before insert)
- [`mplx cm validate`](/dev-tools/cli/cm/validate) - Validate cache and uploads
- [`mplx cm fetch`](/dev-tools/cli/cm/fetch) - Verify insertion status

## Next Steps

1. **[Verify insertion](/dev-tools/cli/cm/fetch)** to confirm all items are loaded
2. **[Test minting](/smart-contracts/core-candy-machine/mint)** to ensure candy machine works
3. **[Monitor performance](/dev-tools/cli/cm/validate)** to check for issues
4. **[Plan your launch](/smart-contracts/core-candy-machine/guides)** with appropriate guards
