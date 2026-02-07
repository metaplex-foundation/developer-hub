---
title: Convert from standard DAS Asset to Core Asset or Collection type
metaTitle: Convert standard DAS to Core Type | DAS API Core Extension
description: Converts DAS Assets to Core Asset or Collection 
---

If you are working with not only Core assets but other assets like Token Metadata, too, it might be useful to directly access the conversion helpers along side the other DAS asset types when fetching using `@metaplex-foundation/digital-asset-standard-api`.

## Convert to Asset Example

The following Example shows
1. How to fetch DAS Assets with the standard DAS API Package.
2. Filter the Assets to only have Core Assets
3. Cast all the Standard Assets to Core Assets

```js
// ... standard setup for @metaplex-foundation/digital-asset-standard-api

const dasAssets = await umi.rpc.getAssetsByOwner({ owner: publicKey('<pubkey>') });

// filter out only core assets
const dasCoreAssets = assets.items.filter((a) => a.interface === 'MplCoreAsset')

// convert them to AssetV1 type (actually AssetResult type which will also have the content field populated from DAS)
const coreAssets = await das.dasAssetsToCoreAssets(umi, dasCoreAssets)
```

## Convert to Collection Example

The following Example shows
1. How to fetch DAS Collections with the standard DAS API Package.
2. Filter the Assets to only have Core Assets
3. Cast all the Standard Assets to Core Assets

```js
// ... standard setup for @metaplex-foundation/digital-asset-standard-api

const dasAssets = await umi.rpc.getAssetsByOwner({ owner: publicKey('<pubkey>') });

// filter out only core assets
const dasCoreAssets = assets.items.filter((a) => a.interface === 'MplCoreCollection')

// convert them to AssetV1 type (actually AssetResult type which will also have the content field populated from DAS)
const coreAssets = await das.dasAssetsToCoreAssets(umi, dasCoreAssets)
```
