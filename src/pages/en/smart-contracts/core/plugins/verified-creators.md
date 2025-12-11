---
title: Verified Creator Plugin
metaTitle: Verified Creator Plugin | Core
description: A plugin that stores data which is a list of creators who worked on the Assets/Collection. 
---

The `Verified Creator` Plugin is a `Authority Managed` plugin that allows people to add verified creators to your Asset or Collection. It works similar to the verified Creator Array Metaplex Token Metadata used, different to that in MPL Core the Verified Creatores are not used to distribute royalties.

Possible use cases for this plugins can be to publicly verify that a Creator was part of the asset creation process. For example the Designer, Developer and Founder could sign as proof as creatorship.

The `update authority` can: 
- Add the plugin.
- Add unverified creators to the creators array.
- Can remove unverified creators. To remove verified creators they must unverify themselves first.
- Can verify themselves.

To verify a creator the `updatePlugin` instruction has to be signed by the public key that was added by the update authority to the creators array. 

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## Arguments

The `verifiedCreator` Plugin requires the following arguments in a `VerifiedCreatorsSignature` Array:

| Arg     | Value     |
| ------- | ------    |
| address | publicKey |
| message | string    |

Assets inherit the Creators array from the Collection.

## Adding the autograph Plugin to an Asset code example

{% dialect-switcher title="Adding a verified Creators Plugin to an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}

This snippet assumes that the umi identity is the update authority of the asset.

```ts
import {
  addPlugin,
} from '@metaplex-foundation/mpl-core'

await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: [
      {
        address: umi.identity.publicKey,
        verified: true,
      },
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Adding a different Creator to an Asset code example

{% dialect-switcher title="Adding a different Creator to an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}

This snippet assumes that the umi identity is the update authority of the asset to add a unverified Creator.

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'


const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

const publicKeyToAdd = publicKey("abc...")

// The new autograph that you want to add
const newCreator = {
  address: publicKeyToAdd,
  verified: false,
}

// Add the new autograph to the existing signatures array
const updatedCreators = [...asset.verifiedCreators.signatures, newCreator]

await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: updatedCreators,
  },
  authority: umi.identity,
}).sendAndConfirm(umi)
```

After adding the unverified Creator they can verify themselves using the `updatePlugin` function again.
This snippet assumes that the umi identity is the Creator.

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'


const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

const publicKeyToVerify = publicKey("abc...")

// The creator that you want to verify
const updatedCreators = asset.verifiedCreators.signatures.map(creator => {
  if (creator.address === publicKeyToVerify) {
    return { ...creator, verified: true };
  }
  return creator;
});


await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: updatedCreators,
  },
  authority: umi.identity,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Removing a Creator from an Asset code example

{% dialect-switcher title="Removing a Creator from an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}

Only the update authority can remove creators. To remove the creator it has to be `verified:false` or the update authority itself. Therefore the update will be done in two steps. If you are able to sign with the update authority and the creator at the same time this could be done in one transaction combining both instructions.

1. Set `verified:false`
This snippet assumes that `umi.identity` is the creator that you want to remove

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

// The Publickey of the creator that you want to remove 
const publicKeyToRemove = publicKey("abc...")

const modifiedCreators = signatures.map(signature => 
  signature.address === creator.publicKey 
    ? { ...signature, verified: false } 
    : signature
);

await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: modifiedCreators,
  },
  authority: umi.identity, // Should be the creator
}).sendAndConfirm(umi)
```

2. remove the creator
This snippet assumes that `umi.identity` is the update authority

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

// The Publickey of the creator that you want to remove 
const publicKeyToRemove = publicKey("abc...")


const creatorsToKeep = asset.verifiedCreators.signatures.filter(
  (creator) => creator.address !== publicKeyToRemove
);

await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: creatorsToKeep,
  },
  authority: umi.identity, // Should be the update authority
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Adding the verified Creators Plugin to a Collection code example

{% dialect-switcher title="Add verified Creators Plugin to Collection" %}
{% dialect title="JavaScript" id="js" %}
This snippet assumes that the `umi.identity` is the update authority

```ts
import { addCollectionPlugin } from '@metaplex-foundation/mpl-core'

await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: 'VerifiedCreators',
        signatures: [
      {
        address: umi.identity.publicKey,
        verified: true,
      },
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}
