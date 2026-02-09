// [IMPORTS]
import {
  addUnlockedBucketV2,
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

// Assumes genesisAccount, baseMint, claimStart, and claimEnd from previous steps.
// [/SETUP]

// [MAIN]
await addUnlockedBucketV2(umi, {
  genesisAccount,
  baseMint: baseMint.publicKey,
  baseTokenAllocation: 0n,
  recipient: umi.identity.publicKey,
  claimStartCondition: {
    __kind: 'TimeAbsolute',
    padding: Array(47).fill(0),
    time: claimStart,
    triggeredTimestamp: null,
  },
  claimEndCondition: {
    __kind: 'TimeAbsolute',
    padding: Array(47).fill(0),
    time: claimEnd,
    triggeredTimestamp: null,
  },
  backendSigner: null,
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// [/OUTPUT]
