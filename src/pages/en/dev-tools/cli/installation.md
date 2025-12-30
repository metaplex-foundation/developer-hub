---
title: Installation
description: Install and set up the Metaplex CLI
---

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

The CLI will automatically create a configuration file at `~/.config/mplx` when first setting config settings. This config stores:
- Wallet configurations
- RPC endpoint settings
- Explorer preferences
- Other CLI settings

### 2. Configure Your Environment

#### Set up a Wallet
```bash
# Create a new wallet
mplx config wallets new --name dev1

# Or add an existing wallet
mplx config wallets add <name> <path>
mplx config wallets add dev1 /path/to/keypair.json

# After adding a wallet you'll need to set it
mplx config wallets set
```

Further reading see 

#### Configure RPC Endpoint
```bash
mplx config set rpcUrl  https://api.mainnet-beta.solana.com
```

#### Set Preferred Explorer
```bash
mplx config explorer set
```

## Development Installation

If you want to contribute to the CLI or run it from source:

1. Clone the repository:
```bash
git clone https://github.com/metaplex-foundation/cli.git
cd cli
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

1. Check the [documentation](https://developers.metaplex.com)
2. Search [GitHub issues](https://github.com/metaplex-foundation/cli/issues)
3. Join the [Discord community](https://discord.gg/metaplex)

## Next Steps

Now that you have the CLI installed, you can:

1. [Learn about the core commands](/dev-tools/cli/core/create-asset)
2. [Explore the toolbox utilities](/dev-tools/cli/toolbox/token-create)
3. [Configure your environment](/dev-tools/cli/config/wallets)

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