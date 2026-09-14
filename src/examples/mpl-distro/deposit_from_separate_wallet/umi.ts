// [IMPORTS]
import { deposit, mplDistro } from '@metaplex-foundation/mpl-distro'
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi(
  process.env.RPC_URL ?? 'https://api.devnet.solana.com'
).use(mplDistro())

const distribution = publicKey(process.env.DISTRIBUTION_ADDRESS!)
const mint = publicKey(process.env.TOKEN_MINT!)
const amount = 350_000n
const treasurySigner = umi.identity
const feePayer = umi.payer
const distributionAuthority = umi.identity
// [/SETUP]

// [MAIN]
await deposit(umi, {
  distribution,
  mint,
  depositor: treasurySigner,
  payer: feePayer,
  authority: distributionAuthority,
  amount,
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// Tokens move from the treasury ATA to the distribution vault.
// [/OUTPUT]
