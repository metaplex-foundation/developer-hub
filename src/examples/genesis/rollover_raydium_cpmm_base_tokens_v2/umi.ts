// [IMPORTS]
import {
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
// The Raydium bucket was created with this end behavior:
// {
//   __kind: 'BaseTokenRollover',
//   padding: Array(4).fill(0),
//   destinationBucket: treasuryBucket,
//   percentageBps: 10000, // 100% of unused base tokens
//   processed: false,
// }
const [raydiumBucket] = findRaydiumCpmmBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })
const [treasuryBucket] = findUnlockedBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })
const [treasuryQuoteTokenAccount] = findAssociatedTokenPda(umi, {
  owner: treasuryBucket,
  mint: WRAPPED_SOL_MINT,
})

// Runs after graduation: moves base tokens the pool did not need to the treasury
await triggerBehaviorsV2(umi, {
  genesisAccount,
  primaryBucket: raydiumBucket,
  baseMint,
})
  .addRemainingAccounts([
    { pubkey: treasuryBucket, isSigner: false, isWritable: true },
    { pubkey: treasuryQuoteTokenAccount, isSigner: false, isWritable: true },
  ])
  .sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// Unused Raydium base tokens are credited to the treasury Unlocked bucket.
// [/OUTPUT]
