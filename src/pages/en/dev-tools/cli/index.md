---
title: Introduction
metaTitle: Introduction | Metaplex CLI
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

### Candy Machine Support
- Create MPL Core Candy Machines with step-by-step guidance
- Upload, validate, and insert assets with intelligent caching
- Set up complex minting rules and guard groups
- Real-time indicators for uploads, creation, and deployment

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

1. [Install the CLI](/dev-tools/cli/installation)
2. Configure your environment:
   - [Set up your wallet](/dev-tools/cli/config/wallets)
   - [Configure RPC endpoints](/dev-tools/cli/config/rpcs)
   - [Choose your preferred explorer](/dev-tools/cli/config/explorer)
3. Start using the commands:
   - [Create assets](/dev-tools/cli/core/create-asset)
   - [Create collections](/dev-tools/cli/core/create-collection)

## Command Structure

The CLI follows a hierarchical command structure:

```bash
mplx <category> <command> [options]
```

Categories include:
- `core`: MPL Core asset management
- `cm`: Candy Machine operations
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

## Quick Start Examples

### Create Your First Candy Machine

Get started with the interactive wizard:
```bash
# Install and configure the CLI
mplx config set keypair /path/to/my-wallet.json
mplx config set rpcUrl https://api.mainnet-beta.solana.com

# Create a candy machine with guided setup
mplx cm create --wizard
```

### Create Individual Assets

For single assets or custom collections:
```bash
# Create a collection
mplx core create-collection

# Create an asset in the collection
mplx core create-asset
```

## Next Steps

Ready to get started? Choose your path:

1. **For Setup**: Visit the [installation guide](/dev-tools/cli/installation)  
2. **For NFT Collections**: Start with the [candy machine wizard](/dev-tools/cli/cm/create)
3. **For Individual Assets**: Begin with [asset creation](/dev-tools/cli/core/create-asset)
