---
title: Storage Withdraw
metaTitle: Storage Withdraw | Metaplex CLI
description: Withdraw funds from your storage provider account back to your wallet.
---

The `mplx toolbox storage withdraw` command withdraws SOL from your storage provider account back to your wallet.

## Basic Usage

```bash
# Withdraw a specific amount
mplx toolbox storage withdraw <amount-in-sol>

# Withdraw all funds
mplx toolbox storage withdraw --all
```

## Arguments

- `amount` *(required unless `--all` is set)*: Amount of SOL to withdraw.

## Flags

- `--all`: Withdraw the entire balance from the storage account.

## Examples

```bash
mplx toolbox storage withdraw 0.05
mplx toolbox storage withdraw --all
```

## Output

On success, prints the new balance of the storage account.

## Notes

- Provide either an amount or `--all` — not both.
- Funds are returned to the wallet configured as the CLI payer.
- View the current balance with [`toolbox storage balance`](/dev-tools/cli/toolbox/storage-balance).
