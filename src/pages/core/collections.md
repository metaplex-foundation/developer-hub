---
title: Managing Collections
metaTitle: Core - Verified Collections
description: Learn how to safely manage Collections of Assets on Core
---

## What are Collections?

Collections are a group of Assets that belong together, part of the same series, or group. In order to group Assets together, we must first create a Collection Asset whose purpose is to store any metadata related to that collection such as collection name and collection image. The Collection Asset acts as a front cover to your collection and can also store collection wide plugins.

## Creating a Collection

To create a Core Collection you can use the `CreateCollection` instruction like this:

{% totem %}
{% totem-accordion title="Technical Instruction Details" %}

**Instruction Accounts List**
| Accounts | Description |
| --------------- | -------------------------------------------------- |
| collection | The collection to which the Core Asset belongs to. |
| updateAuthority | The authority of the new asset. |
| payer | The account paying for the storage fees. |
| systemProgram | The System Program account. |

**Instruction Arguments**
| Arg | Description |
| ------------- | -------------------------------------------------- |
| name | The collection to which the Core Asset belongs to. |
| uri | The authority of the new asset. |
| plugins | The account paying for the storage fees. |
| systemProgram | The System Program account. |

Some of the accounts and arguments may be abstracted out and/or optional in our SDKs for ease of use.
A full detailed look at the on chain instruction it can be viewed on [Github](https://github.com/metaplex-foundation/mpl-core/blob/main/programs/mpl-core/src/processor/create_collection.rs).

{% /totem-accordion %}
{% /totem %}

### Creating a simple Collection

The following snippet creates a simple collection without Plugins or anything special.

{% dialect-switcher title="Create a MPL Core Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createCollection } from '@metaplex-foundation/core'

const collectionAddress = generateSigner(umi)
await createCollection(umi, {
  collection: collectionAddress,
})
```

{% /dialect %}
{% /dialect-switcher %}

### Creating a Collection with Plugins

The following snippet creates a collection with the [freeze Plugin](/core/plugins/freeze) attached. You can attach additional plugins as described [here](/core/plugins/overview).

{% dialect-switcher title="Create a MPL Core Collection with Plugin" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import {
  createCollection,
  pluginAuthorityPair,
} from '@metaplex-foundation/core'

const collectionAddress = publicKey('11111111111111111111111111111111') // Replace this with your collection address!
await createCollection(umi, {
  collection: collectionAddress,
  plugins: [
    pluginAuthorityPair({
      type: 'Freeze',
      data: { frozen: false },
    }),
  ],
})
```

{% /dialect %}
{% /dialect-switcher %}

## Updating a Collection

To update the data of a Core Collection you can use the `UpdateCollection` instruction. You want to use this for example when you need to change the name of a collection.

{% totem %}
{% totem-accordion title="Technical Instruction Details" %}

**Instruction Accounts List**

| Accounts           | Description                                        |
| ------------------ | -------------------------------------------------- |
| collection         | The collection to which the Core Asset belongs to. |
| authority          | The authority of the new asset.                    |
| payer              | The account paying for the storage fees.           |
| newUpdateAuthority | The new update authority of the collection.        |
| systemProgram      | The System Program account.                        |
| logWrapper         | The SPL Noop Program.                              |

**Instruction Arguments**

| Args | Description                      |
| ---- | -------------------------------- |
| name | The name of your MPL Core Asset. |
| uri  | The off chain json metadata uri. |

Some of the accounts and arguments may be abstracted out and/or optional in our sdks for ease of use.
A full detailed look at the on chain instruction it can be viewed on [Github](https://github.com/metaplex-foundation/mpl-core/blob/1d3da907635a4f3950a43a3cb7239d91024579cc/programs/mpl-core/src/processor/update.rs#L92).

{% /totem-accordion %}
{% /totem %}

### Code Example

{% dialect-switcher title="Updating a Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  createCollection,
  pluginAuthorityPair,
} from '@metaplex-foundation/core'

const collectionAddress = publicKey('11111111111111111111111111111111') // Replace this with your collection address!
await updateCollection(umi, {
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
{% totem-accordion title="Technical Instruction Details" %}
**Instruction Accounts List**

| Accounts      | Description                                        |
| ------------- | -------------------------------------------------- |
| collection    | The collection to which the Core Asset belongs to. |
| authority     | The authority of the new asset.                    |
| payer         | The account paying for the storage fees.           |
| systemProgram | The System Program account.                        |
| logWrapper    | The SPL Noop Program.                              |

**Instruction Arguments**

| Args   | Description                    |
| ------ | ------------------------------ |
| plugin | The plugin you wish to update. |

Some of the accounts may be abstracted out and/or optional in our sdks for ease of use.
A full detailed look at the on chain instruction it can be viewed on [Github](https://github.com/metaplex-foundation/mpl-core/blob/1d3da907635a4f3950a43a3cb7239d91024579cc/programs/mpl-core/src/processor/add_plugin.rs#L80).

{% /totem-accordion %}
{% /totem %}

### Code Example

{% dialect-switcher title="Updating a Collection Plugin" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { createCollection, pluginAuthorityPair } from '@metaplex-foundation/core'

const collectionAddress = publicKey("11111111111111111111111111111111") // Replace this with your collection address! 
  await updateCollectionPlugin(umi, {
    collection: collectionAddress,
    plugin: plugin('PermanentFreeze', [{ frozen: false }]),
  }).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}