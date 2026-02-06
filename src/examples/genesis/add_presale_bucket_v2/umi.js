// [IMPORTS]
import {
  genesis,
  addPresaleBucketV2,
  findPresaleBucketV2Pda,
  findUnlockedBucketV2Pda,
} from '@metaplex-foundation/genesis'
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox'
import { keypairIdentity, publicKey, sol } from '@metaplex-foundation/umi'
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
const [presaleBucket] = findPresaleBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })
const [unlockedBucket] = findUnlockedBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })

const now = BigInt(Math.floor(Date.now() / 1000))
const depositStart = now
const depositEnd = now + 86400n // 24 hours
const claimStart = depositEnd + 1n
const claimEnd = claimStart + 604800n // 1 week

await addPresaleBucketV2(umi, {
  genesisAccount,
  baseMint: baseMint.publicKey,
  baseTokenAllocation: TOTAL_SUPPLY,
  allocationQuoteTokenCap: 100_000_000_000n, // 100 SOL cap (sets price)

  // Timing
  depositStartCondition: {
    __kind: 'TimeAbsolute',
    padding: Array(47).fill(0),
    time: depositStart,
    triggeredTimestamp: null,
  },
  depositEndCondition: {
    __kind: 'TimeAbsolute',
    padding: Array(47).fill(0),
    time: depositEnd,
    triggeredTimestamp: null,
  },
  claimStartCondition: {
    __kind: 'TimeAbsolute',
    padding: Array(47).fill(0),
    time: claimStart,
    triggeredTimestamp: null,
  },
  claimEndCondition: {
    __kind: 'TimeAbsolute',
    padding: Array(47).fill(0),
    time: claimEnd,
    triggeredTimestamp: null,
  },

  // Optional: Deposit limits
  minimumDepositAmount: null, // or { amount: sol(0.1).basisPoints }
  depositLimit: null, // or { limit: sol(10).basisPoints }

  // Where collected SOL goes after transition
  endBehaviors: [
    {
      __kind: 'SendQuoteTokenPercentage',
      padding: Array(4).fill(0),
      destinationBucket: publicKey(unlockedBucket),
      percentageBps: 10000, // 100%
      processed: false,
    },
  ],
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// [/OUTPUT]
