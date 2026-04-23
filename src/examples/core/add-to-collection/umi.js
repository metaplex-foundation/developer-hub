// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi'
import {
  update,
  fetchAsset,
  fetchCollection,
  updateAuthority,
} from '@metaplex-foundation/mpl-core'
// [/IMPORTS]

// [SETUP]
const assetId = publicKey('11111111111111111111111111111111')
const collectionId = publicKey('22222222222222222222222222222222')
// [/SETUP]

// [MAIN]
const asset = await fetchAsset(umi, assetId)
const collection = await fetchCollection(umi, collectionId)

// Assumes the asset is standalone. If it already belongs to a collection,
// pass the current collection as `collection` or the instruction will fail.
await update(umi, {
  asset,
  newCollection: collection.publicKey,
  newUpdateAuthority: updateAuthority('Collection', [collection.publicKey]),
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
console.log('Asset added to collection')
// [/OUTPUT]
