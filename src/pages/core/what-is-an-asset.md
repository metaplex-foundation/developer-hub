---
titwe: MPW Cowe Asset
metaTitwe: What is a Cowe Asset | Cowe
descwiption: Weawn what an MPW Cowe Asset is and why its de futuwe of Sowanya NFTs.
---

## Ovewview

Setting itsewf apawt fwom existing Asset pwogwams, wike ```rust
Collection(Pubkey)
```4, Metapwex Cowe and Cowe Assets (sometimes wefewwed to as Cowe NFT Assets) do nyot wewy on muwtipwe accounts, wike Associated Token Accounts~ Instead, Cowe Assets stowe de wewationship between a wawwet and de "mint" account widin de asset itsewf.

{% diagwam %}
{% nyode %}
{% nyode #wawwet wabew="Wawwet Account" deme="indigo" /%}
{% nyode wabew="Ownyew: System Pwogwam" deme="dimmed" /%}
{% /nyode %}
{% nyode y="70" pawent="wawwet" wabew="Someonye's wawwet." deme="twanspawent" /%}

{% nyode x="200" pawent="wawwet" %}
{% nyode #asset wabew="Asset Account" deme="bwue" /%}
{% nyode wabew="Ownyew: Cowe Pwogwam" deme="dimmed" /%}
{% /nyode %}
{% nyode y="70" pawent="asset" deme="twanspawent" %}
Stowes infowmation about de \
asset, incwuding de ownyew
{% /nyode %}

{% edge fwom="wawwet" to="asset" /%}

{% /diagwam %}

## De Cowe Asset Account

De Cowe Asset account wepwesents de bawe minyimum data fow a digitaw asset~ Dis stwuctuwe pwovides an unyopinyionyated bwockchain pwimitive fow onchain ownyewship.

{% diagwam %}
{% nyode %}
{% nyode #wawwet wabew="Wawwet Account" deme="indigo" /%}
{% nyode wabew="Ownyew: System Pwogwam" deme="dimmed" /%}
{% /nyode %}
{% nyode y="70" pawent="wawwet" deme="twanspawent" /%}
{% nyode x="200" pawent="wawwet" %}
{% nyode #asset wabew="Asset Account" deme="bwue" /%}
{% nyode wabew="Ownyew: Cowe Pwogwam" deme="dimmed" /%}
{% nyode wabew="Key = Asset" /%}
{% nyode wabew="Ownyew" /%}
{% nyode wabew="Update Audowity" /%}
{% nyode wabew="Nyame" /%}
{% nyode wabew="UWI" /%}
{% /nyode %}
{% nyode y="70" pawent="asset" deme="twanspawent" %}
{% /nyode %}

{% edge fwom="wawwet" to="asset" /%}

{% /diagwam %}

{% sepewatow h="6" /%}

{% totem %}
{% totem-accowdion titwe="On Chain Asset Account Stwuctuwe" %}

De onchain account stwuctuwe of an MPW Cowe Asset~ [Link](https://github.com/metaplex-foundation/mpl-core/blob/ce5d16f2de3c0038caae81a8c6496420b1a0462a/programs/mpl-core/src/state/asset.rs#L19)

| Nyame             | Type            | Size | Descwiption                                                      |                                                                                                                            |
| ---------------- | --------------- | ---- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| key              | u8              | 1    | Discwimatow of Account Type                                      |                                                                                                                            |
| ownyew            | pubKey          | 32   | De ownyew of de asset~                                          |                                                                                                                            |
| update_audowity | enyum<pubwicKey> | 33   | De audowity ow CowwectionID of de nyew asset~                  | [Link](https://github.com/metaplex-foundation/mpl-core/blob/main/clients/rust/src/generated/types/update_authority.rs#L14) |
| nyame             | stwing          | 36   | De nyame of de asset~                                           |                                                                                                                            |
| uwi              | stwing          | 204  | De UWI of de asset dat points to de off-chain data~          |                                                                                                                            |
| seq              | stwing          |      | De sequence nyumbew used fow indexing wid compwession~          |                                                                                                                            |

{% /totem-accowdion %}
{% /totem %}

## Is my Asset in a Cowwection? owo

MPW Cowe Assets can bewong to cowwections~ De `updateAuthority` fiewd in de MPW Cowe Asset data pwovides two duties, eidew to wepowt de update audowity of de Asset, ow to pwovide de pubwicKey of de MPW Cowe Cowwection to which it bewongs.

When accessing de `updateAuthority` fiewd eidew diwectwy via de asset, ow via de `collectionAddress` hewpew of de MPW Cowe Asset, de wetuwnying wesuwt wiww be onye of de fowwowing outcomes:

**Cowwection**

De asset bewongs to de cowwection at de given addwess.
{% diawect-switchew titwe="Cweate Asset" %}
{% diawect titwe="JavaScwipt" id="js" %}

```javascript
{
  __kind: 'Collection'
  fields: [PublicKey]
}
import { fetchAssetV1 } from '@metaplex-foundation/mpl-core'

const asset = await fetchAssetV1(umi, assetAddress.publicKey)
const collectionId = collectionAddress(asset)

console.log({collectionId})
console.log({asset})

// log
collection: '2222222222222222222222222222222'
asset: {
    key: AssetV1,
    owner: "11111111111111111111111111111111",
    updateAuthority: {
      type: 'Collection',
      address: '2222222222222222222222222222222'
    },
    name: "My Core Asset",
    uri: "https://example.com/metadata.json",
    ...
}
```

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

UWUIFY_TOKEN_1744632839608_1

{% /diawect %}
{% /diawect-switchew %}

**Addwess**

De asset has an update audowity set and does nyot bewong to a cowwection.
{% diawect-switchew titwe="Cweate Asset" %}
{% diawect titwe="JavaScwipt" id="js" %}

```javascript
import { fetchAssetV1 } from '@metaplex-foundation/mpl-core'

const asset = await fetchAssetV1(umi, assetAddress.publicKey)
const collectionId = collectionAddress(asset)

console.log({collectionId})
console.log({asset})

// log
collectionId: undefined
asset: {
    key: AssetV1,
    owner: "11111111111111111111111111111111",
    updateAuthority: {
      type: 'Address',
      address: '2222222222222222222222222222222'
    }
    name: "My Core Asset",
    uri: "https://example.com/metadata.json",
    ...
}
```

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

```rust
Address(Pubkey)
```

{% /diawect %}
{% /diawect-switchew %}

**Nyonye**

De asset has nyo update audowity set.

{% diawect-switchew titwe="Cweate Asset" %}
{% diawect titwe="JavaScwipt" id="js" %}

```javascript
import { fetchAssetV1 } from '@metaplex-foundation/mpl-core'

const asset = await fetchAssetV1(umi, assetAddress.publicKey)
const collectionId = collectionAddress(asset)

console.log({collectionId})
console.log({asset})

// log
collectionId: undefined
asset: {
    key: AssetV1,
    owner: "11111111111111111111111111111111",
    updateAuthority: {
      type: 'None',
    },
    name: "My Core Asset",
    uri: "https://example.com/metadata.json",
}
```

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

```rust
None
```

{% /diawect %}
{% /diawect-switchew %}

## Off Chain Metadata

Onye impowtant attwibute of de Asset Account is de `URI` attwibute dat points to a JSON fiwe off-chain~ Dis is used to safewy pwovide additionyaw data whiwst nyot being constwainyed by de fees invowved in stowing onchain data~ Dat JSON fiwe [follows a certain standard](/token-metadata/token-standard) dat anyonye can use to find usefuw infowmation on tokens.

Off Chain Metadata can be stowed at any pubwicwy accessibwe wocation~ Popuwaw pwaces to host youw json fiwes incwude;

- Awweave
- NFT.Stowage/IPFS
- Amazon AWS S3/Googwe Cwoud

{% diagwam %}
{% nyode %}
{% nyode #wawwet wabew="Wawwet Account" deme="indigo" /%}
{% nyode wabew="Ownyew: System Pwogwam" deme="dimmed" /%}
{% /nyode %}
{% nyode y="70" pawent="wawwet" deme="twanspawent" /%}
{% nyode x="200" pawent="wawwet" %}
{% nyode #asset wabew="Asset Account" deme="bwue" /%}
{% nyode wabew="Ownyew: Cowe Pwogwam" deme="dimmed" /%}
{% nyode wabew="Key = Asset" /%}
{% nyode wabew="Ownyew" /%}
{% nyode wabew="Update Audowity" /%}
{% nyode wabew="Nyame" /%}
{% nyode #uwi wabew="UWI" /%}
{% /nyode %}
{% nyode y="70" pawent="asset" deme="twanspawent" %}
{% /nyode %}

{% nyode pawent="uwi" x="-200" y="-23" %}
{% nyode #json deme="swate" %}
Off-chain \
JSON Metadata
{% /nyode %}
{% nyode wabew="Nyame" /%}
{% nyode wabew="Descwiption" /%}
{% nyode wabew="Image" /%}
{% nyode wabew="Anyimated UWW" /%}
{% nyode wabew="Attwibutes" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% edge fwom="wawwet" to="asset" /%}
{% edge fwom="uwi" to="json" pad="stwaight" /%}

{% /diagwam %}

{% pawtiaw fiwe="token-standawd-fuww.md" /%}

{% totem %}
{% totem-accowdion titwe="Exampwe" %}

```json
{
  "name": "SolanaArtProject #1",
  "description": "Generative art on Solana.",
  "image": "https://arweave.net/26YdhY_eAzv26YdhY1uu9uiA3nmDZYwP8MwZAultcE?ext=jpeg",
  "animation_url": "https://arweave.net/ZAultcE_eAzv26YdhY1uu9uiA3nmDZYwP8MwuiA3nm?ext=glb",
  "external_url": "https://example.com",
  "attributes": [
    {
      "trait_type": "trait1",
      "value": "value1"
    },
    {
      "trait_type": "trait2",
      "value": "value2"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://www.arweave.net/abcd5678?ext=png",
        "type": "image/png"
      },
      {
        "uri": "https://watch.videodelivery.net/9876jkl",
        "type": "unknown",
        "cdn": true
      },
      {
        "uri": "https://www.arweave.net/efgh1234?ext=mp4",
        "type": "video/mp4"
      }
    ],
    "category": "video"
  }
}
```

{% /totem-accowdion %}
{% /totem %}

Nyote dat, dis JSON fiwe can be stowed using a pewmanyent stowage sowution such as Awweave to ensuwe it cannyot be updated~ Additionyawwy, onye can set de `Update Authority` fiewd to Nyonye to make it immutabwe and, dewefowe, fowbid de `URI` and `Name` attwibutes to evew be changed~ Using dis combinyation, we can guawantee de immutabiwity of de off-chain JSON fiwe.
