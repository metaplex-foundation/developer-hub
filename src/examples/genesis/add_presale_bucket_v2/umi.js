// [IMPORTS]
import {
  addPresaleBucketV2Base,
  createTimeAbsoluteCondition,
  findPresaleBucketV2Pda,
  findUnlockedBucketV2Pda,
  genesis,
  setPresaleBucketV2Behaviors,
} from '@metaplex-foundation/genesis'
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
// 'confirmed' makes each transaction's simulation see the previous one;
// the RPC default, 'finalized', lags behind and can reject back-to-back steps.
const umi = createUmi('https://api.mainnet-beta.solana.com', { commitment: 'confirmed' })
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

// A Presale bucket is configured in two transactions (plus an optional third
// for extensions), because all of its options together exceed Solana's
// transaction size limit.

// 1. Create the bucket with its allocation, price, and timing
await addPresaleBucketV2Base(umi, {
  genesisAccount,
  baseMint: baseMint.publicKey,
  baseTokenAllocation: TOTAL_SUPPLY,
  allocationQuoteTokenCap: 100_000_000_000n, // 100 SOL cap (sets price)
  depositStartCondition: createTimeAbsoluteCondition(depositStart),
  depositEndCondition: createTimeAbsoluteCondition(depositEnd),
  claimStartCondition: createTimeAbsoluteCondition(claimStart),
  claimEndCondition: createTimeAbsoluteCondition(claimEnd),
}).sendAndConfirm(umi)

// 2. Optional: deposit limits and other guards go through
//    addPresaleBucketV2Extensions, e.g.
//    { __kind: 'MinimumDepositAmount', minimumDepositAmount: { amount: sol(0.1).basisPoints } }

// 3. Set where the collected SOL goes after the sale ends.
//    The destination is the Unlocked bucket added in the next step.
await setPresaleBucketV2Behaviors(umi, {
  genesisAccount,
  bucket: presaleBucket,
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
