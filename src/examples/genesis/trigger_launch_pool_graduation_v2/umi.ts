// [IMPORTS]
import {
  findLaunchPoolBucketV2Pda,
  findRaydiumBucketSignerPda,
  findRaydiumCpmmBucketV2Pda,
  findUnlockedBucketV2Pda,
  genesis,
  triggerBehaviorsV2,
  WRAPPED_SOL_MINT,
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
// [/SETUP]

// [MAIN]
const [launchPoolBucket] = findLaunchPoolBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })
const [raydiumBucket] = findRaydiumCpmmBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })
const [treasuryBucket] = findUnlockedBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })

// A Raydium bucket's quote tokens live in an ATA owned by its bucket signer PDA.
const [raydiumBucketSigner] = findRaydiumBucketSignerPda(umi, { bucket: raydiumBucket })
const [raydiumQuoteTokenAccount] = findAssociatedTokenPda(umi, {
  owner: raydiumBucketSigner,
  mint: WRAPPED_SOL_MINT,
})
// An Unlocked bucket's quote tokens live in an ATA owned by the bucket itself.
const [treasuryQuoteTokenAccount] = findAssociatedTokenPda(umi, {
  owner: treasuryBucket,
  mint: WRAPPED_SOL_MINT,
})

// Runs every unprocessed end behavior on the Launch Pool:
// SendQuoteTokenPercentage (20% to Raydium, 80% to treasury) and SendStartPrice.
await triggerBehaviorsV2(umi, {
  genesisAccount,
  primaryBucket: launchPoolBucket,
  baseMint,
})
  .addRemainingAccounts([
    // One (bucket, quote token account) pair per destination bucket
    { pubkey: raydiumBucket, isSigner: false, isWritable: true },
    { pubkey: raydiumQuoteTokenAccount, isSigner: false, isWritable: true },
    { pubkey: treasuryBucket, isSigner: false, isWritable: true },
    { pubkey: treasuryQuoteTokenAccount, isSigner: false, isWritable: true },
  ])
  .sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// Launch Pool proceeds are split between the Raydium CPMM bucket and the treasury,
// and the Raydium bucket now stores the graduation start price.
// [/OUTPUT]
