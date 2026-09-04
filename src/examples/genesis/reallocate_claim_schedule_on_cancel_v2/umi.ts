// [IMPORTS]
import {
  genesis,
  setClaimScheduleBucketV2Behaviors,
  triggerBehaviorsV2,
} from '@metaplex-foundation/genesis'
import { findAssociatedTokenPda, mplToolbox } from '@metaplex-foundation/mpl-toolbox'
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
const quoteMint = publicKey('So11111111111111111111111111111111111111112')
const vestingBucket = publicKey('CLAIM_SCHEDULE_BUCKET_PDA')
const destinationBucket = publicKey('UNLOCKED_BUCKET_PDA')
const [destinationQuoteTokenAccount] = findAssociatedTokenPda(umi, {
  owner: destinationBucket,
  mint: quoteMint,
})
// [/SETUP]

// [MAIN]
// Configure before finalizeV2.
await setClaimScheduleBucketV2Behaviors(umi, {
  genesisAccount,
  bucket: vestingBucket,
  authority: umi.identity,
  padding: Array(3).fill(0),
  endBehaviors: [
    {
      __kind: 'ReallocateBaseTokensOnCancel',
      processed: false,
      padding: Array(6).fill(0),
      destinationBucket,
    },
  ],
}).sendAndConfirm(umi)

// Run after finalization and after cancelClaimScheduleBucketV2 ends the bucket.
await triggerBehaviorsV2(umi, {
  genesisAccount,
  primaryBucket: vestingBucket,
  baseMint,
  quoteMint,
})
  .addRemainingAccounts([
    { pubkey: destinationBucket, isSigner: false, isWritable: true },
    {
      pubkey: destinationQuoteTokenAccount,
      isSigner: false,
      isWritable: true,
    },
  ])
  .sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// The unvested remainder is moved to the destination UnlockedBucketV2 balance.
// [/OUTPUT]
