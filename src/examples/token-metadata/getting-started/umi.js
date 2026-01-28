// [IMPORTS]
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { generateSigner, percentAmount } from '@metaplex-foundation/umi';
import {
  mplTokenMetadata,
  createNft,
  fetchDigitalAsset,
} from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Create Umi instance with the Token Metadata plugin
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplTokenMetadata());

// Connect your wallet (keypair or wallet adapter)
// For keypair: umi.use(keypairIdentity(keypair))
// For wallet adapter: umi.use(walletAdapterIdentity(wallet))
// [/SETUP]

// [MAIN]
// Generate a new mint keypair
const mint = generateSigner(umi);

// Create an NFT
await createNft(umi, {
  mint,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: percentAmount(5.5),
}).sendAndConfirm(umi);

// Fetch the NFT data
const asset = await fetchDigitalAsset(umi, mint.publicKey);
// [/MAIN]

// [OUTPUT]
console.log('NFT created successfully!');
console.log('Mint address:', mint.publicKey);
console.log('Name:', asset.metadata.name);
console.log('URI:', asset.metadata.uri);
// [/OUTPUT]
