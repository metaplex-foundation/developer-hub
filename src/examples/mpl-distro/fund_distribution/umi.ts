// [IMPORTS]
import {
  deposit,
  mplDistro,
} from '@metaplex-foundation/mpl-distro'
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi(
  process.env.RPC_URL ?? 'https://api.devnet.solana.com'
).use(mplDistro())

// The Umi identity must be the current distribution authority.

const distribution = publicKey(process.env.DISTRIBUTION_ADDRESS!)
const mint = publicKey(process.env.TOKEN_MINT!)
const totalAmount = 350_000n
// [/SETUP]

// [MAIN]
await deposit(umi, {
  distribution,
  mint,
  amount: totalAmount,
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// The distribution ATA contains 350000 base units.
// [/OUTPUT]
