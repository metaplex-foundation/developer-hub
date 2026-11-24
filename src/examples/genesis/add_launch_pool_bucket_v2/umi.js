// [IMPORTS]
import {
  addLaunchPoolBucketV2Base,
  addLaunchPoolBucketV2Extensions,
  createTimeAbsoluteCondition,
  findLaunchPoolBucketV2Pda,
  findUnlockedBucketV2Pda,
  genesis,
  setLaunchPoolBucketV2Behaviors,
} from '@metaplex-foundation/genesis'
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox'
import { sol } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplToolbox())
  .use(genesis())

// umi.use(keypairIdentity(yourKeypair));

// Assumes genesisAccount, baseMint, and TOTAL_SUPPLY from the Initialize step.
// [/SETUP]

// [MAIN]
const [launchPoolBucket] = findLaunchPoolBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })
const [unlockedBucket] = findUnlockedBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })

const now = BigInt(Math.floor(Date.now() / 1000))
const depositStart = now
const depositEnd = now + 86400n // 24 hours
const claimStart = depositEnd + 1n
const claimEnd = claimStart + 604800n // 1 week

// A Launch Pool bucket is configured in up to three transactions, because
// all of its options together exceed Solana's transaction size limit.

// 1. Create the bucket with its allocation and timing
await addLaunchPoolBucketV2Base(umi, {
  genesisAccount,
  baseMint: baseMint.publicKey,
  baseTokenAllocation: TOTAL_SUPPLY,
  depositStartCondition: createTimeAbsoluteCondition(depositStart),
  depositEndCondition: createTimeAbsoluteCondition(depositEnd),
  claimStartCondition: createTimeAbsoluteCondition(claimStart),
  claimEndCondition: createTimeAbsoluteCondition(claimEnd),
}).sendAndConfirm(umi)

// 2. Optional: add extensions such as a minimum deposit, a soft cap,
//    or a minimum raise (MinimumQuoteTokenThreshold)
await addLaunchPoolBucketV2Extensions(umi, {
  genesisAccount,
  bucket: launchPoolBucket,
  padding: Array(3).fill(0),
  extensions: [
    { __kind: 'MinimumDepositAmount', minimumDepositAmount: { amount: sol(0.1).basisPoints } },
    // { __kind: 'SoftCap', softCap: { amount: sol(100).basisPoints } },
  ],
}).sendAndConfirm(umi)

// 3. Set where the collected SOL goes after the deposit window closes.
//    The destination is the Unlocked bucket added in the next step.
await setLaunchPoolBucketV2Behaviors(umi, {
  genesisAccount,
  bucket: launchPoolBucket,
  padding: Array(3).fill(0),
  endBehaviors: [
    {
      __kind: 'SendQuoteTokenPercentage',
      padding: Array(4).fill(0),
      destinationBucket: unlockedBucket,
      percentageBps: 10_000, // 100%
      processed: false,
    },
  ],
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// [/OUTPUT]
