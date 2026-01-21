// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import { fetchDigitalAssetByMetadata } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi is set up with mplTokenMetadata plugin
// See getting-started for full setup

const metadataAddress = publicKey('Gz3vYbpsB2agTsAwedtvtTkQ1CG9Cpo6eTq59rrEGCKF');
// [/SETUP]

// [MAIN]
// Fetch a digital asset by its metadata address
const asset = await fetchDigitalAssetByMetadata(umi, metadataAddress);
// [/MAIN]

// [OUTPUT]
console.log('Asset:', asset.publicKey);
console.log('Metadata:', asset.metadata.publicKey);
console.log('Name:', asset.metadata.name);
console.log('URI:', asset.metadata.uri);
// [/OUTPUT]
