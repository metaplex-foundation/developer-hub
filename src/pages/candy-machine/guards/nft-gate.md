---
title: "NFT Gate"
metaTitle: "Candy Machine Guards - NFT Gate"
description: "The NFT Gate guard restricts minting to holders of a specified NFT collection."
---

## Overview

The **NFT Gate** guard restricts minting to holders of a specified NFT collection.

![CandyMachinesV3-GuardsNFTGate.png](https://docs.metaplex.com/assets/candy-machine-v3/CandyMachinesV3-GuardsNFTGate.png#radius)

## Guard Settings

The NFT Gate guard contains the following settings:

- **Required Collection**: The mint address of the required NFT Collection. The NFT we provide as proof when minting must be part of this collection.

{% dialect-switcher title="Set up a Candy Machine using the NFT Gate Guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    nftGate: some({
      requiredCollection: requiredCollectionNft.publicKey,
    }),
  },
});
```

API References: [create](https://mpl-candy-machine-js-docs.vercel.app/functions/create.html), [NftGate](https://mpl-candy-machine-js-docs.vercel.app/types/NftGate.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}
Add this object into the guard section your config.json file:

```json
"nftGate" : {
    "requiredCollection": "<PUBKEY>",
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Mint Settings

The NFT Gate guard contains the following Mint Settings:

- **Mint**: The mint address of the NFT to provide as proof that the payer owns an NFT from the required collection.
- **Token Account** (optional): You may optionally provide the token account linking the NFT with its owner explicitly. By default, the associated token account of the payer will be used.

Note that, if you’re planning on constructing instructions without the help of our SDKs, you will need to provide these Mint Settings and more as a combination of instruction arguments and remaining accounts. See the [Candy Guard’s program documentation](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#nftgate) for more details.

{% dialect-switcher title="Set up a Candy Machine using the NFT Gate Guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

When minting via the Umi library, simply provide the mint address of the NFT to use as proof of ownership via the `mint` attribute like so.

```ts
mintV2(umi, {
  // ...
  mintArgs: {
    nftGate: some({ mint: nftToBurn.publicKey }),
  },
});
```

API References: [mintV2](https://mpl-candy-machine-js-docs.vercel.app/functions/mintV2.html), [NftGateMintArgs](https://mpl-candy-machine-js-docs.vercel.app/types/NftGateMintArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_As soon as a guard is assigned you cannot use sugar to mint - therefore there are no specific mint settings._

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route Instruction

_The NFT Gate guard does not support the route instruction._
