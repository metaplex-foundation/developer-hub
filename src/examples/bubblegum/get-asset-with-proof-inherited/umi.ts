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
})

// Leaf / hashing value (65535 when inherited)
console.log(assetWithProof.metadata.sellerFeeBasisPoints)

// Display / payout value from DAS *_inherited fields
console.log(assetWithProof.rpcAsset.royalty?.basis_points_inherited)
// [/MAIN]

// [OUTPUT]
// 65535
// 500
// [/OUTPUT]
