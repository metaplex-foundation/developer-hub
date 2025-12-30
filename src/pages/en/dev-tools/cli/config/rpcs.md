---
title: RPCs
description: Manage RPC endpoints in your configuration
---

Manage RPC endpoints in your configuration. You can add, list, remove, and set active RPCs for different networks.

## Basic Usage

```bash
# Add a new RPC endpoint
mplx config rpcs add <name> <endpoint>

# List all RPC endpoints
mplx config rpcs list

# Remove an RPC endpoint
mplx config rpcs remove <name>

# Set active RPC endpoint
mplx config rpcs set <name>
```

## Commands

### Add RPC

Add a new RPC endpoint to your configuration.

```bash
mplx config rpcs add <name> <endpoint>
```

#### Arguments

| Argument | Description |
|----------|-------------|
| `name` | A unique name for the RPC endpoint (e.g., 'mainnet', 'devnet') |
| `endpoint` | The RPC endpoint URL |

#### Example

```bash
mplx config rpcs add mainnet https://api.mainnet-beta.solana.com
```

### List RPCs

Display all configured RPC endpoints.

```bash
mplx config rpcs list
```

#### Output

```
--------------------------------
RPC Endpoints
--------------------------------
Name: mainnet
Endpoint: https://api.mainnet-beta.solana.com
Active: true

Name: devnet
Endpoint: https://api.devnet.solana.com
Active: false
--------------------------------
```

### Remove RPC

Remove an RPC endpoint from your configuration.

```bash
mplx config rpcs remove <name>
```

#### Arguments

| Argument | Description |
|----------|-------------|
| `name` | The name of the RPC endpoint to remove |

#### Example

```bash
mplx config rpcs remove devnet
```

### Set Active RPC

Set the active RPC endpoint for your configuration.

```bash
mplx config rpcs set <name>
```

#### Arguments

| Argument | Description |
|----------|-------------|
| `name` | The name of the RPC endpoint to set as active |

#### Example

```bash
mplx config rpcs set mainnet
```

## Configuration File

RPCs are stored in your configuration file at `~/.mplx/config.json`:

```json
{
  "rpcs": {
    "mainnet": {
      "endpoint": "https://api.mainnet-beta.solana.com",
      "active": true
    },
    "devnet": {
      "endpoint": "https://api.devnet.solana.com",
      "active": false
    }
  }
}
```

## Notes

- RPC names are case-sensitive
- Only one RPC can be active at a time
- The active RPC is used for all network operations
- You can add multiple RPCs for different networks
- Removing the active RPC will automatically set another RPC as active if available

## Related Commands

- [Wallets](/dev-tools/cli/config/wallets) - Manage wallet configurations
- [Explorer](/dev-tools/cli/config/explorer) - Set preferred blockchain explorer 