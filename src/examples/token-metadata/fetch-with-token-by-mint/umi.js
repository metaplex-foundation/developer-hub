// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import { fetchDigitalAssetWithTokenByMint } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi is set up with mplTokenMetadata plugin
// See getting-started for full setup

const mint = publicKey('Ay1U9DWphDgc7hq58Yj1yHabt91zTzvV2YJbAWkPNbaK');
// [/SETUP]

// [MAIN]
// Fetch a digital asset with its token account by mint address
const asset = await fetchDigitalAssetWithTokenByMint(umi, mint);
// [/MAIN]

// [OUTPUT]
console.log('Asset:', asset.publicKey);
console.log('Name:', asset.metadata.name);
console.log('Token Owner:', asset.token.owner);
console.log('Token Amount:', asset.token.amount);
// [/OUTPUT]
