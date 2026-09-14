// [IMPORTS]
import {
  claimClaimScheduleV2,
  findClaimScheduleBucketV2Pda,
  genesis,
} from '@metaplex-foundation/genesis'
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com').use(genesis())

// umi.use(keypairIdentity(yourKeypair))

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT')
const baseMint = publicKey('YOUR_PROJECT_TOKEN_MINT')
const recipient = publicKey('VESTING_RECIPIENT')
const [vestingBucket] = findClaimScheduleBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
})
// [/SETUP]

// [MAIN]
await claimClaimScheduleV2(umi, {
  genesisAccount,
  bucket: vestingBucket,
  baseMint,
  recipient,
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// All currently vested, unclaimed tokens are sent to the stored recipient.
// [/OUTPUT]
