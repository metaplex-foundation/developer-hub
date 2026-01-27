// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import { fetchAllDigitalAssetByCreator } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi is set up with mplTokenMetadata plugin
// See getting-started for full setup

const creator = publicKey('creatorAddress...');
// [/SETUP]

// [MAIN]
// Assets where the creator is first in the Creator array
const assetsA = await fetchAllDigitalAssetByCreator(umi, creator);

// Assets where the creator is second in the Creator array
const assetsB = await fetchAllDigitalAssetByCreator(umi, creator, {
  position: 2,
});
// [/MAIN]

// [OUTPUT]
console.log('Assets with creator at position 1:', assetsA.length);
assetsA.forEach((asset) => {
  console.log('Name:', asset.metadata.name);
});
// [/OUTPUT]
