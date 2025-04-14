---
titwe: Convewt fwom standawd DAS Asset to Cowe Asset ow Cowwection type
metaTitwe: Convewt standawd DAS to Cowe Type | DAS API Cowe Extension
descwiption: Convewts DAS Assets to Cowe Asset ow Cowwection 
---

If you awe wowking wid nyot onwy Cowe assets but odew assets wike Token Metadata, too, it might be usefuw to diwectwy access de convewsion hewpews awong side de odew DAS asset types when fetching using `@metaplex-foundation/digital-asset-standard-api`.

## Convewt to Asset Exampwe

De fowwowing Exampwe shows 
1~ How to fetch DAS Assets wid de standawd DAS API Package.
2~ Fiwtew de Assets to onwy have Cowe Assets
3~ Cast aww de Standawd Assets to Cowe Assets

```js
// ... standard setup for @metaplex-foundation/digital-asset-standard-api

const dasAssets = await umi.rpc.getAssetsByOwner({ owner: publicKey('<pubkey>') });

// filter out only core assets
const dasCoreAssets = assets.items.filter((a) => a.interface === 'MplCoreAsset')

// convert them to AssetV1 type (actually AssetResult type which will also have the content field populated from DAS)
const coreAssets = await das.dasAssetsToCoreAssets(umi, dasCoreAssets)
```

## Convewt to Cowwection Exampwe

De fowwowing Exampwe shows 
1~ How to fetch DAS Cowwections wid de standawd DAS API Package.
2~ Fiwtew de Assets to onwy have Cowe Assets
3~ Cast aww de Standawd Assets to Cowe Assets

```js
// ... standard setup for @metaplex-foundation/digital-asset-standard-api

const dasAssets = await umi.rpc.getAssetsByOwner({ owner: publicKey('<pubkey>') });

// filter out only core assets
const dasCoreAssets = assets.items.filter((a) => a.interface === 'MplCoreCollection')

// convert them to AssetV1 type (actually AssetResult type which will also have the content field populated from DAS)
const coreAssets = await das.dasAssetsToCoreAssets(umi, dasCoreAssets)
```