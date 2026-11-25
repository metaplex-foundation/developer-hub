// [IMPORTS]
import {
  genesis,
  finalizeV2,
} from '@metaplex-foundation/genesis'
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox'
import { keypairIdentity } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplToolbox())
  .use(genesis())

// umi.use(keypairIdentity(yourKeypair));

// Assumes genesisAccount, baseMint, and the launchPoolBucket and unlockedBucket from previous steps.
// [/SETUP]

// [MAIN]
// finalizeV2 needs every bucket of the launch as a read-only remaining account.
const buckets = [launchPoolBucket, unlockedBucket]

await finalizeV2(umi, {
  baseMint: baseMint.publicKey,
  genesisAccount,
})
  .addRemainingAccounts(buckets.map((pubkey) => ({ pubkey, isSigner: false, isWritable: false })))
  .sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// [/OUTPUT]
