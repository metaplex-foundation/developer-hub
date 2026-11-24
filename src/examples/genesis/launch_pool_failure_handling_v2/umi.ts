// [IMPORTS]
import {
  addLaunchPoolBucketV2Extensions,
  findLaunchPoolBucketV2Pda,
  findRaydiumCpmmBucketV2Pda,
  findUnlockedBucketV2Pda,
  genesis,
  setLaunchPoolBucketV2Behaviors,
} from '@metaplex-foundation/genesis'
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox'
import { keypairIdentity, publicKey, sol } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplToolbox())
  .use(genesis())

// The identity must be the Genesis authority, before finalizeV2.
// umi.use(keypairIdentity(yourKeypair))

// The Launch Pool bucket was added with addLaunchPoolBucketV2Base.
const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT')
// [/SETUP]

// [MAIN]
const [launchPoolBucket] = findLaunchPoolBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })
const [raydiumBucket] = findRaydiumCpmmBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })
const [treasuryBucket] = findUnlockedBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })

// The sale fails if deposits end below 100 SOL
await addLaunchPoolBucketV2Extensions(umi, {
  genesisAccount,
  bucket: launchPoolBucket,
  padding: Array(3).fill(0),
  extensions: [
    { __kind: 'MinimumQuoteTokenThreshold', minimumQuoteTokenThreshold: { amount: sol(100).basisPoints } },
  ],
}).sendAndConfirm(umi)

await setLaunchPoolBucketV2Behaviors(umi, {
  genesisAccount,
  bucket: launchPoolBucket,
  padding: Array(3).fill(0),
  endBehaviors: [
    // Success path: 20% of proceeds and the start price to Raydium, 80% to the treasury
    { __kind: 'SendQuoteTokenPercentage', padding: Array(4).fill(0), destinationBucket: raydiumBucket, percentageBps: 2_000, processed: false },
    { __kind: 'SendStartPrice', padding: Array(6).fill(0), destinationBucket: raydiumBucket, processed: false },
    { __kind: 'SendQuoteTokenPercentage', padding: Array(4).fill(0), destinationBucket: treasuryBucket, percentageBps: 8_000, processed: false },
    // Failure path: return the unsold tokens to the treasury and close graduation
    { __kind: 'ReallocateBaseTokensOnFailure', padding: Array(4).fill(0), destinationBucket: treasuryBucket, percentageBps: 10_000, processed: false },
    { __kind: 'TransmitFailure', padding: Array(6).fill(0), destinationBucket: raydiumBucket, processed: false },
  ],
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// If deposits end below 100 SOL, triggerBehaviorsV2 runs only the failure path:
// depositors refund with refundLaunchPoolV2, the treasury receives the Launch Pool's
// base tokens, and the Raydium bucket is marked failed (graduation returns BucketLaunchFailed).
// [/OUTPUT]
