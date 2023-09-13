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

<Accordion>
<AccordionItem title="JavaScript — Umi library (recommended)" open={true}>
<div className="accordion-item-padding">

Here’s how we can set up a Candy Machine using the NFT Gate guard.

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

</div>
</AccordionItem>
<AccordionItem title="JavaScript — SDK">
<div className="accordion-item-padding">

Here’s an example of how to set up a Candy Machine using the NFT Gate guard.

```tsx
const { candyMachine } = await metaplex.candyMachines().create({
  // ...
  guards: {
    nftGate: {
      requiredCollection: requiredCollectionNft.address,
    },
  },
});
```

API References: [Operation](https://metaplex-foundation.github.io/js/classes/js.CandyMachineClient.html#create), [Input](https://metaplex-foundation.github.io/js/types/js.CreateCandyMachineInput.html), [Output](https://metaplex-foundation.github.io/js/types/js.CreateCandyMachineOutput.html), [Transaction Builder](https://metaplex-foundation.github.io/js/classes/js.CandyMachineBuildersClient.html#create), [Guard Settings](https://metaplex-foundation.github.io/js/types/js.NftGateGuardSettings.html).

</div>
</AccordionItem>
</Accordion>

## Mint Settings

The NFT Gate guard contains the following Mint Settings:

- **Mint**: The mint address of the NFT to provide as proof that the payer owns an NFT from the required collection.
- **Token Account** (optional): You may optionally provide the token account linking the NFT with its owner explicitly. By default, the associated token account of the payer will be used.

Note that, if you’re planning on constructing instructions without the help of our SDKs, you will need to provide these Mint Settings and more as a combination of instruction arguments and remaining accounts. See the [Candy Guard’s program documentation](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#nftgate) for more details.

<Accordion>
<AccordionItem title="JavaScript — Umi library (recommended)" open={true}>
<div className="accordion-item-padding">

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

</div>
</AccordionItem>
<AccordionItem title="JavaScript — SDK">
<div className="accordion-item-padding">

When minting via the JS SDK, simply provide the mint address of the NFT to use as proof of ownership via the `mint` attribute like so.

```tsx
const { nft } = await metaplex.candyMachines().mint({
  // ...
  guards: {
    nftGate: {
      mint: nftFromRequiredCollection.address,
    },
  },
});
```

You may also provide the `tokenAccount` attribute explicitly should the NFT not use an associated token account.

API References: [Operation](https://metaplex-foundation.github.io/js/classes/js.CandyMachineClient.html#mint), [Input](https://metaplex-foundation.github.io/js/types/js.MintFromCandyMachineInput.html), [Output](https://metaplex-foundation.github.io/js/types/js.MintFromCandyMachineOutput.html), [Transaction Builder](https://metaplex-foundation.github.io/js/classes/js.CandyMachineBuildersClient.html#mint), [Mint Settings](https://metaplex-foundation.github.io/js/types/js.NftGateGuardMintSettings.html).

</div>
</AccordionItem>
</Accordion>

## Route Instruction

_The NFT Gate guard does not support the route instruction._
