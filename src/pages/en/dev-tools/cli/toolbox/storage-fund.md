---
# Remember to also update the date in src/components/products/guides/index.js
title: Storage Fund
metaTitle: Storage Fund | Metaplex CLI
description: Fund your storage provider account with SOL.
keywords:
  - mplx CLI
  - storage fund
  - Irys
  - Arweave
  - storage provider
about:
  - Metaplex CLI
  - Storage Providers
proficiencyLevel: Beginner
created: '04-20-2026'
updated: '04-20-2026'
---

## Summary

The `mplx toolbox storage fund` command deposits SOL into your storage provider account so subsequent uploads have available credit.

- Transfers SOL from the current CLI payer to the storage provider.
- Amount is specified in SOL (fractions allowed).
- Prints the new storage balance on success.
- Used before large uploads to avoid mid-run funding prompts.

## Quick Reference

| Item | Value |
|------|-------|
| Command | `mplx toolbox storage fund <amount>` |
| Required arg | `amount` — SOL amount to deposit |
| Flags | None |
| Provider | Active storage provider (e.g. Irys) |
| Inverse | [`toolbox storage withdraw`](/dev-tools/cli/toolbox/storage-withdraw) |

## Basic Usage

Pass the amount of SOL to deposit as the sole positional argument.

```bash
mplx toolbox storage fund <amount>
```

## Arguments

The command takes a single positional argument specifying the amount.

- `amount` *(required)*: Amount of SOL to deposit into the storage account.

## Examples

These examples show fractional and whole-SOL deposits.

```bash
mplx toolbox storage fund 0.1
mplx toolbox storage fund 1
```

## Output

On success the command prints the new balance of the storage account.

## Notes

- Funds are transferred from the wallet configured as the CLI payer.
- View the current balance with [`toolbox storage balance`](/dev-tools/cli/toolbox/storage-balance).
- Funds can be retrieved with [`toolbox storage withdraw`](/dev-tools/cli/toolbox/storage-withdraw).
