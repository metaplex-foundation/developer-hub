---
title: "Mint Limit"
metaTitle: "Candy Machine Guards - Mint Limit"
description: "The Mint Limit guard allows specifying a limit on the number of NFTs each wallet can mint."
---

## Overview

The **Mint Limit** guard allows specifying a limit on the number of NFTs each wallet can mint.

The limit is set per wallet, per candy machine and per identifier — provided in the settings — to allow multiple mint limits within the same Candy Machine.

![CandyMachinesV3-GuardsMintLimit.png](https://docs.metaplex.com/assets/candy-machine-v3/CandyMachinesV3-GuardsMintLimit.png#radius)

## Guard Settings

The Mint Limit guard contains the following settings:

- **ID**: A unique identifier for this guard. Different identifiers will use different counters to track how many items were minted by a given wallet. This is particularly useful when using groups of guards as we may want each of them to have a different mint limit.
- **Limit**: The maximum number of mints allowed per wallet for that identifier.

{% dialect-switcher title="Set up a Candy Machine using the Mint Limit guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    mintLimit: some({ id: 1, limit: 5 }),
  },
});
```

API References: [create](https://mpl-candy-machine-js-docs.vercel.app/functions/create.html), [MintLimit](https://mpl-candy-machine-js-docs.vercel.app/types/MintLimit.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

Add this object into the guard section your config.json file:

```json
"mintLimit" : {
    "id": number,
    "limit": number
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Mint Settings

The Mint Limit guard contains the following Mint Settings:

- **ID**: A unique identifier for this guard.

Note that, if you’re planning on constructing instructions without the help of our SDKs, you will need to provide these Mint Settings and more as a combination of instruction arguments and remaining accounts. See the [Candy Guard’s program documentation](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#mintlimit) for more details.

{% dialect-switcher title="Mint with the Mint Limit Guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

You may pass the Mint Settings of the Mint Limit guard using the `mintArgs` argument like so.

```ts
mintV2(umi, {
  // ...
  mintArgs: {
    mintLimit: some({ id: 1 }),
  },
});
```

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_As soon as a guard is assigned you cannot use sugar to mint - therefore there are no specific mint settings._

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route Instruction

_The Mint Limit guard does not support the route instruction._
