---
title: Managing Collections
metaTitle: Core - Verified Collections
description: Learn how to safely manage Collections of Assets on Core
---

Certified Collections enables NFTs – and tokens in general — **to be grouped together** and for that information to be **verified on-chain**. Additionally, it makes it easier to manage these collections by allocating data for them on-chain. {% .lead %}

This feature provides the following advantages:

- Easy to identify which collection any given NFT belongs to without making additional on-chain calls.
- Possible to find all NFTs that belong to a given collection ([Check the FAQ to see how](/token-metadata/faq#how-can-i-filter-metadata-accounts-by-collection-using-get-program-accounts)).
- Easy to manage the collection metadata such as its name, description and image.

## What are Collections?

In order to group NFTs — or any token — together, we must first create a Collection NFT whose purpose is to store any metadata related to that collection. That's right, **a collection of NFT is itself, an NFT**. It has the same data layout on-chain as any other NFT.

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

Creating a Collection NFT is very similar to creating a Regular NFT. The only difference is that we must set the `CollectionDetails` field as seen in the previous section. Some of our SDKs encapsulate this by requesting a `isCollection` attribute when creating an NFT.

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

Creating a Collection NFT is very similar to creating a Regular NFT. The only difference is that we must set the `CollectionDetails` field as seen in the previous section. Some of our SDKs encapsulate this by requesting a `isCollection` attribute when creating an NFT.

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

Creating a Collection NFT is very similar to creating a Regular NFT. The only difference is that we must set the `CollectionDetails` field as seen in the previous section. Some of our SDKs encapsulate this by requesting a `isCollection` attribute when creating an NFT.

{% dialect-switcher title="Updating a Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createCollection } from '@metaplex-foundation/core'

const collectionAddress = generateSigner(umi)
await createCollection(umi, {
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

Creating a Collection NFT is very similar to creating a Regular NFT. The only difference is that we must set the `CollectionDetails` field as seen in the previous section. Some of our SDKs encapsulate this by requesting a `isCollection` attribute when creating an NFT.

{% dialect-switcher title="Updating a Collection Plugin" %}
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
