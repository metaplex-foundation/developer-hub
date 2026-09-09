// [IMPORTS]
import { mplDistro, prepareDistribution } from '@metaplex-foundation/mpl-distro'
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi(
  process.env.RPC_URL ?? 'https://api.devnet.solana.com'
).use(mplDistro())

const contributorA = publicKey(process.env.RECIPIENT_1!)
const contributorB = publicKey(process.env.RECIPIENT_2!)
// [/SETUP]

// [MAIN]
const allocations = [
  { address: contributorA, amount: 1_000_000n, nonce: 0n },
  { address: contributorB, amount: 2_500_000n, nonce: 0n },
]

const { root, proofs, treeHeight } = prepareDistribution(allocations)
console.log(root, proofs.length, treeHeight)
// [/MAIN]

// [OUTPUT]
// Merkle root, two proofs, and treeHeight for the wallet allocations
// [/OUTPUT]
