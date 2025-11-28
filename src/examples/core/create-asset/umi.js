// [IMPORTS]
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { create } from '@metaplex-foundation/mpl-core'
import { mplCore } from '@metaplex-foundation/mpl-core'
// [/IMPORTS]

// [SETUP]
// Initialize UMI
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
// [/SETUP]

// [MAIN]
// Create a new NFT asset
const asset = await create(umi, {
  name: 'My NFT',
  uri: 'https://example.com/metadata.json'
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
console.log('Asset created:', asset.publicKey)
// [/OUTPUT]
