---
title: Create Token
metaTitle: Create Token | Metaplex CLI
description: Create a new fungible token on Solana
---

The `mplx toolbox token create` command allows you to create a new fungible token on Solana. You can create a token in two ways: using the interactive wizard or by providing all required information directly.

## Basic Usage

### Interactive Wizard
```bash
mplx toolbox token create --wizard
```

### Direct Creation
```bash
mplx toolbox token create --name "My Token" --symbol "TOKEN" --mint-amount 1000000
```

## Options

### Required Options (when not using wizard)
- `--name <string>`: Name of the token (e.g., "My Awesome Token")
- `--symbol <string>`: Token symbol (2-6 characters, e.g., "MAT")
- `--mint-amount <number>`: Initial amount of tokens to mint (must be greater than 0)

### Optional Options
- `--decimals <number>`: Number of decimal places (0-9, default: 0)
- `--description <string>`: Description of the token and its purpose
- `--image <path>`: Path to the token image file (PNG, JPG, or GIF)
- `--speed-run`: Enable speed run mode to measure execution time

## Examples

### Create Token with Basic Information
```bash
mplx toolbox token create --name "My Token" --symbol "TOKEN" --mint-amount 1000000
```

### Create Token with All Options
```bash
mplx toolbox token create \
  --name "My Awesome Token" \
  --symbol "MAT" \
  --description "A token for awesome things" \
  --image ./token-image.png \
  --decimals 2 \
  --mint-amount 1000000
```

### Create Token Using Wizard
```bash
mplx toolbox token create --wizard
```

## Output

After successful token creation, the command will display:
```
--------------------------------
Token created successfully!

Token Details:
Name: <name>
Symbol: <symbol>
Decimals: <decimals>
Initial Supply: <formattedAmount>

Mint Address: <mintAddress>
Explorer: <explorerUrl>

Transaction Signature: <signature>
Explorer: <transactionExplorerUrl>
Execution Time: <time> seconds
--------------------------------
```

## Notes

- The token symbol must be 2-6 characters long
- The mint amount must be greater than 0
- Decimals determine the smallest unit of the token (e.g., 2 decimals means 100 tokens = 100_00)
- The image file must be in PNG, JPG, or GIF format
- The wizard will guide you through all required fields interactively
- The command will automatically:
  - Upload the token image (if provided)
  - Create and upload the token metadata
  - Create the token on the blockchain
  - Mint the initial supply
- The transaction signature and mint address are provided for verification
- Speed run mode can be used to measure execution time 