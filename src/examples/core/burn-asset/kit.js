// [IMPORTS]
import { burn } from '@metaplex-foundation/mpl-core-kit'
// [/IMPORTS]

// [SETUP]
const client = createClient()
// [/SETUP]

// [MAIN]
// Permanently destroy/burn an NFT asset
const result = await burn({
  asset: assetAddress,
})
// [/MAIN]

// [OUTPUT]
console.log('Asset burned:', result)
// [/OUTPUT]
