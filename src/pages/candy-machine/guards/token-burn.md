---
title: "Token Burn"
metaTitle: "Candy Machine Guards - Token Burn"
description: "The Token Burn guard allows minting by burning some of the payer’s tokens."
---

## Overview

The **Token Burn** guard allows minting by burning some of the payer’s tokens from a configured mint account. If the payer does not have the required amount of tokens to burn, minting will fail.

![CandyMachinesV3-GuardsTokenBurn.png](https://docs.metaplex.com/assets/candy-machine-v3/CandyMachinesV3-GuardsTokenBurn.png#radius)

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

API References: [create](https://mpl-candy-machine-js-docs.vercel.app/functions/create.html), [TokenBurn](https://mpl-candy-machine-js-docs.vercel.app/types/TokenBurnArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

Add this object into the guard section your config.json file:

```json
"tokenBurn" : {
    "amount": number,
    "mint": "<PUBKEY>"
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Mint Settings

The Token Burn guard contains the following Mint Settings:

- **Mint**: The address of the mint account defining the SPL Token we want to burn.

Note that, if you’re planning on constructing instructions without the help of our SDKs, you will need to provide these Mint Settings and more as a combination of instruction arguments and remaining accounts. See the [Candy Guard’s program documentation](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#tokenburn) for more details.

{% dialect-switcher title="Mint with the NFT Burn Guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

You may pass the Mint Settings of the Token Burn guard using the `mintArgs` argument like so.

```ts
mintV2(umi, {
  // ...
  mintArgs: {
    tokenBurn: some({ mint: tokenMint.publicKey }),
  },
});
```

API References: [mintV2](https://mpl-candy-machine-js-docs.vercel.app/functions/mintV2.html), [TokenBurnMintArgs](https://mpl-candy-machine-js-docs.vercel.app/types/TokenBurnMintArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_As soon as a guard is assigned you cannot use sugar to mint - therefore there are no specific mint settings._

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route Instruction

_The Token Burn guard does not support the route instruction._
