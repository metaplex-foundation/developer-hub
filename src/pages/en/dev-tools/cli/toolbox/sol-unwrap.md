---
# Remember to also update the date in src/components/products/guides/index.js
title: Unwrap SOL
metaTitle: Unwrap SOL | Metaplex CLI
description: Unwrap all wSOL (wrapped SOL) tokens back to native SOL.
keywords:
  - mplx CLI
  - wSOL
  - wrapped SOL
  - unwrap SOL
  - Solana
about:
  - Metaplex CLI
  - Wrapped SOL
proficiencyLevel: Beginner
created: '04-20-2026'
updated: '04-20-2026'
---

## Summary

The `mplx toolbox sol unwrap` command unwraps the entire wSOL balance by closing the associated token account, returning the SOL to the owner.

- Closes the wSOL associated token account and returns all SOL to the identity.
- Takes no arguments and no flags.
- All-or-nothing — partial unwrapping is not supported.
- Fails if no wSOL token account exists for the current wallet.

## Quick Reference

The table below summarizes the command's shape and key constants.

| Item | Value |
|------|-------|
| Command | `mplx toolbox sol unwrap` |
| Arguments | None |
| Flags | None |
| Native mint | `So11111111111111111111111111111111111111112` |
| Inverse | [`toolbox sol wrap`](/dev-tools/cli/toolbox/sol-wrap) |

## Basic Usage

Run the command with no arguments to unwrap the full wSOL balance of the current wallet.

```bash
mplx toolbox sol unwrap
```

## Examples

The command has a single invocation form.

```bash
mplx toolbox sol unwrap
```

## Output

On success the command prints the unwrapped amount, the closed token account, and the transaction signature.

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
