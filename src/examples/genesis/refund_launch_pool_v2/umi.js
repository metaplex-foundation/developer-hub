// [IMPORTS]
import {
  genesis,
  refundLaunchPoolV2,
} from '@metaplex-foundation/genesis'
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplToolbox())
  .use(genesis())

// umi.use(keypairIdentity(yourKeypair));

// Assumes genesisAccount, launchPoolBucket, and baseMint from previous steps.
// Only valid after the deposit window closed AND either the
// minimumQuoteTokenThreshold was missed or the softCap was exceeded.
// [/SETUP]

// [MAIN]
// The program computes the refundable amount, so there is no amount argument.
// A missed threshold refunds the full deposit; an exceeded soft cap refunds
// only the excess, leaving the depositor's token allocation intact.
await refundLaunchPoolV2(umi, {
  genesisAccount,
  bucket: launchPoolBucket,
  baseMint: baseMint.publicKey,
  recipient: umi.identity.publicKey,
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// [/OUTPUT]
