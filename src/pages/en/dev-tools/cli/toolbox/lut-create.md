---
# Remember to also update the date in src/components/products/guides/index.js
title: Create Address Lookup Table
metaTitle: Create Address Lookup Table | Metaplex CLI
description: Create a new Solana Address Lookup Table (LUT) with optional initial addresses.
keywords:
  - mplx CLI
  - Address Lookup Table
  - LUT
  - create LUT
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

The `mplx toolbox lut create` command creates a new Solana Address Lookup Table (LUT) and, when addresses are provided, extends it in the same transaction.

- Derives the LUT address from the authority and a recent slot.
- Accepts an optional comma-separated list of public keys as initial entries.
- Defaults the authority to the current identity unless `--authority` is passed.
- Returns the LUT address and the transaction signature on success.

## Quick Reference

The table below summarizes the command's syntax and defaults.

| Item | Value |
|------|-------|
| Command | `mplx toolbox lut create [addresses]` |
| Optional arg | `addresses` — comma-separated list of public keys |
| Optional flags | `--recentSlot <number>`, `--authority <pubkey>` |
| LUT address | PDA derived from `authority` + `recentSlot` |
| Follow-ups | [`toolbox lut fetch`](/dev-tools/cli/toolbox/lut-fetch), [`toolbox lut deactivate`](/dev-tools/cli/toolbox/lut-deactivate), [`toolbox lut close`](/dev-tools/cli/toolbox/lut-close) |

## Basic Usage

Run the command with no arguments to create an empty LUT, or pass a comma-separated list of public keys to seed it.

```bash
# Create an empty LUT
mplx toolbox lut create

# Create a LUT with initial addresses
mplx toolbox lut create "<pubkey1>,<pubkey2>"
```

## Arguments

The single positional argument is an optional comma-separated list of public keys.

- `addresses` *(optional)*: Comma-separated list of public keys to include in the LUT.

## Flags

Optional flags override the recent slot and authority defaults.

- `--recentSlot <number>`: Recent slot used to derive the LUT PDA. Defaults to the latest slot.
- `--authority <pubkey>`: Authority public key for the LUT. Defaults to the current identity.

## Examples

These examples show empty, seeded, and custom-authority LUT creation.

```bash
mplx toolbox lut create
mplx toolbox lut create "11111111111111111111111111111111,TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
mplx toolbox lut create "11111111111111111111111111111111" --authority <authority-pubkey>
```

## Output

On success the command prints the new LUT address and the transaction signature.

```
--------------------------------
Address Lookup Table Created
LUT Address: <lut_address>
Signature: <transaction_signature>
--------------------------------
```

## Notes

- The LUT address is a PDA derived from the authority and recent slot.
- Use [`toolbox lut fetch`](/dev-tools/cli/toolbox/lut-fetch) to read back the contents.
- To remove a LUT, deactivate it first with [`toolbox lut deactivate`](/dev-tools/cli/toolbox/lut-deactivate), then close it with [`toolbox lut close`](/dev-tools/cli/toolbox/lut-close).
