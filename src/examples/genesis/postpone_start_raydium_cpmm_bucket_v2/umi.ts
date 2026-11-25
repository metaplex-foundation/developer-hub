// [IMPORTS]
import {
  findRaydiumCpmmBucketV2Pda,
  genesis,
  postponeStartRaydiumCpmmBucketV2,
} from '@metaplex-foundation/genesis'
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox'
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplToolbox())
  .use(genesis())

// The identity must be the Genesis authority.
// umi.use(keypairIdentity(yourKeypair))

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT')
// [/SETUP]

// [MAIN]
const [raydiumBucket] = findRaydiumCpmmBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })

// For a TimeAbsolute start, newStartValue is the new Unix timestamp.
// For a TimeRelative start, it is the new offset in seconds and the
// referenced sale bucket must be passed as sourceBucket.
const newGraduationTime = BigInt(Math.floor(Date.now() / 1000)) + 2n * 86_400n

await postponeStartRaydiumCpmmBucketV2(umi, {
  genesisAccount,
  bucket: raydiumBucket,
  padding: Array(7).fill(0),
  newStartValue: newGraduationTime,
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// The Raydium bucket's startCondition now opens graduation at the new time.
// [/OUTPUT]
