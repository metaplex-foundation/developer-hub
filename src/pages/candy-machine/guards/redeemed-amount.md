---
title: "Redeemed Amount"
metaTitle: "Candy Machine Guards - Redeemed Amount"
description: "The Redeemed Amount guard forbids minting when the number of minted NFTs for the entire Candy Machine reaches the configured maximum amount."
---

## Overview

The **Redeemed Amount** guard forbids minting when the number of minted NFTs for the entire Candy Machine reaches the configured maximum amount.

This guard becomes more interesting when used with [Guard Groups](../guard-groups) since it allows us to add global minting thresholds to our groups.

![CandyMachinesV3-GuardsRedeemedAmount.png](https://docs.metaplex.com/assets/candy-machine-v3/CandyMachinesV3-GuardsRedeemedAmount.png#radius)

## Guard Settings

The Redeemed Amount guard contains the following settings:

- **Maximum**: The maximum amount of NFTs that can be minted.

{% dialect-switcher title="Set up a Candy Machine using the Redeemed Amount Guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  itemsAvailable: 500,
  guards: {
    redeemedAmount: some({ maximum: 300 }),
  },
});
```

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}
Add this object into the guard section your config.json file:

```json
"redeemedAmount" : {
    "maximum": number,
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

Notice that, even if the Candy Machine contains 500 items, only 300 of these items will be mintable because of this guard.

Thus, this guard becomes more useful when using [Guard Groups](/programs/candy-machine/guard-groups). Here’s another example using two groups such that the first 300 NFTs can be minted for 1 SOL but the last 200 will need 2 SOL to mint.

{% dialect-switcher title="Using the Redeemed Amount Guard with groups example" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  itemsAvailable: 500,
  groups: [
    {
      label: "early",
      guards: {
        redeemedAmount: some({ maximum: 300 }),
        solPayment: some({ lamports: sol(1), destination: treasury }),
      },
    },
    {
      label: "late",
      guards: {
        solPayment: some({ lamports: sol(2), destination: treasury }),
      },
    },
  ],
});
```

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

Like all the other guards it can also be added as a group like so:

```json
    "groups": [
      {
        "label": "early",
        "guards": {
          "redeemedAmount": {
            "maximum": 300,
          },
          "solPayment": {
            "value": 1,
            "destination": "<PUBKEY>"
          }
        }
      },
      {
        "label": "late",
        "guards": {
          "solPayment": {
            "value": 2,
            "destination": "<PUBKEY>"
          }
        }
      }
    ]

```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Mint Settings

_The Redeemed Amount guard does not need Mint Settings._

## Route Instruction

_The Redeemed Amount guard does not support the route instruction._
