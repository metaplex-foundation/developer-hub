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

// collectionDelegate only needs to be in the Collection's UpdateDelegate additionalDelegates
const collectionDelegate = umi.identity // replace with your delegate signer if different
await update(umi, {
  asset,
  collection,
  newUpdateAuthority: updateAuthority('Address', [umi.identity.publicKey]),
  authority: collectionDelegate,
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
console.log('Asset removed from collection')
// [/OUTPUT]
