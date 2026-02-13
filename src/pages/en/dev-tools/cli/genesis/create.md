---
title: Create Genesis Account
metaTitle: Create Genesis Account | Metaplex CLI
description: Create a new Genesis account and token mint using the Metaplex CLI.
keywords:
  - genesis create
  - create token launch
  - mplx genesis create
  - token mint CLI
  - Solana token creation
about:
  - Genesis account creation
  - token mint setup
  - Metaplex CLI
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
howToSteps:
  - Run mplx genesis create with name, symbol, totalSupply, and decimals
  - Optionally provide a metadata URI and custom quote mint
  - Save the Genesis Account address from the output for subsequent commands
howToTools:
  - Metaplex CLI (mplx)
  - Solana CLI
faqs:
  - q: What does mplx genesis create do?
    a: It creates a new Genesis account PDA and token mint on Solana. This is the first step in any Genesis token launch.
  - q: How do I calculate totalSupply in base units?
    a: Multiply the desired token count by 10 raised to the number of decimals. For 1 million tokens with 9 decimals, totalSupply = 1000000 * 10^9 = 1000000000000000.
---

{% callout title="What You'll Do" %}
Create a Genesis account and token mint — the first step in any token launch:
- Initialize a Genesis PDA that manages the entire launch
- Create a new token mint (or link an existing one)
- Configure token name, symbol, decimals, and supply
{% /callout %}

## Summary

The `mplx genesis create` command creates a new Genesis account and token mint. This is the first step in any token launch.

- **Creates**: A Genesis account PDA and a token mint
- **Required flags**: `--name`, `--symbol`, `--totalSupply`
- **Default decimals**: 9 (1 token = 1,000,000,000 base units)

## Out of Scope

Bucket configuration, deposit/claim flows, token metadata hosting, liquidity pool setup.

**Jump to:** [Basic Usage](#basic-usage) · [Options](#options) · [Examples](#examples) · [Output](#output) · [Common Errors](#common-errors) · [FAQ](#faq)

*Maintained by Metaplex Foundation · Last verified February 2026 · Requires Metaplex CLI (mplx)*

## Basic Usage

```bash {% title="Create a Genesis account" %}
mplx genesis create --name "My Token" --symbol "MTK" --totalSupply 1000000000000000 --decimals 9
```

## Options

| Flag | Short | Description | Required |
|------|-------|-------------|----------|
| `--name <string>` | `-n` | Name of the token | Yes |
| `--symbol <string>` | `-s` | Symbol of the token | Yes |
| `--totalSupply <string>` | | Total supply in base units | Yes |
| `--uri <string>` | `-u` | URI for token metadata JSON | No |
| `--decimals <integer>` | `-d` | Number of decimals (default: 9) | No |
| `--quoteMint <string>` | | Quote token mint address (default: Wrapped SOL) | No |
| `--fundingMode <new-mint\|transfer>` | | Create a new mint or use an existing one (default: `new-mint`) | No |
| `--baseMint <string>` | | Base token mint address (required when `fundingMode` is `transfer`) | Conditional |
| `--genesisIndex <integer>` | | Genesis index for multiple launches on the same mint (default: 0) | No |

## Examples

1. Create a token with 9 decimals and 1 million total supply:
```bash {% title="Basic creation" %}
mplx genesis create \
  --name "My Token" \
  --symbol "MTK" \
  --totalSupply 1000000000000000 \
  --decimals 9
```

2. Create a token with metadata URI:
```bash {% title="With metadata URI" %}
mplx genesis create \
  --name "My Token" \
  --symbol "MTK" \
  --totalSupply 1000000000000000 \
  --decimals 9 \
  --uri "https://example.com/metadata.json"
```

3. Use an existing token mint:
```bash {% title="Existing mint" %}
mplx genesis create \
  --name "Existing Token" \
  --symbol "EXT" \
  --totalSupply 1000000000000000 \
  --fundingMode transfer \
  --baseMint <EXISTING_MINT_ADDRESS>
```

## Output

```text {% title="Expected output" %}
--------------------------------
  Genesis Account: <genesis_address>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
--------------------------------
```

Save the `Genesis Account` address — you'll use it in every subsequent command.

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| Missing required flag | `--name`, `--symbol`, or `--totalSupply` not provided | Add all three required flags |
| Invalid totalSupply | Non-numeric or zero value | Provide a positive integer in base units |
| baseMint required | `--fundingMode transfer` without `--baseMint` | Add `--baseMint <address>` when using transfer mode |
| Insufficient SOL | Not enough SOL for the transaction fee | Fund your wallet with SOL for fees |

## Notes

- `totalSupply` is in base units. With 9 decimals, `1000000000000000` = 1,000,000 tokens
- The default quote token is Wrapped SOL. Use `--quoteMint` to specify a different SPL token
- When using `--fundingMode transfer`, you must also provide `--baseMint` with an existing token mint address
- Use `--genesisIndex` if you need to create multiple Genesis launches for the same token mint

## FAQ

**What does mplx genesis create do?**
It creates a new Genesis account PDA and token mint on Solana. This is the first step in any Genesis token launch — all subsequent commands reference the Genesis address from this step.

**How do I calculate totalSupply in base units?**
Multiply the desired token count by 10 raised to the number of decimals. For 1 million tokens with 9 decimals: `1,000,000 × 10^9 = 1,000,000,000,000,000`.

**Can I use an existing token mint instead of creating a new one?**
Yes. Set `--fundingMode transfer` and provide the existing mint address with `--baseMint`. The existing mint's authority must be transferable to the Genesis account.

**What is genesisIndex for?**
It allows multiple Genesis launches for the same token mint. Each launch needs a unique index. The default is 0.

## Glossary

| Term | Definition |
|------|------------|
| **Genesis Account** | The PDA that manages the token launch, created by this command |
| **Base Units** | Smallest denomination — with 9 decimals, 1 token = 1,000,000,000 base units |
| **Quote Mint** | The token accepted as payment during deposits (default: Wrapped SOL) |
| **Genesis Index** | Numeric index allowing multiple launches for the same token mint |
