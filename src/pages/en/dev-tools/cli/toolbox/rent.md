---
title: Rent
metaTitle: Rent | Metaplex CLI
description: Calculate the Solana rent cost for an account of a given size.
---

The `mplx toolbox rent` command returns the rent-exempt balance required for a Solana account of a given size.

## Basic Usage

```bash
mplx toolbox rent <bytes>
```

## Arguments

- `bytes` *(required)*: Number of bytes the account will occupy.

## Flags

- `--noHeader`: Ignore the 128-byte account header when calculating rent.
- `--lamports`: Display the rent cost in lamports instead of SOL.

## Examples

```bash
# Rent for a 165-byte SPL token account
mplx toolbox rent 165

# Rent in lamports
mplx toolbox rent 165 --lamports

# Exclude the 128-byte account header
mplx toolbox rent 165 --noHeader
```

## Output

```
--------------------------------
    Rent cost for <bytes> bytes is <amount> SOL
--------------------------------
```

## Notes

- Solana accounts must hold at least the rent-exempt minimum balance to avoid being purged.
- Common sizes: SPL token account = `165` bytes, SPL mint = `82` bytes.
