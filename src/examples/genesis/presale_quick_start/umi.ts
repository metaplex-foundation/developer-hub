// [IMPORTS]
import {
  addPresaleBucketV2Base,
  addUnlockedBucketV2,
  createNeverCondition,
  createTimeAbsoluteCondition,
  finalizeV2,
  findGenesisAccountV2Pda,
  findPresaleBucketV2Pda,
  findUnlockedBucketV2Pda,
  genesis,
  initializeV2,
  setPresaleBucketV2Behaviors,
} from '@metaplex-foundation/genesis'
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox'
import { generateSigner, keypairIdentity, sol } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
// 'confirmed' makes each transaction's simulation see the previous one;
// the RPC default, 'finalized', lags behind and can reject back-to-back steps.
const umi = createUmi('https://api.mainnet-beta.solana.com', { commitment: 'confirmed' })
  .use(mplToolbox())
  .use(genesis())

// umi.use(keypairIdentity(yourKeypair))
// [/SETUP]

// [MAIN]
const baseMint = generateSigner(umi)
const TOTAL_SUPPLY = 1_000_000_000_000_000n // 1 million tokens (9 decimals)

// 1. Initialize the Genesis account and mint the supply to it
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

// 2. Timing
const now = BigInt(Math.floor(Date.now() / 1000))
const depositStart = now + 60n
const depositEnd = now + 86400n // 24 hours
const claimStart = depositEnd + 1n
const claimEnd = claimStart + 604800n // 1 week

const [presaleBucket] = findPresaleBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })
const [unlockedBucket] = findUnlockedBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })

// 3. Presale bucket: the 100 SOL cap fixes the price (allocation / cap)
await addPresaleBucketV2Base(umi, {
  genesisAccount,
  baseMint: baseMint.publicKey,
  baseTokenAllocation: TOTAL_SUPPLY,
  allocationQuoteTokenCap: sol(100).basisPoints,
  depositStartCondition: createTimeAbsoluteCondition(depositStart),
  depositEndCondition: createTimeAbsoluteCondition(depositEnd),
  claimStartCondition: createTimeAbsoluteCondition(claimStart),
  claimEndCondition: createTimeAbsoluteCondition(claimEnd),
}).sendAndConfirm(umi)

// Send all collected SOL to the Unlocked bucket after the sale ends
await setPresaleBucketV2Behaviors(umi, {
  genesisAccount,
  bucket: presaleBucket,
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

// 4. Unlocked bucket: receives the collected SOL
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

// 5. Finalize with every bucket as a read-only remaining account
await finalizeV2(umi, {
  baseMint: baseMint.publicKey,
  genesisAccount,
})
  .addRemainingAccounts(
    [presaleBucket, unlockedBucket].map((pubkey) => ({ pubkey, isSigner: false, isWritable: false }))
  )
  .sendAndConfirm(umi)

console.log('Presale active!')
console.log('Token:', baseMint.publicKey)
console.log('Genesis:', genesisAccount)
// [/MAIN]

// [OUTPUT]
// Presale active!
// Token: <TOKEN_MINT>
// Genesis: <GENESIS_ACCOUNT>
// [/OUTPUT]
