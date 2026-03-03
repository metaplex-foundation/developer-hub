// [IMPORTS]
import {
  genesis,
  triggerBehaviorsV2,
  WRAPPED_SOL_MINT,
} from '@metaplex-foundation/genesis'
import {
  findAssociatedTokenPda,
  mplToolbox,
} from '@metaplex-foundation/mpl-toolbox'
import { publicKey } from '@metaplex-foundation/umi'
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
const unlockedBucketQuoteTokenAccount = findAssociatedTokenPda(umi, {
  owner: unlockedBucket,
  mint: WRAPPED_SOL_MINT,
})

await triggerBehaviorsV2(umi, {
  genesisAccount,
  primaryBucket: presaleBucket,
  baseMint,
})
  .addRemainingAccounts([
    { pubkey: publicKey(unlockedBucket), isSigner: false, isWritable: true },
    { pubkey: publicKey(unlockedBucketQuoteTokenAccount), isSigner: false, isWritable: true },
  ])
  .sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// [/OUTPUT]
