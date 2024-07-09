---
title: Core DAS API Extension
metaTitle: Core DAS API - Methods
description: Digital Asset Standard API Extension for MPL Core
---

In addition to the general DAS SDK an extension for [MPL Core](/core) has been created that directly returns you the correct types to further use with the MPL Core SDKs. It also automatically derives the plugins in assets inherited from the collection and provides functions for [DAS-to-Core type conversions](/das-api/core-extension/convert-das-asset-to-core).  

## Fetching
The Core DAS API Extension supports the following methods:

- [`getAsset`](/das-api/core-extension/methods/get-core-asset): Returns the information of a compressed/standard asset including metadata and owner.
- [`getCollection`](/das-api/core-extension/methods/get-core-collection): Returns the merkle tree proof information for a compressed asset.
- [`getAssetsByAuthority`](/das-api/core-extension/methods/get-core-assets-by-authority): Returns the list of assets given an authority address.
- [`getAssetsByCreator`](/das-api/core-extension/methods/get-core-assets-by-creator): Return the list of assets given a creator address.
- [`getAssetsByCollection`](/das-api/core-extension/methods/get-core-assets-by-Collection): Return the list of assets given a group (key, value) pair. For example this can be used to get all assets in a collection.
- [`getAssetsByOwner`](/das-api/core-extension/methods/get-core-assets-by-owner): Return the list of assets given an owner address.
- [`searchAssets`](/das-api/core-extension/methods/search-core-assets): Return the list of assets given a search criteria.
- [`searchCollections`](/das-api/core-extension/methods/search-core-collections): Return the list of collections given a search criteria.

## Type Conversion
In addition to that it also provides functions to convert the usual DAS Asset type to Core Assets and Core Collections:
- [`dasAssetsToCoreAssets`](/das-api/core-extension/convert-das-asset-to-core#convert-to-asset-example): Convert a DAS Asset to Core Asset Type
- [`dasAssetsToCoreCollection`](/das-api/core-extension/convert-das-asset-to-core#convert-to-asset-example): Convert a DAS Asset to Core Collection Type

## Plugin Derivations

This library will automatically derive the plugins in assets inherited from the collection. Read more about general plugin inheritance and precedence on the [Core plugin page](/core/plugins).

If you want to deactivate the derivation or implement it manually the [Plugin Derivation Page](/das-api/core-extension/plugin-derivation) should be helpful.
