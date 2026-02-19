---
title: SPL Tokens and Token Programs
metaTitle: SPL Tokens and Token Programs | Understanding Solana Tokens
description: Learn how SPL tokens work on Solana, including the Token Program, mint accounts, token accounts, and how Metaplex builds on top of the token standard.
# remember to update dates also in /components/products/guides/index.js
created: '02-06-2026'
updated: null
---

Understand how tokens work on Solana—from the SPL Token Program to Metaplex Core—and how Metaplex extends tokens with metadata, royalties, and more. {% .lead %}

## What You'll Learn

- How SPL tokens work on Solana
- The role of mint accounts, token accounts, and ATAs
- How to choose between Token Program, Token Metadata, and Metaplex Core
- How Metaplex builds on top of the token standard

## Prerequisites

- [Understanding Solana accounts](/solana/understanding-solana-accounts)
- [Solana CLI installed](/solana/solana-cli-essentials)

## What Are SPL Tokens?

**SPL tokens** (Solana Program Library tokens) are the standard for fungible and non-fungible tokens on Solana. Every token you interact with—USDC, BONK, NFTs, compressed NFTs—is built on the SPL token standard.

Unlike Ethereum where each token deploys its own smart contract (ERC-20), Solana uses a **single shared program** that manages all tokens:

```
Ethereum:                          Solana:
┌──────────────┐                   ┌──────────────────────┐
│ USDC Contract│                   │   Token Program      │
├──────────────┤                   │   (single program)   │
│ BONK Contract│                   │                      │
├──────────────┤         vs        │  manages ALL tokens: │
│ DAI Contract │                   │  - USDC mint         │
├──────────────┤                   │  - BONK mint         │
│  ... each    │                   │  - Your NFT mint     │
│  separate    │                   │  - Every SPL token   │
└──────────────┘                   └──────────────────────┘
```

## The Three Account Types

Every SPL token involves three types of accounts:

### 1. Mint Account

The **mint account** defines the token itself. There's exactly one per token type.

```
┌─────────────────────────────────────────────┐
│              Mint Account (82 bytes)         │
├─────────────────────────────────────────────┤
│  mint_authority: <pubkey or null>           │  ← Who can create more supply
│  supply: 1,000,000,000                      │  ← Total tokens in existence
│  decimals: 6                                │  ← Decimal precision
│  is_initialized: true                       │
│  freeze_authority: <pubkey or null>         │  ← Who can freeze accounts
└─────────────────────────────────────────────┘
```

Key properties:
- **Decimals** define precision (USDC uses 6, SOL-like tokens use 9, NFTs use 0)
- **Supply** tracks total minted tokens
- **Mint authority** can create new tokens (set to null to make supply fixed)
- **Freeze authority** can freeze individual token accounts

### 2. Token Account

A **token account** holds a specific user's balance of a specific token. Each wallet needs a separate token account for each token they hold.

```
┌─────────────────────────────────────────────┐
│            Token Account (165 bytes)         │
├─────────────────────────────────────────────┤
│  mint: <which token>                        │
│  owner: <which wallet controls this>        │
│  amount: 500,000,000                        │  ← Balance (raw, before decimals)
│  delegate: <optional delegated authority>   │
│  state: Initialized                         │
│  is_native: false                           │
│  delegated_amount: 0                        │
│  close_authority: <optional>                │
└─────────────────────────────────────────────┘
```

### 3. Associated Token Account (ATA)

An **Associated Token Account** is a token account with a **deterministic address** derived from the wallet and mint:

```
ATA address = findProgramAddress(
  [wallet_address, TOKEN_PROGRAM_ID, mint_address],
  ASSOCIATED_TOKEN_PROGRAM_ID
)
```

This means:
- Given a wallet and a token mint, you can always find the ATA address
- No need to track token account addresses separately
- Wallets and explorers automatically know where to look

```bash
# Find the ATA for a wallet and mint
spl-token address --owner <WALLET> --token <MINT>
```

{% callout title="ATAs Are the Standard" %}
Always use Associated Token Accounts. Metaplex tools (MPLX CLI and SDKs) create ATAs automatically when needed. You rarely need to create token accounts manually.
{% /callout %}

## The Token Programs

Solana has two token programs:

### Token Program (Original)

**Program ID:** `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`

The original SPL Token Program handles:
- Creating mints and token accounts
- Minting, transferring, and burning tokens
- Approving delegates
- Freezing/thawing accounts

Most existing tokens (USDC, BONK, and most NFTs) use this program.

### Token-2022 (Token Extensions)

Solana also has a newer **Token-2022** program (`TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb`) that adds extensions like transfer fees and confidential transfers. However, ecosystem support for Token-2022 is still maturing—most wallets, marketplaces, and DeFi protocols are optimized for the original Token Program.

### What Should I Use?

| Scenario | Recommended | Why |
|----------|-------------|-----|
| **Fungible tokens** | **Token Program + [Token Metadata](/token-metadata)** | Maximum compatibility with wallets, exchanges, and DeFi |
| **NFTs and digital assets** | **[Metaplex Core](/core)** | Purpose-built for NFTs, lower cost, better performance |
| **NFT collections with minting** | **[Core Candy Machine](/core-candy-machine)** | Automated minting with guards and phases |
| **Massive NFT collections (100k+)** | **[Bubblegum](/bubblegum)** | Compressed NFTs at a fraction of the cost |
| **Existing Token Metadata NFTs** | **[Token Metadata](/token-metadata)** | Continue with the legacy standard |

{% callout title="Metaplex Core for NFTs" %}
**[Metaplex Core](/core)** is the recommended standard for NFTs and digital assets. It doesn't rely on SPL tokens—instead it uses a purpose-built account model that is more efficient, cheaper, and easier to work with. Always choose Core for new NFT projects.
{% /callout %}

## How Metaplex Extends Tokens

The SPL Token Program stores only basic information (supply, decimals, authority). It has no concept of names, images, or royalties. Metaplex fills this gap:

```
┌─────────────────────────────────────────────────────────────┐
│  SPL Token Program          Metaplex Token Metadata         │
│  (token mechanics)          (rich metadata)                 │
│                                                             │
│  Mint Account ◄────────────► Metadata Account               │
│  ├── supply                  ├── name: "Cool Token"         │
│  ├── decimals                ├── symbol: "COOL"             │
│  └── authority               ├── uri: "https://..."         │
│                              ├── creators: [...]            │
│  Token Account               ├── royalties: 5%             │
│  ├── owner                   └── collection: <pubkey>       │
│  └── amount                                                 │
│                             Master Edition Account          │
│                              ├── max_supply: 1              │
│                              └── (makes it an NFT)          │
└─────────────────────────────────────────────────────────────┘
```

### The Metaplex Ecosystem

| Product | Purpose |
|---------|---------|
| **[Token Metadata](/token-metadata)** | Adds metadata (name, image, royalties) to any SPL token |
| **[Core](/core)** | Modern NFT standard (recommended for new projects) |
| **[Bubblegum](/bubblegum)** | Compressed NFTs for massive collections |
| **[Candy Machine](/candy-machine)** | Automated NFT minting |
| **[Core Candy Machine](/core-candy-machine)** | Candy Machine for Core NFTs |

## Common Operations

### Creating a Token with Metadata

Using the MPLX CLI (handles all accounts automatically):

```bash
# Create a fungible token with metadata
mplx toolbox token-create --name "My Token" --symbol "MTK" --decimals 9
```

This creates:
1. A **Mint Account** (Token Program)
2. A **Metadata Account** (Token Metadata Program)
3. Your wallet's **ATA** for the new token

### Checking Token Information

```bash
# View mint details
spl-token display <MINT_ADDRESS>

# View your token accounts
spl-token accounts

# View a specific token balance
spl-token balance --address <TOKEN_ACCOUNT_ADDRESS>
```

### Minting Tokens

```bash
# Mint tokens (you must be the mint authority)
spl-token mint <MINT_ADDRESS> <AMOUNT>

# Mint to a specific wallet
spl-token mint <MINT_ADDRESS> <AMOUNT> -- <RECIPIENT_TOKEN_ACCOUNT>
```

## NFTs Are Tokens

On Solana, an NFT is simply an SPL token with:
- **0 decimals** (no fractional amounts)
- **Supply of 1** (exactly one token exists)
- **Mint authority set to null** (no more can be minted)

This is how the original Token Metadata standard works. **Metaplex Core** takes a different approach with dedicated NFT accounts that are more efficient.

| Approach | How It Works | Best For |
|----------|-------------|----------|
| **Token Metadata** (legacy) | SPL token + metadata account | Existing projects, fungible tokens |
| **Core** (recommended) | Dedicated asset account | New NFT projects, collections |
| **Bubblegum** | Compressed on-chain data | Massive collections (100k+) |

## Rent Costs

Creating token-related accounts requires rent-exempt deposits:

```bash
# Check rent costs
solana rent 82     # Mint Account: ~0.002 SOL
solana rent 165    # Token Account: ~0.0025 SOL
```

When you close token accounts or burn NFTs, you recover these deposits.

## Troubleshooting

### "Account does not exist"

The recipient doesn't have a token account for this mint. Create one:

```bash
# Create an ATA for a recipient
spl-token create-account <MINT_ADDRESS> --owner <RECIPIENT_WALLET>
```

Most Metaplex tools create ATAs automatically.

### "Insufficient funds"

You need SOL for:
1. Transaction fees (~0.000005 SOL)
2. Rent for new accounts (~0.002 SOL per account)

```bash
solana airdrop 2  # On devnet
```

### "Owner does not match"

You're trying to operate on a token account you don't own, or using the wrong token program. Check the account's owner field matches the expected program.

## Next Steps

- [Create a Solana token](/solana/javascript/how-to-create-a-solana-token) - Hands-on token creation
- [Add metadata to tokens](/smart-contracts/token-metadata/guides/how-to-add-metadata-to-spl-tokens) - Enrich tokens with Metaplex metadata
- [Metaplex Core overview](/core) - The modern NFT standard
- [Understanding Solana accounts](/solana/understanding-solana-accounts) - Deeper account model understanding

## FAQ

### Do I need to understand SPL tokens to use Metaplex Core?

Not necessarily. Metaplex Core has its own account model that doesn't use SPL tokens. However, understanding SPL tokens helps you work with Token Metadata NFTs and fungible tokens.

### Should I use Token-2022?

For most use cases, the original Token Program with Metaplex Token Metadata is the best choice for fungible tokens. It has the widest ecosystem support across wallets, exchanges, and DeFi protocols.

### Why are there separate token accounts for each token?

This is a key Solana design choice. Separate accounts enable **parallel processing**—transfers of different tokens can happen simultaneously without conflicts, which is how Solana achieves high throughput.

### What's the difference between "owner" and "authority"?

- **Account owner** (on-chain field): The program that controls the account (Token Program)
- **Token account owner** (in account data): The wallet that controls the tokens
- **Mint authority** (in mint data): The wallet that can mint new supply
- **Freeze authority** (in mint data): The wallet that can freeze accounts
