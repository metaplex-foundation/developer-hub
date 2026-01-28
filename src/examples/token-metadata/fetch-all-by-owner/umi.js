// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import { fetchAllDigitalAssetByOwner } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi is set up with mplTokenMetadata plugin
// See getting-started for full setup

const owner = publicKey('ownerAddress...');
// [/SETUP]

// [MAIN]
// Fetch all digital assets owned by a wallet
const assets = await fetchAllDigitalAssetByOwner(umi, owner);
// [/MAIN]

// [OUTPUT]
assets.forEach((asset) => {
  console.log('Name:', asset.metadata.name);
  console.log('URI:', asset.metadata.uri);
});
// [/OUTPUT]
