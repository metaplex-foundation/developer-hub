// [IMPORTS]
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { addPlugin, fetchAsset, ruleSet } from '@metaplex-foundation/mpl-core'
import { mplCore } from '@metaplex-foundation/mpl-core'
import { publicKey } from '@metaplex-foundation/umi'
// [/IMPORTS]

// [SETUP]
// Initialize UMI
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())

const assetAddress = publicKey('YOUR_ASSET_ADDRESS')
// [/SETUP]

// [MAIN]
// Fetch the existing asset
const asset = await fetchAsset(umi, assetAddress)

// Add a Royalties plugin to the asset
await addPlugin(umi, {
  asset,
  plugin: {
    type: 'Royalties',
    basisPoints: 500, // 5%
    creators: [
      { address: umi.identity.publicKey, percentage: 100 },
    ],
    ruleSet: ruleSet('None'),
  },
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
console.log('Plugin added to asset:', assetAddress)
// [/OUTPUT]
