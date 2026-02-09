// [IMPORTS]
import {
  genesis,
  withdrawLaunchPoolV2,
} from '@metaplex-foundation/genesis'
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox'
import { keypairIdentity, sol } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplToolbox())
  .use(genesis())

// umi.use(keypairIdentity(yourKeypair));

// Assumes genesisAccount, launchPoolBucket, and baseMint from previous steps.
// [/SETUP]

// [MAIN]
await withdrawLaunchPoolV2(umi, {
  genesisAccount,
  bucket: launchPoolBucket,
  baseMint: baseMint.publicKey,
  amountQuoteToken: sol(3).basisPoints,
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// [/OUTPUT]
