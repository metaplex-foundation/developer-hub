// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi'
import {
  update,
  fetchAsset,
  updateAuthority,
} from '@metaplex-foundation/mpl-core'
// [/IMPORTS]

// [SETUP]
const assetId = publicKey('11111111111111111111111111111111')
const collectionId = publicKey('22222222222222222222222222222222')
// [/SETUP]

// [MAIN]
const asset = await fetchAsset(umi, assetId)

// umi.identity must be in the Collection's UpdateDelegate additionalDelegates
// AND hold the Asset's update authority (or be in the Asset's UpdateDelegate additionalDelegates)
await update(umi, {
  asset,
  newCollection: collectionId,
  newUpdateAuthority: updateAuthority('Collection', [collectionId]),
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
console.log('Asset added to collection')
// [/OUTPUT]
