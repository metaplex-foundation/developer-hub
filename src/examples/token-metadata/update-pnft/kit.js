// [IMPORTS]
import {
  getUpdateV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, and authority are set up

const mintAddress = 'mintAddress...'; // The pNFT mint address
// [/SETUP]

// [MAIN]
// Update the Programmable NFT metadata
// Note: pNFTs may have rule sets that restrict updates
const updateIx = await getUpdateV1InstructionAsync({
  mint: mintAddress,
  authority,
  payer: authority,
  // Specify fields to update (creators must be explicitly set, use null to keep existing)
  data: {
    name: 'Updated pNFT Name',
    symbol: 'UPNFT',
    uri: 'https://example.com/updated-pnft.json',
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
console.log('pNFT metadata updated');
// [/OUTPUT]
