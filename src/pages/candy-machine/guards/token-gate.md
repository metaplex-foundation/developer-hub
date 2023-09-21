---
title: "Token Gate"
metaTitle: "Candy Machine Guards - Token Gate"
description: "The Token Gate guard restricts minting to token holders of a configured mint account."
---

## Overview

The **Token Gate** guard restricts minting to token holders of a configured mint account. If the payer does not have the required amount of tokens, minting will fail.

![CandyMachinesV3-GuardsTokenGate.png](https://docs.metaplex.com/assets/candy-machine-v3/CandyMachinesV3-GuardsTokenGate.png#radius)

## Guard Settings

The Token Gate guard contains the following settings:

- **Amount**: The number of tokens required.
- **Mint**: The address of the mint account defining the SPL Token we want to gate with.

{% dialect-switcher title="Set up a Candy Machine using the Token Gate guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    tokenGate: some({
      amount: 300,
      mint: tokenMint.publicKey,
    }),
  },
});
```

API References: [create](https://mpl-candy-machine-js-docs.vercel.app/functions/create.html), [TokenGate](https://mpl-candy-machine-js-docs.vercel.app/types/TokenGateArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

Add this object into the guard section your config.json file:

```json
"tokenGate" : {
    "amount": number,
    "mint": "<PUBKEY>"
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Mint Settings

The Token Gate guard contains the following Mint Settings:

- **Mint**: The address of the mint account defining the SPL Token we want to gate with.

Note that, if you’re planning on constructing instructions without the help of our SDKs, you will need to provide these Mint Settings and more as a combination of instruction arguments and remaining accounts. See the [Candy Guard’s program documentation](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#tokengate) for more details.

{% dialect-switcher title="Mint with the Token Gate Guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

You may pass the Mint Settings of the Token Gate guard using the `mintArgs` argument like so.

```ts
mintV2(umi, {
  // ...
  mintArgs: {
    tokenGate: some({ mint: tokenMint.publicKey }),
  },
});
```

API References: [mintV2](https://mpl-candy-machine-js-docs.vercel.app/functions/mintV2.html), [TokenGateMintArgs](https://mpl-candy-machine-js-docs.vercel.app/types/TokenGateMintArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_As soon as a guard is assigned you cannot use sugar to mint - therefore there are no specific mint settings._

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route Instruction

_The Token Gate guard does not support the route instruction._
