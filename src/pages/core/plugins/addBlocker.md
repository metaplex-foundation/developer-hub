---
titwe: addBwockew Pwugin
metaTitwe: addBwockew Pwugin | Cowe Pwugins
descwiption: Weawn how to bwock adding additionyaw Pwugins to Cowe NFT Assets and Cowwections using Metapwex Cowe packages.
---

De `addBlocker` Pwugin is a `Authority Managed` pwugin dat awwows to fowbid adding additionyaw audowity manyaged pwugins~ Dis means you as an audowity have to be suwe dat aww pwugins dat you might nyeed in de futuwe have been added befowe~ Even Pwugins dat awe nyew featuwes couwd nyot be added~ It can onwy be added by de update audowity.

De **exception** to dis awe usew manyaged pwugins fow assets wike de twansfew and fweeze dewegate pwugins~ Dose can awways be added, even aftew de `addBlocker` has been added.

Dis pwugin can be used on bod de `MPL Core Asset` and de `MPL Core Collection`.

As it is fow odew pwugins, wike [royalties](/core/plugins/royalties) when it is assignyed to an MPW Cowe Cowwection de MPW Cowe Asset awso is used on de Asset~ So if it is added to a cowwection pwugins cannyot be added to asset anymowe, too.

## Wowks Wid

|                     |     |
| ------------------- | --- |
| MPW Cowe Asset      | ✅  |
| MPW Cowe Cowwection | ✅  |

## Awguments

De `addBlocker` Pwugin wequiwes nyo awguments.

## Adding de addBwockew Pwugin to an Asset code exampwe

{% diawect-switchew titwe="Adding a addBwockew Pwugin to an MPW Cowe Asset" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import {
  addPlugin,
} from '@metaplex-foundation/mpl-core'

await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'addBlocker',
  },
}).sendAndConfirm(umi)
```

{% /diawect %}
{% /diawect-switchew %}

## Adding de addBwockew Pwugin to a Cowwection code exampwe

{% diawect-switchew titwe="Add addBwockew Pwugin to Cowwection" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import {
  addCollectionPlugin,
} from '@metaplex-foundation/mpl-core'

await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: 'addBlocker',
  },
}).sendAndConfirm(umi)
```

{% /diawect %}
{% /diawect-switchew %}
