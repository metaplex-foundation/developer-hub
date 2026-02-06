---
title: Core DAS API Extension
metaTitle: Methods | Core DAS API Extension
description: Digital Asset Standard API Extension for MPL Core
---

In addition to the general DAS SDK an extension for [MPL Core](/smart-contracts/core) has been created that directly returns you the correct types to further use with the MPL Core SDKs. It also automatically derives the plugins in assets inherited from the collection and provides functions for [DAS-to-Core type conversions](/dev-tools/das-api/core-extension/convert-das-asset-to-core).  

## Fetching

The Core DAS API Extension supports the following methods:

- [`getAsset`](/dev-tools/das-api/core-extension/methods/get-asset): Returns the information of a compressed/standard asset including metadata and owner.
- [`getCollection`](/dev-tools/das-api/core-extension/methods/get-collection): Returns the merkle tree proof information for a compressed asset.
- [`getAssetsByAuthority`](/dev-tools/das-api/core-extension/methods/get-assets-by-authority): Returns the list of assets given an authority address.
- [`getAssetsByCollection`](/dev-tools/das-api/core-extension/methods/get-assets-by-collection): Return the list of assets given a group (key, value) pair. For example this can be used to get all assets in a collection.
- [`getAssetsByOwner`](/dev-tools/das-api/core-extension/methods/get-assets-by-owner): Return the list of assets given an owner address.
- [`searchAssets`](/dev-tools/das-api/core-extension/methods/search-assets): Return the list of assets given a search criteria.
- [`searchCollections`](/dev-tools/das-api/core-extension/methods/search-collections): Return the list of collections given a search criteria.

## Type Conversion

In addition to that it also provides functions to convert the usual DAS Asset type to Core Assets and Core Collections:

- [`dasAssetsToCoreAssets`](/dev-tools/das-api/core-extension/convert-das-asset-to-core#convert-to-asset-example): Convert a DAS Asset to Core Asset Type
- [`dasAssetsToCoreCollection`](/dev-tools/das-api/core-extension/convert-das-asset-to-core#convert-to-asset-example): Convert a DAS Asset to Core Collection Type

## Plugin Derivations

This library will automatically derive the plugins in assets inherited from the collection. Read more about general plugin inheritance and precedence on the [Core plugin page](/smart-contracts/core/plugins).

If you want to deactivate the derivation or implement it manually the [Plugin Derivation Page](/dev-tools/das-api/core-extension/plugin-derivation) should be helpful.
