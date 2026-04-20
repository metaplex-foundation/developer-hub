---
# Remember to also update the date in src/components/products/guides/index.js
title: Deactivate Address Lookup Table
metaTitle: Deactivate Address Lookup Table | Metaplex CLI
description: Deactivate an Address Lookup Table (LUT) as the first step before closing it.
keywords:
  - mplx CLI
  - Address Lookup Table
  - LUT
  - deactivate LUT
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

The `mplx toolbox lut deactivate` command deactivates an Address Lookup Table so it can later be closed and its rent reclaimed.

- Prevents new addresses from being added to the LUT.
- Required before `toolbox lut close` can reclaim rent.
- Waits ~512 slots (~5 minutes on mainnet) before closure is possible.
- Only the LUT authority can deactivate the table.

## Quick Reference

The table below summarizes the command's syntax, cooldown, and next step.

| Item | Value |
|------|-------|
| Command | `mplx toolbox lut deactivate <address>` |
| Required arg | `address` — public key of the LUT |
| Optional flag | `--authority <pubkey>` |
| Cooldown | 512 slots before the LUT can be closed |
| Next step | [`toolbox lut close`](/dev-tools/cli/toolbox/lut-close) |

## Basic Usage

Deactivate a LUT by passing its address as the sole positional argument.

```bash
mplx toolbox lut deactivate <address>
```

## Arguments

The command takes a single positional argument identifying the LUT.

- `address` *(required)*: Public key of the LUT to deactivate.

## Flags

Optional flags override the default authority.

- `--authority <pubkey>`: Authority public key for the LUT. Defaults to the current identity.

## Examples

These examples show the default and custom-authority deactivation flows.

```bash
mplx toolbox lut deactivate <address>
mplx toolbox lut deactivate <address> --authority <authority-pubkey>
```

## Output

On success the command prints the deactivated LUT address and the transaction signature.

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
