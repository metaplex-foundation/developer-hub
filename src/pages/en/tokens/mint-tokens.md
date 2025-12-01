---
title: Mint Fungible Tokens
metaTitle: How to Mint Additional Fungible Tokens on Solana | Tokens
description: Learn how to mint additional fungible SPL tokens to a wallet on Solana using JavaScript and Umi
created: '11-28-2025'
updated: '11-28-2025'
---

Mint additional fungible tokens to increase the circulating supply of your token on Solana. {% .lead %}

## Mint Tokens

In the following section you can find a full code example and the parameters that you might have to change. This assumes you already have a fungible token created and want to mint more tokens.

{% code-tabs-imported from="token-metadata/fungibles/mint" frameworks="umi" /%}

## Parameters

Customize these parameters for your mint operation:

| Parameter | Description |
|-----------|-------------|
| `mintAddress` | The token mint address |
| `destinationAddress` | Wallet address to receive the tokens |
| `amount` | Number of tokens to mint |

## How It Works

The minting process involves three steps:

1. **Find destination token account** - Locate the recipient's token account using `findAssociatedTokenPda`
2. **Create token account if needed** - Use `createTokenIfMissing` to ensure the recipient has a token account
3. **Mint tokens** - Execute the mint with `mintTokensTo`

## Requirements

To mint additional tokens, you must:

- **Be the mint authority** - Only the wallet designated as the mint authority can mint new tokens
- **Have a mutable token** - The token must not have had its mint authority revoked

## Common Use Cases

- **Token distributions** - Distribute tokens to users or investors
- **Rewards programs** - Mint tokens as rewards for users
- **Liquidity provision** - Create tokens for liquidity pools
- **Airdrops** - Mint tokens to multiple wallets

## Important Notes

- The `amount` should account for decimals (e.g., for 9 decimals, minting 1 token requires `amount: 1_000_000_000`)
- You can mint to any wallet address—the token account will be created if it doesn't exist
- Only the mint authority can mint new tokens
