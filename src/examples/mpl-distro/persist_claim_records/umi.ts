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
  { address: publicKey(process.env.RECIPIENT_1!), amount: 100_000n, nonce: 0n },
  { address: publicKey(process.env.RECIPIENT_2!), amount: 250_000n, nonce: 0n },
]
// [/SETUP]

// [MAIN]
const { root, proofs, treeHeight } = prepareDistribution(allocations)

const claimRecords = allocations.map((allocation, index) => ({
  address: allocation.address,
  amount: allocation.amount.toString(),
  nonce: (allocation.nonce ?? 0n).toString(),
  proof: proofs[index],
}))

// Persist claimRecords with the distribution PDA after createDistribution.
console.log(root, treeHeight, claimRecords.length)
// [/MAIN]

// [OUTPUT]
// One durable record per allocation: address, amount, nonce, and proof.
// [/OUTPUT]
