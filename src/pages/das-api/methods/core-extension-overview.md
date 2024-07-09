---
title: Core DAS API Extension
metaTitle: Core DAS API - Methods
description: Digital Asset Standard API Extension for MPL Core
---

In addition to the general DAS SDK an extension for [MPL Core](/core) has been created that directly returns you the correct types to further use with the MPL Core SDKs. It also automatically derives the plugins in assets inherited from the collection and provides functions for [DAS-to-Core type conversions](//TODO).  

## Fetching
The Core DAS API Extension supports the following methods:

- [`getAsset`](/das-api/methods/get-core-asset): Returns the information of a compressed/standard asset including metadata and owner.
- [`getCollection`](/das-api/methods/get-core-collection): Returns the merkle tree proof information for a compressed asset.
- [`getAssetsByAuthority`](/das-api/methods/get-core-assets-by-authority): Returns the list of assets given an authority address.
- [`getAssetsByCreator`](/das-api/methods/get-core-assets-by-creator): Return the list of assets given a creator address.
- [`getAssetsByCollection`](/das-api/methods/get-core-assets-by-Collection): Return the list of assets given a group (key, value) pair. For example this can be used to get all assets in a collection.
- [`getAssetsByOwner`](/das-api/methods/get-core-assets-by-owner): Return the list of assets given an owner address.
- [`searchAssets`](/das-api/methods/search-core-assets): Return the list of assets given a search criteria.
- [`searchCollections`](/das-api/methods/search-core-collections): Return the list of collections given a search criteria.

## Type Conversion
In addition to that it also provides functions to convert the usual DAS Asset type to Core Assets and Core Collections:
- [dasAssetsToCoreAssets](//TODO)
- [dasAssetsToCoreCollection](//TODO) 

## Plugin Derivations

This library will automatically derive the plugins in assets inherited from the collection.

Read more about general plugin inheritance and precedence on the [Core plugin page](/core/plugins).

### Disable Plugin Derivation
If you want to disable this automatic derivation you can use `skipDerivePlugins` in all functions like this:

```js
const assetsByOwner = await das.getAssetsByOwner(umi, {
  owner: publicKey('<ownerPublicKey>'),
  skipDerivePlugins: true,
});
```

### Manual Plugin derivation
You can also manually derive the plugins for the asset if you have already fetched the collection at a prior time using the mpl-core JavaScript SDK like:

```js
import { deriveAssetPlugins } from '@metaplex-foundation/mpl-core'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
import { das }  from '@metaplex-foundation/mpl-core-das';
import { publicKey } from '@metaplex-foundation/umi';

const umi = createUmi('<ENDPOINT>').use(dasApi());
const collectionId = publicKey('<PublicKey>');
//...

const collection = await das.getCollection(umi, collectionId);
const assetsByCollection = await das.getAssetsByCollection(umi, {
  collection: collection.publicKey,
  skipDerivePlugins: true,
});

const derivedAssets = assetsByCollection.map((asset) => deriveAssetPlugins(asset, collection))
```