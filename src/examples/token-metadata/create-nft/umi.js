// [IMPORTS]
import { percentAmount, generateSigner } from '@metaplex-foundation/umi';
import { createNft } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi is set up with mplTokenMetadata plugin
// See getting-started for full setup

const mint = generateSigner(umi);
// [/SETUP]

// [MAIN]
// Create and mint an NFT in one step
await createNft(umi, {
  mint,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: percentAmount(5.5),
  // Optional: add to collection (must verify separately)
  // collection: some({ key: collectionMint.publicKey, verified: false }),
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('NFT created:', mint.publicKey);
// [/OUTPUT]
