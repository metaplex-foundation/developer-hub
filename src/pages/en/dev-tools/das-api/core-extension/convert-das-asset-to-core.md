---
title: Convert from standard DAS Asset to Core Asset, Collection, or Group
metaTitle: Convert standard DAS to Core Type | DAS API Core Extension
description: Convert DAS API assets to MPL Core Asset, Collection, or Group types.
created: '07-22-2026'
updated: '07-22-2026'
keywords:
  - dasAssetsToCoreAssets
  - dasAssetToCoreCollection
  - dasAssetToCoreGroup
  - das to core conversion
about:
  - DAS API
  - MPL Core
---

## Summary

When you mix Core with other standards (for example Token Metadata), fetch with `@metaplex-foundation/digital-asset-standard-api` then convert Core items with `mpl-core-das` helpers.

- `das.dasAssetsToCoreAssets` — `MplCoreAsset` → `AssetResult`
- `das.dasAssetToCoreCollection` — `MplCoreCollection` → `CollectionResult`
- `das.dasAssetToCoreGroup` — `MplCoreGroup` → `GroupResult`

## Convert to Asset Example {% #convert-to-asset-example %}

`das.dasAssetsToCoreAssets` converts filtered `MplCoreAsset` DAS items into Core `AssetResult` values.

1. Fetch with the standard DAS package.
2. Filter to Core assets.
3. Convert to Core asset types.

{% code-tabs-imported from="das-api/core-extension/convert-to-asset" frameworks="umi" /%}

## Convert to Collection Example {% #convert-to-collection-example %}

`das.dasAssetToCoreCollection` converts a single `MplCoreCollection` DAS item into a Core `CollectionResult`.

{% code-tabs-imported from="das-api/core-extension/convert-to-collection" frameworks="umi" /%}

## Convert to Group Example {% #convert-to-group-example %}

`das.dasAssetToCoreGroup` converts a single `MplCoreGroup` DAS item into a Core `GroupResult`.

{% code-tabs-imported from="das-api/core-extension/convert-to-group" frameworks="umi" /%}

## Notes

Conversion helpers validate the DAS `interface` and throw when the Core type does not match.

- Conversion helpers throw if the DAS `interface` does not match the expected Core type.
- `GroupResult` membership vectors may be empty depending on the indexer — use [`fetchGroupV1`](/smart-contracts/core/groups) for authoritative membership.
- Prefer the dedicated Core fetch helpers (`das.getAsset`, `das.getCollection`, `das.getGroup`) when you only work with Core.
