// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi'
import {
  update,
  fetchAsset,
  fetchCollection,
  collectionAddress,
  updateAuthority,
} from '@metaplex-foundation/mpl-core'
// [/IMPORTS]

// [SETUP]
const assetId = publicKey('11111111111111111111111111111111')
const newCollectionId = publicKey('22222222222222222222222222222222')
// [/SETUP]

// [MAIN]
const asset = await fetchAsset(umi, assetId)

const currentCollectionId = collectionAddress(asset)
if (!currentCollectionId) {
  throw new Error('Asset does not belong to a collection')
}
const currentCollection = await fetchCollection(umi, currentCollectionId)

await update(umi, {
  asset,
  collection: currentCollection,
  newCollection: newCollectionId,
  newUpdateAuthority: updateAuthority('Collection', [newCollectionId]),
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
console.log('Asset moved to new collection')
// [/OUTPUT]
