---
title: Creating a Core Candy Machine 
metaTitle: Creating a Core Candy Machine | Core Candy Machine
description: Learn how to create a Core Candy Machine and it's various settings in both Javascript and Rust.
---

**Note**: Before creating the Candy Machine, ensure that all assets intended for loading are fully prepared and uploaded to a decentralized storage solution. If you're unsure how to proceed, follow to this guide: [Preparing the Candy Machine Assets](/core-candy-machine/guides/preparing-assets)

Additionally, you'll need a Core Collection (new or existing) where all the assets created by the Candy Machine will be included. If you're unfamiliar with creating a Core Collection, follow this guide: [Create a Core Collection](/core/guides/javascript/how-to-create-a-core-collection-with-javascript)

## Creating a Candy Machine

All arguments passed in the `create` function define the behavior, ownership, and configuration of the Candy Machine. 

Below is a detailed breakdown of each argument, including required and optional parameters:

| Name                          | Type                          | Description                                                                                      |
|------------------------------|-------------------------------|--------------------------------------------------------------------------------------------------|
| `candyMachine`               | `signer`                     | A newly generated keypair/signer used to create the Core Candy Machine.                         |
| `authorityPda`   (optional)  | `publicKey`                  | PDA used to verify minted assets to the collection. Auto-calculated if left undefined.          |
| `authority`      (optional)  | `publicKey`                  | The wallet/public key that will be the authority over the Core Candy Machine.                   |
| `payer`          (optional)  | `signer`                     | Wallet that pays for the transaction and rent costs. Defaults to the signer.                    |
| `collection`                 | `publicKey`                  | The collection into which the Core Candy Machine will create assets.                            |
| `collectionUpdateAuthority`  | `signer`                     | Signer required to approve a delegate verifying created assets in the collection.               |
| `itemsAvailable`             | `number`                    | Number of items being loaded into the Core Candy Machine.                                        |
| `isMutable`                  | `boolean`                   | Boolean indicating whether the assets are mutable upon creation.                                 |
| `configLineSettings`(optional)| [Link](#with-config-line-settings) | Configuration settings for asset lines.                                                         |
| `hiddenSettings` (optional)  | [Link](#with-hidden-settings)     | Optional settings for hiding asset information.                                                 |
| `guards`         (optional)  | [Link](#with-guards)         | Optional settings for adding [Candy Guards](#candy-guards).                                      |

When creating a Candy Machine, there are different configurations that can modify its behavior. The most important ones include:  
- [ConfigLineSettings](#with-config-line-settings): Reduces the space required for the Candy Machine by not storing identical name and URI prefixes linked to all the assets.
- [HiddenSettings](#with-hidden-settings): Allows minting the same asset to all purchasers while storing a hash of data that validates each updated/revealed NFT correctly.
- [Guards](#with-guards): Adds specific Candy Guards to the Candy Machine.  

If no additional behavior or configuration is required, the code to create a Candy Machine will look like this:  

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

### with Config Line Settings

Config Line Settings is an optional feature that helps reduce the Core Candy Machine's rent cost by minimizing stored asset data.

This is done by storing common prefix for Assets and URI once, and allowing then the Core Candy Machine to append unique indexes automatically.

For example if your assets are named `Example Asset #1` through `Example Asset #1000`, storing the prefix Example Asset # once and appending numbers from 1 to 1000 saves storing the same prefix 1000 times, reducing storage by 15,000 bytes.

The same approach applies to the URI prefix, further lowering rent costs.

To use it, we'll need to create a specific struct. Below is a detailed breakdown of each argument present in the `ConfigLineSettings` Struct:

| Field            | Type       | Description                                                                                  |
|------------------|------------|----------------------------------------------------------------------------------------------|
| `prefixName`     | `string`   | Stores the name prefix of the NFTs. The minted index is appended to create unique names.     |
| `nameLength`     | `number`   | Maximum length of the NFT name excluding the prefix.                                         |
| `prefixUri`      | `string`   | Base URI of the metadata, excluding the unique identifier.                                   |
| `uriLength`      | `number`   | Maximum length of the URI excluding the base `prefixUri`.                                    |
| `isSequential`   | `boolean`  | Indicates whether to use sequential or random minting.                                       |

Here is an example of creating a Core Candy Machine with `configLineSettings` applied:

{% dialect-switcher title="Create a Core Candy Machine with configLineSettings" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { create } from '@metaplex-foundation/mpl-core-candy-machine'

const candyMachine = generateSigner(umi)

const coreCollection = publicKey('11111111111111111111111111111111')

const createIx = await create(umi, {
  // ...
  configLineSettings: some({
    prefixName: 'Example Asset #',
    nameLength: 4,
    prefixUri: 'https://example.com/metadata/',
    uriLength: 9,
    isSequential: false,
  }),
})

await createIx.sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

### with Hidden Settings

Hidden Settings is an optional feature that mints the same asset to all buyers, allowing creators to `reveal` the actual assets at a later time.

**Note**: This feature also supports printing Core Editions when used with the Edition Guard.

To ensure the revealed NFT data hasn’t been manipulated (such as moving rare assets to specific holders), creators must submit and save a hash that links each asset's URI with its corresponding number during the creation of the Candy Machine.

This can be done with the following code: 

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

To use it, we'll need to create a specific struct. Below is a detailed breakdown of each argument present in the `HiddenSettings` Struct:

| Field       | Type          | Description                                                                                     |
|-------------|---------------|-------------------------------------------------------------------------------------------------|
| `name`      | `string`      | The name applied to all minted assets. Supports special variables like `$ID$` and `$ID+1$`.     |
| `uri`       | `string`      | The URI applied to all minted assets.                                                           |
| `hash`      | `Uint8Array`  | Cryptographic hash used to verify that the revealed NFTs match the originally minted data.      |

Here is an example of creating a Core Candy Machine with `hiddenSettings` applied:

{% dialect-switcher title="Create a Core Candy Machine with hiddenSettings" %}
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
  // ...
  hiddenSettings: {
    name: "Hidden Asset",
    uri: "https://example.com/hidden-asset.json",
    hash,
  }
})

await createIx.sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

### with Guards

Candy Guards is an optional feature that adds extra functionalities to a Core Candy Machine.

To enable guards, pass the `some()` attribute along with the required data for each specific guard. Any guard set to `none()` or not provided will be disabled by default.

If you want to learn more about what Candy Guards are available, refer to this: [Candy Guards Overview]()

Here's a list of all the Candy Guards available and the individual attributes:  

{% totem %}

{% totem-accordion title="Candy Guards Attributes" %}

| Guard Name                 | Arguments                                                                |
|----------------------------|--------------------------------------------------------------------------|
| **addressGate**            | { `address`: PublicKey }                                                 |
| **allocation**             | { `id`: number, `limit`: number }                                        |
| **allowList**              | { `merkleRoot`: Uint8Array }                                             |
| **assetBurn**              | { `requiredCollection`: PublicKey }                                      |
| **assetBurnMulti**         | { `num`: number, `requiredCollection`: PublicKey }                       |
| **assetGate**              | { `requiredCollection`: PublicKey }                                      |
| **assetMintLimit**         | { `id`: number, `limit`: number, `requiredCollection`: PublicKey }       |
| **assetPayment**           | { `destination`: PublicKey, `requiredCollection`: PublicKey }            |
| **assetPaymentMulti**      | { `destination`: PublicKey, `num`: number, `requiredCollection`: PublicKey } |
| **botTax**                 | { `lamports`: SolAmount, `lastInstruction`: boolean }                    |
| **edition**                | { `editionStartOffset`: number }                                         |
| **endDate**                | { `date`: DateTimeInput }                                                |
| **freezeSolPayment**       | { `destination`: PublicKey, `lamports`: SolAmount }                      |
| **freezeTokenPayment**     | { `amount`: number | bigint, `mint`: PublicKey, `destination`: PublicKey } |
| **gatekeeper**             | { `expireOnUse`: boolean, `gatekeeperNetwork`: PublicKey }               |
| **mintLimit**              | { `id`: number, `limit`: number }                                        |
| **nftBurn**                | { `requiredCollection`: PublicKey }                                      |
| **nftGate**                | { `requiredCollection`: PublicKey }                                      |
| **nftMintLimit**           | { `id`: number, `limit`: number, `requiredCollection`: PublicKey }       |
| **nftPayment**             | { `destination`: PublicKey, `requiredCollection`: PublicKey }            |
| **programGate**            | { `additional`: PublicKey[] }                                            |
| **redeemedAmount**         | { `maximum`: number | bigint }                                           |
| **solFixedFee**            | { `destination`: PublicKey, `lamports`: SolAmount }                      |
| **solPayment**             | { `lamports`: SolAmount, `destination`: PublicKey }                      |
| **startDate**              | { `date`: DateTimeInput }                                                |
| **thirdPartySigner**       | { `signerKey`: PublicKey }                                               |
| **token2022Payment**       | { `amount`: number | bigint, `destinationAta`: PublicKey, `mint`: PublicKey } |
| **tokenBurn**              | { `amount`: number | bigint, `mint`: PublicKey }                         |
| **tokenGate**              | { `amount`: number | bigint, `mint`: PublicKey }                         |
| **tokenPayment**           | { `amount`: number | bigint, `destinationAta`: PublicKey, `mint`: PublicKey } |
| **vanityMint**             | { `regex`: string }                                                      |


{% /totem-accordion %}

{% /totem %}

Here is an example of creating a Core Candy Machine with `guards` applied:

{% dialect-switcher title="Create a Core Candy Machine with guards" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { some, sol, dateTime } from '@metaplex-foundation/umi'

const createIx = await create(umi, {
  // ...
  guards: {
    botTax: some({ lamports: sol(0.01), lastInstruction: true }),
    solPayment: some({ lamports: sol(1.5), destination: treasury }),
    startDate: some({ date: dateTime('2023-04-04T16:00:00Z') }),
    // ...
  },
})

await createIx.sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}
