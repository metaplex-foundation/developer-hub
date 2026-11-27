// [IMPORTS]
import {
  addUnlockedBucketV2,
  BucketTimes,
  createNeverCondition,
  createTimeRelativeCondition,
  findRaydiumCpmmBucketV2Pda,
  findUnlockedBucketV2Pda,
  genesis,
} from '@metaplex-foundation/genesis'
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox'
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplToolbox())
  .use(genesis())

// The identity must be the Genesis authority, before finalizeV2.
// umi.use(keypairIdentity(yourKeypair))

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT')
const baseMint = publicKey('YOUR_PROJECT_TOKEN_MINT')
const treasuryWallet = publicKey('TREASURY_WALLET')
// [/SETUP]

// [MAIN]
// The Raydium CPMM bucket can be added before or after this one; its PDA is
// all the claim start needs.
const [raydiumBucket] = findRaydiumCpmmBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })
const [treasuryBucket] = findUnlockedBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })

await addUnlockedBucketV2(umi, {
  genesisAccount,
  baseMint,
  bucketIndex: 0,
  baseTokenAllocation: 80_000_000_000_000n, // 80,000 tokens at 9 decimals; use 0n for a SOL-only treasury
  recipient: treasuryWallet,
  // Claims open when the Raydium pool is created
  claimStartCondition: createTimeRelativeCondition(raydiumBucket, BucketTimes.Graduate),
  // Never closes, so late rollover credits stay claimable
  claimEndCondition: createNeverCondition(),
  backendSigner: null,
}).sendAndConfirm(umi)

console.log('Treasury bucket:', treasuryBucket)
// [/MAIN]

// [OUTPUT]
// Treasury bucket: <UNLOCKED_BUCKET_PDA>
// [/OUTPUT]
