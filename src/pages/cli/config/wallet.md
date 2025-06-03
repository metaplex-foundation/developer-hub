---
title: Wallet Configuration
description: Manage wallets in your configuration
---

The `mplx config wallet` commands allow you to manage wallets in your configuration. You can create new wallets, add existing ones, remove, list, and set active wallets.

## Basic Usage

### Create a New Wallet
```bash
mplx config wallet new [options]
```

### Add an Existing Wallet
```bash
mplx config wallet add <name> <path>
```

### List Wallets
```bash
mplx config wallet list
```

### Remove a Wallet
```bash
mplx config wallet remove <name>
```

### Set Active Wallet
```bash
mplx config wallet set
```

## Commands

### Create New Wallet
Creates a new wallet and optionally adds it to your configuration.

#### Options
- `--name <string>`: Name for wallet (max 6 characters, alphanumeric, hyphens and underscores only)
- `--output <path>`: Directory path where to save the wallet file
- `--hidden`: Save wallet in the hidden `mplx config` folder

#### Examples
```bash
# Create a new wallet in current directory
mplx config wallet new

# Create a named wallet and add it to config
mplx config wallet new --name dev1

# Create a wallet in a specific directory
mplx config wallet new --name dev1 --output ./wallets

# Create a wallet in the hidden config directory
mplx config wallet new --name dev1 --hidden
```

#### Notes
- If no name is provided, the wallet will be created but not added to config
- If a name is provided, the wallet will be automatically added to config
- Wallet name must be 6 characters or less
- Wallet name can only contain alphanumeric characters, hyphens and underscores
- The wallet file will be named using the format: `<name>-<publicKey>.json` or `<publicKey>.json` if no name is provided
- Cannot create a wallet with a name, path, or address that already exists in config

### Add Wallet
Adds an existing wallet to your configuration.

#### Arguments
- `name`: Name of wallet (max 6 characters, no spaces)
- `path`: Path to keypair JSON file

#### Examples
```bash
mplx config wallet add dev1 /path/to/keypair.json
```

#### Notes
- Wallet name must be 6 characters or less
- Wallet name cannot contain spaces
- Keypair file must be a JSON file
- Cannot add duplicate wallet names, paths, or addresses
- The wallet's public key will be automatically extracted from the keypair file

### List Wallets
Lists all wallets in your configuration.

#### Examples
```bash
mplx config wallet list
```

#### Output
```
Installed Wallets:
┌─────────┬────────┬──────────────────────────────┬──────────────────────────────┐
│ (index) │  name  │            path             │           address            │
├─────────┼────────┼──────────────────────────────┼──────────────────────────────┤
│    0    │ 'dev1' │ '/path/to/keypair.json'     │ '5avjMVza8SuMhgTfzEGNWJsk...' │
│    1    │ 'dev2' │ '/path/to/another.json'     │ 'HaKyubAWuTS9AZkpUHtFkTK...'  │
└─────────┴────────┴──────────────────────────────┴──────────────────────────────┘
```

### Remove Wallet
Removes a wallet from your configuration.

#### Arguments
- `name`: Name of wallet to remove

#### Examples
```bash
mplx config wallet remove dev1
```

#### Notes
- The wallet must exist in your configuration
- This only removes the wallet from configuration, it doesn't delete the keypair file

### Set Active Wallet
Sets a new active wallet from your configured wallets.

#### Examples
```bash
mplx config wallet set
```

#### Notes
- Opens an interactive prompt to select from available wallets
- Updates the active wallet in your configuration
- The selected wallet will be used for subsequent commands
- If no wallet is selected in the configuration, the command will default to using the Solana CLI default wallet (`~/.config/solana/id.json`)

## Configuration File

The wallet configuration is stored in your config file (default: `~/.mplx/config.json`). The structure looks like this:

```json
{
  "wallets": [
    {
      "name": "dev1",
      "address": "5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa",
      "path": "/path/to/keypair.json"
    }
  ],
  "keypair": "/path/to/active/keypair.json"
}
```

## Notes

- All wallet operations modify your local configuration file
- The active wallet (specified by `keypair`) is used for transactions
- If no wallet is configured, the command will use the Solana CLI default wallet (`~/.config/solana/id.json`)
- Wallet names are case-sensitive
- Keypair files must be valid Solana keypair JSON files
- The configuration file is automatically created if it doesn't exist
- Wallet addresses are displayed in shortened format for better readability
- New wallets can be created in any directory or in the hidden config directory
- Wallet files are named using the public key for uniqueness 