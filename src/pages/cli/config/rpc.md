---
title: RPC Configuration
description: Manage RPC endpoints in your configuration
---

The `mplx config rpc` commands allow you to manage RPC endpoints in your configuration. You can add, remove, list, and set active RPC endpoints.

## Basic Usage

### Add an RPC
```bash
mplx config rpc add <name> <endpoint>
```

### List RPCs
```bash
mplx config rpc list
```

### Remove an RPC
```bash
mplx config rpc remove <name>
```

### Set Active RPC
```bash
mplx config rpc set
```

## Commands

### Add RPC
Adds a new RPC endpoint to your configuration.

#### Arguments
- `name`: Name of RPC (max 15 characters, no spaces)
- `endpoint`: RPC endpoint URL

#### Examples
```bash
mplx config rpc add mainnet https://api.mainnet-beta.solana.com
mplx config rpc add devnet https://api.devnet.solana.com
```

#### Notes
- RPC name must be 15 characters or less
- RPC name cannot contain spaces
- Cannot add duplicate RPC names or endpoints
- The endpoint must be a valid URL

### List RPCs
Lists all RPC endpoints in your configuration.

#### Examples
```bash
mplx config rpc list
```

#### Output
```
Installed RPCs:
┌─────────┬────────────┬────────────────────────────────────────────┐
│ (index) │    name    │                  endpoint                   │
├─────────┼────────────┼────────────────────────────────────────────┤
│    0    │ 'mainnet'  │ 'https://api.mainnet-beta.solana.com'      │
│    1    │ 'devnet'   │ 'https://api.devnet.solana.com'            │
└─────────┴────────────┴────────────────────────────────────────────┘
```

### Remove RPC
Removes an RPC endpoint from your configuration.

#### Arguments
- `name`: Name of RPC to remove

#### Examples
```bash
mplx config rpc remove devnet
```

#### Notes
- The RPC must exist in your configuration
- This only removes the RPC from configuration, it doesn't affect the actual endpoint

### Set Active RPC
Sets a new active RPC endpoint from your configured endpoints.

#### Examples
```bash
mplx config rpc set
```

#### Notes
- Opens an interactive prompt to select from available RPC endpoints
- Updates the active RPC in your configuration
- The selected RPC will be used for subsequent commands
- If no RPC is selected in the configuration, the command will default to using the Solana default RPC endpoint

## Configuration File

The RPC configuration is stored in your config file (default: `~/.mplx/config.json`). The structure looks like this:

```json
{
  "rpcs": [
    {
      "name": "mainnet",
      "endpoint": "https://api.mainnet-beta.solana.com"
    },
    {
      "name": "devnet",
      "endpoint": "https://api.devnet.solana.com"
    }
  ],
  "rpcUrl": "https://api.mainnet-beta.solana.com"
}
```

## Notes

- All RPC operations modify your local configuration file
- The active RPC (specified by `rpcUrl`) is used for network connections
- If no RPC is configured, the command will use the Solana default RPC endpoint
- RPC names are case-sensitive
- The configuration file is automatically created if it doesn't exist
- You can use any valid Solana RPC endpoint URL
- Common RPC endpoints include:
  - Mainnet: `https://api.mainnet-beta.solana.com`
  - Devnet: `https://api.devnet.solana.com`
  - Testnet: `https://api.testnet.solana.com`
