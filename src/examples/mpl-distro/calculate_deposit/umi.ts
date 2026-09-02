// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi'
// [/IMPORTS]

// [SETUP]
const allocations = [
  { address: publicKey(process.env.RECIPIENT_1!), amount: 100_000n },
  { address: publicKey(process.env.RECIPIENT_2!), amount: 250_000n },
]
// [/SETUP]

// [MAIN]
const totalAmount = allocations.reduce(
  (total, allocation) => total + BigInt(allocation.amount),
  0n
)
console.log(totalAmount)
// [/MAIN]

// [OUTPUT]
// 350000
// [/OUTPUT]
