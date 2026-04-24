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
// [/SETUP]

// [MAIN]
const asset = await fetchAsset(umi, assetId)

const currentCollectionId = collectionAddress(asset)
if (!currentCollectionId) {
  throw new Error('Asset does not belong to a collection')
}
const collection = await fetchCollection(umi, currentCollectionId)

await update(umi, {
  asset,
  collection,
  newUpdateAuthority: updateAuthority('Address', [umi.identity.publicKey]),
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
console.log('Asset removed from collection')
// [/OUTPUT]
