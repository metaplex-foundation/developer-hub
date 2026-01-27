// [IMPORTS]
import { generateSigner, percentAmount } from '@metaplex-foundation/umi';
import {
  createV1,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi is set up with mplTokenMetadata plugin
// See getting-started for full setup

const mint = generateSigner(umi);
// [/SETUP]

// [MAIN]
// Create the onchain accounts (Mint + Metadata + MasterEdition for NFTs)
await createV1(umi, {
  mint,
  authority: umi.identity,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: percentAmount(5.5),
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Created NFT accounts');
console.log('Mint:', mint.publicKey);
// [/OUTPUT]
