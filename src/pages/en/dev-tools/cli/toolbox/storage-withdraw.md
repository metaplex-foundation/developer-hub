---
# Remember to also update the date in src/components/products/guides/index.js
title: Storage Withdraw
metaTitle: Storage Withdraw | Metaplex CLI
description: Withdraw funds from your storage provider account back to your wallet.
keywords:
  - mplx CLI
  - storage withdraw
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

The `mplx toolbox storage withdraw` command withdraws SOL from your storage provider account back to your wallet.

- Withdraws a specific SOL amount, or the entire balance with `--all`.
- Requires either `amount` or `--all` — not both.
- Funds are returned to the wallet configured as the CLI payer.
- Prints the new storage balance on success.

## Quick Reference

The table below summarizes the command's inputs and related commands.

| Item | Value |
|------|-------|
| Command | `mplx toolbox storage withdraw {<amount> \| --all}` |
| Input | Exactly one of `amount` (SOL) or `--all` — mutually exclusive |
| Default recipient | Wallet configured as the CLI payer |
| Provider | Active storage provider (e.g. Irys) |
| Inverse | [`toolbox storage fund`](/dev-tools/cli/toolbox/storage-fund) |

## Basic Usage

Pass an amount to withdraw a specific value, or use `--all` to drain the full balance.

```bash
# Withdraw a specific amount
mplx toolbox storage withdraw <amount>

# Withdraw all funds
mplx toolbox storage withdraw --all
```

## Arguments

The single positional argument specifies the amount when `--all` is not set.

- `amount` *(required unless `--all` is set)*: Amount of SOL to withdraw.

## Flags

The optional flag drains the full balance.

- `--all`: Withdraw the entire balance from the storage account.

## Examples

These examples show a fixed amount and a full drain.

```bash
mplx toolbox storage withdraw 0.05
mplx toolbox storage withdraw --all
```

## Output

On success the command prints the new balance of the storage account.

## Notes

- Provide either an amount or `--all` — not both.
- Funds are returned to the wallet configured as the CLI payer.
- View the current balance with [`toolbox storage balance`](/dev-tools/cli/toolbox/storage-balance).
