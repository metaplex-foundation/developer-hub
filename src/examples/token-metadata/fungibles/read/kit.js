// [IMPORTS]
import { fetchDigitalAsset } from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc is set up
// See getting-started for full setup

const mintAddress = 'YOUR_TOKEN_MINT_ADDRESS'; // Your fungible token mint
// [/SETUP]

// [MAIN]
// Fetch the fungible token's metadata
const asset = await fetchDigitalAsset(rpc, mintAddress);
// [/MAIN]

// [OUTPUT]
console.log('Token Name:', asset.metadata.name);
console.log('Token Symbol:', asset.metadata.symbol);
console.log('Token URI:', asset.metadata.uri);
console.log('Decimals:', asset.mint.decimals);
console.log('Supply:', asset.mint.supply);
// [/OUTPUT]
