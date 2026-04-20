---
# Remember to also update the date in src/components/products/guides/index.js
title: Storage Balance
metaTitle: Storage Balance | Metaplex CLI
description: Show the current balance of your storage provider account.
keywords:
  - mplx CLI
  - storage balance
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

The `mplx toolbox storage balance` command prints the current prepaid balance held with the configured storage provider.

- Reads the balance from the active storage provider (e.g. Irys).
- Takes no arguments and no flags.
- Outputs a JSON object containing `basisPoints` (lamports) and the SOL-denominated amount.
- Separate from your wallet SOL balance — only reflects storage credit.

## Quick Reference

| Item | Value |
|------|-------|
| Command | `mplx toolbox storage balance` |
| Arguments | None |
| Flags | None |
| Output format | JSON |
| Top up | [`toolbox storage fund`](/dev-tools/cli/toolbox/storage-fund) |
| Withdraw | [`toolbox storage withdraw`](/dev-tools/cli/toolbox/storage-withdraw) |

## Basic Usage

Run the command with no arguments.

```bash
mplx toolbox storage balance
```

## Examples

The command has a single invocation form.

```bash
mplx toolbox storage balance
```

## Output

The command prints the balance as JSON, including `basisPoints` (lamports) and the SOL-denominated amount.

## Notes

- The storage balance is prepaid credit held with the storage provider (e.g. Irys). It is separate from your wallet SOL balance.
- Top up with [`toolbox storage fund`](/dev-tools/cli/toolbox/storage-fund) or withdraw with [`toolbox storage withdraw`](/dev-tools/cli/toolbox/storage-withdraw).
