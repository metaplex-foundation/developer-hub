// [IMPORTS]
import {
  DISTRIBUTION_SIZE,
  fetchDistribution,
  mplDistro,
  withdraw,
  withdrawSubsidy,
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
// [/SETUP]

// [MAIN]
// Token and subsidy withdrawals succeed only outside the active window.
await withdraw(umi, {
  distribution,
  mint,
  amount: 50_000n,
}).sendAndConfirm(umi)

const distributionAccount = await fetchDistribution(umi, distribution)
if (distributionAccount.subsidizeReceipts) {
  const balance = await umi.rpc.getBalance(distribution)
  const rent = await umi.rpc.getRent(DISTRIBUTION_SIZE)
  const unusedSubsidy = balance.basisPoints - rent.basisPoints

  if (unusedSubsidy > 0n) {
    await withdrawSubsidy(umi, {
      distribution,
      recipient: umi.identity.publicKey,
      amount: unusedSubsidy,
    }).sendAndConfirm(umi)
  }
}
// [/MAIN]

// [OUTPUT]
// 50000 token base units and any unused receipt subsidy are returned.
// [/OUTPUT]
