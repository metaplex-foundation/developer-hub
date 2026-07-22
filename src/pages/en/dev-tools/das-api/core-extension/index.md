---
title: Core DAS API Extension
metaTitle: Overview | Core DAS API Extension
description: Digital Asset Standard API Extension for MPL Core — typed Core assets, collections, groups, and agent discovery.
created: '07-22-2026'
updated: '07-22-2026'
keywords:
  - mpl-core-das
  - core das extension
  - das api core
  - mpl core groups
  - agent discovery
about:
  - DAS API
  - MPL Core
  - mpl-core-das
---

## Summary

`@metaplex-foundation/mpl-core-das` is the DAS API extension for [MPL Core](/smart-contracts/core). It returns Core-typed results (`AssetV1`, `CollectionV1`, `GroupV1`) instead of raw DAS shapes.

- Returns types ready for the MPL Core SDKs
- Automatically derives collection plugins on assets (optional to skip)
- Supports [Core Groups](/smart-contracts/core/groups), agent filters, and DAS-to-Core conversions
- Requires `@metaplex-foundation/digital-asset-standard-api` **≥ 2.1.0**.

Install and setup: [Getting Started](/dev-tools/das-api/getting-started).

## Fetching

The Core DAS API Extension supports the following methods:

- [`getAsset`](/dev-tools/das-api/core-extension/methods/get-asset): Fetch a single Core asset by public key.
- [`getCollection`](/dev-tools/das-api/core-extension/methods/get-collection): Fetch a single Core collection by public key.
- [`getGroup`](/dev-tools/das-api/core-extension/methods/get-group): Fetch a single Core GroupV1 by public key.
- [`getAssetsByAuthority`](/dev-tools/das-api/core-extension/methods/get-assets-by-authority): List Core assets for an authority.
- [`getAssetsByCollection`](/dev-tools/das-api/core-extension/methods/get-assets-by-collection): List Core assets in a collection.
- [`getAssetsByOwner`](/dev-tools/das-api/core-extension/methods/get-assets-by-owner): List Core assets owned by a wallet.
- [`getAssetsByGroup`](/dev-tools/das-api/core-extension/methods/get-assets-by-group): List members of an mpl-core GroupV1 (`groupKey: "group"`).
- [`getGrouping`](/dev-tools/das-api/core-extension/methods/get-grouping): Return group name and indexed size without listing members.
- [`searchAssets`](/dev-tools/das-api/core-extension/methods/search-assets): Search Core assets (includes agent filters).
- [`searchCollections`](/dev-tools/das-api/core-extension/methods/search-collections): Search Core collections (includes by update authority).
- [`searchGroups`](/dev-tools/das-api/core-extension/methods/search-groups): Search Core groups (includes by update authority).

## Type Conversion

Helpers convert raw DAS items into Core types:

- [`dasAssetsToCoreAssets`](/dev-tools/das-api/core-extension/convert-das-asset-to-core#convert-to-asset-example): Convert DAS items to Core assets
- [`dasAssetToCoreCollection`](/dev-tools/das-api/core-extension/convert-das-asset-to-core#convert-to-collection-example): Convert a DAS item to a Core collection
- [`dasAssetToCoreGroup`](/dev-tools/das-api/core-extension/convert-das-asset-to-core#convert-to-group-example): Convert a DAS item to a Core group

## Plugin Derivations

This library automatically derives plugins that assets inherit from their collection. Read more about plugin inheritance and precedence on the [Core plugins page](/smart-contracts/core/plugins).

To disable derivation or implement it manually, see [Plugin Derivation](/dev-tools/das-api/core-extension/plugin-derivation).

## Notes

- Prefer this package over GPA helpers (`fetchAssetsByOwner` / `fetchAssetsByCollection`) for production listing.
- `GroupResult` membership vectors (`collections`, `groups`, `parentGroups`, `assets`) may be empty from DAS — use [`fetchGroupV1`](/smart-contracts/core/groups) for authoritative on-chain membership.
- Agent discovery uses `searchAssets({ isAgent: true })` and may populate `is_agent`, `agent_token`, and `asset_signer` on results when indexed.
