---
title: Managing Collections
metaTitle: Core - Verified Collections
description: Learn how to safely manage Collections of Assets on Core
---

## What are Collections?

Collections are a group of Assets that belong together, part of the same series, or group. In order to group Assets together, we must first create a Collection Asset whose purpose is to store any metadata related to that collection such as collection name and collection image. The Collection Asset acts as a front cover to your collection and can also store collection wide plugins.

The data that is stored and accessible from the Collection Asset is as follows;

| Accounts        | Description                                       |
| --------------- | ------------------------------------------------- |
| key             | THe account key discriminator                     |
| updateAuthority | The authority of the new asset.                   |
| name            | The collection name.                              |
| uri             | THe uri to the collections off-chain metadata.    |
| num minted      | The number of assets minted in the collection.    |
| current size    | The number of assets currently in the collection. |

## Creating a Collection

To create a Core Collection you can use the `CreateCollection` instruction like this:

{% totem %}
{% totem-accordion title="Technical Instruction Details - CreateCollectionV1" %}

**Instruction Accounts List**

| Accounts        | Description                                        |
| --------------- | -------------------------------------------------- |
| collection      | The collection to which the Core Asset belongs to. |
| updateAuthority | The authority of the new asset.                    |
| payer           | The account paying for the storage fees.           |
| systemProgram   | The System Program account.                        |

**Instruction Arguments**

| Arg     | Description                                        |
| ------- | -------------------------------------------------- |
| name    | The collection to which the Core Asset belongs to. |
| uri     | The authority of the new asset.                    |
| plugins | The account paying for the storage fees.           |

Some of the accounts and arguments may be abstracted out and/or optional in our SDKs for ease of use.
A full detailed look at the on chain instruction it can be viewed on [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L30).

{% /totem-accordion %}
{% /totem %}

### Creating a Simple Collection

The following snippet creates a simple collection without Plugins or anything special.

{% dialect-switcher title="Create a MPL Core Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createCollectionV1 } from '@metaplex-foundation/mpl-core'

const collectionSigner = generateSigner(umi)

await createCollectionV1(umi, {
  collection: collectionSigner,
  name: 'My Collection',
  uri: 'https://example.com/my-collection.json',
})
```

{% /dialect %}
{% /dialect-switcher %}

### Creating a Collection with Plugins

The following snippet creates a collection with the [Royalties Plugin](/core/plugins/royalties) attached. You can attach additional plugins as described [here](/core/plugins).

{% dialect-switcher title="Create a MPL Core Collection with Plugin" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import {
  createCollectionV1,
  pluginAuthorityPair,
  ruleSet,
} from '@metaplex-foundation/core'

const collectionSigner = generateSigner(umi)

const creator1 = publicKey('11111111111111111111111111111111')
const creator2 = publicKey('22222222222222222222222222222222')

await createCollectionV1(umi, {
  collection: collectionSigner,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  plugins: [
    pluginAuthorityPair({
      type: 'Royalties',
      data: {
        basisPoints: 500,
        creators: [
          {
            address: creator1,
            percentage: 20,
          },
          {
            address: creator2,
            percentage: 80,
          },
        ],
        ruleSet: ruleSet('None'), // Compatibility rule set
      },
    }),
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Updating a Collection

To update the data of a Core Collection you can use the `UpdateCollection` instruction. You want to use this for example when you need to change the name of a collection.

{% totem %}
{% totem-accordion title="Technical Instruction Details - UpdateCollectionV1" %}

**Instruction Accounts List**

| Accounts           | Description                                        |
| ------------------ | -------------------------------------------------- |
| collection         | The collection to which the Core Asset belongs to. |
| payer              | The account paying for the storage fees.           |
| authority          | The authority of the new asset.                    |
| newUpdateAuthority | The new update authority of the collection.        |
| systemProgram      | The System Program account.                        |
| logWrapper         | The SPL Noop Program.                              |

**Instruction Arguments**

| Args | Description                      |
| ---- | -------------------------------- |
| name | The name of your MPL Core Asset. |
| uri  | The off chain json metadata uri. |

Some of the accounts and arguments may be abstracted out and/or optional in our sdks for ease of use.
A full detailed look at the on chain instruction it can be viewed on [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L167C4-L167C23).

{% /totem-accordion %}
{% /totem %}

{% seperator h="6" /%}

{% dialect-switcher title="Updating a Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updateCollectionV1 } from '@metaplex-foundation/mpl-core'

const collectionAddress = publicKey('1111111111111111111111111111111')

await updateCollectionV1(umi, {
  collection: collectionAddress,
  newName: 'my-nft',
  newUri: 'https://exmaple.com/new-uri',
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Updating a Collection Plugin

If you want to change the behaviour of a plugin that is attached to a collection you may want to use the `updateCollectionPlugin` instruction.

{% totem %}
{% totem-accordion title="Technical Instruction Details - UpdateCollectionPluginV1" %}

**Instruction Accounts List**

| Accounts      | Description                                        |
| ------------- | -------------------------------------------------- |
| collection    | The collection to which the Core Asset belongs to. |
| payer         | The account paying for the storage fees.           |
| authority     | The authority of the new asset.                    |
| systemProgram | The System Program account.                        |
| logWrapper    | The SPL Noop Program.                              |

**Instruction Arguments**

| Args   | Description                    |
| ------ | ------------------------------ |
| plugin | The plugin you wish to update. |

Some of the accounts may be abstracted out and/or optional in our sdks for ease of use.
A full detailed look at the on chain instruction it can be viewed on [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L81).

{% /totem-accordion %}
{% /totem %}

{% seperator h="6" /%}

{% dialect-switcher title="Updating a Collection Plugin" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  updateCollectionPluginV1,
  createPlugin,
  ruleSet,
} from '@metaplex-foundation/mpl-core'

const collectionAddress = publicKey('1111111111111111111111111111111')

const newCreator = publicKey('5555555555555555555555555555555')

await updateCollectionPluginV1(umi, {
  collection: collectionAddress,
  plugin: createPlugin({
    type: 'Royalties',
    data: {
      basisPoints: 400,
      creators: [{ address: newCreator, percentage: 100 }],
      ruleSet: ruleSet('None'),
    },
  }),
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}
