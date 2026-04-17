---
title: Fetch Address Lookup Table
metaTitle: Fetch Address Lookup Table | Metaplex CLI
description: Fetch and display the contents of an Address Lookup Table (LUT).
---

The `mplx toolbox lut fetch` command reads an Address Lookup Table from the network and prints its authority and contained addresses.

## Basic Usage

```bash
mplx toolbox lut fetch <lutAddress>
```

## Arguments

- `address` *(required)*: The address of the LUT to fetch.

## Flags

- `--verbose`: Show additional details (deactivation slot, last extended slot).
- `--json`: Output structured JSON instead of formatted text.

## Examples

```bash
mplx toolbox lut fetch <lutAddress>
mplx toolbox lut fetch <lutAddress> --verbose
mplx toolbox lut fetch <lutAddress> --json
```

## Output

```
--------------------------------
Address Lookup Table Details
LUT Address: <lut_address>
Authority: <authority_pubkey>
Total Addresses: <count>

Addresses in Table:
    1. <address1>
    2. <address2>
--------------------------------
```

## Notes

- A deactivation slot of `0` means the LUT is still active.
- Use [`toolbox lut create`](/dev-tools/cli/toolbox/lut-create) to create a LUT.
