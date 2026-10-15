// [IMPORTS]
import {
  cancelClaimScheduleBucketV2,
  genesis,
} from '@metaplex-foundation/genesis'
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com').use(genesis())

// umi.use(keypairIdentity(yourKeypair))

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT')
const vestingBucket = publicKey('CLAIM_SCHEDULE_BUCKET_PDA')
// [/SETUP]

// [MAIN]
await cancelClaimScheduleBucketV2(umi, {
  genesisAccount,
  bucket: vestingBucket,
  signer: umi.identity,
  padding: Array(7).fill(0),
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// Vesting is frozen, but the recipient can still claim the vested remainder.
// [/OUTPUT]
