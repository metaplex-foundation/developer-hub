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

// Reading: metadata mirrors DAS main / resolved fields
console.log(assetWithProof.metadata.sellerFeeBasisPoints) // e.g. 500 when inherited
console.log(assetWithProof.metadata.creators) // collection payees when inherited
console.log(assetWithProof.inherited) // true

// Writes / hashing: currentMetadata is leaf-canonical (V2)
console.log(assetWithProof.currentMetadata.sellerFeeBasisPoints) // 65535 when inherited
console.log(assetWithProof.currentMetadata.creators) // usually []

// Optional DAS-aligned _raw siblings (same leaf values)
console.log(assetWithProof.sellerFeeBasisPointsRaw) // 65535 when inherited
console.log(assetWithProof.creatorsRaw) // usually []

// Explicit DAS raw + flag
console.log(assetWithProof.rpcAsset.royalty?.basis_points_raw) // 65535
console.log(assetWithProof.rpcAsset.creators_raw) // []
console.log(assetWithProof.rpcAsset.royalty?.inherited) // true
// [/MAIN]

// [OUTPUT]
// 500
// [{ address: '...', share: 100, verified: true }]
// true
// 65535
// []
// 65535
// []
// 65535
// []
// true
// [/OUTPUT]
