// [IMPORTS]
import {
  findClaimScheduleBucketV2Pda,
  findLaunchPoolBucketV2Pda,
  findRaydiumCpmmBucketV2Pda,
  findUnlockedBucketV2Pda,
  genesis,
  triggerConditionsV2,
} from '@metaplex-foundation/genesis'
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox'
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplToolbox())
  .use(genesis())

// umi.use(keypairIdentity(yourKeypair))

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT')
const baseMint = publicKey('YOUR_PROJECT_TOKEN_MINT')
// [/SETUP]

// [MAIN]
const [raydiumBucket] = findRaydiumCpmmBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })

// Every bucket whose conditions are TimeRelative to the Raydium Graduate time
const dependentBuckets = [
  findLaunchPoolBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })[0],
  findUnlockedBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })[0],
  findClaimScheduleBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })[0],
]

// One triggerConditionsV2 call per dependent bucket. The referenced bucket is
// passed as a writable remaining account so the program can read its Graduate time.
for (const bucket of dependentBuckets) {
  await triggerConditionsV2(umi, {
    genesisAccount,
    bucket,
    baseMint,
  })
    .addRemainingAccounts([
      { pubkey: raydiumBucket, isSigner: false, isWritable: true },
    ])
    .sendAndConfirm(umi)
}
// [/MAIN]

// [OUTPUT]
// Each TimeRelative condition whose time (Graduate + offset) has passed is now
// triggered, so claims on the Launch Pool, treasury, and vesting buckets can open.
// [/OUTPUT]
