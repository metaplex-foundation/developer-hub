// [IMPORTS]
import { readFileSync } from 'fs'
import { genesis, revokeV2 } from '@metaplex-foundation/genesis'
import { mplToolbox, SPL_TOKEN_PROGRAM_ID } from '@metaplex-foundation/mpl-toolbox'
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplToolbox())
  .use(genesis())

// Load your wallet keypair (the same wallet used for the launch)
const walletFile = '/path/to/your/keypair.json' // <-- UPDATE THIS PATH
const secretKey = JSON.parse(readFileSync(walletFile, 'utf-8'))
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey))
umi.use(keypairIdentity(keypair))

// Fill in these addresses from the launch
const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT')
const baseMint = publicKey('YOUR_TOKEN_MINT')
// [/SETUP]

// [MAIN]
async function main() {
  console.log('Revoking mint and freeze authorities...')
  await revokeV2(umi, {
    genesisAccount,
    baseMint,
    baseTokenProgram: SPL_TOKEN_PROGRAM_ID,
    revokeMintAuthority: true,
    revokeFreezeAuthority: true,
    padding: Array(5).fill(0),
  }).sendAndConfirm(umi)

  console.log('Launch complete. No more tokens can be minted.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
// [/MAIN]

// [OUTPUT]
// Revoking mint and freeze authorities...
// Launch complete. No more tokens can be minted.
// [/OUTPUT]
