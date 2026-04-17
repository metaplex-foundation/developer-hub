---
title: Deactivate Address Lookup Table
metaTitle: Deactivate Address Lookup Table | Metaplex CLI
description: Deactivate an Address Lookup Table (LUT) as the first step before closing it.
---

The `mplx toolbox lut deactivate` command deactivates an Address Lookup Table. Deactivation is required before a LUT can be closed and its rent reclaimed.

## Basic Usage

```bash
mplx toolbox lut deactivate <lutAddress>
```

## Arguments

- `address` *(required)*: The address of the LUT to deactivate.

## Flags

- `--authority <pubkey>`: Authority public key. Defaults to the current identity.

## Examples

```bash
mplx toolbox lut deactivate <lutAddress>
mplx toolbox lut deactivate <lutAddress> --authority <pubkey>
```

## Output

```
--------------------------------
Address Lookup Table Deactivated
LUT Address: <lut_address>
Signature: <transaction_signature>
--------------------------------
```

## Notes

- Deactivation prevents any further addresses from being added.
- You must wait approximately 512 slots (~5 minutes on mainnet) after deactivation before the LUT can be closed.
- Only the LUT authority can deactivate it.
- Close the LUT with [`toolbox lut close`](/dev-tools/cli/toolbox/lut-close) after the waiting period.
