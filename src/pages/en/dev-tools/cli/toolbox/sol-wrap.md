---
# Remember to also update the date in src/components/products/guides/index.js
title: Wrap SOL
metaTitle: Wrap SOL | Metaplex CLI
description: Wrap native SOL into wSOL (wrapped SOL) tokens.
keywords:
  - mplx CLI
  - wrap SOL
  - wSOL
  - wrapped SOL
  - Solana
about:
  - Metaplex CLI
  - Wrapped SOL
proficiencyLevel: Beginner
created: '04-20-2026'
updated: '04-20-2026'
---

## Summary

The `mplx toolbox sol wrap` command wraps native SOL into wSOL by transferring SOL to the native-mint associated token account and syncing the balance.

- Creates the wSOL associated token account if it does not yet exist.
- Adds the specified amount to the wSOL balance of the current identity.
- Amount must be a positive number expressed in SOL (fractions allowed).
- Inverse of [`toolbox sol unwrap`](/dev-tools/cli/toolbox/sol-unwrap).

## Quick Reference

| Item | Value |
|------|-------|
| Command | `mplx toolbox sol wrap <amount>` |
| Required arg | `amount` — SOL amount (e.g. `1`, `0.5`) |
| Flags | None |
| Native mint | `So11111111111111111111111111111111111111112` |
| Inverse | [`toolbox sol unwrap`](/dev-tools/cli/toolbox/sol-unwrap) |

## Basic Usage

Pass the amount of SOL to wrap as the sole positional argument.

```bash
mplx toolbox sol wrap <amount>
```

## Arguments

The command takes a single positional argument specifying the amount.

- `amount` *(required)*: Amount of SOL to wrap (e.g. `1` or `0.5`). Must be greater than `0`.

## Examples

These examples show whole and fractional amounts.

```bash
mplx toolbox sol wrap 1
mplx toolbox sol wrap 0.5
```

## Output

On success the command prints the wrapped amount, the wSOL token account, and the transaction signature.

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
