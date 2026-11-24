// [IMPORTS]
import { readFileSync } from 'fs'
import { genesis, triggerBehaviorsV2, WRAPPED_SOL_MINT } from '@metaplex-foundation/genesis'
import { findAssociatedTokenPda, mplToolbox } from '@metaplex-foundation/mpl-toolbox'
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplToolbox())
  .use(genesis())

// Load your wallet keypair (any funded wallet can run the crank)
const walletFile = '/path/to/your/keypair.json' // <-- UPDATE THIS PATH
const secretKey = JSON.parse(readFileSync(walletFile, 'utf-8'))
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey))
umi.use(keypairIdentity(keypair))

// Fill in the addresses printed by your launch script
const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT')
const baseMint = publicKey('YOUR_TOKEN_MINT')
const launchPoolBucket = publicKey('YOUR_LAUNCH_POOL_BUCKET')
const unlockedBucket = publicKey('YOUR_UNLOCKED_BUCKET')
// [/SETUP]

// [MAIN]
async function main() {
  // The Unlocked bucket's wrapped SOL account receives the collected SOL
  const [unlockedBucketQuoteTokenAccount] = findAssociatedTokenPda(umi, {
    owner: unlockedBucket,
    mint: WRAPPED_SOL_MINT,
  })

  console.log('Running end behaviors...')
  await triggerBehaviorsV2(umi, {
    genesisAccount,
    primaryBucket: launchPoolBucket,
    baseMint,
  })
    .addRemainingAccounts([
      { pubkey: unlockedBucket, isSigner: false, isWritable: true },
      { pubkey: unlockedBucketQuoteTokenAccount, isSigner: false, isWritable: true },
    ])
    .sendAndConfirm(umi)

  console.log('Crank complete. The collected SOL is in the Unlocked bucket.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
// [/MAIN]

// [OUTPUT]
// Running end behaviors...
// Crank complete. The collected SOL is in the Unlocked bucket.
// [/OUTPUT]
