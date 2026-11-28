// [IMPORTS]
import {
  fetchLaunchPoolBucketV2,
  fetchRaydiumCpmmBucketV2,
  findLaunchPoolBucketV2Pda,
  findLaunchPoolDepositV2Pda,
  findRaydiumCpmmBucketV2Pda,
  genesis,
  safeFetchLaunchPoolDepositV2,
  type Condition,
} from '@metaplex-foundation/genesis'
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox'
import { isSome, publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplToolbox())
  .use(genesis())

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT')
const wallet = publicKey('CONNECTED_WALLET') // the visitor's wallet
// [/SETUP]

// [MAIN]
const [launchPoolBucket] = findLaunchPoolBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })
const [raydiumBucket] = findRaydiumCpmmBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })
const [depositPda] = findLaunchPoolDepositV2Pda(umi, { bucket: launchPoolBucket, recipient: wallet })

const [pool, raydium, deposit] = await Promise.all([
  fetchLaunchPoolBucketV2(umi, launchPoolBucket),
  fetchRaydiumCpmmBucketV2(umi, raydiumBucket),
  safeFetchLaunchPoolDepositV2(umi, depositPda),
])

const now = BigInt(Math.floor(Date.now() / 1000))
const timeOf = (c: Condition) => (c.__kind === 'TimeAbsolute' ? c.time : null)
const triggered = (c: Condition) => isSome(c.triggeredTimestamp)

const depositStart = timeOf(pool.depositStartCondition)
const depositEnd = timeOf(pool.depositEndCondition)
const phase =
  depositStart !== null && now < depositStart ? 'upcoming'
  : depositEnd !== null && now < depositEnd ? 'deposits open'
  : !triggered(raydium.graduateCondition) ? 'awaiting graduation'
  : !triggered(pool.claimStartCondition) ? 'awaiting claim crank'
  : 'claims open'

const totalDeposits = pool.quoteTokenDepositTotal // lamports of wrapped SOL
const allocation = pool.bucket.baseTokenAllocation // base token units
// Share of the allocation, using bonus-weighted deposits
const userShareBps = deposit && pool.weightedQuoteTokenTotal > 0n
  ? (deposit.weightedQuoteToken * 10_000n) / pool.weightedQuoteTokenTotal
  : 0n

console.log({
  phase,
  depositStart,
  depositEnd,
  depositors: pool.depositCount,
  totalDeposits,
  impliedTokensPerSol: totalDeposits > 0n ? (allocation * 1_000_000_000n) / totalDeposits : null,
  userDeposit: deposit?.amountQuoteToken ?? 0n,
  userShareBps,
  userClaimed: deposit?.claimed ?? false,
})
// [/MAIN]

// [OUTPUT]
// { phase: 'deposits open', depositors: 412n, totalDeposits: 1250000000000n, userShareBps: 37n, ... }
// [/OUTPUT]
