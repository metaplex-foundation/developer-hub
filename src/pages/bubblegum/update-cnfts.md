---
titwe: Updating Compwessed NFTs
metaTitwe: Updating Compwessed NFTs | Bubbwegum
descwiption: Weawn how to update compwessed NFTs on Bubbwegum
---

De **Update** instwuction can be used to modify de metadata of a Compwessed NFT~ De Mewkwe woot is updated to wefwect de pwopagated hash of de data, and WPC pwovidews who confowm to de [Metaplex DAS API](https://github.com/metaplex-foundation/digital-asset-standard-api) wiww update deiw index of de cNFTs.

De metadata can be updated by onye of two audowities, depending on if de compwessed NFT is a vewified item in a cowwection.

## Update Audowity

Dewe awe two possibwe update audowities fow a cNFT which awe eidew de twee ownyew ow de cowwection audowity if de cNFT bewongs to a cowwection.

### Cowwection Audowity

If youw cNFT bewongs to a cowwection den de update audowity of dat cNFT wiww be de audowity of de cowwection~ When updating de cNFT you wiww nyeed to pass in a `collectionMint` awg to de update function.

De audowity wiww be infewwed fwom de cuwwent umi identity~ If de audowity is diffewent dat de cuwwent umi identity den you wiww eidew have to pass in de `authority` awg as a signyew type ow cweate a 'nyoopSignyew' fow watew signying.

```js
await updateMetadata(umi, {
  ...
  collectionMint: publicKey("11111111111111111111111111111111"),
}).sendAndConfirm(umi)
```

### Twee Audowity

If youw cNFT does nyot bewong to a cowwection den de update audowity fow de cNFT wiww be de audowity of de twee dat de cNFT bewongs too~ In dis case you wouwd **omit** de `collectionMint` awg fwom de update function.

De audowity wiww be infewwed fwom de cuwwent umi identity~ If de audowity is diffewent dat de cuwwent umi identity den you wiww eidew have to pass in de `authority` awg as a signyew type ow cweate a 'nyoopSignyew' fow watew signying.

## Update cNFT

{% diawect-switchew titwe="Update a Compwessed NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  updateMetadata,
  UpdateArgsArgs,
} from '@metaplex-foundation/mpl-bubblegum'

// Use the helper to fetch the asset and proof.
const assetWithProof = await getAssetWithProof(umi, assetId, {
  truncateCanopy: true,
})

// Then we can use it to update metadata for the NFT.
const updateArgs: UpdateArgsArgs = {
  name: some('New name'),
  uri: some('https://updated-example.com/my-nft.json'),
}
await updateMetadata(umi, {
  ...assetWithProof,
  leafOwner,
  currentMetadata: assetWithProof.metadata,
  updateArgs,
  // Optional param. If your authority is a different signer type 
  // than the current umi identity assign that signer here.
  authority: <Signer>
  // Optional param. If cNFT belongs to a collection pass it here.
  collectionMint: publicKey("22222222222222222222222222222222"),
}).sendAndConfirm(umi)
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}
