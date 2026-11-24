// [IMPORTS]
import {
  addUnlockedBucketV2,
  createNeverCondition,
  createTimeAbsoluteCondition,
  genesis,
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

// Assumes genesisAccount, baseMint, and claimStart from previous steps.
// [/SETUP]

// [MAIN]
await addUnlockedBucketV2(umi, {
  genesisAccount,
  baseMint: baseMint.publicKey,
  baseTokenAllocation: 0n,
  recipient: umi.identity.publicKey,
  claimStartCondition: createTimeAbsoluteCondition(claimStart),
  // An Unlocked bucket that receives tokens from end behaviors (here the
  // raised SOL) should never close, so late credits stay claimable.
  claimEndCondition: createNeverCondition(),
  backendSigner: null,
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// [/OUTPUT]
