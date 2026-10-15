// [IMPORTS]
import {
  genesis,
  transferRecipientClaimScheduleBucketV2,
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
await transferRecipientClaimScheduleBucketV2(umi, {
  genesisAccount,
  bucket: vestingBucket,
  signer: umi.identity,
  newRecipient: publicKey('NEW_RECIPIENT'),
  padding: Array(7).fill(0),
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// Future claims are sent to the new stored recipient.
// [/OUTPUT]
