// [IMPORTS]
// To install all the required packages use the following command
// npm install @metaplex-foundation/mpl-toolbox @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults
import {
    burnToken,
    findAssociatedTokenPda,
} from '@metaplex-foundation/mpl-toolbox';
import {
    keypairIdentity,
    publicKey,
} from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { readFileSync } from 'fs';
// [/IMPORTS]

// [SETUP]
// Initialize Umi with Devnet endpoint
const umi = createUmi('https://api.devnet.solana.com')

// Load your wallet/keypair
const wallet = '<your wallet file path>'
const secretKey = JSON.parse(readFileSync(wallet, 'utf-8'))
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey))
umi.use(keypairIdentity(keypair))

// Your token mint address
const mintAddress = publicKey('<your token mint address>')
// [/SETUP]

// [MAIN]
// Find the token account to burn from
const tokenAccount = findAssociatedTokenPda(umi, {
  mint: mintAddress,
  owner: umi.identity.publicKey,
})

// Burn 100 tokens
await burnToken(umi, {
  account: tokenAccount,
  mint: mintAddress,
  amount: 100,
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
console.log('Burned 100 tokens')
console.log('Mint:', mintAddress)
console.log('Token Account:', tokenAccount)
// [/OUTPUT]
