---
# Remember to also update the date in src/components/products/guides/index.js
title: Fetch Address Lookup Table
metaTitle: Fetch Address Lookup Table | Metaplex CLI
description: Fetch and display the contents of a Solana Address Lookup Table (LUT).
keywords:
  - mplx CLI
  - Address Lookup Table
  - LUT
  - fetch LUT
  - Solana
about:
  - Metaplex CLI
  - Address Lookup Tables
  - Solana
proficiencyLevel: Intermediate
created: '04-20-2026'
updated: '04-20-2026'
---

## Summary

The `mplx toolbox lut fetch` command reads an [Address Lookup Table](/dev-tools/umi/toolbox/address-lookup-table) from the network and prints its authority and contained addresses.

- Resolves the LUT account and lists every address it holds.
- Prints the authority, or `None` for frozen LUTs.
- Adds deactivation slot and last-extended slot in verbose mode.
- Supports machine-readable JSON output via `--json`.

## Quick Reference

The table below summarizes the command's syntax and output modes.

| Item | Value |
|------|-------|
| Command | `mplx toolbox lut fetch <address>` |
| Required arg | `address` — public key of the LUT |
| Optional flags | `--verbose`, `--json` |
| Read-only | Yes — no transaction is sent |

## Basic Usage

Fetch a LUT by passing its address as the sole positional argument.

```bash
mplx toolbox lut fetch <address>
```

## Arguments

The command takes a single positional argument identifying the LUT.

- `address` *(required)*: Public key of the LUT to fetch.

## Flags

Optional flags extend the output.

- `--verbose`: Show additional details (deactivation slot, last extended slot).
- `--json`: Output structured JSON instead of formatted text.

## Examples

These examples show the default, verbose, and JSON output modes.

```bash
mplx toolbox lut fetch <address>
mplx toolbox lut fetch <address> --verbose
mplx toolbox lut fetch <address> --json
```

## Output

The default output lists the authority, total address count, and each address in the table.

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

- A `deactivationSlot` of `0` means the LUT is still active.
- Use [`toolbox lut create`](/dev-tools/cli/toolbox/lut-create) to create a LUT.
