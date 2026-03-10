---
title: Creating a Core Candy Machine
metaTitle: Creating a Core Candy Machine | Core Candy Machine
description: Step-by-step tutorial for creating a Core Candy Machine on Solana with configurable settings including Config Line Settings, Hidden Settings, and guards using the mpl-core-candy-machine SDK.
keywords:
  - core candy machine
  - create candy machine
  - mpl-core-candy-machine
  - candy machine settings
  - config line settings
  - hidden settings
  - candy machine guards
  - solana NFT minting
  - metaplex core
  - NFT collection launch
  - candy machine reveal
  - solana NFT distribution
about:
  - Creating and configuring a Core Candy Machine for NFT distribution
  - Core Candy Machine item settings including Config Line and Hidden Settings
  - Applying guards to a Core Candy Machine during creation
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
howToSteps:
  - Prepare assets and a Core Collection for the Candy Machine
  - Call the create instruction with the Candy Machine signer, collection, and itemsAvailable
  - Optionally configure Config Line Settings or Hidden Settings for asset data storage
  - Optionally attach guards to control minting access and payment
howToTools:
  - '@metaplex-foundation/mpl-core-candy-machine'
  - '@metaplex-foundation/umi'
faqs:
  - q: What is the difference between Config Line Settings and Hidden Settings?
    a: Config Line Settings store individual asset names and URIs on-chain with prefix compression to reduce rent costs. Hidden Settings mint identical placeholder assets to all buyers, enabling a reveal mechanic at a later date. Only one can be used per Candy Machine — they are mutually exclusive.
  - q: How much does it cost to create a Core Candy Machine?
    a: The rent cost depends on the number of items and the storage mode. Using Config Line Settings with prefixes significantly reduces rent because repeated name and URI prefixes are stored once. Hidden Settings are the cheapest because only a single name, URI, and hash are stored regardless of collection size.
  - q: Can I add guards after creating a Core Candy Machine?
    a: Yes. You can create a Candy Guard account and set it as the mint authority of an existing Core Candy Machine at any time. Guards can also be passed directly during creation for convenience.
  - q: Do I need an existing Core Collection before creating a Candy Machine?
    a: Yes. The Core Candy Machine requires a Core Collection address at creation time. The collection update authority must sign the transaction so the Candy Machine can be approved as a delegate to verify minted assets into the collection.
  - q: What happens if I set isSequential to false in Config Line Settings?
    a: The Candy Machine mints assets in a pseudo-random order rather than sequentially. Note that this randomness is not cryptographically secure and can be influenced with sufficient resources, so Hidden Settings may be preferable when unpredictability is critical.
---

## Summary

The `create` instruction initializes a new [Core](/smart-contracts/core) Candy Machine account on Solana, linking it to a Core Collection and defining how assets are stored and distributed. {% .lead %}

- **Core instruction**: `create` from `@metaplex-foundation/mpl-core-candy-machine` deploys a new Candy Machine account
- **Storage modes**: Choose [Config Line Settings](#config-line-settings-field) for prefix-compressed individual asset data or [Hidden Settings](#hidden-settings-field) for a single-reveal placeholder
- **Guard support**: Attach [guards](/smart-contracts/core-candy-machine/guards) at creation time to control minting access, payments, and scheduling
- **Prerequisite**: A [Core Collection](/smart-contracts/core/collections#creating-a-collection) must exist before the Candy Machine can be created

**Jump to:** [Prerequisites](#prerequisites) · [Creating a Candy Machine](#creating-a-core-candy-machine) · [Create Candy Machine Arguments](#create-candy-machine-arguments) · [Config Line Settings](#config-line-settings-field) · [Hidden Settings](#hidden-settings-field) · [Creating with Guards](#creating-a-core-candy-machine-with-guards) · [Notes](#notes) · [FAQ](#faq)


## Prerequisites

- [Prepared Assets](/smart-contracts/core-candy-machine/preparing-assets)
- [Create Core Collection](/smart-contracts/core/collections#creating-a-collection)

If you wish to create your Core Candy Machine Assets into a collection (new or existing) you will need to supply the Core Collection upon creation of the Core Candy Machine.

## Creating a Core Candy Machine

The `create` function deploys a new Core Candy Machine account, assigns it to a [Core](/smart-contracts/core) Collection, and sets the total number of items available for minting.

{% callout title="CLI Alternative" type="note" %}
You can also create Core Candy Machines using the MPLX CLI with an interactive wizard:
```bash
mplx cm create --wizard
```
This provides step-by-step guidance, asset validation, and automatic deployment. See the [CLI Candy Machine documentation](/dev-tools/cli/cm) for detailed instructions.
{% /callout %}

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

### Create Candy Machine Arguments

The `create` function accepts the following arguments to configure the Core Candy Machine at deployment time.

A newly generated keypair/signer that is used to create the Core Candy Machine.

{% dialect-switcher title="Create CandyMachine Args" %}
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
| configLineSettings        | [link](#config-line-settings-field) |
| hiddenSettings            | [link](#hidden-settings-field)      |

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
| configLineSettings        | [link](#config-line-settings-field) |
| hiddenSettings            | [link](#hidden-settings-field)      |

{% /dialect %}
{% /dialect-switcher %}

### authorityPda Field

The `authorityPda` is the PDA used to verify minted assets against the collection. This field is optional and is calculated automatically from default seeds when omitted.

{% dialect-switcher title="Authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
authorityPda: string
```

{% /dialect %}
{% /dialect-switcher %}

### authority Field

The `authority` is the wallet or public key that will have administrative control over the Core Candy Machine, including the ability to update settings and manage [guards](/smart-contracts/core-candy-machine/guards).

{% dialect-switcher title="authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
authority: string
```

{% /dialect %}
{% /dialect-switcher %}

### payer Field

The `payer` is the wallet that pays for the transaction and rent costs. This field defaults to the current signer when omitted.

{% dialect-switcher title="authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
payer: publicKey
```

{% /dialect %}
{% /dialect-switcher %}

### collection Field

The `collection` is the public key of the [Core Collection](/smart-contracts/core/collections#creating-a-collection) that the Candy Machine will mint assets into.

{% dialect-switcher title="authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
collection: publicKey
```

{% /dialect %}
{% /dialect-switcher %}

### collectionUpdateAuthority Field

The `collectionUpdateAuthority` is the update authority of the collection. This must be a signer so the Candy Machine can approve a delegate to verify created Assets to the Collection.

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
This is designated as a number based on 2 decimal places, so `500` basis points is equal to `5%`.

There is also a `percentageAmount` helper than can also be used for calculation that can be imported from the `umi` library.

{% dialect-switcher title="percentageAmount" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { percentAmount } from '@metaplex-foundation/umi'

sellerFeeBasisPoints: percentageAmount(5)
```

{% /dialect %}
{% /dialect-switcher %} -->

### itemsAvailable Field

The `itemsAvailable` field specifies the total number of assets that can be minted from the Core Candy Machine. This value is set at creation and determines the size of the Candy Machine account.

{% dialect-switcher title="itemsAvailable" %}
{% dialect title="JavaScript" id="js" %}

```ts
itemsAvailable: number
```

{% /dialect %}
{% /dialect-switcher %}

### isMutable Field

The `isMutable` field is a boolean that determines whether minted assets can be updated after creation. When set to `false`, asset metadata is permanently locked at mint time.

{% dialect-switcher title="isMutable" %}
{% dialect title="JavaScript" id="js" %}

```ts
isMutable: boolean
```

{% /dialect %}
{% /dialect-switcher %}

### Config Line Settings Field

Config Line Settings stores individual asset names and URIs on-chain using prefix compression, significantly reducing the Candy Machine's rent cost compared to storing full strings for every asset.

{% callout type="note" title="Randomness" %}

Config Line Settings and [Hidden Settings](#hidden-settings-field) are mutually exclusive. Only one can be used at a time.

It can be advisable to utilize Hidden Settings for the reveal mechanic, as the "random" minting process of the assets is not entirely unpredictable and can be influenced by sufficient resources and malicious intent.

{% /callout %}

By storing the Assets name and URI prefix into the Core Candy Machine the data required to be stored is significantly reduced as you will not be storing the same name and URI for every single Asset.

For example if all your Assets had the same naming structure of `Example Asset #1` through to `Example Asset #1000` this would normally require you to store the string `Example Asset #` 1000 times, taking up 15,000 bytes.

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

#### prefixName Field

The `prefixName` stores the name prefix of the assets and appends the minted index to the end of the name upon mint.

If your Asset's have a naming structure of `Example Asset #1` then your prefix would be `Example Asset #`. Upon mint the Core Candy Machine will attach the index to the end of the string.

#### nameLength Field

The `nameLength` is the maximum length for the name of each inserted item excluding the name prefix.

For Example given...
- a candy machine containing `1000` items.
- The name of each item is `Example Asset #X` where X is the item's index starting from 1.

... would result in 19 characters that would need to be stored. 15 characters for "My NFT Project #" and 4 characters for the highest number which is "1000". When using the `prefixName` the `nameLength` instead can be reduced to 4.

#### prefixUri Field

The `prefixUri` is the base URI of your metadata excluding the variable identification id.

If your Asset's will have a metadata URI of `https://example.com/metadata/0.json` then your base metadata URI will be `https://example.com/metadata/`.

#### uriLength Field

The `uriLength` is the maximum length of your URIs excluding the `prefixUri`.

For Example given...
- a base URI `https://arweave.net/` with 20 characters.
- and a unique unifier with a maximum length of 43 characters

... without prefix would result in 63 required characters to store. When using the `prefixUri` the `uriLength` can be reduced by 20 characters for `https://arweave.net/` to the 43 characters for the unique identifier.

#### isSequential Field

The `isSequential` field indicates whether assets are minted in sequential order or pseudo-randomly. When set to `false`, the Candy Machine mints in a pseudo-random order. [Hidden Settings](#hidden-settings-field) always mint sequentially regardless of this field.

#### Config Line Settings Example

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

### Hidden Settings Field

Hidden Settings configures the Core Candy Machine to mint identical placeholder assets to all buyers, enabling the popular "reveal" mechanic where final metadata is assigned at a later date. It also supports printing [Core](/smart-contracts/core) Editions when combined with the Edition Guard.

{% callout type="note" %}
[Config Line Settings](#config-line-settings-field) and Hidden Settings are mutually exclusive. You must choose one or the other when creating a Candy Machine.
{% /callout %}

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

#### Hidden Settings name Field

The `name` is the name that appears on all assets minted with Hidden Settings enabled. Note that, just like for the prefixes of the Config Line Settings, special variables can be used for the Name and URI of the Hidden Settings. As a reminder, these variables are:

- `$ID$`: This will be replaced by the index of the minted Asset starting at 0.
- `$ID+1$`: This will be replaced by the index of the minted Asset starting at 1.

You should use this to be able to match the Assets that you want to your revealed data.

#### Hidden Settings uri Field

The `uri` is the metadata URI that appears on all assets minted with Hidden Settings enabled. This typically points to a shared placeholder JSON file.

#### Hidden Settings hash Field

The `hash` stores a cryptographic hash/checksum of the reveal data, allowing anyone to verify that the final revealed metadata matches the originally committed order. This prevents tampering such as rearranging rare assets to specific holders after minting.

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

#### Hidden Settings Creation Example

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

## Creating a Core Candy Machine with Guards

The `create` function accepts a `guards` field that attaches [guard](/smart-contracts/core-candy-machine/guards) rules directly at creation time, controlling who can mint, when, and at what cost.

So far, the Core Candy Machine we created did not have any guards enabled. Now that we know all the guards available to us, let's see how we can set up new Candy Machines with some guards enabled.

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

API References: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [DefaultGuardSetArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## Notes

- **Config Line Settings and Hidden Settings are mutually exclusive.** You must choose one or the other. Passing both to the `create` instruction will result in an error.
- **Rent costs scale with item count and storage mode.** Config Line Settings with short prefixes are cheaper than storing full names and URIs. Hidden Settings are the cheapest option because only a single name, URI, and hash are stored.
- **The collection update authority must be a signer.** The Candy Machine needs the collection update authority to sign the creation transaction so it can be approved as a verified delegate on the collection.
- **Pseudo-random minting order is not cryptographically secure.** When `isSequential` is set to `false` in Config Line Settings, the minting order is shuffled but can be predicted or influenced with sufficient resources. Use Hidden Settings with a reveal mechanic when unpredictability is important.
- **This page covers Core Candy Machine, not legacy Candy Machine V3.** Core Candy Machine mints [Core](/smart-contracts/core) assets. For minting Metaplex Token Metadata NFTs, see [Candy Machine V3](/smart-contracts/candy-machine) instead.

## FAQ

### What is the difference between Config Line Settings and Hidden Settings?

[Config Line Settings](#config-line-settings-field) store individual asset names and URIs on-chain using prefix compression to reduce rent. [Hidden Settings](#hidden-settings-field) mint identical placeholder assets to all buyers, enabling a reveal mechanic at a later date. Only one can be used per Candy Machine because they are mutually exclusive.

### How much does it cost to create a Core Candy Machine?

The rent cost depends on the number of items and the storage mode chosen. Config Line Settings with short prefixes reduce rent significantly because repeated prefixes are stored only once. Hidden Settings are the cheapest because only a single name, URI, and SHA-256 hash are stored regardless of how many items the Candy Machine holds.

### Can I add guards after creating a Core Candy Machine?

Yes. You can create a separate Candy Guard account and set it as the mint authority of an existing Core Candy Machine at any time. Alternatively, you can pass [guards](/smart-contracts/core-candy-machine/guards) directly in the `create` instruction for convenience.

### Do I need an existing Core Collection before creating a Candy Machine?

Yes. The `create` instruction requires a [Core Collection](/smart-contracts/core/collections#creating-a-collection) address. The collection update authority must sign the transaction so the Candy Machine can register as a verified delegate that adds minted assets to the collection.

### What happens if isSequential is set to false in Config Line Settings?

The Candy Machine mints assets in a pseudo-random order rather than in index order. This randomness is not cryptographically secure and can be influenced with sufficient resources. When unpredictability is critical, prefer [Hidden Settings](#hidden-settings-field) with a reveal mechanic instead.
