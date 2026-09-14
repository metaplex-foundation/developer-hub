// [IMPORTS]
import { findAssetSignerPda, mplCore } from '@metaplex-foundation/mpl-core'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { publicKey } from '@metaplex-foundation/umi'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com').use(mplCore())
const assetPublicKey = publicKey('AGENT_CORE_ASSET_ADDRESS')
// [/SETUP]

// [MAIN]
const assetSignerPda = findAssetSignerPda(umi, { asset: assetPublicKey })
const balance = await umi.rpc.getBalance(assetSignerPda)

console.log('Agent wallet:', assetSignerPda)
console.log('Balance:', balance.basisPoints.toString(), 'lamports')
// [/MAIN]

// [OUTPUT]
// Agent wallet: 6ttUwc5VVmHeVKTddB6XM5vQgBMfw62DThuoiVEufVZq
// Balance: 1000000 lamports
// [/OUTPUT]
