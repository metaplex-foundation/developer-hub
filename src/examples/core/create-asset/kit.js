// [IMPORTS]
import { create } from '@metaplex-kit/core'
// [/IMPORTS]

// [SETUP]
// Initialize client
const client = createClient()
// [/SETUP]

// [MAIN]
// Create a new NFT asset
const asset = await create({
  name: 'My NFT',
  uri: 'https://example.com/metadata.json'
})
// [/MAIN]

// [OUTPUT]
console.log('Asset created:', asset.publicKey)
// [/OUTPUT]
