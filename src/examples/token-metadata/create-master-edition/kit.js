// [IMPORTS]
import { generateKeyPairSigner } from '@solana/kit';
import { createNft, PrintSupply } from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, and authority are set up

const mint = await generateKeyPairSigner();
// [/SETUP]

// [MAIN]
// Create a Master Edition NFT with limited supply of 100 prints
const [createIx, mintIx] = await createNft({
  mint,
  authority,
  payer: authority,
  name: 'My Master Edition NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: 550, // 5.5%
  tokenOwner: authority.address,
  printSupply: PrintSupply.Limited(100), // Or PrintSupply.Unlimited
});

await sendAndConfirm({
  instructions: [createIx, mintIx],
  payer: authority,
});
// [/MAIN]

// [OUTPUT]
console.log('Master Edition NFT created:', mint.address);
// [/OUTPUT]
