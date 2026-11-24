// [IMPORTS]
import {
  collectRaydiumCpmmFeesV2,
  deriveRaydiumPDAsV2,
  findRaydiumCpmmBucketV2Pda,
  genesis,
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

// Any funded wallet can collect; no Genesis authority is required.
// umi.use(keypairIdentity(yourKeypair))

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT')
const baseMint = publicKey('YOUR_PROJECT_TOKEN_MINT')
// [/SETUP]

// [MAIN]
const [raydiumBucket] = findRaydiumCpmmBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })

// For a bucket without the creatorFee extension (the default AMM config).
// Pass { env: 'devnet' } on devnet.
const raydium = deriveRaydiumPDAsV2(umi, baseMint, raydiumBucket)

await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 400_000 }))
  .add(
    collectRaydiumCpmmFeesV2(umi, {
      baseMint,
      quoteMint: WRAPPED_SOL_MINT,
      poolState: raydium.poolState,
      ammConfig: raydium.ammConfig,
      poolAuthority: raydium.poolAuthority,
      baseVault: raydium.baseVault,
      quoteVault: raydium.quoteVault,
      raydiumProgram: raydium.raydiumProgram,
      creatorFeeShare: raydium.creatorFeeShare,
    })
  )
  .sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// Accrued Raydium creator fees are swept to the Genesis fee wallet.
// The transaction succeeds without a transfer when no fees have accrued yet.
// [/OUTPUT]
