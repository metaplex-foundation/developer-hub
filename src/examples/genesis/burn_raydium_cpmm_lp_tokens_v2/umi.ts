// [IMPORTS]
import {
  burnRaydiumCpmmLpTokensV2,
  deriveRaydiumPDAsV2,
  fetchRaydiumCpmmBucketV2,
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

// The identity must be the LP claim authority (the Genesis authority by default).
// umi.use(keypairIdentity(yourKeypair))

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT')
const baseMint = publicKey('YOUR_PROJECT_TOKEN_MINT')
// [/SETUP]

// [MAIN]
const [raydiumBucket] = findRaydiumCpmmBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 })

// Pass { env: 'devnet' } on devnet.
const { lpMint } = deriveRaydiumPDAsV2(umi, baseMint, raydiumBucket)

// Burn every LP token the bucket signer still holds. Burning ignores the
// lpLockSchedule and permanently locks that share of the pool's liquidity.
const bucket = await fetchRaydiumCpmmBucketV2(umi, raydiumBucket, { commitment: 'confirmed' })
const unclaimed = bucket.lpTokenBalance - bucket.lpTokensClaimed - bucket.lpTokensBurned

await burnRaydiumCpmmLpTokensV2(umi, {
  genesisAccount,
  bucket: raydiumBucket,
  baseMint,
  lpMint,
  lpClaimAuthority: umi.identity,
  amount: unclaimed, // capped to the unclaimed, unburned balance
}).sendAndConfirm(umi)

const after = await fetchRaydiumCpmmBucketV2(umi, raydiumBucket, { commitment: 'confirmed' })
console.log('LP tokens burned:', after.lpTokensBurned, 'Claimed:', after.lpTokensClaimed)
// [/MAIN]

// [OUTPUT]
// LP tokens burned: 1094445115n Claimed: 1000000n
// [/OUTPUT]
