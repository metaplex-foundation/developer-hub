// [IMPORTS]
import { publicKey, none, some } from '@metaplex-foundation/umi';
import { updateV1 } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi is set up with mplTokenMetadata plugin

const mintAddress = publicKey('mintAddress...');
// [/SETUP]

// [MAIN]
// Update the Programmable NFT metadata
// Note: pNFTs may have rule sets that restrict updates
await updateV1(umi, {
  mint: mintAddress,
  authority: umi.identity,
  data: some({
    name: 'Updated pNFT Name',
    symbol: '',
    uri: '',
    sellerFeeBasisPoints: 0,
    creators: none(),
  }),
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('pNFT metadata updated');
// [/OUTPUT]
