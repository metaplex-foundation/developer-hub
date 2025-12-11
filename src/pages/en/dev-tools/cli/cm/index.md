---
title: "Candy Machine Commands"
metaTitle: "MPLX CLI - Candy Machine Commands"
description: "Create and manage MPL Core Candy Machines using the MPLX CLI. Interactive wizard, asset upload, and complete candy machine lifecycle management."
---

The MPLX CLI provides comprehensive support for creating and managing **MPL Core Candy Machines** on Solana. These commands allow you to create NFT collections with configurable minting rules, upload assets, and manage the entire candy machine lifecycle through an intuitive command-line interface.

## Quick Start

Get started quickly with the interactive wizard:

```bash
mplx cm create --wizard
```

This single command handles everything to create a candy machine: asset validation, upload, candy machine creation including guard configuration, item insertion with progress tracking.

## Command Overview

| Command | Purpose | Key Features |
|---------|---------|--------------|
| [`create`](/cli/cm/create) | Create a new candy machine | Interactive wizard, template generation, manual config |
| [`upload`](/cli/cm/upload) | Upload assets to storage | Intelligent caching, progress tracking, validation |
| [`insert`](/cli/cm/insert) | Insert items into candy machine | Smart loading detection, batch processing |
| [`validate`](/cli/cm/validate) | Validate asset cache | Comprehensive validation, error reporting |
| [`fetch`](/cli/cm/fetch) | Fetch candy machine info | Display configuration, guard settings, status |
| [`withdraw`](/cli/cm/withdraw) | Withdraw and delete | Clean withdrawal, balance recovery |

## Key Features

### Interactive Wizard

- **Guided Setup**: Step-by-step candy machine creation
- **Asset Validation**: Comprehensive file and metadata validation
- **Progress Tracking**: Real-time indicators for all operations
- **Error Recovery**: Detailed error messages with actionable guidance

### Intelligent Asset Management

- **Smart Caching**: Reuses existing uploads when possible
- **Batch Processing**: Efficient asset upload and insertion
- **File Validation**: Ensures proper naming and metadata format
- **Collection Support**: Automatic collection creation

### Flexible Configuration

- **Guard Support**: All Core Candy Machine guards supported
- **Guard Groups**: Create different minting phases with distinct rules
- **Template Generation**: Quick directory structure setup
- **Manual Configuration**: Advanced users can create custom configs

## Directory Structure

All candy machine commands work from a **candy machine asset directory** with this structure:

```text
my-candy-machine/
├── assets/
│   ├── 0.png              # Image files (PNG, JPG)
│   ├── 0.json             # Metadata files
│   ├── 1.png
│   ├── 1.json
│   ├── ...
│   ├── collection.png      # Collection image
│   └── collection.json     # Collection metadata
├── asset-cache.json        # Asset upload cache (generated)
└── cm-config.json          # Candy machine configuration (generated when using the wizard)
```

## Workflow Options

### Option 1: Wizard Mode (Recommended)

Perfect for beginners and most use cases:

```bash
mplx cm create --wizard
```

**What it does:**

1. Validates assets and configuration
2. Uploads all assets with progress tracking
3. Creates the candy machine on-chain
4. Inserts all items with transaction progress
5. Provides comprehensive completion summary

### Option 2: Manual Mode (Advanced)

For advanced users who want full control:

```bash
# 1. Set up directory and config manually
mkdir my-candy-machine && cd my-candy-machine
# (create assets/ directory and add your assets)

# 2. Upload assets
mplx cm upload

# 3. Create candy machine
mplx cm create

# 4. Insert items
mplx cm insert

# 5. Validate (optional)
mplx cm validate
```

## Guard Configuration

The CLI supports all Core Candy Machine guards and guard groups:

### Global Guards

```json
{
  "guardConfig": {
    "solPayment": {
      "lamports": 1000000000,
      "destination": "111111111111111111111111111111111"
    },
    "mintLimit": {
      "id": 1,
      "limit": 1
    }
  }
}
```

### Guard Groups (Minting Phases)

```json
{
  "groups": [
    {
      "label": "wl",
      "guards": {
        "allowList": {
          "merkleRoot": "MerkleRootHash..."
        },
        "solPayment": {
          "lamports": 500000000,
          "destination": "111111111111111111111111111111111"
        }
      }
    },
    {
      "label": "public",
      "guards": {
        "solPayment": {
          "lamports": 1000000000,
          "destination": "111111111111111111111111111111111"
        }
      }
    }
  ]
}
```

## Available Guards

The CLI supports all Core Candy Machine guards:

**Payment Guards**: `solPayment`, `solFixedFee`, `tokenPayment`, `token2022Payment`, `nftPayment`, `assetPayment`, `assetPaymentMulti`

**Access Control**: `addressGate`, `allowList`, `nftGate`, `tokenGate`, `assetGate`, `programGate`, `thirdPartySigner`

**Time-Based**: `startDate`, `endDate`

**Limits**: `mintLimit`, `allocation`, `nftMintLimit`, `assetMintLimit`, `redeemedAmount`

**Burn Guards**: `nftBurn`, `tokenBurn`, `assetBurn`, `assetBurnMulti`

**Special**: `botTax`, `edition`, `vanityMint`

**Freeze Guards**: `freezeSolPayment`, `freezeTokenPayment`

For detailed guard documentation, see the [Core Candy Machine Guards](/core-candy-machine/guards) reference.

## Best Practices

### 🎯 Directory Organization

- Keep each candy machine in its own directory
- Use descriptive directory names
- Maintain consistent asset naming (0.png, 1.png, etc.)
- Back up your candy machine directories

### 📁 Asset Preparation

- Use consistent naming (0.png, 1.png, etc.)
- Ensure metadata JSON files match image files
- Validate image formats (PNG, JPG supported)
- Keep file sizes reasonable (< 10MB recommended)
- Include collection.json with a valid "name" field

### ⚙️ Configuration

- Test on devnet before mainnet
- Use the wizard for guided configuration
- Back up configuration files
- Document guard settings
- Consider adding at least one guard or guard group

### 🚀 Deployment

- Verify candy machine creation
- Test minting functionality
- Monitor transaction status
- Keep explorer links for verification

## Related Documentation

- [Core Candy Machine Overview](/core-candy-machine) - Understanding MPL Core Candy Machines
- [Core Candy Machine Guards](/core-candy-machine/guards) - Complete guard reference
- [CLI Installation](/cli/installation) - Setting up the MPLX CLI
- [CLI Configuration](/cli/config/wallets) - Wallet and RPC setup

## Next Steps

1. **[Install the CLI](/cli/installation)** if you haven't already
2. **[Create your first candy machine](/cli/cm/create)** using the wizard
3. **[Explore guard configuration](/core-candy-machine/guards)** for advanced minting rules
4. **[Learn about guard groups](/core-candy-machine/guard-groups)** for phased launches
