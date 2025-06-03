---
title: Installation
description: Install and set up the Metaplex CLI
---

# Installation Guide

This guide will help you install and set up the Metaplex CLI on your system.

## Prerequisites

Before installing the CLI, ensure you have:

- Node.js 16.x or later
- npm 7.x or later
- A Solana wallet (optional, but recommended)
- Git (optional, for development)

## Installation Methods

### Using npm (Recommended)

```bash
npm install -g @metaplex-foundation/cli
```

### Using yarn

```bash
yarn global add @metaplex-foundation/cli
```

### Using pnpm

```bash
pnpm add -g @metaplex-foundation/cli
```

## Verify Installation

After installation, verify that the CLI is properly installed:

```bash
mplx --version
```

You should see the current version of the CLI displayed.

## Initial Setup

### 1. Create Configuration Directory

The CLI will automatically create a configuration directory at `~/.mplx` on first run. This directory stores:
- Wallet configurations
- RPC endpoint settings
- Explorer preferences
- Other CLI settings

### 2. Configure Your Environment

#### Set up a Wallet
```bash
# Create a new wallet
mplx config wallet new --name dev1

# Or add an existing wallet
mplx config wallet add dev1 /path/to/keypair.json
```

#### Configure RPC Endpoint
```bash
# Add mainnet RPC
mplx config rpc add mainnet https://api.mainnet-beta.solana.com

# Add devnet RPC
mplx config rpc add devnet https://api.devnet.solana.com
```

#### Set Preferred Explorer
```bash
mplx config explorer set
```

## Development Installation

If you want to contribute to the CLI or run it from source:

1. Clone the repository:
```bash
git clone https://github.com/metaplex-foundation/mpl-toolbox.git
cd mpl-toolbox
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Link the CLI:
```bash
npm link
```

## Troubleshooting

### Common Issues

1. **Command Not Found**
   - Ensure the global npm bin directory is in your PATH
   - Try reinstalling the package

2. **Permission Errors**
   - Use `sudo` for global installation on Unix-based systems
   - Or configure npm to install global packages without sudo

3. **Node Version Issues**
   - Use nvm to manage Node.js versions
   - Ensure you're using a compatible Node.js version

### Getting Help

If you encounter any issues:

1. Check the [documentation](https://docs.metaplex.com)
2. Search [GitHub issues](https://github.com/metaplex-foundation/mpl-toolbox/issues)
3. Join the [Discord community](https://discord.gg/metaplex)

## Next Steps

Now that you have the CLI installed, you can:

1. [Learn about the core commands](../core/create-asset)
2. [Explore the toolbox utilities](../toolbox/token-create)
3. [Configure your environment](../config/wallet)

## Updating

To update the CLI to the latest version:

```bash
npm update -g @metaplex-foundation/cli
```

Or if you installed via yarn:

```bash
yarn global upgrade @metaplex-foundation/cli
```

## Uninstallation

To remove the CLI:

```bash
npm uninstall -g @metaplex-foundation/cli
```

Or if you installed via yarn:

```bash
yarn global remove @metaplex-foundation/cli
``` 