// [IMPORTS]
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { create, ruleSet } from '@metaplex-foundation/mpl-core'
import { mplCore } from '@metaplex-foundation/mpl-core'
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
// [/IMPORTS]

// [SETUP]
// Initialize UMI
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())

const creator = publicKey('YOUR_CREATOR_ADDRESS')
// [/SETUP]

// [MAIN]
// Generate a new keypair for the asset
const assetSigner = generateSigner(umi)

// Create asset with Royalties plugin
await create(umi, {
  asset: assetSigner,
  name: 'NFT with Royalties',
  uri: 'https://example.com/metadata.json',
  plugins: [
    {
      type: 'Royalties',
      basisPoints: 500, // 5%
      creators: [
        { address: creator, percentage: 100 },
      ],
      ruleSet: ruleSet('None'),
    },
  ],
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
console.log('Asset created with plugins:', assetSigner.publicKey)
// [/OUTPUT]
