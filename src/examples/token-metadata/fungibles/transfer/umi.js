// [IMPORTS]
// To install all the required packages use the following command
// npm install @metaplex-foundation/mpl-toolbox @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults
import {
    createTokenIfMissing,
    findAssociatedTokenPda,
    transferTokens,
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
  // Find the source token account (your account)
  const sourceTokenAccount = findAssociatedTokenPda(umi, {
  mint: mintAddress,
  owner: umi.identity.publicKey,
  })
  
  // Find the destination token account
  const destinationTokenAccount = findAssociatedTokenPda(umi, {
  mint: mintAddress,
  owner: destinationAddress,
  })
  
  // Create the destination token account if it doesn't exist
  transactionBuilder()
    .add(createTokenIfMissing(umi, {
      mint: mintAddress,
      owner: destinationAddress,
    }))
    // Transfer 100 tokens
    .add(
      transferTokens(umi, {
      source: sourceTokenAccount,
      destination: destinationTokenAccount,
      amount: 100,
    }))
    .sendAndConfirm(umi)
  // [/MAIN]
  
  // [OUTPUT]
  console.log('Transferred 100 tokens')
  console.log('From:', sourceTokenAccount)
  console.log('To:', destinationTokenAccount)
  // [/OUTPUT]
  