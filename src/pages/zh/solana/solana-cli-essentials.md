---
title: Solana CLI Essentials
metaTitle: Solana CLI Essentials | Solana Development Guide
description: Learn the essential Solana CLI commands for development, including installation, configuration, and common operations.
# remember to update dates also in /components/products/guides/index.js
created: '02-04-2026'
updated: null
---

A guide to the essential Solana command-line interface (CLI) commands you'll need for development. {% .lead %}

## What You'll Learn

- How to install and configure the Solana CLI
- Essential commands for daily development
- How to switch between clusters (devnet, testnet, mainnet)
- When to use Solana CLI vs MPLX CLI

## Prerequisites

- Basic command-line familiarity
- Node.js 16+ installed (for MPLX CLI)

## Installation

### Solana CLI

Install the Solana CLI tools using the official installer.

{% dialect-switcher title="Installation Commands" %}

{% dialect title="macOS & Linux" id="macos-linux" %}

```bash
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
```

{% /dialect %}

{% dialect title="Windows" id="windows" %}

```bash
cmd /c "curl https://release.anza.xyz/stable/solana-install-init-x86_64-pc-windows-msvc.exe --output C:\solana-install-tmp\solana-install-init.exe --create-dirs"
```

{% /dialect %}

{% /dialect-switcher %}

After installation, restart your terminal and verify:

```bash
solana --version
```

### MPLX CLI (Recommended for Metaplex Operations)

For Metaplex-specific operations like creating tokens with metadata, NFTs, and Candy Machines, the **MPLX CLI** provides a streamlined experience with interactive wizards. This requires you to have npm/node installed. If you do not have it yet follow your operating system specific guide on the [Node.js Download Page](https://nodejs.org/en/download).

```bash
npm install -g @metaplex-foundation/cli
mplx --version
```

{% callout title="When to Use Which CLI" %}

| Task | Recommended CLI |
|------|-----------------|
| Grinding keypairs | Solana CLI |
| Check balances | Either (MPLX: `mplx toolbox sol-balance`) |
| Transfer SOL | Either (MPLX: `mplx toolbox sol-transfer`) |
| Airdrop devnet SOL | Either (MPLX: `mplx toolbox sol-airdrop`) |
| Create tokens with metadata | **MPLX CLI** (`mplx toolbox token-create`) |
| Create NFTs/Collections | **MPLX CLI** (`mplx core create-asset`) |
| Candy Machine operations | **MPLX CLI** (`mplx cm`) |
| Deploy custom programs | Solana CLI |
| Low-level transactions | Solana CLI |

{% /callout %}

## Configuration

### View Current Configuration

```bash
solana config get
```

This displays your current settings including:
- **Config File** - Location of your config file
- **RPC URL** - The cluster you're connected to
- **WebSocket URL** - For subscription-based updates
- **Keypair Path** - Your default wallet location

### Set Your Wallet

Point the CLI to your keypair file:

```bash
solana config set --keypair ~/.config/solana/id.json
```

Or use a specific keypair:

```bash
solana config set --keypair /path/to/my-wallet.json
```

### Switch Clusters

Change which Solana network you're connected to:

```bash
# Devnet (for development and testing)
solana config set --url devnet

# Testnet (for testing with more realistic conditions)
solana config set --url testnet

# Mainnet (production - real SOL!)
solana config set --url mainnet-beta

# Local validator
solana config set --url localhost
```

You can also use full URLs:

```bash
solana config set --url https://api.devnet.solana.com
```

## Essential Commands

### Check Your Balance

```bash
# Using configured wallet
solana balance

# Check a specific address
solana balance <ADDRESS>

# With MPLX CLI
mplx toolbox sol-balance
mplx toolbox sol-balance <ADDRESS>
```

### Request Airdrop (Devnet/Testnet Only)

```bash
# Airdrop 1 SOL to your wallet
solana airdrop 1

# Airdrop to a specific address
solana airdrop 1 <ADDRESS>

# With MPLX CLI
mplx toolbox sol-airdrop 1
mplx toolbox sol-airdrop 1 --to <ADDRESS>
```

{% callout title="Airdrop Limits" type="warning" %}
Devnet airdrops are limited to 2 SOL per request with rate limiting. If airdrops fail, wait a few minutes or try a [web faucet](/solana/airdrop-sol-for-development).
{% /callout %}

### Transfer SOL

```bash
# Transfer SOL to another address
solana transfer <RECIPIENT_ADDRESS> <AMOUNT>

# With MPLX CLI
mplx toolbox sol-transfer <RECIPIENT_ADDRESS> <AMOUNT>
```

### View Account Information

```bash
# View account details
solana account <ADDRESS>

# View in JSON format
solana account <ADDRESS> --output json
```

### Check Transaction Status

```bash
# Confirm a transaction
solana confirm <SIGNATURE>

# Get transaction details
solana transaction-history <ADDRESS>
```

### View Cluster Information

```bash
# Check cluster version
solana cluster-version

# View current slot
solana slot

# Check cluster health
solana catchup --our-localhost
```

## Working with Programs

### View Program Information

```bash
# Get program account info
solana program show <PROGRAM_ID>
```

### Download a Program

Useful for local validator testing:

```bash
solana program dump -u mainnet-beta <PROGRAM_ID> program.so
```

## Practical Examples

### Daily Development Workflow

```bash
# 1. Start your day - check config
solana config get

# 2. Make sure you're on devnet
solana config set --url devnet

# 3. Check your balance
solana balance

# 4. Need SOL? Airdrop some
solana airdrop 2

# 5. Verify the airdrop
solana balance
```

## Common Issues

### "Unable to connect to cluster"

Your RPC endpoint may be down or rate-limited. Try:

```bash
# Switch to a different RPC
solana config set --url https://api.devnet.solana.com
```

### "Keypair file not found"

Generate a new keypair or point to an existing one:

```bash
# Generate new keypair
solana-keygen new --outfile ~/.config/solana/id.json

# Or set path to existing keypair
solana config set --keypair /path/to/existing/keypair.json
```

### Commands Running Slowly

You may be rate-limited. Consider using a dedicated RPC provider like Helius, QuickNode, or Triton for better performance.

## Next Steps

- [Create and manage keypairs](/solana/solana-keypairs-and-wallets) - Learn about wallet security
- [Get SOL for development](/solana/airdrop-sol-for-development) - Airdrops and faucets
- [Setup a local validator](/solana/setup-a-local-validator) - Test without network dependencies
- [MPLX CLI Documentation](/dev-tools/cli) - Full Metaplex CLI reference

## FAQ

### What's the difference between Solana CLI and MPLX CLI?

The **Solana CLI** is the official tool for general Solana operations (wallets, transfers, program deployment). The **MPLX CLI** is Metaplex's tool specifically for NFTs, tokens with metadata, and Candy Machines. Use Solana CLI for low-level operations and MPLX CLI for Metaplex-specific tasks.

### Can I use multiple keypairs?

Yes. Either specify the keypair per command with `--keypair` flag, or change your default with `solana config set --keypair`. The MPLX CLI also supports multiple wallets via `mplx config wallets`.

### How do I know which cluster I'm connected to?

Run `solana config get` - the "RPC URL" line shows your current cluster. Devnet URLs contain "devnet", mainnet contains "mainnet-beta".
