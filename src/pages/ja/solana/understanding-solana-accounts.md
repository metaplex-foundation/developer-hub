---
title: Understanding Solana Accounts
metaTitle: Understanding Solana Accounts | Solana Account Model Guide
description: Learn how Solana accounts work, including ownership, rent, and how they differ from Ethereum. Essential knowledge for token and NFT development.
created: '02-04-2026'
updated: null
---

A comprehensive guide to Solana's account model—the foundation for understanding tokens, NFTs, and all on-chain data storage. {% .lead %}

## What You'll Learn

- How Solana accounts differ from Ethereum accounts
- Account ownership and the program model
- Rent and rent exemption
- Types of accounts you'll encounter in token development

## Prerequisites

- Basic blockchain understanding
- [Solana CLI installed](/solana/solana-cli-essentials) (for examples)

## The Solana Account Model

On Solana, **everything is an account**. Unlike Ethereum where contracts have their own storage, Solana separates **code** (programs) from **data** (accounts).

```
┌─────────────────────────────────────────────┐
│                  Account                     │
├─────────────────────────────────────────────┤
│  lamports: 1000000                          │  ← Balance (in lamports, 1 SOL = 1B lamports)
│  data: [bytes...]                           │  ← Arbitrary data storage
│  owner: 11111111111111111111111111111111    │  ← Program that controls this account
│  executable: false                          │  ← Is this a program?
│  rent_epoch: 123                            │  ← Rent tracking
└─────────────────────────────────────────────┘
```

### Key Concepts

| Concept | Description |
|---------|-------------|
| **Lamports** | The balance in the smallest unit (1 SOL = 1,000,000,000 lamports) |
| **Data** | Arbitrary bytes stored in the account |
| **Owner** | The program ID that can modify this account's data |
| **Executable** | Whether this account contains program code |

## Account Ownership

Every account has an **owner**—a program that has exclusive rights to:
- Modify the account's data
- Debit lamports from the account
- Change the account's owner (transfer ownership)

### The System Program

The **System Program** (`11111111111111111111111111111111`) owns all basic wallet accounts:

```bash
# View a wallet account
solana account <YOUR_WALLET_ADDRESS>

# Output shows:
# Owner: 11111111111111111111111111111111
```

When you transfer SOL, you're asking the System Program to debit your account.

### Program Ownership

When a program creates an account, that program becomes the owner:

```
┌─────────────────────────────────────────────────────────────┐
│  Token Program owns token-related accounts                  │
│                                                             │
│  Token Program ──owns──► Mint Account                       │
│       │                                                     │
│       └──────owns──► Token Account (your token balance)     │
│                                                             │
│  Metaplex Token Metadata Program ──owns──► Metadata Account │
└─────────────────────────────────────────────────────────────┘
```

## Types of Accounts

### 1. Wallet Accounts (System Accounts)

Basic accounts that hold SOL:

```bash
# Create a new wallet
solana-keygen new --outfile wallet.json

# This creates a keypair, and when funded, a System Program-owned account
solana airdrop 1
```

Properties:
- Owner: System Program
- Data: Empty (0 bytes)
- Purpose: Hold SOL, sign transactions

### 2. Program Accounts

Accounts that contain executable code:

```bash
# View a program account
solana account TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA

# Owner: BPFLoaderUpgradeab1e11111111111111111111111
# Executable: true
```

Properties:
- Owner: BPF Loader
- Executable: true
- Data: Compiled program bytecode

### 3. Data Accounts

Accounts that store arbitrary data for programs:

```bash
# View a token mint account
solana account <MINT_ADDRESS>

# Owner: TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA (Token Program)
# Executable: false
# Data: [mint data...]
```

### 4. Program Derived Addresses (PDAs)

Special accounts derived deterministically from a program ID and seeds:

```
PDA = hash(seeds + program_id + "PDA")
```

Properties:
- No private key (cannot sign transactions)
- Only the deriving program can sign for it
- Deterministic—same inputs always produce same address

See [Understanding PDAs](/solana/understanding-pdas) for more details.

## Accounts in Token Development

When working with Metaplex tools, you'll interact with several account types:

### Token Mint Account

Represents the token itself:

```
┌─────────────────────────────────────────────┐
│              Mint Account                    │
├─────────────────────────────────────────────┤
│  mint_authority: <pubkey>                   │  ← Who can mint more
│  supply: 1000000                            │  ← Total supply
│  decimals: 9                                │  ← Decimal places
│  freeze_authority: <pubkey>                 │  ← Who can freeze
└─────────────────────────────────────────────┘
```

### Token Account (Associated Token Account)

Holds a user's balance of a specific token:

```
┌─────────────────────────────────────────────┐
│            Token Account                     │
├─────────────────────────────────────────────┤
│  mint: <mint_pubkey>                        │  ← Which token
│  owner: <wallet_pubkey>                     │  ← Who owns these tokens
│  amount: 500                                │  ← Balance
│  state: Initialized                         │  ← Account state
└─────────────────────────────────────────────┘
```

### Metadata Account (Metaplex)

Stores token/NFT metadata on-chain:

```
┌─────────────────────────────────────────────┐
│           Metadata Account                   │
├─────────────────────────────────────────────┤
│  mint: <mint_pubkey>                        │  ← Associated mint
│  name: "My Token"                           │
│  symbol: "MTK"                              │
│  uri: "https://..."                         │  ← Off-chain metadata
│  creators: [...]                            │  ← Creator info
│  royalties: 500 (5%)                        │
└─────────────────────────────────────────────┘
```

### SPL Token Model vs Metaplex Core

The account structure for tokens and NFTs differs significantly depending on the program you use.

**SPL Token + Token Metadata** uses multiple accounts per asset:

```
┌──────────────────────────────────────────────────────┐
│  SPL Token Model (3+ accounts per asset)             │
│                                                      │
│  Mint Account          ← Token definition (82 bytes) │
│  Token Account (ATA)   ← Holder's balance (165 bytes)│
│  Metadata Account      ← Name, symbol, URI (PDA)     │
│  Master Edition        ← NFT edition tracking (PDA)  │
└──────────────────────────────────────────────────────┘
```

Each account is owned by a different program, requires its own rent-exempt deposit, and must be managed separately. Transferring an NFT means updating the Token Account; metadata lives in a separate PDA owned by the Token Metadata program.

**Metaplex Core** collapses everything into a single account:

```
┌──────────────────────────────────────────────────────┐
│  Core Model (1 account per asset)                    │
│                                                      │
│  Asset Account                                       │
│    ├── owner: <wallet_pubkey>                        │
│    ├── name: "My NFT"                                │
│    ├── uri: "https://..."                            │
│    └── plugins: [royalties, freeze, burn, ...]       │
└──────────────────────────────────────────────────────┘
```

With Core, ownership, metadata, and extensibility (via plugins) are stored in one account owned by the Core program. This means fewer accounts to create, lower rent costs, and simpler transactions.

| | SPL Token + Token Metadata | Metaplex Core |
|---|---|---|
| **Accounts per NFT** | 3–4 (mint, token, metadata, edition) | 1 (asset) |
| **Rent cost** | ~0.01 SOL | ~0.003 SOL |
| **Ownership** | Token Account tracks balance | Asset account `owner` field |
| **Metadata** | Separate PDA | Built into the asset account |
| **Extensibility** | Token Extensions (Token-2022) | Plugin system |
| **Best for** | Fungible tokens (SPL) | NFTs and digital assets |

{% callout title="Which should I use?" %}
For **NFTs and digital assets**, use [Metaplex Core](/core) — it's simpler, cheaper, and purpose-built. For **fungible tokens** (currencies, rewards), use the SPL Token program with [Metaplex Token Metadata](/token-metadata) for on-chain metadata.
{% /callout %}

## Rent and Rent Exemption

Accounts must pay **rent** to exist on Solana. This prevents blockchain bloat.

### How Rent Works

- Rent is paid in lamports based on data size
- Accounts that fall below minimum balance are **purged**
- **Rent-exempt** accounts pay a one-time deposit and exist forever

### Rent Exemption

To be rent-exempt, an account must hold minimum lamports based on its size:

```bash
# Check rent-exempt minimum for different sizes
solana rent 0      # Wallet (0 bytes): ~0.00089 SOL
solana rent 82     # Mint Account: ~0.002 SOL
solana rent 165    # Token Account: ~0.0025 SOL
solana rent 679    # Metadata Account: ~0.0056 SOL
```

{% callout title="Always Rent-Exempt" %}
When creating accounts with Metaplex tools (MPLX CLI, SDKs), the tools automatically calculate and include rent-exempt amounts. You don't need to manually calculate rent.
{% /callout %}

### Recovering Rent

When you close an account, you recover the rent deposit:

```bash
# Burning an NFT recovers most of its rent
mplx core burn-asset <ASSET_ADDRESS>
# Returns ~0.00089 SOL
```

## Solana vs Ethereum

Coming from Ethereum? Here are the key differences:

| Aspect | Ethereum | Solana |
|--------|----------|--------|
| **Contract storage** | Contract stores its own data | Programs are stateless; data in separate accounts |
| **Account creation** | Implicit (just send to address) | Explicit (must create and fund account) |
| **Storage cost** | Gas per operation | Rent exemption (one-time deposit) |
| **Ownership** | Contracts own themselves | Programs own data accounts |
| **Balance storage** | Single balance field | Separate token accounts per token |

### Practical Implications

**Token balances**: On Ethereum, one contract tracks all balances. On Solana, each holder has a separate token account:

```
Ethereum:
  ERC-20 Contract
    └── balances mapping
        ├── Alice: 100
        └── Bob: 50

Solana:
  ├── Mint Account
  ├── Alice's Token Account → amount: 100
  └── Bob's Token Account → amount: 50
```

## Viewing Accounts

### CLI

```bash
# View account info
solana account <ADDRESS>

# View in JSON format
solana account <ADDRESS> --output json

# View only data (hex encoded)
solana account <ADDRESS> --output json | jq '.data'
```

### Explorer

Use Solana Explorer or SolanaFM to view accounts visually:
- [Solana Explorer](https://explorer.solana.com/)
- [SolanaFM](https://solana.fm/)

### Programmatically

```javascript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { publicKey } from '@metaplex-foundation/umi'

const umi = createUmi('https://api.devnet.solana.com')

const account = await umi.rpc.getAccount(publicKey('YourAddressHere...'))
if (account.exists) {
  console.log('Owner:', account.owner)
  console.log('Lamports:', account.lamports)
  console.log('Data length:', account.data.length)
}
```

## Common Patterns

### Why "Account Not Found"?

On Solana, accounts must be explicitly created:

```
Error: Account does not exist

Cause: The account has never been created, or it was closed/purged
Solution: Create the account first (automatic with most Metaplex operations)
```

### Associated Token Accounts (ATAs)

ATAs are deterministically derived so you don't need to track them:

```
ATA = derive(wallet_address, mint_address, token_program)
```

The MPLX CLI and SDKs automatically create ATAs when needed:

```bash
# This auto-creates the recipient's ATA if it doesn't exist
mplx toolbox token-transfer <RECIPIENT> <AMOUNT>
```

## Next Steps

- [Understanding PDAs](/solana/understanding-pdas) - Dive deeper into Program Derived Addresses
- [Transaction fundamentals](/solana/solana-transaction-fundamentals) - How transactions work on Solana
- [Create a Solana token](/solana/javascript/how-to-create-a-solana-token) - Put this knowledge into practice

## FAQ

### Why do I need to create token accounts?

Unlike Ethereum where a contract tracks balances, Solana requires separate accounts. This enables parallel processing—different accounts can be modified simultaneously.

### What happens if my account runs out of rent?

If an account falls below the rent-exempt threshold, it will be purged after some time, and the remaining lamports returned to the owner. Always keep accounts rent-exempt.

### Can I close accounts to recover SOL?

Yes! When you burn NFTs or close token accounts, you recover the rent-exempt deposit. This is why burning assets returns SOL.

### Why does my wallet show a small balance after minting?

Creating accounts (mint, metadata, token accounts) requires rent-exempt deposits. These are locked in the accounts, not spent.

### What's the difference between owner and authority?

- **Owner** (on-chain): The program that controls the account's data
- **Authority** (in account data): The wallet that can perform certain actions (like minting)

Example: A Mint Account is *owned* by the Token Program, but its *mint authority* is your wallet.
