---
title: Storage Fund
metaTitle: Storage Fund | Metaplex CLI
description: Fund your storage provider account with SOL.
---

The `mplx toolbox storage fund` command deposits SOL into your storage provider account so that subsequent uploads have available credit.

## Basic Usage

```bash
mplx toolbox storage fund <amount-in-sol>
```

## Arguments

- `amount` *(required)*: Amount of SOL to deposit into the storage account.

## Examples

```bash
mplx toolbox storage fund 0.1
mplx toolbox storage fund 1
```

## Output

On success, prints the new balance of the storage account.

## Notes

- Funds are transferred from the wallet configured as the CLI payer.
- View the current balance with [`toolbox storage balance`](/dev-tools/cli/toolbox/storage-balance).
- Funds can be retrieved with [`toolbox storage withdraw`](/dev-tools/cli/toolbox/storage-withdraw).
