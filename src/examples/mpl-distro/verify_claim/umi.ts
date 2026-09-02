// [IMPORTS]
import {
  fetchClaimReceipt,
  fetchDistribution,
  findClaimReceiptPda,
  mplDistro,
} from '@metaplex-foundation/mpl-distro'
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi(
  process.env.RPC_URL ?? 'https://api.devnet.solana.com'
).use(mplDistro())

const distribution = publicKey(process.env.DISTRIBUTION_ADDRESS!)
const recipients = [
  { address: publicKey(process.env.RECIPIENT_1!), amount: 100_000n },
  { address: publicKey(process.env.RECIPIENT_2!), amount: 250_000n },
]
const recipientIndex = 0
// [/SETUP]

// [MAIN]
const [receipt] = findClaimReceiptPda(umi, {
  distribution,
  recipient: recipients[recipientIndex].address,
  amount: recipients[recipientIndex].amount,
  nonce: 0,
})

const [distributionAccount, receiptAccount] = await Promise.all([
  fetchDistribution(umi, distribution),
  fetchClaimReceipt(umi, receipt),
])

console.log(distributionAccount.claimCount)
console.log(receiptAccount.amount)
// [/MAIN]

// [OUTPUT]
// claimCount includes this allocation and the receipt stores 100000
// [/OUTPUT]
