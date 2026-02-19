---
title: Solana Keypairs and Wallets
metaTitle: Solana Keypairs and Wallets | Wallet Security Guide
description: Learn how to create, manage, and secure Solana keypairs and wallets for development and production use.
# remember to update dates also in /components/guides/index.js
created: '02-04-2026'
updated: null
---

A comprehensive guide to creating, managing, and securing Solana keypairs for development and production environments. {% .lead %}

## What You'll Learn

- What keypairs are and how they work on Solana
- How to generate and manage keypairs
- Security best practices for different environments
- How to use keypairs with the Solana CLI and MPLX CLI

## Prerequisites

- [Solana CLI installed](/guides/solana-cli-essentials)

## Understanding Keypairs

A **keypair** on Solana consists of:

- **Public Key** - Your wallet address, safe to share
- **Secret Key** - Secret key that controls the wallet, **never share this**

{% callout title="Critical Security Rule" type="warning" %}
Your private key gives complete control over your wallet. Anyone with access to it can transfer all your assets. Never commit keypair files to git, share them online, or store them unencrypted on cloud services.
{% /callout %}

## Creating Keypairs

### Generate a New Keypair

```bash
# Create a new keypair (prompts for BIP39 passphrase)
solana-keygen new

# Create with a specific output file
solana-keygen new --outfile ~/my-wallet.json

# Create without passphrase prompt (for scripts/testing)
solana-keygen new --no-bip39-passphrase --outfile ~/my-devnet-wallet.json
```

The command outputs:
- The **public key** (your wallet address)
- A **seed phrase** (12-24 words) for recovery

{% callout title="Save Your Seed Phrase" type="warning" %}
Write down your seed phrase and store it securely offline. This is the only way to recover your wallet if you lose the keypair file.
{% /callout %}

### Recover from Seed Phrase

```bash
# Recover a keypair from seed phrase
solana-keygen recover --outfile ~/recovered-wallet.json
```

You'll be prompted to enter your seed phrase.

### Generate from Existing Seed

If you have a seed phrase and want to derive the keypair:

```bash
solana-keygen recover 'prompt://?full-path=m/44'/501'/0'/0'' --outfile ~/derived-wallet.json
```

## Managing Keypairs with MPLX CLI

The MPLX CLI provides convenient wallet management with named wallets:

```bash
# Create a new wallet in MPLX config
mplx config wallets new my-dev-wallet

# Add an existing keypair file
mplx config wallets add my-wallet ~/path/to/keypair.json

# List all configured wallets
mplx config wallets list

# Set the active wallet
mplx config wallets set my-dev-wallet

# Remove a wallet from config
mplx config wallets remove old-wallet
```

Benefits of MPLX wallet management:
- Named wallets instead of file paths
- Easy switching between wallets
- Centralized configuration at `~/.mplx/config.json`

## Viewing Keypair Information

### Get Public Key from Keypair File

```bash
solana-keygen pubkey ~/my-wallet.json
```

### Verify a Keypair File

```bash
solana-keygen verify <PUBKEY> ~/my-wallet.json
```

## Setting Your Default Keypair

### Solana CLI

```bash
# Set default keypair for all commands
solana config set --keypair ~/my-wallet.json

# Verify the setting
solana config get
```

### Per-Command Override

```bash
# Use a specific keypair for one command
solana balance --keypair ~/other-wallet.json
solana transfer <ADDRESS> 1 --keypair ~/funding-wallet.json
```

## Security Best Practices

### Development vs Production

| Environment | Recommendation |
|-------------|----------------|
| Local testing | File system wallet, no passphrase needed |
| Devnet/Testnet | File system wallet, backed up seed phrase |
| Mainnet (small amounts) | File system wallet with passphrase, encrypted disk |
| Mainnet (significant value) | Hardware wallet or multisigs |

### File System Wallets

For development and moderate amounts:

```bash
# Create with restrictive permissions
solana-keygen new --outfile ~/.config/solana/mainnet-wallet.json
chmod 600 ~/.config/solana/mainnet-wallet.json
```

### Environment Variables

For automated scripts, avoid hardcoding keypair paths:

```bash
# In your shell profile (~/.bashrc or ~/.zshrc)
export SOLANA_KEYPAIR_PATH="$HOME/.config/solana/devnet-wallet.json"

# In scripts
solana config set --keypair "$SOLANA_KEYPAIR_PATH"
```

### Multiple Wallets Strategy

Recommended setup for active developers:

```
~/.config/solana/
├── devnet-wallet.json      # Main devnet testing
├── testnet-wallet.json     # Testnet when needed
├── mainnet-wallet.json     # Small mainnet operations
└── burner-wallet.json      # Temporary/throwaway
```

Configure with MPLX CLI for easy switching:

```bash
mplx config wallets add devnet ~/.config/solana/devnet-wallet.json
mplx config wallets add mainnet ~/.config/solana/mainnet-wallet.json
mplx config wallets set devnet
```

### What NOT to Do

- **Never** commit keypair files to git (add `*.json` to `.gitignore`)
- **Never** share your seed phrase or private key in Discord, Telegram, or support tickets
- **Never** paste your private key into websites
- **Never** store unencrypted keypairs in cloud storage (Dropbox, Google Drive)
- **Never** use the same keypair for mainnet testing and production

## Hardware Wallets

For significant mainnet holdings, use a Ledger hardware wallet:

```bash
# Check if Ledger is connected
solana-keygen pubkey usb://ledger

# Use Ledger for transactions
solana config set --keypair usb://ledger
solana transfer <ADDRESS> 1
```

Requirements:
- Ledger device with Solana app installed
- USB connection to your computer

## Practical Examples

### Development Wallet Setup

```bash
# 1. Create a devnet wallet (no passphrase for convenience)
solana-keygen new --no-bip39-passphrase --outfile ~/.config/solana/devnet.json

# 2. Set it as default
solana config set --keypair ~/.config/solana/devnet.json

# 3. Switch to devnet
solana config set --url devnet

# 4. Get some devnet SOL
solana airdrop 2

# 5. Verify
solana balance
```

### Team Development Setup

For teams, each developer should have their own keypairs:

```bash
# Developer creates their own wallet
solana-keygen new --outfile ~/my-project-wallet.json

# Share only the PUBLIC key with the team
solana-keygen pubkey ~/my-project-wallet.json
# Output: 7nE9GvcwYDhwWdFfGjVZQ8dR6bYYvqPJktNpyxQYb1xm
```

### Programmatic Keypair Generation (JavaScript)

For applications that need to generate keypairs using UMI:

```javascript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { generateSigner, signerIdentity } from '@metaplex-foundation/umi'

const umi = createUmi('https://api.devnet.solana.com')

// Generate a new random keypair signer
const signer = generateSigner(umi)
console.log('Public Key:', signer.publicKey)

// Use it as the identity (payer + signer)
umi.use(signerIdentity(signer))

// Load an existing keypair from a file
import { createSignerFromKeypair } from '@metaplex-foundation/umi'
import fs from 'fs'

const secretKey = new Uint8Array(JSON.parse(fs.readFileSync('wallet.json')))
const keypair = umi.eddsa.createKeypairFromSecretKey(secretKey)
const loadedSigner = createSignerFromKeypair(umi, keypair)
```

## Troubleshooting

### "Keypair file not found"

```bash
# Check if file exists
ls -la ~/.config/solana/id.json

# If not, create one
solana-keygen new --outfile ~/.config/solana/id.json

# Or check your config
solana config get
```

### "Invalid keypair"

The keypair file must be a JSON array of 64 numbers. Verify format:

```bash
# Should output an array like [123, 45, 67, ...]
cat ~/my-wallet.json | head -c 100
```

### Lost Seed Phrase

If you lost your seed phrase but still have the keypair file:
1. Your funds are safe as long as you have the file
2. Transfer funds to a new wallet with a backed-up seed phrase
3. Treat the old keypair as compromised for future use

## Next Steps

- [Grind a vanity public key](/guides/grind-vanity-public-key) - Create branded addresses
- [Get SOL for development](/guides/airdrop-sol-for-development) - Fund your new wallet
- [Solana CLI essentials](/guides/solana-cli-essentials) - Use your wallet effectively

## FAQ

### Can I use the same keypair on devnet and mainnet?

Technically yes, but it's **not recommended**. Use separate keypairs to avoid accidentally sending real SOL in test scripts.

### What's the difference between a keypair and a wallet?

A **keypair** is the cryptographic key pair (public + private). A **wallet** is software that manages keypairs and helps you interact with the blockchain. File system wallets store the raw keypair; browser wallets like Phantom manage it with additional UX.

### How do I use my Phantom wallet with the CLI?

Export your private key from Phantom (Settings > Security > Export Private Key), then import it:

```bash
# The exported key is base58 encoded, convert it:
echo "[your-exported-key]" | base58 -d > phantom-wallet.json
solana config set --keypair phantom-wallet.json
```

Note: For security, consider creating a separate CLI keypair instead of exporting from Phantom.
