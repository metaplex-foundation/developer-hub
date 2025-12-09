// [IMPORTS]
// npm install @metaplex-foundation/mpl-token-metadata @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults
import {
  fetchDigitalAsset,
  mplTokenMetadata,
  updateV1,
} from '@metaplex-foundation/mpl-token-metadata'
import {
  keypairIdentity,
  publicKey,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { readFileSync } from 'fs'
// [/IMPORTS]

// [SETUP]
// Initialize Umi with your RPC endpoint
const umi = createUmi('https://api.devnet.solana.com').use(mplTokenMetadata())

// Load your wallet keypair (must be the update authority)
const wallet = '<your wallet file path>'
const secretKey = JSON.parse(readFileSync(wallet, 'utf-8'))
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey))
umi.use(keypairIdentity(keypair))

// Your token mint address
const mintAddress = publicKey('<your token mint address>')
// [/SETUP]

// [MAIN]
// Fetch existing token data
const asset = await fetchDigitalAsset(umi, mintAddress)

// Update the token metadata (name, symbol, and URI)
await updateV1(umi, {
  mint: mintAddress,
  authority: umi.identity,
  data: {
    ...asset.metadata,
    name: 'Updated Token Name',
    symbol: 'UTN',
    uri: 'https://example.com/updated-metadata.json',
  },
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
console.log('Token metadata updated successfully')
console.log('Mint:', mintAddress)
console.log('New name:', 'Updated Token Name')
console.log('New URI:', 'https://example.com/updated-metadata.json')
// [/OUTPUT]
