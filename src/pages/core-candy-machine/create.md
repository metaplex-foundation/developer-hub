---
title: Creating a Core Candy Machine 
metaTitle: Creating a Core Candy Machine
description: Learn how to create your Core Candy Machine and it's various settings.
---

## Prerequisites

- [Prepared Assets](/core-candy-machine/preparing-assets)
- [Create Core Collection](/core/collections#creating-a-collection)

If you wish to create your Core Candy Machine Assets into a collection (new or existing) you will need to supply the Core Collection upon creation of the Core Candy Machine.

## Creating a Candy Machine

{% dialect-switcher title="Create a Core Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

```ts
// Create the Candy Machine.
import { create } from '@metaplex-foundation/mpl-core-candy-machine'
import { generateSigner } from '@metaplex-foundation/umi'

const candyMachine = generateSigner(umi)

const createIx = await create(umi, {
  candyMachine,
  collection: collectionMint.publicKey,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 1000,
  authority: umi.identity.publicKey,
})

await createIx.sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

### Args

Available arguments that can be passed into the createCandyMachine function.

A newly generated keypair/signer that is used to create the Core Candy Machine.

{% dialect-switcher title="Create CandyMahcine Args" %}
{% dialect title="JavaScript" id="js" %}

| name                      | type                          |
| ------------------------- | ----------------------------- |
| candyMachine              | signer                        |
| authorityPda (optional)   | publicKey                     |
| authority (optional)      | publicKey                     |
| payer (optional)          | signer                        |
| collection                | publicKey                     |
| collectionUpdateAuthority | signer                        |
| itemsAvailable            | number                        |
| isMutable                 | boolean                       |
| configLineSettings        | [link](#config-line-settings) |
| hiddenSettings            | [link](#hidden-settings)      |

{% /dialect %}
{% dialect title="Rust" id="rust" %}

| name                      | type                          |
| ------------------------- | ----------------------------- |
| candyMachine              | signer                        |
| authorityPda (optional)   | pubkey                        |
| authority (optional)      | pubkey                        |
| payer (optional)          | signer                        |
| collection                | pubkey                        |
| collectionUpdateAuthority | signer                        |
| itemsAvailable            | number                        |
| isMutable                 | boolean                       |
| configLineSettings        | [link](#config-line-settings) |
| hiddenSettings            | [link](#hidden-settings)      |

{% /dialect %}
{% /dialect-switcher %}

### authorityPda (optional)

{% dialect-switcher title="Authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
authorityPda: string
```

{% /dialect %}
{% /dialect-switcher %}

The authorityPda field is the PDA used to verify minted Assets to the collection. This is optional an is calculated automatically based on default seeds if left.

### authority (optional)

{% dialect-switcher title="authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
authority: string
```

{% /dialect %}
{% /dialect-switcher %}

### payer (optional)

The wallet that pays for the transaction and rent costs. Defaults to signer.

{% dialect-switcher title="authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
payer: publicKey
```

{% /dialect %}
{% /dialect-switcher %}

The authority field is the wallet/publicKey that will be the authority over the Core Candy Machine.

### Collection

The collection the Core Candy Machine will create Assets into.

{% dialect-switcher title="authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
collection: publicKey
```

{% /dialect %}
{% /dialect-switcher %}

### Collection Update Authority

Update authority of the collection. This needs to be a signer so the Candy Machine can approve a delegate to verify created Assets to the Collection.

{% dialect-switcher title="authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
collectionUpdateAuthority: signer
```

{% /dialect %}
{% /dialect-switcher %}

<!-- ### Seller Fee Basis Points

{% dialect-switcher title="sellerFeeBasisPoints" %}
{% dialect title="JavaScript" id="js" %}

```ts
sellerFeeBasisPoints: number
```

{% /dialect %}
{% /dialect-switcher %}

The `sellerFeeBasisPoints` fields is the royalty basis points that will be written to each created Asset from the Candy Machine.
This is designated as a number based on 2 decimal places, so `500` basis points is eqaul to `5%`.

There is also a `percentageAmount` helper than can also be used for calculation that can be imported from the `umi` library.

{% dialect-switcher title="percentageAmount" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { percentAmount } from '@metaplex-foundation/umi'

sellerFeeBasisPoints: percentageAmount(5)
```

{% /dialect %}
{% /dialect-switcher %} -->

### itemsAvailable

{% dialect-switcher title="percentageAmount" %}
{% dialect title="JavaScript" id="js" %}

```ts
isMutable: number
```

{% /dialect %}
{% /dialect-switcher %}

The number of items being loaded into the Core Candy Machine.

### Is Mutable

{% dialect-switcher title="percentageAmount" %}
{% dialect title="JavaScript" id="js" %}

```ts
isMutable: boolean
```

{% /dialect %}
{% /dialect-switcher %}

A boolean that marks an Asset as mutable or immutable upon creation.

<!-- ### Creators

// Do we even need these anymore? Should this now set the Royalties plugin on the Collection Asset.

An array of creators that is writen to the `Royalties` plugin

{% dialect-switcher title="percentageAmount" %}
{% dialect title="JavaScript" id="js" %}

```ts
creators : {
  address: publicKey,
  share: number
}[]
```

{% /dialect %}
{% /dialect-switcher %}


//Todo: Currently needs fixing in the program and client to remove verified. -->

### Config Line Settings

Config Line Settings is an optional field that allows advanced options of adding your Asset data to the Core Candy Machine making the Core Candy Machine's rent cost significantly cheaper.

By storing the Assets name and URI prefixs into the Core Candy Machine the data required to be stored is significantly reduced as you will not be storing the same name and URI for every single Asset.

For example if all your Assests had the same naming structure of `Example Asset #1` through to `Example Asset #1000` this would normally require you to store the string `Example Asset #` 1000 times, taking up 15,000 bytes.

By storing the prefix of the name in the the Core Candy Machine and letting the Core Candy Machine append the index number created to the string you save these 15,000 bytes in rent cost.

This also applies to the URI prefix.

{% dialect-switcher title="ConfigLineSettings Object" %}
{% dialect title="JavaScript" id="js" %}

```ts
ConfigLineSettings = {
    prefixName: string;
    nameLength: number;
    prefixUri: string;
    uriLength: number;
    isSequential: boolean;
}
```

{% /dialect %}
{% /dialect-switcher %}

#### prefixName

This stores the name prefix of the nfts and appends the minted index to the end of the name upon mint.

If your Asset's have a naming structure of `Example Asset #1` then your prefix would be `Example Asset #`. Upon mint the Core Candy Machine will attatch the index to the end of the string.

#### nameLength

The lengh of your prefixName.

If your Asset's prefix name is `Example Asset #` then the length would be `15`

#### prefixUri

The base URI of your metadata excluding the varible identification id.

If your Asset's will have a metadata URI of `https://example.com/metadata/0.json` then your base metadata URI will be `https://example.com/metadata/`.

#### uriLength

If your prefixUri is `https://example.com/metadata/` this would have a length of `29`

#### isSequential

Indicates whether to use a senquential index generator or not. If false the Candy Machine will mint randomly.

#### configLineSettings

Here is an example of creating a Core Candy Machine with `configLineSettings` applied:

{% dialect-switcher title="Create a Core Candy Machine with configLineSettings" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { create } from '@metaplex-foundation/mpl-core-candy-machine'

const candyMachine = generateSigner(umi)

const coreCollection = publicKey('11111111111111111111111111111111')

const createIx = await create(umi, {
  candyMachine,
  collection: coreCollection,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 5000,
  configLineSettings: some({
    prefixName: 'Example Asset #',
    nameLength: 15,
    prefixUri: 'https://example.com/metadata/',
    uriLength: 29,
    isSequential: false,
  }),
})

await createIx.sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

### Hidden Settings

Hidden settings allows the Core Candy Machine to mint exactly the same Asset to all purchasers. The design princple behind this is to allow the popular 'reveal' mechanic to take to take place at a later date. It also allows printing Core Editions when combined with the Edition Guard.

{% dialect-switcher title="Hidden Settings" %}
{% dialect title="JavaScript" id="js" %}

```ts
hiddenSettings = {
  name: string,
  uri: string,
  hash: Uint8Array,
}
```

{% /dialect %}
{% /dialect-switcher %}

#### name

The name that appears on all Assets minted with hidden settings enabled. Note that, just like for the prefixes of the Config Line Settings, special variables can be used for the Name and URI of the Hidden Settings. As a reminder, these variables are:

- `$ID$`: This will be replaced by the index of the minted Asset starting at 0.
- `$ID+1$`: This will be replaced by the index of the minted Asset starting at 1.

You should use this to be able to match the Assets that you want to your revealed data.

#### uri

The uri that appears on all Assets minted with hidden settings enabled.

#### hash

The purpose behind the hash is to store a crytographic hash/checksum of a piece of data that validates that each updated/revealed nft is the correct one matched to the index minted from the Candy Machine. This allows users to check the validation and if you have altered the data shared and in fact that `Hidden NFT #39` is also `Revealed NFT #39` and that the original data hasn't been tampered with to move rares around to specific people/holders.

{% dialect-switcher title="Hashing Reveal Data" %}
{% dialect title="JavaScript" id="js" %}

```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```

{% /dialect %}
{% /dialect-switcher %}

#### Example Core Candy Machine with Hidden Settings

{% dialect-switcher title="Create a Candy Machine With Hidden Settings" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { create } from '@metaplex-foundation/mpl-core-candy-machine'
import crypto from "crypto";

const candyMachine = generateSigner(umi)

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

const createIx = await create(umi, {
  candyMachine,
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
  sellerFeeBasisPoints: percentAmount(10),
  itemsAvailable: 5000,
  hiddenSettings = {
    name: "Hidden Asset",
    uri: "https://example.com/hidden-asset.json,
    hash,
  }
})

await createIx.sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Creating a Core Candy Machine with guards

To create a `Core Candy Machine` with `Guards` you can supply the `guards:` field during creation and supply the default guards you with to apply to the Candy Machine.s

So far, the Core Candy Machine we created did not have any guards enabled. Now that we know all the guards available to us, let’s see how we can set up new Candy Machines with some guards enabled.

The concrete implementation will depend on which SDK you are using (see below) but the main idea is that you enable guards by providing their required settings. Any guard that has not been set up will be disabled.

{% dialect-switcher title="Create a Core Candy Machine with guards" %}
{% dialect title="JavaScript" id="js" %}

<!-- To enable guards using the Umi library, simply provides the `guards` attribute to the `create` function and pass in the settings of every guard you want to enable. Any guard set to `none()` or not provided will be disabled. -->

```ts
import { some, sol, dateTime } from '@metaplex-foundation/umi'

const createIx = await create(umi, {
  // ...
  guards: {
    botTax: some({ lamports: sol(0.01), lastInstruction: true }),
    solPayment: some({ lamports: sol(1.5), destination: treasury }),
    startDate: some({ date: dateTime('2023-04-04T16:00:00Z') }),
    // All other guards are disabled...
  },
})

await createIx.sendAndConfirm(umi)
```

API References: [create](https://mpl-core-candy-machine-js-docs.vercel.app/functions/create.html), [DefaultGuardSetArgs](https://mpl-core-candy-machine-js-docs.vercel.app/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}
