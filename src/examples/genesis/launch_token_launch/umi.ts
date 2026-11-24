// [IMPORTS]
import { readFileSync } from 'fs'
import {
  addLaunchPoolBucketV2Base,
  addUnlockedBucketV2,
  createNeverCondition,
  createTimeAbsoluteCondition,
  finalizeV2,
  findGenesisAccountV2Pda,
  findLaunchPoolBucketV2Pda,
  findUnlockedBucketV2Pda,
  genesis,
  initializeV2,
  setLaunchPoolBucketV2Behaviors,
} from '@metaplex-foundation/genesis'
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox'
import { generateSigner, keypairIdentity } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
// 'confirmed' makes each transaction's simulation see the previous one;
// the RPC default, 'finalized', lags behind and can reject back-to-back steps.
const umi = createUmi('https://api.devnet.solana.com', { commitment: 'confirmed' })
  .use(mplToolbox())
  .use(genesis())

// Load your wallet keypair from a file on your machine, for example the
// Solana CLI wallet at ~/.config/solana/id.json. It needs SOL for fees.
const walletFile = '/path/to/your/keypair.json' // <-- UPDATE THIS PATH
const secretKey = JSON.parse(readFileSync(walletFile, 'utf-8'))
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey))
umi.use(keypairIdentity(keypair))
// [/SETUP]

// [MAIN]
async function main() {
  // Token details
  const TOKEN_NAME = 'My Token'
  const TOKEN_SYMBOL = 'MTK'
  const TOKEN_URI = 'https://example.com/metadata.json' // Your metadata JSON URL
  const TOTAL_SUPPLY = 1_000_000_000_000n // 1,000 tokens at 9 decimals (adjust as needed)

  // Timing (in seconds from now)
  const DEPOSIT_DURATION = 24n * 60n * 60n // 24 hours
  const CLAIM_DURATION = 7n * 24n * 60n * 60n // 7 days

  const now = BigInt(Math.floor(Date.now() / 1000))
  const depositStart = now
  const depositEnd = now + DEPOSIT_DURATION
  const claimStart = depositEnd + 1n
  const claimEnd = claimStart + CLAIM_DURATION

  // Step 1: Create your token and the Genesis account that holds its supply
  console.log('Step 1: Creating token...')
  const baseMint = generateSigner(umi)
  const [genesisAccount] = findGenesisAccountV2Pda(umi, {
    baseMint: baseMint.publicKey,
    genesisIndex: 0,
  })

  await initializeV2(umi, {
    baseMint,
    fundingMode: 0,
    totalSupplyBaseToken: TOTAL_SUPPLY,
    name: TOKEN_NAME,
    symbol: TOKEN_SYMBOL,
    uri: TOKEN_URI,
  }).sendAndConfirm(umi)

  // Derive both bucket addresses up front so they can reference each other
  const [launchPoolBucket] = findLaunchPoolBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })
  const [unlockedBucket] = findUnlockedBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })

  // Step 2: Add the Launch Pool bucket, where users deposit SOL
  console.log('Step 2: Adding Launch Pool bucket...')
  await addLaunchPoolBucketV2Base(umi, {
    genesisAccount,
    baseMint: baseMint.publicKey,
    baseTokenAllocation: TOTAL_SUPPLY,
    depositStartCondition: createTimeAbsoluteCondition(depositStart),
    depositEndCondition: createTimeAbsoluteCondition(depositEnd),
    claimStartCondition: createTimeAbsoluteCondition(claimStart),
    claimEndCondition: createTimeAbsoluteCondition(claimEnd),
  }).sendAndConfirm(umi)

  // Send 100% of the collected SOL to the Unlocked bucket after deposits close
  await setLaunchPoolBucketV2Behaviors(umi, {
    genesisAccount,
    bucket: launchPoolBucket,
    padding: Array(3).fill(0),
    endBehaviors: [
      {
        __kind: 'SendQuoteTokenPercentage',
        padding: Array(4).fill(0),
        destinationBucket: unlockedBucket,
        percentageBps: 10_000,
        processed: false,
      },
    ],
  }).sendAndConfirm(umi)

  // Step 3: Add the Unlocked bucket, which receives the collected SOL for your team
  console.log('Step 3: Adding Unlocked bucket...')
  await addUnlockedBucketV2(umi, {
    genesisAccount,
    baseMint: baseMint.publicKey,
    baseTokenAllocation: 0n,
    recipient: umi.identity.publicKey,
    claimStartCondition: createTimeAbsoluteCondition(claimStart),
    // Never closes, so SOL and tokens sent here later stay claimable
    claimEndCondition: createNeverCondition(),
    backendSigner: null,
  }).sendAndConfirm(umi)

  // Step 4: Finalize, which activates the launch. Every bucket must be passed.
  console.log('Step 4: Finalizing...')
  await finalizeV2(umi, {
    baseMint: baseMint.publicKey,
    genesisAccount,
  })
    .addRemainingAccounts(
      [launchPoolBucket, unlockedBucket].map((pubkey) => ({ pubkey, isSigner: false, isWritable: false }))
    )
    .sendAndConfirm(umi)

  console.log('\nLaunch is active. Save these addresses:')
  console.log('Token mint:', baseMint.publicKey)
  console.log('Genesis account:', genesisAccount)
  console.log('Launch Pool bucket:', launchPoolBucket)
  console.log('Unlocked bucket:', unlockedBucket)
  console.log('Deposits close:', new Date(Number(depositEnd) * 1000).toISOString())
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
// [/MAIN]

// [OUTPUT]
// Step 1: Creating token...
// Step 2: Adding Launch Pool bucket...
// Step 3: Adding Unlocked bucket...
// Step 4: Finalizing...
//
// Launch is active. Save these addresses:
// Token mint: <TOKEN_MINT>
// Genesis account: <GENESIS_ACCOUNT>
// Launch Pool bucket: <LAUNCH_POOL_BUCKET>
// Unlocked bucket: <UNLOCKED_BUCKET>
// Deposits close: 2026-11-26T09:00:00.000Z
// [/OUTPUT]
