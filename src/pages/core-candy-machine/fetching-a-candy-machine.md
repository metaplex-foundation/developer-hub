---
title: Fetching a Core Candy Machine
metaTitle: Fetching a Core Candy Machine | Core Candy Machine
description: How to fetch the data of a Core Core Candy Machine from the Solana blockchain.
---

You can fetch a Core Candy Machine and its data using the `fetchCandyMachine()` function. The response will contain the following arguments:

| **Name**          | **Type**                  | **Description**                                                                                |
|-------------------|---------------------------|------------------------------------------------------------------------------------------------|
| `authority`       | `PublicKey`               | The key responsible for updating the Candy Machine's data.                                     |
| `mintAuthority`   | `PublicKey`               | The key responsible for minting NFTs from the Candy Machine.                                   |
| `collectionMint`  | `PublicKey`               | The address of the NFT collection associated with the Candy Machine.                           |
| `itemsRedeemed`   | `bigint`                  | The number of items successfully minted from the Candy Machine.                                |
| `data`            | `CandyMachineData`        | Contains the Candy Machine's configuration and settings.                                       |
| `items`           | `CandyMachineItem[]`      | Represents items available for minting in the Candy Machine.                                   |
| `itemsLoaded`     | `number`                  | The total number of items currently loaded into the Candy Machine.                             |
| `isMutable`       | `boolean`                 | Indicates whether assets created by the Candy Machine can be modified after creation.          |

And this are the `CandyMachineData` and `CandyMachineItem` types:

{% totem %}

{% totem-accordion title="`CandyMachineItem` type" %}

```ts
export declare type CandyMachineItem = {
    /** The index of the config line. */
    readonly index: number;
    /** Whether the item has been minted or not. */
    readonly minted: boolean;
    /** The name of the NFT to be. */
    readonly name: string;
    /** The URI of the NFT to be, pointing to some off-chain JSON Metadata. */
    readonly uri: string;
};
```

{% /totem-accordion %}

{% totem-accordion title="`CandyMachineData` type" %}

```ts
export declare type CandyMachineData = {
    /** Number of assets available */
    itemsAvailable: bigint;
    /** Max supply of each individual asset (default 0) */
    maxEditionSupply: bigint;
    /** Indicates if the asset is mutable or not (default yes) */
    isMutable: boolean;
    /** Config line settings */
    configLineSettings: Option<ConfigLineSettings>;
    /** Hidden setttings */
    hiddenSettings: Option<HiddenSettings>;
};
```

{% /totem-accordion %}

{% /totem %}

Here is an example of how to fetch a Core Candy Machine directly:

{% dialect-switcher title="Fetch a Core Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchCandyMachine, mplCandyMachine } from "@metaplex-foundation/mpl-core-candy-machine";
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

const umi = createUmi("https://api.devnet.solana.com").use(mplCandyMachine())

const candyMachineId = "11111111111111111111111111111111"

const candyMachine = await fetchCandyMachine( umi, publicKey(candyMachineId));
```

{% /dialect %}
{% /dialect-switcher %}
