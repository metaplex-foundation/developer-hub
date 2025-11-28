// [IMPORTS]
// To install all the required packages use the following command
// npm install @metaplex-foundation/mpl-token-metadata @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults
import {
    mplTokenMetadata,
    updateV1,
} from '@metaplex-foundation/mpl-token-metadata';
import {
    keypairIdentity,
    publicKey,
} from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { readFileSync } from 'fs';
// [/IMPORTS]

// [SETUP]
// Initialize Umi with Devnet endpoint
const umi = createUmi('https://api.devnet.solana.com').use(mplTokenMetadata())

// Load your wallet/keypair
const wallet = '<your wallet file path>'
const secretKey = JSON.parse(readFileSync(wallet, 'utf-8'))
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey))
umi.use(keypairIdentity(keypair))

// Your token mint address
const mintAddress = publicKey('<your token mint address>')
// [/SETUP]

// [MAIN]
// Update the fungible token metadata
await updateV1(umi, {
  mint: mintAddress,
  data: {
    name: 'Updated Token Name',
    symbol: 'UTN',
    uri: 'https://arweave.net/new-metadata-uri',
    sellerFeeBasisPoints: 0,
    creators: null,
  },
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
console.log('Token metadata updated')
console.log('Mint:', mintAddress)
// [/OUTPUT]
