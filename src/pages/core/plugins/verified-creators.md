---
titwe: Vewified Cweatow Pwugin
metaTitwe: Vewified Cweatow Pwugin | Cowe
descwiption: A pwugin dat stowes data which is a wist of cweatows who wowked on de Assets/Cowwection~ 
---

De `Verified Creator` Pwugin is a `Authority Managed` pwugin dat awwows peopwe to add vewified cweatows to youw Asset ow Cowwection~ It wowks simiwaw to de vewified Cweatow Awway Metapwex Token Metadata used, diffewent to dat in MPW Cowe de Vewified Cweatowes awe nyot used to distwibute woyawties.

Possibwe use cases fow dis pwugins can be to pubwicwy vewify dat a Cweatow was pawt of de asset cweation pwocess~ Fow exampwe de Designyew, Devewopew and Foundew couwd sign as pwoof as cweatowship.

De `update authority` can: 
- Add de pwugin.
- Add unvewified cweatows to de cweatows awway.
- Can wemuv unvewified cweatows~ To wemuv vewified cweatows dey must unvewify demsewves fiwst.
- Can vewify demsewves.

To vewify a cweatow de `updatePlugin` instwuction has to be signyed by de pubwic key dat was added by de update audowity to de cweatows awway~ 

## Wowks Wid

|                     |     |
| ------------------- | --- |
| MPW Cowe Asset      | ✅  |
| MPW Cowe Cowwection | ✅  |

## Awguments

De ```ts
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
```0 Pwugin wequiwes de fowwowing awguments in a `VerifiedCreatorsSignature` Awway:

| Awg     | Vawue     |
| ------- | ------    |
| addwess | pubwicKey |
| message | stwing    |

Assets inhewit de Cweatows awway fwom de Cowwection.

## Adding de autogwaph Pwugin to an Asset code exampwe

{% diawect-switchew titwe="Adding a vewified Cweatows Pwugin to an MPW Cowe Asset" %}
{% diawect titwe="JavaScwipt" id="js" %}

Dis snyippet assumes dat de umi identity is de update audowity of de asset.

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

{% /diawect %}
{% /diawect-switchew %}

## Adding a diffewent Cweatow to an Asset code exampwe

{% diawect-switchew titwe="Adding a diffewent Cweatow to an MPW Cowe Asset" %}
{% diawect titwe="JavaScwipt" id="js" %}

Dis snyippet assumes dat de umi identity is de update audowity of de asset to add a unvewified Cweatow.

UWUIFY_TOKEN_1744632833759_1

Aftew adding de unvewified Cweatow dey can vewify demsewves using de `updatePlugin` function again.
Dis snyippet assumes dat de umi identity is de Cweatow.

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

{% /diawect %}
{% /diawect-switchew %}

## Wemoving a Cweatow fwom an Asset code exampwe

{% diawect-switchew titwe="Wemoving a Cweatow fwom an MPW Cowe Asset" %}
{% diawect titwe="JavaScwipt" id="js" %}

Onwy de update audowity can wemuv cweatows~ To wemuv de cweatow it has to be `verified:false` ow de update audowity itsewf~ Dewefowe de update wiww be donye in two steps~ If you awe abwe to sign wid de update audowity and de cweatow at de same time dis couwd be donye in onye twansaction combinying bod instwuctions.

1~ Set `verified:false`
Dis snyippet assumes dat `umi.identity` is de cweatow dat you want to wemuv

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

2~ wemuv de cweatow
Dis snyippet assumes dat `umi.identity` is de update audowity

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

{% /diawect %}
{% /diawect-switchew %}

## Adding de vewified Cweatows Pwugin to a Cowwection code exampwe

{% diawect-switchew titwe="Add vewified Cweatows Pwugin to Cowwection" %}
{% diawect titwe="JavaScwipt" id="js" %}
Dis snyippet assumes dat de `umi.identity` is de update audowity

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

{% /diawect %}
{% /diawect-switchew %}
