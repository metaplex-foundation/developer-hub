// [IMPORTS]
import {
  genesis,
  setClaimSchedulePausedStateV2,
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
await setClaimSchedulePausedStateV2(umi, {
  genesisAccount,
  bucket: vestingBucket,
  signer: umi.identity,
  paused: true,
  padding: Array(6).fill(0),
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// Set paused to false and send again to resume vesting.
// [/OUTPUT]
