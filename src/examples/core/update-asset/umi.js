// [IMPORTS]
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { update } from '@metaplex-foundation/mpl-core'
import { mplCore } from '@metaplex-foundation/mpl-core'
import { publicKey } from '@metaplex-foundation/umi'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.devnet.solana.com').use(mplCore())
const assetAddress = publicKey('AssetAddressHere...')
// [/SETUP]

// [MAIN]
// Update an existing NFT asset's metadata
const result = await update(umi, {
  asset: assetAddress,
  name: 'Updated NFT Name',
  uri: 'https://updated-example.com/metadata.json',
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
console.log('Asset updated successfully')
// [/OUTPUT]
