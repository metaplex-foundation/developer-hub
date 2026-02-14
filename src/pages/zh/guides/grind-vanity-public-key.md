---
title: Grind a Vanity Public Key on Solana
metaTitle: Grind a Vanity Public Key on Solana | Custom Address Guide
description: Learn how to generate custom Solana addresses with specific prefixes or suffixes using solana-keygen grind for branded tokens and recognizable wallets.
# remember to update dates also in /components/guides/index.js
created: '02-04-2026'
updated: null
---

Generate custom Solana addresses with memorable prefixes or suffixes for branded tokens, recognizable program IDs, or vanity wallets. {% .lead %}

## What You'll Learn

- What vanity addresses are and why they're useful
- How to use `solana-keygen grind` to generate custom addresses
- Performance expectations and optimization tips
- Security considerations for vanity keypairs

## Prerequisites

- [Solana CLI installed](/guides/solana-cli-essentials)

## What Are Vanity Addresses?

A **vanity address** is a Solana public key that contains a specific, human-readable pattern. For example:

- `TOKEN...` - A token mint address starting with "TOKEN"
- `...CAFE` - An address ending with "CAFE"
- `ABC123...` - Branded prefix for a project called ABC123

Vanity addresses are purely cosmetic—they work exactly like regular addresses but are easier to recognize and remember.

## Use Cases

| Use Case | Example Pattern | Why It Matters |
|----------|-----------------|----------------|
| Token mint address | `USDC...`, `BONK...` | Brand recognition, easier verification |
| Program ID | `PROG...` | Distinguishable in explorer |
| Collection address | `NFT...` | Recognizable collections |
| Personal wallet | `YOUR...` | Memorable address |
| Project treasury | `DAO...` | Clear purpose identification |

## Using solana-keygen grind

The `solana-keygen grind` command generates keypairs until it finds one matching your criteria.

### Basic Prefix Search

Find an address starting with specific characters:

```bash
# Find address starting with "ABC"
solana-keygen grind --starts-with ABC:1
```

The `:1` means "find 1 match". The command outputs the keypair file when found.

### Suffix Search

Find an address ending with specific characters:

```bash
# Find address ending with "XYZ"
solana-keygen grind --ends-with XYZ:1
```

### Combined Search

Search for both prefix and suffix:

```bash
# Find address starting with "AB" AND ending with "YZ"
solana-keygen grind --starts-with AB:1 --ends-with YZ:1
```

### Multiple Patterns

Search for any of several patterns:

```bash
# Find address starting with "TOKEN" OR "MINT"
solana-keygen grind --starts-with TOKEN:1 --starts-with MINT:1
```

### Case Sensitivity

By default, the search is **case-sensitive**. Use `--ignore-case` for case-insensitive matching:

```bash
# Case-sensitive (default) — only matches exact case
solana-keygen grind --starts-with ABC:1

# Case-insensitive — matches "abc", "Abc", "aBc", etc.
solana-keygen grind --starts-with ABC:1 --ignore-case
```

### Output Options

Specify output file location:

```bash
solana-keygen grind --starts-with ABC:1 --output-directory ./vanity-keys/
```

### Optimization Tips

**Use all CPU cores** - The grind command uses multiple threads by default.

**Start simple** - Begin with 3-4 characters and increase if you have time.

**Run overnight** - For 5+ characters, start the grind before leaving your computer.

## Practical Examples

### Create a Branded Token Mint

```bash
# 1. Grind for a token-related prefix
solana-keygen grind --starts-with MYTKN:1 --output-directory ./

# 2. This creates a file like: MYTKN...abc123.json
# 3. Use this keypair when creating your token mint

# With MPLX CLI, specify this keypair for token creation
mplx toolbox token-create --keypair ./MYTKNxyz123....json
```

### Create a Recognizable Program ID

For Anchor programs, you can grind a keypair for your program ID:

```bash
# 1. Grind for program prefix
solana-keygen grind --starts-with PROG:1

# 2. Move to your Anchor project
mv PROGxyz....json ./target/deploy/my_program-keypair.json

# 3. Update declare_id! in your program
# declare_id!("PROGxyz...");
```

### Create Multiple Options

Generate several options to choose from:

```bash
# Find 5 addresses starting with "NFT"
solana-keygen grind --starts-with NFT:5 --output-directory ./vanity-options/

# Review the generated addresses
ls ./vanity-options/
```

## Security Considerations

### Vanity Keypairs Are Still Secure

The grinding process is **random search**, not cryptographic weakening. A vanity keypair is exactly as secure as a regular keypair.

### Best Practices

1. **Generate locally** - Always grind on your own machine, never use online generators
2. **Secure the output** - Treat vanity keypairs with the same security as any keypair
3. **Verify the file** - Check that the file contains the expected public key

```bash
# Verify the keypair
solana-keygen pubkey ./MYTKNxyz....json
# Should output: MYTKNxyz...
```

### What NOT to Do

- **Never** use online vanity generators - they could steal your private key
- **Never** share your grinding progress or partial results
- **Never** assume a vanity address is more or less secure than others

## Alternative: GPU Grinding

For longer patterns, community tools use GPU acceleration:

- **solana-keygen-cuda** - NVIDIA GPU acceleration
- **VanitySearch-Solana** - Cross-platform GPU support

These can be 100-1000x faster than CPU grinding but require setup and verification that the tools are safe.

{% callout title="Trust Warning" type="warning" %}
Third-party grinding tools could potentially compromise your keypair. Only use well-audited, open-source tools, and verify the generated keypairs work correctly before using them with real funds.
{% /callout %}

## Verifying Your Vanity Keypair

After grinding, always verify:

```bash
# 1. Check the public key matches your pattern
solana-keygen pubkey ./your-vanity-keypair.json

# 2. Verify the keypair file is valid
solana-keygen verify <EXPECTED_PUBKEY> ./your-vanity-keypair.json

# 3. Test with a small transaction on devnet
solana config set --url devnet
solana config set --keypair ./your-vanity-keypair.json
solana airdrop 1
solana balance
```

## Using Vanity Addresses with Metaplex

### Token Creation

```bash
# Create a token with a vanity mint address
# First, grind the keypair
solana-keygen grind --starts-with COOL:1

# Use with MPLX CLI (specify as mint keypair)
mplx toolbox token-create --name "Cool Token" --symbol "COOL"
```

### NFT Collection

When creating collections with the MPLX CLI, you can use a vanity address for your collection:

```bash
# Grind collection address
solana-keygen grind --starts-with ART:1

# Use in collection creation
mplx core create-collection --keypair ./ARTxyz....json
```

## Next Steps

- [Solana keypairs and wallets](/guides/solana-keypairs-and-wallets) - Keypair security fundamentals
- [Getting SOL for development](/guides/getting-sol-for-development) - Fund your new vanity wallet
- [MPLX CLI token creation](/dev-tools/cli/toolbox/token-create) - Create tokens with your vanity address

## FAQ

### How long will grinding take?

It depends on pattern length. 3 characters: seconds. 4 characters: minutes. 5 characters: hours. 6+ characters: days or longer.

### Is a vanity address less secure?

No. The grinding process is pure random search. The resulting keypair has the same cryptographic strength as any randomly generated keypair.

### Can I grind for patterns in the middle of the address?

No, `solana-keygen grind` only supports prefix (starts-with) and suffix (ends-with) patterns. Middle patterns would require custom tooling.

### Why can't I find certain characters?

Solana addresses use **base58** encoding, which excludes: `0` (zero), `O` (uppercase o), `I` (uppercase i), and `l` (lowercase L) to avoid confusion.

### Can I continue a grind session?

No, each grind starts fresh. For long grinds, consider running multiple parallel sessions with different output directories.
