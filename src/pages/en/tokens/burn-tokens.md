---
title: Burn Fungible Tokens
metaTitle: How to Burn Fungible Tokens on Solana | Tokens
description: Learn how to burn fungible SPL tokens on Solana using JavaScript and Umi
created: '11-28-2025'
updated: '11-28-2025'
---

Burn fungible tokens to permanently remove them from circulation on the Solana blockchain. {% .lead %}

## Burn Tokens

In the following section you can find a full code example and the parameters that you might have to change. Burning tokens permanently destroys them—this action cannot be undone.

{% code-tabs-imported from="token-metadata/fungibles/burn" frameworks="umi" /%}

## Parameters

Customize these parameters for your burn operation:

| Parameter | Description |
|-----------|-------------|
| `mintAddress` | The token mint address |
| `amount` | Number of tokens to burn |

## How It Works

The burn process involves two steps:

1. **Find your token account** - Locate your token account using `findAssociatedTokenPda`
2. **Burn tokens** - Execute the burn with `burnToken`

## When to Burn Tokens

Common use cases for burning tokens include:

- **Reducing supply** - Decrease total circulating supply
- **Deflationary mechanics** - Implement tokenomics that reduce supply over time
- **Error correction** - Remove tokens minted by mistake

## Important Notes

- Burning is **permanent** and cannot be reversed
- You can only burn tokens that you own
- The `amount` should account for decimals (e.g., for 9 decimals, burning 1 token requires `amount: 1_000_000_000`)
