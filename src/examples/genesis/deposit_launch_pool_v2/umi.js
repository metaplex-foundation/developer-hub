// [IMPORTS]
import {
  genesis,
  depositLaunchPoolV2,
  findLaunchPoolDepositV2Pda,
  fetchLaunchPoolDepositV2,
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
await depositLaunchPoolV2(umi, {
  genesisAccount,
  bucket: launchPoolBucket,
  baseMint: baseMint.publicKey,
  amountQuoteToken: sol(10).basisPoints,
}).sendAndConfirm(umi)

// Verify
const [depositPda] = findLaunchPoolDepositV2Pda(umi, {
  bucket: launchPoolBucket,
  recipient: umi.identity.publicKey,
})
const deposit = await fetchLaunchPoolDepositV2(umi, depositPda)
// [/MAIN]

// [OUTPUT]
console.log('Deposited (after fee):', deposit.amountQuoteToken)
// [/OUTPUT]
