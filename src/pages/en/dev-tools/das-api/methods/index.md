---
title: Methods
metaTitle: Methods | DAS API
description: Callable API Methods for the Metaplex DAS API client.
---

The DAS API supports the following methods:

- [`getAsset`](/dev-tools/das-api/methods/get-asset): Returns the information of a compressed/standard asset including metadata and owner.
- [`getAssets`](/dev-tools/das-api/methods/get-assets): Returns the information of multiple compressed/standard asset including metadata and owner.
- [`getAssetProof`](/dev-tools/das-api/methods/get-asset-proof): Returns the merkle tree proof information for a compressed asset.
- [`getAssetProofs`](/dev-tools/das-api/methods/get-asset-proofs): Returns the merkle tree proof information for multiple compressed assets.
- [`getAssetSignatures`](/dev-tools/das-api/methods/get-asset-signatures): Returns the transaction signatures for compressed assets.
- [`getAssetsByAuthority`](/dev-tools/das-api/methods/get-assets-by-authority): Returns the list of assets given an authority address.
- [`getAssetsByCreator`](/dev-tools/das-api/methods/get-assets-by-creator): Return the list of assets given a creator address.
- [`getAssetsByGroup`](/dev-tools/das-api/methods/get-assets-by-group): Return the list of assets given a group (key, value) pair. Use `"collection"` for collections or `"group"` for mpl-core GroupV1 accounts.
- [`getGrouping`](/dev-tools/das-api/methods/get-grouping): Return grouping metadata for a group key/value pair, including name and member count.
- [`getAssetsByOwner`](/dev-tools/das-api/methods/get-assets-by-owner): Return the list of assets given an owner address.
- [`getNftEditions`](/dev-tools/das-api/methods/get-nft-editions): Return all printable editions for a master edition NFT mint.
- [`getTokenAccounts`](/dev-tools/das-api/methods/get-token-accounts): Return a list of token accounts by owner or mint.
- [`searchAssets`](/dev-tools/das-api/methods/search-assets): Return the list of assets given a search criteria.
