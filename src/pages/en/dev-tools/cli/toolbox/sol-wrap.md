---
title: Wrap SOL
metaTitle: Wrap SOL | Metaplex CLI
description: Wrap native SOL into wSOL (wrapped SOL) tokens.
---

The `mplx toolbox sol wrap` command wraps native SOL into wSOL tokens by transferring SOL to the associated token account for the native mint and syncing the balance.

## Basic Usage

```bash
mplx toolbox sol wrap <amount>
```

## Arguments

- `amount` *(required)*: Amount of SOL to wrap (e.g. `1` or `0.5`).

## Examples

```bash
mplx toolbox sol wrap 1
mplx toolbox sol wrap 0.5
```

## Output

```
--------------------------------
    Wrapped <amount> SOL to wSOL
    Token Account: <associated_token_account>
    Signature: <transaction_signature>
    Explorer: <explorer_url>
--------------------------------
```

## Notes

- If the associated wSOL token account does not yet exist, it will be created as part of the same transaction.
- The native mint address is `So11111111111111111111111111111111111111112`.
- Unwrap with [`toolbox sol unwrap`](/dev-tools/cli/toolbox/sol-unwrap).
