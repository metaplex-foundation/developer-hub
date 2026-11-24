// [IMPORTS]
import {
  addLaunchPoolBucketV2Extensions,
  findLaunchPoolBucketV2Pda,
  genesis,
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

await addLaunchPoolBucketV2Extensions(umi, {
  genesisAccount,
  bucket: launchPoolBucket,
  padding: Array(3).fill(0),
  extensions: [
    // Floor: the launch fails below this and everyone can take a full refund.
    { __kind: 'MinimumQuoteTokenThreshold', minimumQuoteTokenThreshold: { amount: sol(10).basisPoints } },
    // Ceiling: the launch keeps at most this much; the rest is refunded pro-rata.
    { __kind: 'SoftCap', softCap: { amount: sol(100).basisPoints } },
  ],
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// The Launch Pool bucket now has a 10 SOL floor and a 100 SOL soft cap.
// [/OUTPUT]
