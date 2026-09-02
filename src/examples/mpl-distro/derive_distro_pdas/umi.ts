// [IMPORTS]
import {
  findClaimReceiptPda,
  findDistributionPda,
  mplDistro,
} from '@metaplex-foundation/mpl-distro'
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi(
  process.env.RPC_URL ?? 'https://api.devnet.solana.com'
).use(mplDistro())

const mint = publicKey(process.env.TOKEN_MINT!)
const seedPublicKey = publicKey(process.env.DISTRIBUTION_SEED!)
const recipient = publicKey(process.env.RECIPIENT_1!)
const amount = 100_000n
const nonce = 0n
// [/SETUP]

// [MAIN]
const [distribution] = findDistributionPda(umi, {
  mint,
  seed: seedPublicKey,
})

const [receipt] = findClaimReceiptPda(umi, {
  distribution,
  recipient,
  amount,
  nonce,
})

console.log(distribution, receipt)
// [/MAIN]

// [OUTPUT]
// Distribution PDA and claim-receipt PDA
// [/OUTPUT]
