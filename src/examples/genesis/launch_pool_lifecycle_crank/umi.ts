// [IMPORTS]
import {
  deriveRaydiumPDAsV2,
  fetchClaimScheduleBucketV2,
  fetchLaunchPoolBucketV2,
  fetchRaydiumCpmmBucketV2,
  fetchUnlockedBucketV2,
  findClaimScheduleBucketV2Pda,
  findLaunchPoolBucketV2Pda,
  findRaydiumBucketSignerPda,
  findRaydiumCpmmBucketV2Pda,
  findUnlockedBucketV2Pda,
  genesis,
  graduateToRaydiumCpmmV2,
  triggerBehaviorsV2,
  triggerConditionsV2,
  WRAPPED_SOL_MINT,
  type Condition,
} from '@metaplex-foundation/genesis'
import {
  findAssociatedTokenPda,
  mplToolbox,
  setComputeUnitLimit,
} from '@metaplex-foundation/mpl-toolbox'
import { isSome, keypairIdentity, publicKey, transactionBuilder, unwrapOption } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplToolbox())
  .use(genesis())

// Any funded wallet can run this crank; no Genesis authority is required.
// umi.use(keypairIdentity(crankKeypair))

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT')
const baseMint = publicKey('YOUR_PROJECT_TOKEN_MINT')
// [/SETUP]

// [MAIN]
const [launchPoolBucket] = findLaunchPoolBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })
const [raydiumBucket] = findRaydiumCpmmBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })
const [treasuryBucket] = findUnlockedBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })
const [teamBucket] = findClaimScheduleBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })

const [raydiumSigner] = findRaydiumBucketSignerPda(umi, { bucket: raydiumBucket })
const raydiumQuoteAta = findAssociatedTokenPda(umi, { owner: raydiumSigner, mint: WRAPPED_SOL_MINT })[0]
const treasuryQuoteAta = findAssociatedTokenPda(umi, { owner: treasuryBucket, mint: WRAPPED_SOL_MINT })[0]

const triggered = (condition: Condition) => isSome(condition.triggeredTimestamp)
const nowSeconds = () => BigInt(Math.floor(Date.now() / 1000))

// Run this on an interval (for example every minute). Each step is a no-op
// until its precondition holds, and each step runs at most once.
async function crank() {
  const launchPool = await fetchLaunchPoolBucketV2(umi, launchPoolBucket, { commitment: 'confirmed' })
  const raydium = await fetchRaydiumCpmmBucketV2(umi, raydiumBucket, { commitment: 'confirmed' })
  const depositEnd = launchPool.depositEndCondition

  // Step 1 — deposits closed: move proceeds and the start price
  const depositsClosed = depositEnd.__kind === 'TimeAbsolute' && nowSeconds() >= depositEnd.time
  const behaviorsPending = launchPool.endBehaviors.some((b) => !b.processed)
  if (depositsClosed && behaviorsPending) {
    await triggerBehaviorsV2(umi, { genesisAccount, primaryBucket: launchPoolBucket, baseMint })
      .addRemainingAccounts([
        { pubkey: raydiumBucket, isSigner: false, isWritable: true },
        { pubkey: raydiumQuoteAta, isSigner: false, isWritable: true },
        { pubkey: treasuryBucket, isSigner: false, isWritable: true },
        { pubkey: treasuryQuoteAta, isSigner: false, isWritable: true },
      ])
      .sendAndConfirm(umi)
    return 'triggered Launch Pool behaviors'
  }

  // Step 2 — proceeds and price received: create the Raydium CPMM pool
  if (raydium.priceDenominator > 0n && !triggered(raydium.graduateCondition)) {
    // Pass { env: 'devnet' } on devnet
    const pools = deriveRaydiumPDAsV2(umi, baseMint, raydiumBucket)
    await transactionBuilder()
      .add(setComputeUnitLimit(umi, { units: 400_000 }))
      .add(
        graduateToRaydiumCpmmV2(umi, {
          genesisAccount,
          bucket: raydiumBucket,
          baseMint,
          quoteMint: WRAPPED_SOL_MINT,
          poolState: pools.poolState,
          ammConfig: pools.ammConfig,
          poolAuthority: pools.poolAuthority,
          lpMint: pools.lpMint,
          baseVault: pools.baseVault,
          quoteVault: pools.quoteVault,
          createPoolFee: pools.createPoolFee,
          observationState: pools.observationState,
          permission: pools.permission,
          raydiumProgram: pools.raydiumProgram,
        })
      )
      .sendAndConfirm(umi)
    return 'graduated to Raydium CPMM'
  }
  if (!triggered(raydium.graduateCondition)) return 'waiting for graduation'

  // Step 3 — graduated: roll unused Raydium base tokens into the treasury
  if (raydium.endBehaviors.some((b) => !b.processed)) {
    await triggerBehaviorsV2(umi, { genesisAccount, primaryBucket: raydiumBucket, baseMint })
      .addRemainingAccounts([
        { pubkey: treasuryBucket, isSigner: false, isWritable: true },
        { pubkey: treasuryQuoteAta, isSigner: false, isWritable: true },
      ])
      .sendAndConfirm(umi)
    return 'rolled over unused base tokens'
  }

  // Step 4 — resolve every condition that is relative to the graduation.
  // A TimeRelative condition can only resolve once Graduate + timeOffset has
  // passed, so a bucket is only cranked when one of its conditions is due.
  // The team cliff becomes due 90 days after graduation.
  const graduatedAt = unwrapOption(raydium.graduateCondition.triggeredTimestamp) ?? 0n
  const due = (condition: Condition) =>
    condition.__kind !== 'TimeRelative' || graduatedAt + condition.timeOffset <= nowSeconds()
  const needsTrigger = (condition: Condition) => !triggered(condition) && due(condition)

  const [launchPoolNow, treasury, team] = await Promise.all([
    fetchLaunchPoolBucketV2(umi, launchPoolBucket, { commitment: 'confirmed' }),
    fetchUnlockedBucketV2(umi, treasuryBucket, { commitment: 'confirmed' }),
    fetchClaimScheduleBucketV2(umi, teamBucket, { commitment: 'confirmed' }),
  ])
  const buckets = [
    { bucket: launchPoolBucket, conditions: [launchPoolNow.claimStartCondition] },
    { bucket: treasuryBucket, conditions: [treasury.claimStartCondition] },
    {
      bucket: teamBucket,
      conditions: [
        team.claimStartCondition,
        team.claimSchedule.startCondition,
        team.claimSchedule.cliffCondition,
      ],
    },
  ]
  const pending = buckets.filter(({ conditions }) => conditions.some(needsTrigger))

  for (const { bucket } of pending) {
    await triggerConditionsV2(umi, { genesisAccount, bucket, baseMint })
      .addRemainingAccounts([{ pubkey: raydiumBucket, isSigner: false, isWritable: true }])
      .sendAndConfirm(umi)
  }
  if (pending.length) return 'triggered graduation-relative conditions'
  const allTriggered = buckets.every(({ conditions }) => conditions.every(triggered))
  return allTriggered ? 'all steps complete' : 'waiting for the team cliff'
}

console.log(await crank())
// [/MAIN]

// [OUTPUT]
// triggered Launch Pool behaviors
// (next runs) graduated to Raydium CPMM → rolled over unused base tokens →
// triggered graduation-relative conditions → waiting for the team cliff →
// (90 days after graduation) triggered graduation-relative conditions → all steps complete
// [/OUTPUT]
