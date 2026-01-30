// [IMPORTS]
import { address } from '@solana/addresses';
import { fetchDigitalAssetByMetadata } from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc is set up
// See getting-started for full setup

const metadataAddress = address('Gz3vYbpsB2agTsAwedtvtTkQ1CG9Cpo6eTq59rrEGCKF');
// [/SETUP]

// [MAIN]
// Fetch a digital asset by its metadata address
const asset = await fetchDigitalAssetByMetadata(rpc, metadataAddress);
// [/MAIN]

// [OUTPUT]
console.log('Asset:', asset.address);
console.log('Name:', asset.metadata.name);
console.log('URI:', asset.metadata.uri);
// [/OUTPUT]
