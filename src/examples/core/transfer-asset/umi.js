// [IMPORTS]
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { transfer } from '@metaplex-foundation/mpl-core'
import { mplCore } from '@metaplex-foundation/mpl-core'
import { publicKey } from '@metaplex-foundation/umi'
// [/IMPORTS]

// [SETUP]
// Initialize UMI
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
// [/SETUP]

// [MAIN]
// Transfer an existing NFT asset to a new owner
const result = await transfer(umi, {
  asset: publicKey('AssetAddressHere...'),
  newOwner: publicKey('RecipientAddressHere...'),
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
console.log('Asset transferred:', result.signature)
// [/OUTPUT]
