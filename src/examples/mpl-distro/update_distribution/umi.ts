// [IMPORTS]
import { mplDistro, updateDistribution } from '@metaplex-foundation/mpl-distro'
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi(
  process.env.RPC_URL ?? 'https://api.devnet.solana.com'
).use(mplDistro())

const distributionAddress = process.env.DISTRIBUTION_ADDRESS!
const newEndTimestamp = Math.floor(Date.now() / 1000) + 14 * 24 * 60 * 60
const newDistributorAddress = process.env.PERMISSIONED_DISTRIBUTOR!
// [/SETUP]

// [MAIN]
await updateDistribution(umi, {
  distribution: publicKey(distributionAddress),
  endTime: BigInt(newEndTimestamp),
  name: 'Extended community distribution',
  newPermissionedDistributor: publicKey(newDistributorAddress),
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// The distribution end time, name, and permissioned distributor are updated.
// [/OUTPUT]
