// [IMPORTS]
import {
  genesis,
  transitionV2,
  WRAPPED_SOL_MINT,
} from '@metaplex-foundation/genesis'
import {
  findAssociatedTokenPda,
  mplToolbox,
} from '@metaplex-foundation/mpl-toolbox'
import { keypairIdentity } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplToolbox())
  .use(genesis())

// umi.use(keypairIdentity(yourKeypair));

// Assumes genesisAccount, presaleBucket, unlockedBucket, and baseMint from previous steps.
// [/SETUP]

// [MAIN]
const [unlockedBucketQuoteTokenAccount] = findAssociatedTokenPda(umi, {
  owner: unlockedBucket,
  mint: WRAPPED_SOL_MINT,
})

await transitionV2(umi, {
  genesisAccount,
  primaryBucket: presaleBucket,
  baseMint: baseMint.publicKey,
})
  .addRemainingAccounts([
    { pubkey: unlockedBucket, isSigner: false, isWritable: true },
    { pubkey: unlockedBucketQuoteTokenAccount, isSigner: false, isWritable: true },
  ])
  .sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// [/OUTPUT]
