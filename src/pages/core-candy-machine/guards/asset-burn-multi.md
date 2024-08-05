---
title: "Asset Burn Multi"
metaTitle: "Core Candy Machine Guards - Asset Burn Multi"
description: "The Asset Burn Multi guard restricts the mint to holders of a predefined Collection and burns the holder's Asset(s)."
---

{% callout type="note" %}
This Guard is currently only available on devnet. [Follow us](https://x.com/metaplex) on twitter to see when it's merged to mainnet!
{% /callout %}

## Overview

The **Asset Burn Multi** guard restricts the mint to holders of a predefined Collection and burns the holder's Asset(s). Thus, the address of the Asset(s) to burn must be provided by the payer when minting.

It is similar to the [Asset Burn Guard](/core-candy-machine/guards/asset-burn) but can accept more than one asset to burn.

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
{% node #nftBurn label="nftBurnMulti" /%}
{% node #requiredCollection label="- Required Collection" /%}
{% node label="- Number" /%}
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
Burn n Asset(s) 

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

The Asset Burn guard contains the following settings:

- **Required Collection**: The Address of the required Collection. The Asset we use to mint with must be part of this collection.
- **Number**: The Amount of Assets that have to be burned in exchange for the new Asset.

{% dialect-switcher title="Set up a Candy Machine using the Asset Burn Multi guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    assetBurnMulti: some({
      requiredCollection: requiredCollection.publicKey,
      num: 2,
    }),
  },
});
```

API References: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [AssetBurnMulti](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetBurnMulti.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Mint Settings

The Asset Burn Multi guard contains the following Mint Settings:

- **Required Collection**: The mint address of the required Collection.
- **[Address]**: An Array of Addresses of the Asset(s) to burn. These must be part of the required collection and must belong to the minter.

Note that, if you’re planning on constructing instructions without the help of our SDKs, you will need to provide these Mint Settings and more as a combination of instruction arguments and remaining accounts. See the [Candy Guard’s program documentation](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#asseturn) for more details.

{% dialect-switcher title="Mint with the Asset Burn Multi Guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

You may pass the Mint Settings of the Asset Burn Multi guard using the `mintArgs` argument like so.

```ts

mintV1(umi, {
  // ...
  mintArgs: {
    assetBurnMulti: some({
      requiredCollection: requiredCollection.publicKey,
      assets: [assetToBurn1.publicKey, assetToBurn2.publicKey],
    }),
  },
});
```

API References: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [AssetBurnMultiMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetBurnMultiMintArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route Instruction

_The Asset Burn Multi guard does not support the route instruction._
