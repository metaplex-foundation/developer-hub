---
title: "Core Candy Machine - Asset Gate Guard"
metaTitle: "Asset Gate Guard | Core Candy Machine"
description: "The Core Candy Machine 'Asset Gate' guard requires the minting wallet to hold a Core Asset from a specified collection in order to mint, without burning or transferring the held Asset."
keywords:
  - asset gate
  - Core Candy Machine
  - candy guard
  - token gating
  - collection holder verification
  - ownership check
  - Solana NFT
  - minting restriction
about:
  - Candy Machine guards
  - collection-based ownership gating
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
---

The **Asset Gate** guard allows minting only if the payer holds an Asset from a specified collection, without burning or transferring that Asset. {% .lead %}

## Overview

The **Asset Gate** guard allows minting if the payer is Holder of an Asset of the specified Asset collection. The Asset will **not** be transferred.

If the payer does not own an Asset from the required collection, minting will fail.

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="20" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="Guards" theme="mint" z=1/%}
{% node #assetGate label="assetGate" /%}
{% node #requiredCollection label="- Required Collection" /%}
{% node label="..." /%}
{% /node %}

{% node parent="requiredCollection" x="270" y="-9"  %}
{% node #collectionNftMint theme="blue" %}
Collection {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
Owner: Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="requiredCollection" to="collectionNftMint" /%}

{% edge from="collectionNftMint" to="mint-candy-guard" theme="indigo" dashed=true %}
Check that the payer

has at least 1 asset

from this collection
{% /edge %}
{% node parent="candy-machine" x="600" %}
  {% node #mint-candy-guard theme="pink" %}
    Mint from

    _Candy Guard Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  Access Control
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-9" %}
  {% node theme="pink" %}
    Mint from

    _Candy Machine Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="69" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}

{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## Guard Settings

The Asset Gate guard contains the following settings:

- **Required Collection**: The mint address of the required Collection. The Asset we use to prove ownership must be part of this collection.

{% dialect-switcher title="Set up a Candy Machine using the Asset Gate Guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    assetGate: some({
      requiredCollection: requiredCollection.publicKey,
    }),
  },
});
```

API References: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [AssetGate](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetGate.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Mint Settings

The Asset Gate guard contains the following Mint Settings:
- **Asset Address**: The address of the Asset to prove ownership with. This must be part of the required collection and must belong to the minter.
- **Collection Address**: The Address of the Collection that is used to prove ownership.

Note that, if you're planning on constructing instructions without the help of our SDKs, you will need to provide these Mint Settings and more as a combination of instruction arguments and remaining accounts. See the [Core Candy Guard's program documentation](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#assetgate) for more details.

{% dialect-switcher title="Set up a Candy Machine using the Asset Gate Guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

You may pass the Mint Settings of the Asset Gate guard using the `mintArgs` argument like so.

```ts

mintV1(umi, {
  // ...
  mintArgs: {
    assetGate: some({
      requiredCollection: publicKey(requiredCollection),
      destination,
    }),
  },
});
```

API References: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [AssetGateMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetGateMintArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route Instruction

_The Asset Gate guard does not support the route instruction._

## Notes

- The Asset Gate guard verifies ownership but does not burn or transfer the held Asset. The same Asset can be used to mint multiple times unless combined with other guards that limit minting.
- The Asset used for verification must belong to the minting wallet and must be part of the specified collection at the time of minting.
- To require burning the held Asset during minting instead of just verifying ownership, use the [Asset Burn](/smart-contracts/core-candy-machine/guards/asset-burn) guard.

