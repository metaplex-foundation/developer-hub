---
title: Token Burn Guard
metaTitle: Token Burn Guard | Core Candy Machine
description: "The Core Candy Machine 'Token Burn' guard requires the minter to burn a specified amount of SPL tokens from a configured mint account before minting is allowed."
keywords:
  - Token Burn
  - Core Candy Machine
  - candy guard
  - SPL token burn
  - burn to mint
  - minting restriction
  - Solana NFT
about:
  - Candy Machine guards
  - SPL token burning for mint access
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
---

The **Token Burn** guard requires the minter to permanently burn a configured amount of SPL tokens before the mint transaction is allowed to proceed. {% .lead %}

## Overview

The **Token Burn** guard allows minting by burning some of the payer's tokens from a configured mint account. If the payer does not have the required amount of tokens to burn, minting will fail.

{% diagram  %}

{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="20" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="Guards" theme="mint" z=1/%}
{% node label="Token Burn" /%}
{% node #guardAmount label="- Amount" /%}
{% node #guardMint label="- Mint" /%}
{% node label="..." /%}
{% /node %}

{% node parent="guardMint" #mint x="270" y="-19" %}
{% node  theme="indigo" %}
Mint Account {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
Owner: Token Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" x="600" %}
  {% node #mint-candy-guard theme="pink" %}
    Mint from

    _Core Candy Guard Program_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  Access Control
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-9" %}
  {% node theme="pink" %}
    Mint from

    _Core Candy Machine Program_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="93" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}
{% edge from="guardMint" to="mint" arrow="none" dashed=true /%}
{% edge from="mint-candy-guard" to="mint" arrow="none" dashed=true  theme="pink" %}
Burn tokens from

the payer's token account
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## Guard Settings

The Token Burn guard contains the following settings:

- **Amount**: The number of tokens to burn.
- **Mint**: The address of the mint account defining the SPL Token we want to burn.

{% dialect-switcher title="Set up a Candy Machine using the NFT Burn guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    tokenBurn: some({
      amount: 300,
      mint: tokenMint.publicKey,
    }),
  },
});
```

API References: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [TokenBurn](https://mpl-core-candy-machine.typedoc.metaplex.com/types/TokenBurnArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Mint Settings

The Token Burn guard contains the following Mint Settings:

- **Mint**: The address of the mint account defining the SPL Token we want to burn.

Note that, if you're planning on constructing instructions without the help of our SDKs, you will need to provide these Mint Settings and more as a combination of instruction arguments and remaining accounts. See the [Candy Guard's program documentation](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#tokenburn) for more details.

{% dialect-switcher title="Mint with the NFT Burn Guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

You may pass the Mint Settings of the Token Burn guard using the `mintArgs` argument like so.

```ts
mintV1(umi, {
  // ...
  mintArgs: {
    tokenBurn: some({ mint: tokenMint.publicKey }),
  },
});
```

API References: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [TokenBurnMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/TokenBurnMintArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route Instruction

_The Token Burn guard does not support the route instruction._

## Notes

- Burned tokens are permanently destroyed and cannot be recovered. Ensure the configured **Amount** accurately reflects the intended cost per mint.
- This guard uses the original **SPL Token program**. For Token-2022 mints, use the corresponding Token-2022 guard variant instead.
- The payer must hold at least the configured **Amount** of tokens in their associated token account at the time of minting; otherwise the transaction will fail.

