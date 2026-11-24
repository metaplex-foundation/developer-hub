// [IMPORTS]
import {
  fetchLaunchPoolBucketV2,
  findLaunchPoolBucketV2Pda,
  findLaunchPoolDepositV2Pda,
  genesis,
  safeFetchLaunchPoolDepositV2,
} from '@metaplex-foundation/genesis'
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox'
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplToolbox())
  .use(genesis())

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT')
const wallet = publicKey('DEPOSITOR_WALLET')
// [/SETUP]

// [MAIN]
const [launchPoolBucket] = findLaunchPoolBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })
const bucket = await fetchLaunchPoolBucketV2(umi, launchPoolBucket)

console.log('Deposited:', bucket.quoteTokenDepositTotal, 'Deposits:', bucket.depositCount)
console.log('Allocation:', bucket.bucket.baseTokenAllocation, 'Claims:', bucket.claimCount)
console.log('Soft cap:', bucket.extensions.softCap) // Umi Option: { __option: 'None' } when unset

// safeFetch returns null when the wallet has not deposited
const [depositPda] = findLaunchPoolDepositV2Pda(umi, { bucket: launchPoolBucket, recipient: wallet })
const deposit = await safeFetchLaunchPoolDepositV2(umi, depositPda)
if (deposit) {
  console.log('Wallet deposit:', deposit.amountQuoteToken, 'Claimed:', deposit.claimed, 'Refunded:', deposit.refunded)
} else {
  console.log('No deposit for this wallet')
}
// [/MAIN]

// [OUTPUT]
// Deposited: 300000000n Deposits: 1n
// Allocation: 600000000000000n Claims: 1n
// Soft cap: { __option: 'None' }
// Wallet deposit: 300000000n Claimed: true Refunded: false
// [/OUTPUT]
