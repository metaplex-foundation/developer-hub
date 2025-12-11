---
title: "Fetch Information"
metaTitle: "MPLX CLI - Fetch Candy Machine Information"
description: "Fetch and display MPL Core Candy Machine information using the MPLX CLI. View configuration, guard settings, item status, and deployment details."
---

The `mplx cm fetch` command retrieves and displays comprehensive information about a candy machine, including configuration, guard settings, item status, and deployment details. This command is essential for monitoring and verifying your candy machine setup.

## Usage

```bash
# Fetch info from current candy machine directory
mplx cm fetch

# Fetch specific candy machine by address
mplx cm fetch <candy_machine_address>

```

The fetch command supports an additional flag for detailed information:

- `--items`: Include detailed information about loaded items

## Related Commands

- [`mplx cm create`](/cli/cm/create) - Create the candy machine to fetch
- [`mplx cm insert`](/cli/cm/insert) - Load items (affects item counts)
- [`mplx cm validate`](/cli/cm/validate) - Validate cache vs on-chain data
- [`mplx cm withdraw`](/cli/cm/withdraw) - Clean up after checking status
