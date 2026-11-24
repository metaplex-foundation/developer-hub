// [IMPORTS]
import {
  fetchUnlockedBucketV2,
  findUnlockedBucketV2Pda,
  genesis,
  setBucketBackendSignerV2,
} from '@metaplex-foundation/genesis'
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox'
import { defaultPublicKey, keypairIdentity, publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplToolbox())
  .use(genesis())

// The identity must be the Genesis authority.
// umi.use(keypairIdentity(yourKeypair))

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT')
const newBackendSigner = publicKey('NEW_BACKEND_SIGNER')
// [/SETUP]

// [MAIN]
const [treasuryBucket] = findUnlockedBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })

// Rotate the bucket's backend signer to a new key. Rotating or clearing an
// existing signer also works after finalizeV2; adding one to a bucket that
// never had one is only allowed before finalizeV2.
await setBucketBackendSignerV2(umi, {
  genesisAccount,
  bucket: treasuryBucket,
  backendSigner: newBackendSigner,
}).sendAndConfirm(umi)

const bucket = await fetchUnlockedBucketV2(umi, treasuryBucket, { commitment: 'confirmed' })
console.log('Backend signer:', bucket.extensions.backendSigner)

// To remove the requirement entirely, pass the default (all-zero) key:
// await setBucketBackendSignerV2(umi, {
//   genesisAccount,
//   bucket: treasuryBucket,
//   backendSigner: defaultPublicKey(),
// }).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// Backend signer: <NEW_BACKEND_SIGNER>
// [/OUTPUT]
