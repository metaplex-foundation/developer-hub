// [IMPORTS]
import {
  AllowedDistributor,
  createDistribution,
  DistributionType,
  findDistributionPda,
  mplDistro,
  prepareDistribution,
} from '@metaplex-foundation/mpl-distro'
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi(
  process.env.RPC_URL ?? 'https://api.devnet.solana.com'
).use(mplDistro())

// Use umi.use(keypairIdentity(yourKeypair)) when the Umi identity
// should be the distribution authority.

const mint = publicKey(process.env.TOKEN_MINT!)
const recipients = [
  { address: publicKey(process.env.RECIPIENT_1!), amount: 100_000n },
  { address: publicKey(process.env.RECIPIENT_2!), amount: 250_000n },
]
const { root, proofs, treeHeight } = prepareDistribution(recipients)
const seed = generateSigner(umi)
const now = BigInt(Math.floor(Date.now() / 1000))
// [/SETUP]

// [MAIN]
await createDistribution(umi, {
  mint,
  seed,
  merkleRoot: root,
  treeHeight,
  startTime: now,
  endTime: now + 7n * 24n * 60n * 60n,
  totalClaimants: BigInt(recipients.length),
  name: 'Community distribution',
  distributionType: DistributionType.Wallet,
  allowedDistributor: AllowedDistributor.Permissionless,
  subsidizeReceipts: false,
}).sendAndConfirm(umi)

const [distribution] = findDistributionPda(umi, {
  mint,
  seed: seed.publicKey,
})

// Store each recipient's amount, nonce, and proof in your claim service.
console.log('Distribution:', distribution)
console.log('Proofs:', proofs)
// [/MAIN]

// [OUTPUT]
// Distribution: <distribution PDA>
// Proofs: <one proof array per recipient>
// [/OUTPUT]
