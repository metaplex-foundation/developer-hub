---
title: "Create Candy Machine"
metaTitle: "CLI - Create Candy Machine Command"
description: "Create MPL Core Candy Machines using the MPLX CLI. Interactive wizard mode with validation, asset upload, and complete setup automation."
---

The `mplx cm create` command creates a new MPL Core Candy Machine with configurable settings and asset uploads. It offers both an interactive wizard for beginners and manual configuration for advanced users.

## Usage

```bash
# Interactive wizard (recommended)
mplx cm create --wizard

# Create directory template
mplx cm create --template

# Manual creation (requires existing cm-config.json)
mplx cm create
```

## Prerequisite Assets
Independent of the Mode (Wizard or Manual) you choose you will need your assets prepared. If you want to play around with dummy assets you can create them using `mplx cm create --template`. All the image and metadata files should be in the their own `assets` folder.

*Image Files:* 
- **Formats**: PNG, JPG
- **Naming**: Sequential (0.png, 1.png, 2.png, ...)

*Metadata Files*
- **Format**: JSON
- **Naming**: Matching image files (0.json, 1.json, 2.json, ...)
- **Schema**: Standard [Metaplex Core metadata format](/core/json-schema)


*Collection Files* 
- **collection.png**: Collection image
- **collection.json**: Collection metadata 

## Template Mode

Create a basic directory structure to get started:

```bash
mplx cm create --template
```

This creates the following structure, but not the candy machine.
```text
candy-machine-template/
├── assets/
│   ├── 0.png              # Example image
│   ├── 0.json             # Example metadata
│   ├── collection.png     # Example collection image
│   └── collection.json    # Example collection metadata
└── cm-config.json         # Example configuration
```

After creating the template:
1. Replace example assets with your actual files
2. Update the configuration in `cm-config.json`
3. Run `mplx cm create` to deploy

## Interactive Wizard Mode

The wizard provides a guided, user-friendly experience with comprehensive validation and progress tracking. **This is the recommended approach for most users.**

### Wizard Workflow

1. Project Setup
2. Asset Discovery & Validation
3. Collection Configuration
4. Candy Machine and Candy Guard Settings
5. Asset Upload & Processing
6. Candy Machine Creation
7. Item Insertion


## Manual Configuration Mode

For advanced users who want full control over the configuration process.

### Prerequisites

1. **Candy machine asset directory** with proper structure
2. **Manually created `cm-config.json`** with required configuration. See below for an example
3. **Prepared assets** in the `assets/` directory in a structure as shown below 

### Directory Structure

```text
my-candy-machine/
├── assets/
│   ├── 0.png
│   ├── 0.json
│   ├── 1.png
│   ├── 1.json
│   ├── ...
│   ├── collection.png
│   └── collection.json
└── cm-config.json          # Required
```

### Configuration File Format

Create `cm-config.json` with this structure:

```json
{
  "name": "My Candy Machine",
  "config": {
    "collection": "CollectionPublicKey...",  // existing collection
    "itemsAvailable": 100,
    "isMutable": true,
    "isSequential": false,
    "guardConfig": {
      "solPayment": {
        "lamports": 1000000000,
        "destination": "111111111111111111111111111111111"
      },
      "mintLimit": {
        "id": 1,
        "limit": 1
      }
    },
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
      }
    ]
  }
}
```

### Manual Workflow

```bash
# 1. Navigate to your candy machine directory
cd ./my-candy-machine

# 2. Create candy machine using existing config
mplx cm create

# 3. after that run upload and insert
```

## Configuration Options

### Core Settings

| Setting | Description | Required |
|---------|-------------|----------|
| `name` | Display name for the candy machine | ✅ |
| `itemsAvailable` | Total number of items to mint | ✅ |
| `isMutable` | Whether NFTs can be updated after minting | ✅ |
| `isSequential` | Whether to mint items in order | ✅ |
| `collection` | Existing collection address (optional) | ❌ |

### Guard Configuration

**Global Guards** (`guardConfig`):
- Apply to all groups and the candy machine as a whole
- Cannot be overridden by group guards
- Useful for universal restrictions

**Guard Groups** (`groups`):
- Apply only to specific groups
- Allow different rules per minting phase
- Group labels limited to 6 characters maximum

### Common Guard Examples

#### Basic Public Sale
```json
{
  "guardConfig": {
    "solPayment": {
      "lamports": 1000000000,
      "destination": "YourWalletAddress..."
    },
    "mintLimit": {
      "id": 1,
      "limit": 1
    }
  }
}
```

#### Whitelist Phase
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
          "destination": "YourWalletAddress..."
        }
      }
    }
  ]
}
```



### Getting Help

- Use `mplx cm create --help` for command options
- Join the [Metaplex Discord](https://discord.gg/metaplex) for support

## Related Commands

- [`mplx cm upload`](/cli/cm/upload) - Upload assets to storage
- [`mplx cm insert`](/cli/cm/insert) - Insert items into candy machine
- [`mplx cm validate`](/cli/cm/validate) - Validate asset cache
- [`mplx cm fetch`](/cli/cm/fetch) - View candy machine information

## Next Steps

1. **[Upload assets](/cli/cm/upload)** if created manually
2. **[Insert items](/cli/cm/insert)** to load assets into candy machine
3. **[Validate your setup](/cli/cm/validate)** to ensure everything works
4. **[Learn about guards](/core-candy-machine/guards)** for advanced configuration