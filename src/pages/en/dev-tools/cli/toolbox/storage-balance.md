---
title: Storage Balance
metaTitle: Storage Balance | Metaplex CLI
description: Show the current balance of your storage provider account.
---

The `mplx toolbox storage balance` command prints the current balance held with the configured storage provider.

## Basic Usage

```bash
mplx toolbox storage balance
```

This command takes no arguments.

## Examples

```bash
mplx toolbox storage balance
```

## Output

Prints the balance as JSON, including `basisPoints` (lamports) and the SOL-denominated amount.

## Notes

- The storage balance is prepaid credit held with the storage provider (e.g. Irys). It is separate from your wallet SOL balance.
- Top up with [`toolbox storage fund`](/dev-tools/cli/toolbox/storage-fund) or withdraw with [`toolbox storage withdraw`](/dev-tools/cli/toolbox/storage-withdraw).
