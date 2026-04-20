---
# Remember to also update the date in src/components/products/guides/index.js
title: Rent
metaTitle: Rent | Metaplex CLI
description: Calculate the Solana rent cost for an account of a given size.
keywords:
  - mplx CLI
  - Solana rent
  - rent exemption
  - account size
  - lamports
about:
  - Metaplex CLI
  - Solana Rent
proficiencyLevel: Beginner
created: '04-20-2026'
updated: '04-20-2026'
---

## Summary

The `mplx toolbox rent` command returns the rent-exempt balance required for a Solana account of a given size.

- Reads the current rent rate directly from the configured RPC.
- Outputs SOL by default or raw lamports with `--lamports`.
- Excludes the 128-byte account header when `--noHeader` is passed.
- Read-only — no transaction is sent.

## Quick Reference

The table below summarizes the command's inputs, flags, and common account sizes.

| Item | Value |
|------|-------|
| Command | `mplx toolbox rent <bytes>` |
| Required arg | `bytes` — integer number of bytes |
| Optional flags | `--lamports`, `--noHeader` |
| Read-only | Yes — no transaction is sent |
| Common sizes | SPL mint = 82 bytes · SPL token account = 165 bytes |

## Basic Usage

Pass the account size in bytes as the sole positional argument.

```bash
mplx toolbox rent <bytes>
```

## Arguments

The command takes a single positional integer.

- `bytes` *(required)*: Number of bytes the account will occupy.

## Flags

Optional flags adjust the unit and whether the account header is included.

- `--noHeader`: Ignore the 128-byte account header when calculating rent.
- `--lamports`: Display the rent cost in lamports instead of SOL.

## Examples

These examples cover the common rent-calculation scenarios.

```bash
# Rent for a 165-byte SPL token account
mplx toolbox rent 165

# Rent in lamports
mplx toolbox rent 165 --lamports

# Exclude the 128-byte account header
mplx toolbox rent 165 --noHeader
```

## Output

Default output prints the rent-exempt balance in SOL for the given byte size.

```
--------------------------------
    Rent cost for <bytes> bytes is <amount> SOL
--------------------------------
```

## Notes

- Solana accounts must hold at least the rent-exempt minimum balance to avoid being purged.
- Common sizes: SPL token account = `165` bytes, SPL mint = `82` bytes.
