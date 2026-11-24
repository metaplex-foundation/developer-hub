// [IMPORTS]
import {
  claimRaydiumCpmmLpTokensV2,
  deriveRaydiumPDAsV2,
  findRaydiumCpmmBucketV2Pda,
  genesis,
} from '@metaplex-foundation/genesis'
import { findAssociatedTokenPda, mplToolbox } from '@metaplex-foundation/mpl-toolbox'
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
const { lpMint } = deriveRaydiumPDAsV2(umi, baseMint, raydiumBucket)

const recipient = umi.identity.publicKey
const [destinationLpTokenAccount] = findAssociatedTokenPda(umi, {
  owner: recipient,
  mint: lpMint,
})

// Claims `amount`, capped at what the bucket's lpLockSchedule has unlocked
await claimRaydiumCpmmLpTokensV2(umi, {
  genesisAccount,
  bucket: raydiumBucket,
  baseMint,
  lpMint,
  destinationLpTokenAccount,
  recipient,
  lpClaimAuthority: umi.identity,
  amount: 1_000_000n,
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// LP tokens are transferred from the bucket signer to the recipient's LP token account.
// [/OUTPUT]
