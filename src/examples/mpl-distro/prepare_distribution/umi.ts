// [IMPORTS]
import { mplDistro, prepareDistribution } from '@metaplex-foundation/mpl-distro'
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi(
  process.env.RPC_URL ?? 'https://api.devnet.solana.com'
).use(mplDistro())

const allocations = [
  { address: publicKey(process.env.RECIPIENT_1!), amount: 100n, nonce: 0n },
  { address: publicKey(process.env.RECIPIENT_2!), amount: 200n, nonce: 0n },
]
// [/SETUP]

// [MAIN]
const { root, proofs, treeHeight } = prepareDistribution(allocations)
console.log(root, proofs, treeHeight)
// [/MAIN]

// [OUTPUT]
// root, one proof array per allocation, and treeHeight
// [/OUTPUT]
