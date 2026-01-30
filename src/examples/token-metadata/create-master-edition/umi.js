// [IMPORTS]
import { percentAmount, generateSigner } from '@metaplex-foundation/umi';
import { createNft, printSupply } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi is set up with mplTokenMetadata plugin

const mint = generateSigner(umi);
// [/SETUP]

// [MAIN]
await createNft(umi, {
  mint,
  name: 'My Master Edition NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: percentAmount(5.5),
  printSupply: printSupply('Limited', [100]), // Or printSupply('Unlimited')
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Master Edition NFT created:', mint.publicKey);
// [/OUTPUT]
