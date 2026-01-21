// [IMPORTS]
import { percentAmount, generateSigner } from '@metaplex-foundation/umi';
import { createProgrammableNft } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi is set up with mplTokenMetadata plugin

const mint = generateSigner(umi);
// [/SETUP]

// [MAIN]
// Create and mint a Programmable NFT in one step
await createProgrammableNft(umi, {
  mint,
  name: 'My Programmable NFT',
  uri: 'https://example.com/my-programmable-nft.json',
  sellerFeeBasisPoints: percentAmount(5.5),
  // Optional: add to collection (must verify separately)
  // collection: some({ key: collectionMint.publicKey, verified: false }),
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Programmable NFT created:', mint.publicKey);
// [/OUTPUT]
