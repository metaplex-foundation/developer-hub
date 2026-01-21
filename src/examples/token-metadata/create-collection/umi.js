// [IMPORTS]
import { generateSigner, percentAmount } from '@metaplex-foundation/umi';
import { createNft } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi is set up with mplTokenMetadata plugin

const collectionMint = generateSigner(umi);
// [/SETUP]

// [MAIN]
await createNft(umi, {
  mint: collectionMint,
  name: 'My Collection',
  uri: 'https://example.com/my-collection.json',
  sellerFeeBasisPoints: percentAmount(5.5), // 5.5%
  isCollection: true,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Collection NFT created:', collectionMint.publicKey);
// [/OUTPUT]
