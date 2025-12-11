// [IMPORTS]
// npm install @metaplex-foundation/mpl-token-metadata @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import {
  fetchDigitalAsset,
  mplTokenMetadata
} from '@metaplex-foundation/mpl-token-metadata'
// [/IMPORTS]

// [SETUP]
// Initialize Umi with your RPC endpoint
const umi = createUmi('https://api.devnet.solana.com').use(mplTokenMetadata())

// The mint address of the token you want to fetch
const mintAddress = publicKey('YOUR_TOKEN_MINT_ADDRESS')
// [/SETUP]

// [MAIN]
// Fetch the token's metadata from the blockchain
const asset = await fetchDigitalAsset(umi, mintAddress)
// [/MAIN]

// [OUTPUT]
console.log('Token Name:', asset.metadata.name)
console.log('Token Symbol:', asset.metadata.symbol)
console.log('Token URI:', asset.metadata.uri)
console.log('Decimals:', asset.mint.decimals)
console.log('Supply:', asset.mint.supply)
// [/OUTPUT]
