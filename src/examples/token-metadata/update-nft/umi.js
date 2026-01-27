// [IMPORTS]
import { publicKey, none, some } from '@metaplex-foundation/umi';
import { updateV1 } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi is set up with mplTokenMetadata plugin
// See getting-started for full setup

const mintAddress = publicKey('mintAddress...');
// [/SETUP]

// [MAIN]
// Update the NFT metadata
await updateV1(umi, {
  mint: mintAddress,
  authority: umi.identity,
  // Only specify fields you want to update
  data: some({
    name: 'Updated NFT Name',
    symbol: '', // Keep existing
    uri: '', // Keep existing
    sellerFeeBasisPoints: 0, // Keep existing
    creators: none(),
  }),
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('NFT metadata updated');
// [/OUTPUT]
