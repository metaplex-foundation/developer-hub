---
title: "NFT Burn"
metaTitle: "Candy Machine Guards - NFT Burn"
description: "The NFT Burn guard restricts the mint to holders of a predefined NFT Collection and burns the holder's NFT."
---

## Overview

The **NFT Burn** guard restricts the mint to holders of a predefined NFT Collection and burns the holder's NFT. Thus, the mint address of the NFT to burn must be provided by the payer when minting.

![CandyMachinesV3-GuardsNFTBurn.png](https://docs.metaplex.com/assets/candy-machine-v3/CandyMachinesV3-GuardsNFTBurn.png#radius)

## Guard Settings

The NFT Burn guard contains the following settings:

- **Required Collection**: The mint address of the required NFT Collection. The NFT we use to mint with must be part of this collection.

{% dialect-switcher title="Set up a Candy Machine using the NFT Burn guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

Here’s how we can set up a Candy Machine using the NFT Burn guard.

```ts
create(umi, {
  // ...
  guards: {
    nftBurn: some({ requiredCollection: requiredCollectionNft.publicKey }),
  },
});
```

API References: [create](https://mpl-candy-machine-js-docs.vercel.app/functions/create.html), [NftBurn](https://mpl-candy-machine-js-docs.vercel.app/types/NftBurn.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

Add this object into the guard section your config.json file:

```json
"nftBurn" : {
    "requiredCollection": "<PUBKEY>",
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Mint Settings

The NFT Burn guard contains the following Mint Settings:

- **Required Collection**: The mint address of the required NFT Collection.
- **Mint**: The mint address of the NFT to burn. This must be part of the required collection and must belong to the minter.
- **Token Standard**: The token standard of the NFT to burn.
- **Token Account** (optional): You may optionally provide the token account linking the NFT with its owner explicitly. By default, the associated token account of the payer will be used.

Note that, if you’re planning on constructing instructions without the help of our SDKs, you will need to provide these Mint Settings and more as a combination of instruction arguments and remaining accounts. See the [Candy Guard’s program documentation](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#nftburn) for more details.

{% dialect-switcher title="Mint with the NFT Burn" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

You may pass the Mint Settings of the NFT Burn guard using the `mintArgs` argument like so.

```ts
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";

mintV2(umi, {
  // ...
  mintArgs: {
    nftBurn: some({
      requiredCollection: requiredCollectionNft.publicKey,
      mint: nftToBurn.publicKey,
      tokenStandard: TokenStandard.NonFungible,
    }),
  },
});
```

API References: [mintV2](https://mpl-candy-machine-js-docs.vercel.app/functions/mintV2.html), [NftBurnMintArgs](https://mpl-candy-machine-js-docs.vercel.app/types/NftBurnMintArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_As soon as a guard is assigned you cannot use sugar to mint - therefore there are no specific mint settings._

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route Instruction

_The NFT Burn guard does not support the route instruction._
