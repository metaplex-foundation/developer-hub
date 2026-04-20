---
# Remember to also update the date in src/components/products/guides/index.js
title: Mint Tokens
metaTitle: Mint Tokens | Metaplex CLI
description: Mint additional tokens from an existing SPL mint to a recipient's wallet.
keywords:
  - mplx CLI
  - mint tokens
  - SPL token
  - mint authority
  - Solana
about:
  - Metaplex CLI
  - SPL Token
proficiencyLevel: Beginner
created: '04-20-2026'
updated: '04-20-2026'
programmingLanguage:
  - Bash
---

## Summary

The `mplx toolbox token mint` command mints additional units of an existing SPL token to a recipient's wallet.

- Requires the current identity to hold mint authority for the specified mint.
- Creates the recipient's associated token account on the fly if it does not exist.
- Defaults the recipient to the current identity unless `--recipient` is passed.
- Amount is expressed in raw token units — divide by `10^decimals` for display units.

## Quick Reference

| Item | Value |
|------|-------|
| Command | `mplx toolbox token mint <mint> <amount>` |
| Required args | `mint`, `amount` (integer > 0) |
| Optional flag | `--recipient <pubkey>` |
| Amount unit | Raw token units (not display units) |
| Related | [`toolbox token create`](/dev-tools/cli/toolbox/token-create) |

## Basic Usage

Pass the mint address and the amount as positional arguments.

```bash
mplx toolbox token mint <mint> <amount>
```

## Arguments

The command takes two positional arguments.

- `mint` *(required)*: Mint address of the token.
- `amount` *(required)*: Number of tokens to mint. Must be greater than `0`.

## Flags

Optional flag overrides the default recipient.

- `--recipient <pubkey>`: Wallet that will receive the minted tokens. Defaults to the current identity.

## Examples

These examples show minting to the current identity and to a specific recipient.

```bash
mplx toolbox token mint 7EYnhQoR9YM3c7UoaKRoA4q6YQ2Jx4VvQqKjB5x8XqWs 1000
mplx toolbox token mint 7EYnhQoR9YM3c7UoaKRoA4q6YQ2Jx4VvQqKjB5x8XqWs 1000 --recipient 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM
```

## Output

On success the command prints the mint address, recipient, minted amount, and transaction signature.

```
--------------------------------
Tokens minted successfully!

Mint Details:
Mint Address: <mint>
Recipient: <recipient>
Amount Minted: <amount>

Transaction Signature: <signature>
Explorer: <explorer_url>
--------------------------------
```

## Notes

- `amount` is expressed in raw token units. Divide by `10^decimals` to express it in display units.
- The recipient's associated token account is created on the fly if it doesn't exist.
- You must hold mint authority for the mint — otherwise the transaction will fail.
- Create a new token with [`toolbox token create`](/dev-tools/cli/toolbox/token-create).
