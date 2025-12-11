// [IMPORTS]
import { fetchAsset, fetchCollection, mplCore } from '@metaplex-foundation/mpl-core';
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
// [/IMPORTS]

// [SETUP]
// Initialize UMI
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())

// [/SETUP]

// [MAIN]
// Fetch a Core Asset
const assetAddress = publicKey('AssetAddressHere...')
const asset = await fetchAsset(umi, assetAddress)

// Fetch a Core Collection
const collectionAddress = publicKey('CollectionAddressHere...')
const collection = await fetchCollection(umi, collectionAddress)
// [/MAIN]

// [OUTPUT]
console.log('Asset fetched:', asset)
console.log('Name:', asset.name)
console.log('Owner:', asset.owner)
console.log('URI:', asset.uri)

console.log('\nCollection fetched:', collection)
console.log('Name:', collection.name)
console.log('URI:', collection.uri)
// [/OUTPUT]
