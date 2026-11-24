// [IMPORTS]
import {
  claimRaydiumCreatorFeeV2,
  fetchRaydiumCpmmBucketV2,
  findRaydiumCpmmBucketV2Pda,
  genesis,
  WRAPPED_SOL_MINT,
} from '@metaplex-foundation/genesis'
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox'
import { keypairIdentity, publicKey, unwrapOption } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplToolbox())
  .use(genesis())

// Any funded wallet can claim; the fee always goes to the creator wallet.
// umi.use(keypairIdentity(yourKeypair))

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT')
const baseMint = publicKey('YOUR_PROJECT_TOKEN_MINT')
// [/SETUP]

// [MAIN]
const [raydiumBucket] = findRaydiumCpmmBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })

// The creator wallet is stored in the bucket's creatorFee extension
const bucket = await fetchRaydiumCpmmBucketV2(umi, raydiumBucket)
const creatorFee = unwrapOption(bucket.extensions.creatorFee)
if (!creatorFee) throw new Error('This Raydium bucket has no creatorFee extension')

await claimRaydiumCreatorFeeV2(umi, {
  genesisAccount,
  bucket: raydiumBucket,
  baseMint,
  quoteMint: WRAPPED_SOL_MINT,
  creatorFeeWallet: creatorFee.wallet,
}).sendAndConfirm(umi)

console.log('Accrued:', bucket.creatorFeeAccrued, 'Previously claimed:', bucket.creatorFeeClaimed)
// [/MAIN]

// [OUTPUT]
// Accrued: 1250000n Previously claimed: 0n
// The unclaimed creator fee is paid to the creator wallet (as native SOL for a wSOL quote).
// [/OUTPUT]
