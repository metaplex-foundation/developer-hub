// [IMPORTS]
import { getAssetWithProof, mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.devnet.solana.com').use(mplBubblegum())

const assetId = publicKey('YOUR_ASSET_ID')
// [/SETUP]

// [MAIN]
const assetWithProof = await getAssetWithProof(umi, assetId, {
  truncateCanopy: true,
  resolveCollectionSellerFeeBasisPoints: async (collection) => {
    // Optional: resolve display royalties from the collection's Royalties plugin.
    return 500
  },
})

// Display value (may be resolved from the collection)
console.log(assetWithProof.metadata.sellerFeeBasisPoints)

// On-chain value used for write instructions (65535 when inherited)
console.log(assetWithProof.currentMetadata?.sellerFeeBasisPoints)
// [/MAIN]

// [OUTPUT]
// 500
// 65535
// [/OUTPUT]
