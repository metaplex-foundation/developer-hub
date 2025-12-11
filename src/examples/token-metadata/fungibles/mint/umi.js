// [IMPORTS]
// To install all the required packages use the following command
// npm install @metaplex-foundation/mpl-toolbox @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults
import {
    createTokenIfMissing,
    findAssociatedTokenPda,
    mintTokensTo,
} from '@metaplex-foundation/mpl-toolbox';
import {
    keypairIdentity,
    publicKey,
    transactionBuilder,
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

// Your token mint address and destination wallet
const mintAddress = publicKey('<your token mint address>')
const destinationAddress = publicKey('<destination wallet address>')
// [/SETUP]

// [MAIN]
// Find the destination token account
const destinationTokenAccount = findAssociatedTokenPda(umi, {
  mint: mintAddress,
  owner: destinationAddress,
})

// Create the destination token account if it doesn't exist and mint tokens
await transactionBuilder()
  .add(createTokenIfMissing(umi, {
    mint: mintAddress,
    owner: destinationAddress,
  }))
  // Mint 100 tokens to the destination
  .add(
    mintTokensTo(umi, {
    mint: mintAddress,
    token: destinationTokenAccount,
    amount: 100,
  }))
  .sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
console.log('Minted 100 tokens')
console.log('Mint:', mintAddress)
console.log('To:', destinationTokenAccount)
// [/OUTPUT]
