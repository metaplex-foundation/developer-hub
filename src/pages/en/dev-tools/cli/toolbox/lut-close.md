---
# Remember to also update the date in src/components/products/guides/index.js
title: Close Address Lookup Table
metaTitle: Close Address Lookup Table | Metaplex CLI
description: Close a deactivated Address Lookup Table (LUT) and reclaim its rent.
keywords:
  - mplx CLI
  - Address Lookup Table
  - LUT
  - close LUT
  - reclaim rent
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

The `mplx toolbox lut close` command closes a previously deactivated Address Lookup Table and returns its rent to a recipient wallet.

- Permanently removes the LUT account and every address stored in it.
- Requires the LUT to have been deactivated for at least 512 slots (~5 minutes on mainnet).
- Reclaims rent to the current identity by default, or to `--recipient`.
- Only succeeds when the current identity (or `--authority`) matches the LUT authority.

## Quick Reference

The table below summarizes the command's syntax, preconditions, and defaults.

| Item | Value |
|------|-------|
| Command | `mplx toolbox lut close <address>` |
| Required arg | `address` — public key of the LUT |
| Optional flags | `--recipient <pubkey>`, `--authority <pubkey>` |
| Precondition | LUT deactivated via [`toolbox lut deactivate`](/dev-tools/cli/toolbox/lut-deactivate) |
| Minimum wait | 512 slots after deactivation |
| Reversible | No |

## Basic Usage

Close a deactivated LUT by passing its address as the sole positional argument.

```bash
mplx toolbox lut close <address>
```

## Arguments

The command takes a single positional argument identifying the LUT to close.

- `address` *(required)*: Public key of the LUT to close.

## Flags

Optional flags override the default recipient and authority.

- `--recipient <pubkey>`: Recipient for the reclaimed rent. Defaults to the current identity.
- `--authority <pubkey>`: Authority public key for the LUT. Defaults to the current identity.

## Examples

The following examples cover the common close scenarios.

```bash
mplx toolbox lut close <address>
mplx toolbox lut close <address> --recipient <recipient-pubkey>
mplx toolbox lut close <address> --authority <authority-pubkey>
```

## Output

On success the command prints the closed LUT address and the transaction signature.

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
