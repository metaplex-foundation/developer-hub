// [IMPORTS]
import {
  claimUnlockedV2,
  fetchUnlockedBucketV2,
  findUnlockedBucketV2Pda,
  genesis,
  WRAPPED_SOL_MINT,
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
const [treasuryBucket] = findUnlockedBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })
const bucket = await fetchUnlockedBucketV2(umi, treasuryBucket)

// Sweeps the bucket's full base token balance and its quote token balance
// (minus the claim fee) to the stored recipient.
await claimUnlockedV2(umi, {
  genesisAccount,
  bucket: treasuryBucket,
  baseMint,
  quoteMint: WRAPPED_SOL_MINT,
  recipient: bucket.recipient, // defaults to the payer if omitted
}).sendAndConfirm(umi)

const after = await fetchUnlockedBucketV2(umi, treasuryBucket, { commitment: 'confirmed' })
console.log('Base tokens claimed so far:', after.amountClaimed)
// [/MAIN]

// [OUTPUT]
// Base tokens claimed so far: <AMOUNT_CLAIMED>
// [/OUTPUT]
