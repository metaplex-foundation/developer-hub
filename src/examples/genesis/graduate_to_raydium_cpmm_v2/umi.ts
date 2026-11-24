// [IMPORTS]
import {
  deriveRaydiumPDAsV2,
  fetchRaydiumCpmmBucketV2,
  findRaydiumCpmmBucketV2Pda,
  genesis,
  graduateToRaydiumCpmmV2,
  WRAPPED_SOL_MINT,
} from '@metaplex-foundation/genesis'
import { mplToolbox, setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'
import { keypairIdentity, publicKey, transactionBuilder } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplToolbox())
  .use(genesis())

// umi.use(keypairIdentity(yourKeypair))

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT')
const baseMint = publicKey('YOUR_PROJECT_TOKEN_MINT')
// [/SETUP]

// [MAIN]
const [raydiumBucket] = findRaydiumCpmmBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })

// Derive every Raydium CP-Swap account for this pool. Pass { env: 'devnet' }
// on devnet, and { creatorFee: true } if the bucket has the creatorFee extension.
const raydium = deriveRaydiumPDAsV2(umi, baseMint, raydiumBucket, {
  quoteMint: WRAPPED_SOL_MINT,
  env: 'mainnet',
})

await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 400_000 }))
  .add(
    graduateToRaydiumCpmmV2(umi, {
      genesisAccount,
      bucket: raydiumBucket,
      baseMint,
      quoteMint: WRAPPED_SOL_MINT,
      poolState: raydium.poolState,
      ammConfig: raydium.ammConfig,
      poolAuthority: raydium.poolAuthority,
      lpMint: raydium.lpMint,
      baseVault: raydium.baseVault,
      quoteVault: raydium.quoteVault,
      createPoolFee: raydium.createPoolFee,
      observationState: raydium.observationState,
      permission: raydium.permission,
      raydiumProgram: raydium.raydiumProgram,
    })
  )
  .sendAndConfirm(umi)

const bucket = await fetchRaydiumCpmmBucketV2(umi, raydiumBucket, { commitment: 'confirmed' })
console.log('Pool:', raydium.poolState)
console.log('Graduated base tokens:', bucket.graduatedBaseTokenAmount)
console.log('Graduated at:', bucket.graduateCondition.triggeredTimestamp)
// [/MAIN]

// [OUTPUT]
// Pool: <RAYDIUM_POOL_STATE>
// Graduated base tokens: <BASE_TOKENS_PAIRED_INTO_POOL>
// Graduated at: { __option: 'Some', value: 1767229200n }
// [/OUTPUT]
