---
title: Mint Tokens
metaTitle: Mint Tokens | Metaplex CLI
description: Mint additional tokens from an existing SPL mint to a recipient's wallet.
---

The `mplx toolbox token mint` command mints additional units of an existing SPL token to a recipient's wallet. The current identity must hold mint authority for the specified mint.

## Basic Usage

```bash
mplx toolbox token mint <mint> <amount>
```

## Arguments

- `mint` *(required)*: Mint address of the token.
- `amount` *(required)*: Number of tokens to mint. Must be greater than `0`.

## Flags

- `--recipient <pubkey>`: Wallet that will receive the minted tokens. Defaults to the current identity.

## Examples

```bash
mplx toolbox token mint 7EYnhQoR9YM3c7UoaKRoA4q6YQ2Jx4VvQqKjB5x8XqWs 1000
mplx toolbox token mint 7EYnhQoR9YM3c7UoaKRoA4q6YQ2Jx4VvQqKjB5x8XqWs 1000 --recipient 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM
```

## Output

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
