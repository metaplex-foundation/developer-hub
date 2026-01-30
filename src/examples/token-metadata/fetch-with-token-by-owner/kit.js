// [IMPORTS]
import { address } from '@solana/addresses';
import { fetchDigitalAssetWithAssociatedToken } from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc is set up
// See getting-started for full setup

const mintAddress = address('Ay1U9DWphDgc7hq58Yj1yHabt91zTzvV2YJbAWkPNbaK');
const ownerAddress = address('ownerAddress...');
// [/SETUP]

// [MAIN]
// Fetch a digital asset with its associated token account
const asset = await fetchDigitalAssetWithAssociatedToken(rpc, mintAddress, ownerAddress);
// [/MAIN]

// [OUTPUT]
console.log('Asset:', asset.address);
console.log('Name:', asset.metadata.name);
console.log('Token Owner:', asset.token.owner);
console.log('Token Amount:', asset.token.amount);
// [/OUTPUT]
