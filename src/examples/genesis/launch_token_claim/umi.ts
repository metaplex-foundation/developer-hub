// [IMPORTS]
import { readFileSync } from 'fs'
import { claimLaunchPoolV2, genesis } from '@metaplex-foundation/genesis'
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox'
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplToolbox())
  .use(genesis())

// Load your wallet keypair (the wallet that deposited SOL)
const walletFile = '/path/to/your/keypair.json' // <-- UPDATE THIS PATH
const secretKey = JSON.parse(readFileSync(walletFile, 'utf-8'))
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey))
umi.use(keypairIdentity(keypair))

// Fill in the addresses from the launch
const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT')
const baseMint = publicKey('YOUR_TOKEN_MINT')
const launchPoolBucket = publicKey('YOUR_LAUNCH_POOL_BUCKET')
// [/SETUP]

// [MAIN]
async function main() {
  console.log('Claiming tokens...')
  await claimLaunchPoolV2(umi, {
    genesisAccount,
    bucket: launchPoolBucket,
    baseMint,
    recipient: umi.identity.publicKey,
  }).sendAndConfirm(umi)

  console.log('Tokens claimed.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
// [/MAIN]

// [OUTPUT]
// Claiming tokens...
// Tokens claimed.
// [/OUTPUT]
