// [IMPORTS]
import {
    createAndMint,
    mplTokenMetadata,
    TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata';
import {
    generateSigner,
    keypairIdentity,
    percentAmount,
    some,
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

// Generate a new mint account
const mint = generateSigner(umi)
// [/SETUP]

// [MAIN]
// Create and mint the fungible token with metadata
// The minted tokens will be sent to the umi identity address
createAndMint(umi, {
  mint,
  name: 'My Fungible Token',
  symbol: 'MFT',
  uri: 'https://arweave.net/7BzVsHRrEH0ldNOCCM4_E00BiAYuJP_EQiqvcEYz3YY',
  sellerFeeBasisPoints: percentAmount(5.5),
  decimals: some(9),
  tokenStandard: TokenStandard.Fungible,
  amount: 1000,
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
console.log('Fungible token created:', mint.publicKey)
// [/OUTPUT]
