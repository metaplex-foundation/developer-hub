// [IMPORTS]
import { mplDistro, updateDistribution } from '@metaplex-foundation/mpl-distro'
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi(
  process.env.RPC_URL ?? 'https://api.devnet.solana.com'
).use(mplDistro())

const distribution = publicKey(process.env.DISTRIBUTION_ADDRESS!)
const currentAuthority = umi.identity
const nextAuthority = publicKey(process.env.NEXT_AUTHORITY!)
// [/SETUP]

// [MAIN]
await updateDistribution(umi, {
  distribution,
  authority: currentAuthority,
  newAuthority: nextAuthority,
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// Subsequent deposits, withdrawals, and updates require the new authority.
// [/OUTPUT]
