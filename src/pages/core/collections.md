---
title: Managing Collections
metaTitle: Core - Verified Collections
description: Learn how to safely manage Collections of Assets on Core
---

## What are Collections?

Collections are a group of Assets that belong together, part of the same series, or group. In order to group Assets together, we must first create a Collection Asset whose purpose is to store any metadata related to that collection such as collection name and collection image. The Collection Asset acts as a front cover to your collection and can also store collection wide plugins. 

## Creating a Collection

### Instruction Accounts Lists

| Accounts        | Description                                        |
| --------------- | -------------------------------------------------- |
| collection      | The collection to which the Core Asset belongs to. |
| updateAuthority | The authority of the new asset.                    |
| payer           | The account paying for the storage fees.           |
| systemProgram   | The System Program account.                        |

### Instruction Args

| Arg           | Description                                        |
| ------------- | -------------------------------------------------- |
| name          | The collection to which the Core Asset belongs to. |
| uri           | The authority of the new asset.                    |
| plugins       | The account paying for the storage fees.           |
| systemProgram | The System Program account.                        |

Some of the accounts/args may be abstracted out and/or optional in our sdks for ease of use.
A full detailed look at the on chain instruction it can be viewed here. [Github](https://github.com)

### Creating a Collection

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


{% dialect-switcher title="Create a MPL Core Collection w/ Plugin" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createCollection, pluginAuthorityPair } from '@metaplex-foundation/core'

const collectionAddress = generateSigner(umi)
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

### Instruction Accounts Lists

| Accounts           | Description                                        |
| ------------------ | -------------------------------------------------- |
| collection         | The collection to which the Core Asset belongs to. |
| authority          | The authority of the new asset.                    |
| payer              | The account paying for the storage fees.           |
| newUpdateAuthority | The new update authority of the collection.        |
| systemProgram      | The System Program account.                        |
| logWrapper         | The SPL Noop Program.                              |

### Instruction Args

| Args | Description                      |
| ---- | -------------------------------- |
| name | The name of your MPL Core Asset. |
| uri  | The off chain json metadata uri. |

Some of the accounts may be abstracted out and/or optional in our sdks for ease of use.
A full detailed look at the on chain instruction it can be viewed here. [Github](https://github.com)

### Updating a Collection

{% dialect-switcher title="Updating a Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { updateCollection } from '@metaplex-foundation/core'

const collectionAddress = generateSigner(umi)
await updateCollection(umi, {
  collection: collectionAddress,
  name: 'new name',
  uri: 'https://example.com/new-uri',
})
```

{% /dialect %}
{% /dialect-switcher %}

## Updating a Collection Plugin

### Instruction Accounts Lists

| Accounts      | Description                                        |
| ------------- | -------------------------------------------------- |
| collection    | The collection to which the Core Asset belongs to. |
| authority     | The authority of the new asset.                    |
| payer         | The account paying for the storage fees.           |
| systemProgram | The System Program account.                        |
| logWrapper    | The SPL Noop Program.                              |

### Instruction Args

| Args   | Description                    |
| ------ | ------------------------------ |
| plugin | The plugin you wish to update. |

Some of the accounts may be abstracted out and/or optional in our sdks for ease of use.
A full detailed look at the on chain instruction it can be viewed here. [Github](https://github.com)

### Updating a Collection Plugin

{% dialect-switcher title="Updating a Collection Plugin" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createCollection, pluginAuthorityPair } from '@metaplex-foundation/core'

const collectionAddress = generateSigner(umi)
await updateCollection(umi, {
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
