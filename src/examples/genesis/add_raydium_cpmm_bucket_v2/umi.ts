// [IMPORTS]
import {
  addRaydiumCpmmBucketV2,
  createTimeAbsoluteCondition,
  createNeverCondition,
  createTriggeredCondition,
  findLaunchPoolBucketV2Pda,
  findRaydiumCpmmBucketV2Pda,
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

// umi.use(keypairIdentity(yourKeypair))

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT')
const baseMint = publicKey('YOUR_PROJECT_TOKEN_MINT')
const depositEnd = 1767225600n // Launch Pool depositEndCondition time (Unix seconds)
// [/SETUP]

// [MAIN]
const [launchPoolBucket] = findLaunchPoolBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })
const [raydiumBucket] = findRaydiumCpmmBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })

const DAY = 86_400n

await addRaydiumCpmmBucketV2(umi, {
  genesisAccount,
  baseMint,
  bucketIndex: 0,

  // Base tokens reserved for the pool. Size it to the Launch Pool allocation
  // multiplied by the share of proceeds sent here (20% in this example).
  baseTokenAllocation: 120_000_000_000_000n, // 120,000 tokens at 9 decimals

  // Earliest time graduateToRaydiumCpmmV2 can run
  startCondition: createTimeAbsoluteCondition(depositEnd),

  // Lock LP tokens for one year with quarterly unlocks, starting at graduation.
  // The program fires a Triggered start condition when the pool is created.
  lpLockSchedule: {
    startCondition: createTriggeredCondition(),
    duration: 365n * DAY,
    period: 365n * DAY / 4n,
    cliffCondition: createNeverCondition(),
    cliffAmountBps: 0,
    reserved: Array(126).fill(0),
  },
  lpClaimAuthority: null, // null = the Genesis authority claims unlocked LP tokens
  burnLp: false, // true burns all LP at graduation (cannot be combined with lpLockSchedule)

  creatorFee: null, // or { wallet } to receive a share of Raydium creator fees
  postponableStart: null,
  backendSigner: null,

  // false: the payer pre-funds pool creation (rent + 0.15 SOL Raydium fee) now
  deferPoolCreationCost: false,
  endBehaviors: [],
}).sendAndConfirm(umi)

console.log('Raydium CPMM bucket:', raydiumBucket)
console.log('Funded by Launch Pool:', launchPoolBucket)
// [/MAIN]

// [OUTPUT]
// Raydium CPMM bucket: <RAYDIUM_CPMM_BUCKET_PDA>
// Funded by Launch Pool: <LAUNCH_POOL_BUCKET_PDA>
// [/OUTPUT]
