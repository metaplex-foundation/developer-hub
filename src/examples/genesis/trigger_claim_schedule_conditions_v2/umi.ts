// [IMPORTS]
import { genesis, triggerConditionsV2 } from '@metaplex-foundation/genesis'
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com').use(genesis())

// umi.use(keypairIdentity(yourKeypair))

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT')
const baseMint = publicKey('YOUR_PROJECT_TOKEN_MINT')
const vestingBucket = publicKey('CLAIM_SCHEDULE_BUCKET_PDA')
const referenceBucket = publicKey('REFERENCE_BUCKET_PDA')
// [/SETUP]

// [MAIN]
await triggerConditionsV2(umi, {
  genesisAccount,
  bucket: vestingBucket,
  baseMint,
})
  .addRemainingAccounts([
    { pubkey: referenceBucket, isSigner: false, isWritable: true },
  ])
  .sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// Eligible TimeRelative conditions on the vesting bucket are now triggered.
// [/OUTPUT]
