// [IMPORTS]
import {
  addClaimScheduleBucketV2,
  addLaunchPoolBucketV2Base,
  addLaunchPoolBucketV2Extensions,
  addRaydiumCpmmBucketV2,
  addUnlockedBucketV2,
  BucketTimes,
  createNeverCondition,
  createTimeAbsoluteCondition,
  createTimeRelativeCondition,
  createTriggeredCondition,
  finalizeV2,
  findClaimScheduleBucketV2Pda,
  findGenesisAccountV2Pda,
  findLaunchPoolBucketV2Pda,
  findRaydiumCpmmBucketV2Pda,
  findUnlockedBucketV2Pda,
  genesis,
  initializeV2,
  setLaunchPoolBucketV2Behaviors,
} from '@metaplex-foundation/genesis'
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox'
import { generateSigner, keypairIdentity, publicKey, sol } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
// 'confirmed' makes each transaction's simulation see the previous one;
// the RPC default, 'finalized', lags behind and can reject back-to-back steps.
const umi = createUmi('https://api.mainnet-beta.solana.com', { commitment: 'confirmed' })
  .use(mplToolbox())
  .use(genesis())

// umi.use(keypairIdentity(yourKeypair))

const teamWallet = publicKey('TEAM_VESTING_RECIPIENT')
const treasuryWallet = publicKey('TREASURY_WALLET')
// [/SETUP]

// [MAIN]
const DAY = 86_400n
const TOKEN = 1_000_000_000n // 1 token at 9 decimals

// Allocations must add up to the total supply exactly before finalizeV2
const TOTAL_SUPPLY = 1_000_000n * TOKEN
const LAUNCH_POOL_ALLOCATION = 600_000n * TOKEN // sold to depositors
const RAYDIUM_ALLOCATION = 120_000n * TOKEN // 20% of proceeds x Launch Pool price
const TREASURY_ALLOCATION = 80_000n * TOKEN // unlocked at graduation
const TEAM_ALLOCATION = 200_000n * TOKEN // vested for one year after graduation

// 1. Initialize the Genesis account and mint the full supply to it
const baseMint = generateSigner(umi)
const [genesisAccount] = findGenesisAccountV2Pda(umi, {
  baseMint: baseMint.publicKey,
  genesisIndex: 0,
})

await initializeV2(umi, {
  baseMint,
  fundingMode: 0,
  totalSupplyBaseToken: TOTAL_SUPPLY,
  name: 'My Token',
  symbol: 'MTK',
  uri: 'https://example.com/metadata.json',
}).sendAndConfirm(umi)

// 2. Derive every bucket address up front so buckets can reference each other
const [launchPoolBucket] = findLaunchPoolBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })
const [raydiumBucket] = findRaydiumCpmmBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })
const [treasuryBucket] = findUnlockedBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })
const [teamBucket] = findClaimScheduleBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })

const now = BigInt(Math.floor(Date.now() / 1000))
const depositStart = now + 1n * DAY
const depositEnd = depositStart + 3n * DAY

// Every claim below opens relative to the Raydium graduation time
const atGraduation = (offset = 0n) =>
  createTimeRelativeCondition(raydiumBucket, BucketTimes.Graduate, offset)

// 3. Launch Pool: 3-day deposit window, claims open at graduation.
//    Configured in three transactions, because all of its options together
//    exceed Solana's transaction size limit.
await addLaunchPoolBucketV2Base(umi, {
  genesisAccount,
  baseMint: baseMint.publicKey,
  bucketIndex: 0,
  baseTokenAllocation: LAUNCH_POOL_ALLOCATION,
  depositStartCondition: createTimeAbsoluteCondition(depositStart),
  depositEndCondition: createTimeAbsoluteCondition(depositEnd),
  claimStartCondition: atGraduation(),
  claimEndCondition: createTimeAbsoluteCondition(depositEnd + 365n * DAY),
}).sendAndConfirm(umi)

await addLaunchPoolBucketV2Extensions(umi, {
  genesisAccount,
  bucket: launchPoolBucket,
  padding: Array(3).fill(0),
  extensions: [
    { __kind: 'MinimumDepositAmount', minimumDepositAmount: { amount: sol(0.1).basisPoints } },
  ],
}).sendAndConfirm(umi)

await setLaunchPoolBucketV2Behaviors(umi, {
  genesisAccount,
  bucket: launchPoolBucket,
  padding: Array(3).fill(0),
  endBehaviors: [
    // 20% of proceeds and the start price go to the Raydium CPMM bucket
    {
      __kind: 'SendQuoteTokenPercentage',
      padding: Array(4).fill(0),
      destinationBucket: raydiumBucket,
      percentageBps: 2_000,
      processed: false,
    },
    {
      __kind: 'SendStartPrice',
      padding: Array(6).fill(0),
      destinationBucket: raydiumBucket,
      processed: false,
    },
    // The remaining 80% goes to the treasury Unlocked bucket
    {
      __kind: 'SendQuoteTokenPercentage',
      padding: Array(4).fill(0),
      destinationBucket: treasuryBucket,
      percentageBps: 8_000,
      processed: false,
    },
  ],
}).sendAndConfirm(umi)

// 4. Raydium CPMM bucket: graduation opens when deposits close
await addRaydiumCpmmBucketV2(umi, {
  genesisAccount,
  baseMint: baseMint.publicKey,
  bucketIndex: 0,
  baseTokenAllocation: RAYDIUM_ALLOCATION,
  startCondition: createTimeAbsoluteCondition(depositEnd),
  lpLockSchedule: {
    startCondition: createTriggeredCondition(), // fired at graduation
    duration: 365n * DAY,
    period: 365n * DAY / 4n, // quarterly unlocks
    cliffCondition: createNeverCondition(),
    cliffAmountBps: 0,
    reserved: Array(126).fill(0),
  },
  lpClaimAuthority: null,
  deferPoolCreationCost: false,
  endBehaviors: [
    // After graduation, any base tokens the pool did not need go to the treasury
    {
      __kind: 'BaseTokenRollover',
      padding: Array(4).fill(0),
      destinationBucket: treasuryBucket,
      percentageBps: 10_000,
      processed: false,
    },
  ],
}).sendAndConfirm(umi)

// 5. Treasury Unlocked bucket: receives 80% of proceeds, claimable at graduation.
//    A Never end condition keeps late rollover credits claimable.
await addUnlockedBucketV2(umi, {
  genesisAccount,
  baseMint: baseMint.publicKey,
  bucketIndex: 0,
  baseTokenAllocation: TREASURY_ALLOCATION,
  recipient: treasuryWallet,
  claimStartCondition: atGraduation(),
  claimEndCondition: createNeverCondition(),
  backendSigner: null,
}).sendAndConfirm(umi)

// 6. Team vesting: 10% cliff 90 days after graduation, then monthly linear unlocks
await addClaimScheduleBucketV2(umi, {
  genesisAccount,
  baseMint: baseMint.publicKey,
  authority: umi.identity,
  recipient: teamWallet,
  bucketIndex: 0,
  baseTokenAllocation: TEAM_ALLOCATION,
  claimStartCondition: atGraduation(),
  claimSchedule: {
    startCondition: atGraduation(),
    duration: 365n * DAY,
    period: 30n * DAY,
    cliffCondition: atGraduation(90n * DAY),
    cliffAmountBps: 1_000,
    reserved: Array(126).fill(0),
  },
  backendSigner: null,
  endBehaviors: [],
}).sendAndConfirm(umi)

// 7. Finalize: locks the configuration and opens the launch.
//    Every bucket must be passed so the program can validate the whole launch.
await finalizeV2(umi, {
  genesisAccount,
  baseMint: baseMint.publicKey,
})
  .addRemainingAccounts(
    [launchPoolBucket, raydiumBucket, treasuryBucket, teamBucket].map((pubkey) => ({
      pubkey,
      isSigner: false,
      isWritable: false,
    }))
  )
  .sendAndConfirm(umi)

console.log('Genesis account:', genesisAccount)
console.log('Base mint:', baseMint.publicKey)
// [/MAIN]

// [OUTPUT]
// Genesis account: <GENESIS_ACCOUNT_PDA>
// Base mint: <BASE_MINT_ADDRESS>
// [/OUTPUT]
