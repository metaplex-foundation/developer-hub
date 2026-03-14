---
title: "Redeemed Amount Guard"
metaTitle: "Redeemed Amount Guard - Core Candy Machine Guard | Metaplex"
description: "The Redeemed Amount guard limits the total number of Assets that can be minted from a Core Candy Machine, enabling global mint caps and tiered minting strategies with Guard Groups."
keywords:
  - redeemed amount
  - Core Candy Machine
  - candy guard
  - mint limit
  - guard groups
  - global mint cap
  - Solana NFT
  - minting restriction
about:
  - Candy Machine guards
  - minting supply caps
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
---

The **Redeemed Amount** guard forbids minting when the total number of minted Assets across the entire Core Candy Machine reaches a configured maximum, enabling global supply caps and tiered minting phases. {% .lead %}

## Overview

The **Redeemed Amount** guard forbids minting when the number of minted Assets for the entire Core Candy Machine reaches the configured maximum amount.

This guard becomes more interesting when used with [Guard Groups](/smart-contracts/core-candy-machine/guard-groups) since it allows us to add global minting thresholds to our groups.

{% diagram  %}

{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="21" %}
{% node #candy-guard label="Core Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="Guards" theme="mint" z=1/%}
{% node #redeemedAmount label="RedeemedAmount" /%}
{% node #maximum label="- maximum" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine" #mint-candy-guard x="595" %}
  {% node theme="pink" %}
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
{% edge from="maximum" to="mint-candy-guard" arrow="none" dashed=true %}
once that amount of

Assets have been minted

Minting will fail
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## Guard Settings

The Redeemed Amount guard contains the following settings:

- **Maximum**: The maximum amount of NFTs that can be minted.

{% dialect-switcher title="Set up a Core Candy Machine using the Redeemed Amount Guard" %}
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
{% /dialect-switcher %}

Notice that, even if the Candy Machine contains 500 items, only 300 of these items will be mintable because of this guard.

Thus, this guard becomes more useful when using [Guard Groups](/smart-contracts/core-candy-machine/guard-groups). Here's another example using two groups such that the first 300 Assets can be minted for 1 SOL but the last 200 will need 2 SOL to mint.

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
{% /dialect-switcher %}

## Mint Settings

_The Redeemed Amount guard does not need Mint Settings._

## Route Instruction

_The Redeemed Amount guard does not support the route instruction._

## Notes

- The Redeemed Amount guard tracks total mints across the entire Core Candy Machine, not per-wallet. To limit mints per wallet, use the [Mint Limit](/smart-contracts/core-candy-machine/guards/mint-limit) guard instead.
- The `maximum` value must be less than or equal to `itemsAvailable` on the Candy Machine to have any practical effect.
- When used with [Guard Groups](/smart-contracts/core-candy-machine/guard-groups), the Redeemed Amount counter is shared globally across all groups, making it ideal for implementing tiered pricing phases.

