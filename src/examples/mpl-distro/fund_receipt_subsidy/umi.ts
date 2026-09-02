// [IMPORTS]
import { getClaimReceiptSize, mplDistro } from '@metaplex-foundation/mpl-distro'
import { transferSol } from '@metaplex-foundation/mpl-toolbox'
import { multiplyAmount, publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi(
  process.env.RPC_URL ?? 'https://api.devnet.solana.com'
).use(mplDistro())

const distribution = publicKey(process.env.DISTRIBUTION_ADDRESS!)
const expectedClaimCount = 2
// [/SETUP]

// [MAIN]
const receiptRent = await umi.rpc.getRent(getClaimReceiptSize())
const budget = multiplyAmount(receiptRent, expectedClaimCount)

await transferSol(umi, {
  destination: distribution,
  amount: budget,
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// The distribution PDA holds extra SOL for claim-receipt rent.
// [/OUTPUT]
