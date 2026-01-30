// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import { fetchAllDigitalAssetWithTokenByOwner } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi is set up with mplTokenMetadata plugin
// See getting-started for full setup

const owner = publicKey('ownerAddress...');
// [/SETUP]

// [MAIN]
// Fetch all digital assets with their token accounts by owner
const assets = await fetchAllDigitalAssetWithTokenByOwner(umi, owner);
// [/MAIN]

// [OUTPUT]
console.log('Found', assets.length, 'assets');
assets.forEach((asset) => {
  console.log('Name:', asset.metadata.name);
  console.log('Token Amount:', asset.token.amount);
});
// [/OUTPUT]
