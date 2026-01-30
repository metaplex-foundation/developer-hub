// [IMPORTS]
import {
  getUpdateV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, and authority are set up
// See getting-started for full setup

const mintAddress = 'mintAddress...'; // The NFT mint address
// [/SETUP]

// [MAIN]
// Update the NFT metadata
const updateIx = await getUpdateV1InstructionAsync({
  mint: mintAddress,
  authority,
  payer: authority,
  // Specify fields to update (creators must be explicitly set, use null to keep existing)
  data: {
    name: 'Updated NFT Name',
    symbol: 'UNFT',
    uri: 'https://example.com/updated-nft.json',
    sellerFeeBasisPoints: 550,
    creators: null, // Keep existing creators
  },
});

await sendAndConfirm({
  instructions: [updateIx],
  payer: authority,
});
// [/MAIN]

// [OUTPUT]
console.log('NFT metadata updated');
// [/OUTPUT]
