---
title: Wallets
metaTitle: Wallets | Metaplex CLI
description: Manage wallet configurations
---

Manage wallet configurations in your CLI. You can add, list, remove, and set active wallets for different purposes.

{% callout type="note" %}
You can also use an [MPL Core Asset's PDA as a wallet](/dev-tools/cli/config/asset-signer-wallets). Register one with `mplx config wallets add <name> --asset <assetId>` and all commands will automatically operate through the PDA.
{% /callout %}

## Basic Usage

```bash
# Create a new wallet
mplx config wallets new --name <name>

# Add an existing wallet
mplx config wallets add <name> <keypairPath>

# List all wallets
mplx config wallets list

# Remove a wallet
mplx config wallets remove <name>

# Set active wallet
mplx config wallets set <name>
```

## Commands

### New Wallet

Create a new wallet and add it to your configuration.

```bash
mplx config wallets new --name <name>
```

#### Arguments

| Argument | Description |
|----------|-------------|
| `--name` | A unique name for the wallet |

#### Example

```bash
mplx config wallets new --name dev1
```

### Add Wallet

Add an existing wallet to your configuration.

```bash
mplx config wallets add <name> <keypairPath>
```

#### Arguments

| Argument | Description |
|----------|-------------|
| `name` | A unique name for the wallet |
| `keypairPath` | Path to the keypair file |

#### Example

```bash
mplx config wallets add dev1 ~/.config/solana/devnet/dev1.json
```

### List Wallets

Display all configured wallets.

```bash
mplx config wallets list
```

#### Output

```
--------------------------------
Wallets
--------------------------------
Name: dev1
Public Key: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
Active: true

Name: dev2
Public Key: 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM
Active: false
--------------------------------
```

### Remove Wallet

Remove a wallet from your configuration.

```bash
mplx config wallets remove <name>
```

#### Arguments

| Argument | Description |
|----------|-------------|
| `name` | The name of the wallet to remove |

#### Example

```bash
mplx config wallets remove dev2
```

### Set Active Wallet

Set the active wallet for your configuration.

```bash
mplx config wallets set <name>
```

#### Arguments

| Argument | Description |
|----------|-------------|
| `name` | The name of the wallet to set as active |

#### Example

```bash
mplx config wallets set dev1
```

## Configuration File

Wallets are stored in your configuration file at `~/.mplx/config.json`:

```json
{
  "wallets": {
    "dev1": {
      "publicKey": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      "keypairPath": "~/.config/solana/devnet/dev1.json",
      "active": true
    },
    "dev2": {
      "publicKey": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
      "keypairPath": "~/.config/solana/devnet/dev2.json",
      "active": false
    }
  }
}
```

## Notes

- Wallet names are case-sensitive
- Only one wallet can be active at a time
- The active wallet is used for all transactions
- You can add multiple wallets for different purposes
- Removing the active wallet will automatically set another wallet as active if available
- Keep your keypair files secure and never share them

## Related Commands

- [Asset-Signer Wallets](/dev-tools/cli/config/asset-signer-wallets) - Use an MPL Core Asset's PDA as your active wallet
- [RPCs](/dev-tools/cli/config/rpcs) - Manage RPC endpoints
- [Explorer](/dev-tools/cli/config/explorer) - Set preferred blockchain explorer
