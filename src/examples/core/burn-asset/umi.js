// [IMPORTS]
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { burn } from '@metaplex-foundation/mpl-core'
import { mplCore } from '@metaplex-foundation/mpl-core'
import { publicKey } from '@metaplex-foundation/umi'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.devnet.solana.com').use(mplCore())
const assetAddress = publicKey('AssetAddressHere...')
// [/SETUP]

// [MAIN]
// Permanently destroy/burn an NFT asset
const result = await burn(umi, {
  asset: assetAddress,
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
console.log('Asset burned successfully')
// [/OUTPUT]
