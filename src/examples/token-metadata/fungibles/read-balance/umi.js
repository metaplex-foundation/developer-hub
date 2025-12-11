// [IMPORTS]
// npm install @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-toolbox
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import {
  findAssociatedTokenPda,
  fetchToken
} from '@metaplex-foundation/mpl-toolbox'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.devnet.solana.com')

const mintAddress = publicKey('YOUR_TOKEN_MINT_ADDRESS')
const walletAddress = publicKey('WALLET_ADDRESS')
// [/SETUP]

// [MAIN]
// Find the Associated Token Account
const tokenAccount = findAssociatedTokenPda(umi, {
  mint: mintAddress,
  owner: walletAddress,
})

// Fetch the token account data
const tokenData = await fetchToken(umi, tokenAccount)
// [/MAIN]

// [OUTPUT]
console.log('Token Balance:', tokenData.amount)
console.log('Mint:', tokenData.mint)
console.log('Owner:', tokenData.owner)
// [/OUTPUT]
