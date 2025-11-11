// [IMPORTS]
import { update } from '@metaplex-foundation/mpl-core-kit'
// [/IMPORTS]

// [SETUP]
const client = createClient()
// [/SETUP]

// [MAIN]
// Update an existing NFT asset's metadata
const result = await update({
  asset: assetAddress,
  name: 'Updated NFT Name',
  uri: 'https://updated-example.com/metadata.json',
})
// [/MAIN]

// [OUTPUT]
console.log('Asset updated:', result)
// [/OUTPUT]
