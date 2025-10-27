// [IMPORTS]
import { transfer } from '@metaplex-kit/core'
// [/IMPORTS]

// [MAIN]
// Transfer an existing NFT asset to a new owner
const signature = await transfer({
  asset: assetAddress,
  newOwner: recipientPublicKey,
})
// [/MAIN]

// [OUTPUT]
console.log('Asset transferred:', signature)
// [/OUTPUT]
