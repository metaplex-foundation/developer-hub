---
title: Explorer Configuration
description: Set your preferred blockchain explorer
---

The `mplx config explorer` command allows you to set your preferred blockchain explorer for viewing transactions and accounts.

## Basic Usage

### Set Explorer
```bash
mplx config explorer set
```

## Commands

### Set Explorer
Sets your preferred blockchain explorer from a list of available options.

#### Examples
```bash
mplx config explorer set
```

#### Notes
- Opens an interactive prompt to select from available explorers
- Updates the active explorer in your configuration
- The selected explorer will be used for viewing transactions and accounts
- Available explorers include:
  - Solana Explorer (https://explorer.solana.com)
  - Solscan (https://solscan.io)
  - Solana FM (https://solana.fm)

## Configuration File

The explorer configuration is stored in your config file (default: `~/.mplx/config.json`). The structure looks like this:

```json
{
  "explorer": "https://explorer.solana.com"
}
```

## Notes

- The explorer setting is used when displaying links to transactions and accounts
- The configuration file is automatically created if it doesn't exist
- You can change your preferred explorer at any time
- The selected explorer will be used for all explorer links in command outputs
- Each explorer provides different features and interfaces for viewing blockchain data
