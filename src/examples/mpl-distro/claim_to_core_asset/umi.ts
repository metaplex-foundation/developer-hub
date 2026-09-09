// [IMPORTS]
import { findAssetSignerPda } from '@metaplex-foundation/mpl-core'
import {
  distributeToAssetAndClaim,
  mplDistro,
  prepareDistribution,
} from '@metaplex-foundation/mpl-distro'
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi(
  process.env.RPC_URL ?? 'https://api.devnet.solana.com'
).use(mplDistro())

const distribution = publicKey(process.env.DISTRIBUTION_ADDRESS!)
const mint = publicKey(process.env.TOKEN_MINT!)
const asset = publicKey(process.env.CORE_ASSET!)
const currentOwner = publicKey(process.env.CORE_ASSET_OWNER!)
// [/SETUP]

// [MAIN]
const [assetSigner] = findAssetSignerPda(umi, { asset })
const allocations = [{ address: assetSigner, amount: 100_000n }]
const { proofs } = prepareDistribution(allocations)

await distributeToAssetAndClaim(umi, {
  distribution,
  mint,
  asset,
  recipient: currentOwner,
  amount: allocations[0].amount,
  proof: proofs[0],
  nonce: 0,
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// Tokens are claimed to the asset-signer PDA, then transferred to the current owner.
// [/OUTPUT]
