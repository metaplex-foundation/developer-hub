// [IMPORTS]
// npm install @metaplex-foundation/mpl-token-metadata @metaplex-foundation/mpl-toolbox @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults
import {
  createFungible,
  mplTokenMetadata,
} from '@metaplex-foundation/mpl-token-metadata'
import {
  createTokenIfMissing,
  findAssociatedTokenPda,
  mintTokensTo,
} from '@metaplex-foundation/mpl-toolbox'
import {
  generateSigner,
  keypairIdentity,
  percentAmount,
  some,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { readFileSync } from 'fs'
// [/IMPORTS]

// [SETUP]
// Initialize Umi with your RPC endpoint
const umi = createUmi('https://api.devnet.solana.com').use(mplTokenMetadata())

// Load your wallet keypair
const wallet = '<your wallet file path>'
const secretKey = JSON.parse(readFileSync(wallet, 'utf-8'))
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey))
umi.use(keypairIdentity(keypair))

// Generate a new mint account
const mint = generateSigner(umi)
// [/SETUP]

// [MAIN]
// Step 1: Create the fungible token with metadata
await createFungible(umi, {
  mint,
  name: 'My Fungible Token',
  symbol: 'MFT',
  uri: 'https://example.com/my-token-metadata.json',
  sellerFeeBasisPoints: percentAmount(0),
  decimals: some(9),
}).sendAndConfirm(umi)

// Step 2: Mint initial supply to your wallet
await createTokenIfMissing(umi, {
  mint: mint.publicKey,
  owner: umi.identity.publicKey,
})
  .add(
    mintTokensTo(umi, {
      mint: mint.publicKey,
      token: findAssociatedTokenPda(umi, {
        mint: mint.publicKey,
        owner: umi.identity.publicKey,
      }),
      amount: 1_000_000_000_000_000, // 1,000,000 tokens with 9 decimals
    })
  )
  .sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
console.log('Token created:', mint.publicKey)
console.log('Metadata and mint account initialized')
console.log('Initial supply minted to:', umi.identity.publicKey)
// [/OUTPUT]
