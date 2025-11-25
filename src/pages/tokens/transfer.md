---
title: Transfer Fungible Tokens
metaTitle: How to Transfer Fungible Tokens on Solana | SPL Token Transfer
description: Learn how to transfer fungible SPL tokens between wallets on Solana using JavaScript and Umi
created: '11-25-2025'
updated: '11-25-2025'
---

Transfer fungible tokens (SPL tokens) between wallets on the Solana blockchain. {% .lead %}

## Transfer Tokens

{% code-tabs-imported from="token-metadata/fungibles/transfer" frameworks="umi" /%}

## Parameters

Customize these parameters for your transfer:

| Parameter | Description |
|-----------|-------------|
| `mintAddress` | The token mint address |
| `destinationAddress` | Recipient wallet address |
| `amount` | Number of tokens to transfer |

## How It Works

The transfer process involves four steps:

1. **Find source token account** - Locate your token account using `findAssociatedTokenPda`
2. **Find destination token account** - Locate the recipient's token account
3. **Create destination token account if needed** - Use `createTokenIfMissing` to ensure the recipient has a token account
4. **Transfer tokens** - Execute the transfer with `transferTokens`

## Token Accounts

Each wallet has an Associated Token Account (ATA) for each type of token they hold. The `findAssociatedTokenPda` function derives the address of these accounts based on the wallet address and token mint.

The `createTokenIfMissing` function automatically creates the token account if it doesn't exist yet, or does nothing if it already exists. This ensures the transfer will always succeed.
