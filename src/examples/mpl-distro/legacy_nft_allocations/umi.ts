// [IMPORTS]
import {
  DistributionType,
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

const nftMintA = publicKey(process.env.LEGACY_NFT_MINT_A!)
const nftMintB = publicKey(process.env.LEGACY_NFT_MINT_B!)
// [/SETUP]

// [MAIN]
const allocations = [
  { address: nftMintA, amount: 100_000n },
  { address: nftMintB, amount: 100_000n },
]

const { root, proofs, treeHeight } = prepareDistribution(allocations)

const distributionFields = {
  merkleRoot: root,
  treeHeight,
  totalClaimants: BigInt(allocations.length),
  distributionType: DistributionType.LegacyNft,
}

console.log(distributionFields, proofs.length)
// [/MAIN]

// [OUTPUT]
// Root, treeHeight, and LegacyNft fields for createDistribution
// [/OUTPUT]
