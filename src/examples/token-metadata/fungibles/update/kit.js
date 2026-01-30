// [IMPORTS]
import {
  getUpdateV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, and authority are set up
// See getting-started for full setup

const mintAddress = 'YOUR_TOKEN_MINT_ADDRESS'; // Your fungible token mint
// [/SETUP]

// [MAIN]
// Update the fungible token metadata
const updateIx = await getUpdateV1InstructionAsync({
  mint: mintAddress,
  authority,
  payer: authority,
  // Specify fields to update (creators must be explicitly set, use null to keep existing)
  data: {
    name: 'Updated Token Name',
    symbol: 'UTN',
    uri: 'https://example.com/updated-metadata.json',
    sellerFeeBasisPoints: 0,
    creators: null, // Keep existing creators
  },
});

await sendAndConfirm({
  instructions: [updateIx],
  payer: authority,
});
// [/MAIN]

// [OUTPUT]
console.log('Token metadata updated successfully');
console.log('Mint:', mintAddress);
console.log('New name:', 'Updated Token Name');
// [/OUTPUT]
