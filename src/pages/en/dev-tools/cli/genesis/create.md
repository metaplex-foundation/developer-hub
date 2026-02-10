---
title: Create Genesis Account
metaTitle: Create Genesis Account | Metaplex CLI
description: Create a new Genesis account and token mint using the Metaplex CLI.
---

The `mplx genesis create` command creates a new Genesis account and token mint. This is the first step in any token launch.

## Basic Usage

```bash
mplx genesis create --name "My Token" --symbol "MTK" --totalSupply 1000000000000000 --decimals 9
```

## Options

- `--name <string>` (`-n`): Name of the token (required)
- `--symbol <string>` (`-s`): Symbol of the token (required)
- `--totalSupply <string>`: Total supply in base units (required)
- `--uri <string>` (`-u`): URI for token metadata JSON
- `--decimals <integer>` (`-d`): Number of decimals (default: 9)
- `--quoteMint <string>`: Quote token mint address (default: Wrapped SOL)
- `--fundingMode <new-mint|transfer>`: Create a new mint or use an existing one (default: `new-mint`)
- `--baseMint <string>`: Base token mint address (required when `fundingMode` is `transfer`)
- `--genesisIndex <integer>`: Genesis index when creating multiple launches for the same mint (default: 0)

## Examples

1. Create a token with 9 decimals and 1 million total supply:
```bash
mplx genesis create \
  --name "My Token" \
  --symbol "MTK" \
  --totalSupply 1000000000000000 \
  --decimals 9
```

2. Create a token with metadata URI:
```bash
mplx genesis create \
  --name "My Token" \
  --symbol "MTK" \
  --totalSupply 1000000000000000 \
  --decimals 9 \
  --uri "https://example.com/metadata.json"
```

3. Use an existing token mint:
```bash
mplx genesis create \
  --name "Existing Token" \
  --symbol "EXT" \
  --totalSupply 1000000000000000 \
  --fundingMode transfer \
  --baseMint <EXISTING_MINT_ADDRESS>
```

## Output

```
--------------------------------
  Genesis Account: <genesis_address>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
--------------------------------
```

Save the `Genesis Account` address — you'll use it in every subsequent command.

## Notes

- `totalSupply` is in base units. With 9 decimals, `1000000000000000` = 1,000,000 tokens
- The default quote token is Wrapped SOL. Use `--quoteMint` to specify a different SPL token
- When using `--fundingMode transfer`, you must also provide `--baseMint` with an existing token mint address
- Use `--genesisIndex` if you need to create multiple Genesis launches for the same token mint
