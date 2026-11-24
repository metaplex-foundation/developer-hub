// [IMPORTS]
import {
  findLaunchPoolBucketV2Pda,
  findUnlockedBucketV2Pda,
  genesis,
  setLaunchPoolBucketV2Behaviors,
} from '@metaplex-foundation/genesis'
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox'
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplToolbox())
  .use(genesis())

// The identity must be the Genesis authority, before finalizeV2.
// umi.use(keypairIdentity(yourKeypair))

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT')
// [/SETUP]

// [MAIN]
const [launchPoolBucket] = findLaunchPoolBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })
const [treasuryBucket] = findUnlockedBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })
const [teamBucket] = findUnlockedBucketV2Pda(umi, { genesisAccount, bucketIndex: 1 })

// Replaces the bucket's whole endBehaviors list: 70% of the raised SOL to
// the treasury and 30% to the team. Not allowed after finalizeV2.
await setLaunchPoolBucketV2Behaviors(umi, {
  genesisAccount,
  bucket: launchPoolBucket,
  padding: Array(3).fill(0),
  endBehaviors: [
    {
      __kind: 'SendQuoteTokenPercentage',
      padding: Array(4).fill(0),
      destinationBucket: treasuryBucket,
      percentageBps: 7_000,
      processed: false,
    },
    {
      __kind: 'SendQuoteTokenPercentage',
      padding: Array(4).fill(0),
      destinationBucket: teamBucket,
      percentageBps: 3_000,
      processed: false,
    },
  ],
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// The Launch Pool bucket's end behaviors are replaced; the account is resized to fit.
// [/OUTPUT]
