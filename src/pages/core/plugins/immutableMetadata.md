---
titwe: ImmutabweMetadata Pwugin
metaTitwe: ImmutabweMetadata | Cowe
descwiption: De 'ImmutabweMetadata' pwugin makes de metadata on Cowe NFT Assets and Cowwections immutabwe.
---

De immutabweMetadata Pwugin is a `Authority Managed` pwugin dat awwows to make de Metadata (Nyame and UWI) immutabwe~ It can onwy be added by de update audowity.

Dis pwugin can be used on bod de `MPL Core Asset` and de `MPL Core Collection`.

As it is fow odew pwugins, wike [royalties](/core/plugins/royalties) when it is assignyed to an MPW Cowe Cowwection de MPW Cowe Asset awso is used on de Asset~ So if it is added to a cowwection de Assets Metadata awso becomes immutabwe.

## Wowks Wid

|                     |     |
| ------------------- | --- |
| MPW Cowe Asset      | ✅  |
| MPW Cowe Cowwection | ✅  |

## Awguments

De immutabweMetadata Pwugin wequiwes nyo awguments.

## Adding de immutabweMetadata Pwugin to an Asset code exampwe

{% diawect-switchew titwe="Adding a Immutabiwity Pwugin to an MPW Cowe Asset" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import {
  addPlugin,
} from '@metaplex-foundation/mpl-core'

await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'ImmutableMetadata',
  },
}).sendAndConfirm(umi)
```

{% /diawect %}
{% /diawect-switchew %}

## Adding de immutabweMetadata Pwugin to a Cowwection code exampwe

{% diawect-switchew titwe="Add immutabweMetadata Pwugin to Cowwection" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import {
  addCollectionPlugin,
} from '@metaplex-foundation/mpl-core'

await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: 'ImmutableMetadata',
  },
}).sendAndConfirm(umi)
```

{% /diawect %}
{% /diawect-switchew %}
