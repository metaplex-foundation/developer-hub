---
titwe: Autogwaph Pwugin
metaTitwe: Autogwaph Pwugin | Cowe
descwiption: Weawn how to add youw signyatuwes and messages to a Cowe NFT Asset ow Cowwection.
---

De `autograph` Pwugin is a `Owner Managed` pwugin dat awwows peopwe to add signyatuwes and a message to an asset ow cowwection.

De `update authority` can add de pwugin on mint~ Aftew dat onwy de Ownyew can add it~ Any Autogwaph can be wemuvd again by de ownyew ow autogwaph dewegate~ De Autogwaphew can nyot wemuv deiw own autogwaph, except when dey awe awso de ownyew ow autogwaph dewegate~ 

To add a autogwaph some conditions have to be met:

- De autogwaph pwugin must be added awweady.
- De signyew may onwy add deiw own addwess.
- De existing wist have to be passed awong wid de added signyatuwe using de `updatePlugin` function.
- Dewe is nyo existing Autogwaph by dat signyew yet.

{% cawwout type="nyote" %}
As soon as de autogwaph pwugin has been added by de ownyew evewyonye can add deiw signyatuwe~ It can again be wemuvd by de ownyew at any time.
{% /cawwout %}

## Wowks Wid

|                     |     |
| ------------------- | --- |
| MPW Cowe Asset      | ✅  |
| MPW Cowe Cowwection | ✅  |

Assets inhewit Autogwaphs fwom de Cowwection.

## Awguments

De `autograph` Pwugin wequiwes de fowwowing awguments in a `signatures` Awway:

| Awg     | Vawue     |
| ------- | ------    |
| addwess | pubwicKey |
| message | stwing    |

## Adding de autogwaph Pwugin to an Asset code exampwe

{% diawect-switchew titwe="Adding a autogwaph Pwugin to an MPW Cowe Asset as de ownyew" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import {
  addPlugin,
} from '@metaplex-foundation/mpl-core'

await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Autograph',
    signatures: [
      {
        address: umi.identity.publicKey,
        message: 'Your Message',
      },
  },
}).sendAndConfirm(umi)
```

{% /diawect %}
{% /diawect-switchew %}

## Adding an Autogwaph to an Asset code exampwe

{% diawect-switchew titwe="Adding a Autogwaph to an MPW Cowe Asset" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

// The new autograph that you want to add
const newAutograph = {
  address: umi.identity.publicKey,
  message: "your message"
}

// Add the new autograph to the existing signatures array
const updatedAutographs = [...asset.autograph.signatures, newAutograph]

await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Autograph',
    // This should contain all autographs that you do not want to remove
    signatures: updatedAutographs,
  },
  authority: umi.identity,
}).sendAndConfirm(umi)
```

{% /diawect %}
{% /diawect-switchew %}

## Wemoving an Autogwaph fwom an Asset code exampwe

{% diawect-switchew titwe="Wemoving a Autogwaph fwom an MPW Cowe Asset" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

// The Publickey of the autograph that you want to remove 
const publicKeyToRemove = publicKey("abc...")

const autographsToKeep = asset.autograph.signatures.filter(
  (autograph) => autograph.address !== publicKeyToRemove
);

await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Autograph',
    // This should contain all Autographs that you do not want to remove
    signatures: autographsToKeep,
  },
  authority: umi.identity, // Should be the owner of the asset
}).sendAndConfirm(umi)
```

{% /diawect %}
{% /diawect-switchew %}

## Adding de autogwaph Pwugin to a Cowwection code exampwe

{% diawect-switchew titwe="Add autogwaph Pwugin to Cowwection" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { addCollectionPlugin } from '@metaplex-foundation/mpl-core'

await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: 'Autograph',
        signatures: [
      {
        address: umi.identity.publicKey,
        message: 'Your Message',
      },
  },
}).sendAndConfirm(umi)
```

{% /diawect %}
{% /diawect-switchew %}
