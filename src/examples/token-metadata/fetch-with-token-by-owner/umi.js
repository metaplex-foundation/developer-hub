// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import { fetchDigitalAssetWithAssociatedToken } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi is set up with mplTokenMetadata plugin
// See getting-started for full setup

const mint = publicKey('Ay1U9DWphDgc7hq58Yj1yHabt91zTzvV2YJbAWkPNbaK');
const owner = publicKey('ownerAddress...');
// [/SETUP]

// [MAIN]
// Fetch a digital asset with its associated token account
const asset = await fetchDigitalAssetWithAssociatedToken(umi, mint, owner);
// [/MAIN]

// [OUTPUT]
console.log('Asset:', asset.publicKey);
console.log('Name:', asset.metadata.name);
console.log('Token Owner:', asset.token.owner);
console.log('Token Amount:', asset.token.amount);
// [/OUTPUT]
