---
title: Create a Solana Token
metaTitle: Create a Solana Token | Comparing Approaches
description: Learn the different ways to create a fungible token on Solana and why Metaplex tools save you time.
# remember to update dates also in /components/products/guides/index.js
created: '02-13-2026'
updated: null
---

Learn the different ways to create a fungible token on Solana and why Metaplex tools save you time. {% .lead %}

## What You'll Learn

- Why creating a token with the Solana CLI alone leaves you with an unrecognizable token
- How the Metaplex CLI (`mplx`) creates a complete token with metadata in one command
- Where to go for programmatic (SDK) token creation

## Prerequisites

- [SPL Tokens and Token Programs](/solana/spl-tokens-and-token-programs) — understand mint accounts, token accounts, and ATAs
- [Solana CLI Essentials](/solana/solana-cli-essentials) — have the Solana CLI installed and configured

## The Solana CLI Way (spl-token)

The Solana CLI can create tokens with `spl-token create-token`, `spl-token create-account`, and `spl-token mint`, but it only interacts with the SPL Token Program — it has no concept of metadata.

{% callout title="Tokens Without Metadata Are Invisible" type="warning" %}
A token created with only `spl-token` has **no name, no symbol, no image**. Wallets and explorers will show it as an "Unknown Token" with just a raw address. Adding metadata requires manually calling the Token Metadata program, which means uploading images, creating JSON metadata, and writing custom code.
{% /callout %}

## The Metaplex CLI Way (mplx)

The [Metaplex CLI](/dev-tools/cli/toolbox/token-create) handles everything in a single command:

```bash
mplx toolbox token create \
  --name "My Token" \
  --symbol "TKN" \
  --decimals 9 \
  --mint-amount 1000000 \
  --image ./logo.png
```

That one command uploads your image, creates and uploads the JSON metadata, creates the mint and metadata accounts, and mints the initial supply into your wallet.

You can also use the interactive wizard:

```bash
mplx toolbox token create --wizard
```

See the [CLI token create reference](/dev-tools/cli/toolbox/token-create) for all available options.

## Programmatic Token Creation

If you need to create tokens from code (TypeScript), see [Create a Fungible Token](/tokens/create-a-token) for full examples using the Metaplex Kit and Umi SDKs.

## Next Steps

- [Create a Fungible Token](/tokens/create-a-token) — code examples with Kit, Umi, and CLI
- [How to Create a Solana Token (JS)](/solana/javascript/how-to-create-a-solana-token) — detailed JavaScript walkthrough
- [SPL Tokens and Token Programs](/solana/spl-tokens-and-token-programs) — deeper understanding of the token model
