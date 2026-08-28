// [IMPORTS]
import {
  distribute,
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

// The payer may be the recipient or a third-party distributor, depending on
// the distribution's allowedDistributor setting.

const distribution = publicKey(process.env.DISTRIBUTION_ADDRESS!)
const mint = publicKey(process.env.TOKEN_MINT!)
const recipients = [
  { address: publicKey(process.env.RECIPIENT_1!), amount: 100_000n },
  { address: publicKey(process.env.RECIPIENT_2!), amount: 250_000n },
]
const recipientIndex = 0
const { proofs } = prepareDistribution(recipients)
// [/SETUP]

// [MAIN]
await distribute(umi, {
  distribution,
  mint,
  recipient: recipients[recipientIndex].address,
  amount: recipients[recipientIndex].amount,
  proof: proofs[recipientIndex],
  nonce: 0,
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// The recipient ATA receives 100000 base units and a claim receipt is created.
// [/OUTPUT]
