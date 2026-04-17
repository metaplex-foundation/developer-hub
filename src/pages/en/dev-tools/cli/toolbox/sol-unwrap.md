---
title: Unwrap SOL
metaTitle: Unwrap SOL | Metaplex CLI
description: Unwrap all wSOL (wrapped SOL) tokens back to native SOL.
---

The `mplx toolbox sol unwrap` command unwraps the entire wSOL balance by closing the associated token account, returning the SOL to the owner.

## Basic Usage

```bash
mplx toolbox sol unwrap
```

This command takes no arguments — it unwraps the full balance of the current wallet's wSOL token account.

## Examples

```bash
mplx toolbox sol unwrap
```

## Output

```
--------------------------------
    Unwrapped <amount> SOL
    Token Account Closed: <associated_token_account>
    Signature: <transaction_signature>
    Explorer: <explorer_url>
--------------------------------
```

## Notes

- Unwrap is all-or-nothing — the entire wSOL balance is converted back to SOL and the token account is closed.
- Fails if no wSOL token account exists for the current wallet.
- Wrap with [`toolbox sol wrap`](/dev-tools/cli/toolbox/sol-wrap).
