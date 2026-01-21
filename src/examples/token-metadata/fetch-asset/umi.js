// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import { fetchDigitalAsset } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi is set up with mplTokenMetadata plugin
// See getting-started for full setup

const mintAddress = publicKey('Ay1U9DWphDgc7hq58Yj1yHabt91zTzvV2YJbAWkPNbaK');
// [/SETUP]

// [MAIN]
// Fetch a digital asset by its mint address
const asset = await fetchDigitalAsset(umi, mintAddress);
// [/MAIN]

// [OUTPUT]
console.log('Asset:', asset.publicKey);
console.log('Metadata:', asset.metadata.publicKey);
console.log('Name:', asset.metadata.name);
console.log('URI:', asset.metadata.uri);
console.log('Seller Fee:', asset.metadata.sellerFeeBasisPoints);
// [/OUTPUT]
