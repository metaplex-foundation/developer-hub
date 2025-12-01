---
title: Introduction
description: Welcome to the Metaplex CLI
---

# Metaplex CLI

The Metaplex CLI is a powerful command-line tool that provides a comprehensive suite of utilities for interacting with the Metaplex protocol on Solana. Whether you're a developer building NFT applications or a creator managing digital assets, the CLI offers a robust set of features to streamline your workflow.

## Key Features

### Core Functionality
- Create and manage MPL Core Assets and Collections
- Upload and update asset metadata
- Fetch asset and collection information
- Manage asset properties and attributes

### Toolbox Utilities
- Create and manage fungible tokens
- Transfer SOL between addresses
- Check SOL balances
- Airdrop SOL for testing purposes

### Configuration Management
- Manage multiple wallets
- Configure RPC endpoints
- Set preferred blockchain explorer
- Customize CLI behavior

## Why Use the CLI?

1. **Developer-Friendly**: Built with developers in mind, offering both simple commands and advanced options
2. **Interactive Mode**: User-friendly wizards for complex operations
3. **Flexible Configuration**: Customize your environment with multiple wallets and RPC endpoints
4. **Comprehensive Tools**: Everything you need for NFT and token management in one place
5. **Cross-Platform**: Works on Windows, macOS, and Linux

## Getting Started

1. [Install the CLI](/cli/installation)
2. Configure your environment:
   - [Set up your wallet](/cli/config/wallets)
   - [Configure RPC endpoints](/cli/config/rpcs)
   - [Choose your preferred explorer](/cli/config/explorer)
3. Start using the core commands:
   - [Create assets](/cli/core/create-asset)
   - [Create collections](/cli/core/create-collection)
   - [Update assets](/cli/core/update-asset)
   - [Fetch assets](/cli/core/fetch)

## Command Structure

The CLI follows a hierarchical command structure:

```bash
mplx <category> <command> [options]
```

Categories include:
- `core`: MPL Core asset management
- `toolbox`: Utility commands
- `config`: Configuration management

## Best Practices

1. **Use Configuration**: Set up your wallets and RPC endpoints for a smoother experience
2. **Interactive Mode**: Use the `--wizard` flag for guided operations
3. **Check Balances**: Always verify your SOL balance before transactions
4. **Test First**: Use devnet for testing before mainnet deployment
5. **Backup**: Keep your wallet files and configuration secure

## Support and Resources

- [GitHub Repository](https://github.com/metaplex-foundation/cli)
- [Documentation](https://developers.metaplex.com)
- [Discord Community](https://discord.gg/metaplex)

## Next Steps

Ready to get started? Head over to the [installation guide](/cli/installation) to set up the CLI on your system. 