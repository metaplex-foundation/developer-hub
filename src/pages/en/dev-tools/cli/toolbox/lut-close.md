---
title: Close Address Lookup Table
metaTitle: Close Address Lookup Table | Metaplex CLI
description: Close a deactivated Address Lookup Table (LUT) and reclaim its rent.
---

The `mplx toolbox lut close` command closes a previously deactivated Address Lookup Table and returns the reclaimed rent to a recipient.

## Basic Usage

```bash
mplx toolbox lut close <lutAddress>
```

## Arguments

- `address` *(required)*: The address of the LUT to close.

## Flags

- `--recipient <pubkey>`: Recipient address for the reclaimed rent. Defaults to the current identity.
- `--authority <pubkey>`: Authority public key. Defaults to the current identity.

## Examples

```bash
mplx toolbox lut close <lutAddress>
mplx toolbox lut close <lutAddress> --recipient <address>
mplx toolbox lut close <lutAddress> --authority <pubkey>
```

## Output

```
--------------------------------
Address Lookup Table Closed
LUT Address: <lut_address>
Signature: <transaction_signature>
--------------------------------
```

## Notes

- The LUT must be deactivated first via [`toolbox lut deactivate`](/dev-tools/cli/toolbox/lut-deactivate).
- A minimum of 512 slots (~5 minutes on mainnet) must pass between deactivation and close.
- Closing is irreversible — the LUT and its contained addresses are permanently removed.
- Only the LUT authority can close it.
