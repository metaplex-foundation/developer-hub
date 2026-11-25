// [IMPORTS]
import {
  claimRaydiumCreatorFeeV2,
  collectRaydiumCpmmFeesWithCreatorFeeV2,
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

// umi.use(keypairIdentity(yourKeypair))

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT')
const baseMint = publicKey('YOUR_PROJECT_TOKEN_MINT')
const creatorFeeWallet = publicKey('CREATOR_FEE_WALLET') // wallet set in the creatorFee extension
// [/SETUP]

// [MAIN]
const [raydiumBucket] = findRaydiumCpmmBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })
const raydium = deriveRaydiumPDAsV2(umi, baseMint, raydiumBucket, { creatorFee: true })

// 1. Collect accrued Raydium creator fees and split them between the
//    Metaplex fee wallet and the bucket's creator fee share
await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 400_000 }))
  .add(
    collectRaydiumCpmmFeesWithCreatorFeeV2(umi, {
      genesisAccount,
      raydiumCpmmBucket: raydiumBucket,
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

// 2. Pay the creator's accrued share out to the configured wallet
await claimRaydiumCreatorFeeV2(umi, {
  genesisAccount,
  bucket: raydiumBucket,
  baseMint,
  quoteMint: WRAPPED_SOL_MINT,
  creatorFeeWallet,
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// The creator's share of collected Raydium fees is sent to CREATOR_FEE_WALLET.
// [/OUTPUT]
