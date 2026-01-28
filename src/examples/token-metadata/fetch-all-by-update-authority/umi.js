// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import { fetchAllDigitalAssetByUpdateAuthority } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi is set up with mplTokenMetadata plugin
// See getting-started for full setup

const updateAuthority = publicKey('updateAuthorityAddress...');
// [/SETUP]

// [MAIN]
// Fetch all digital assets by update authority
const assets = await fetchAllDigitalAssetByUpdateAuthority(umi, updateAuthority);
// [/MAIN]

// [OUTPUT]
console.log('Found', assets.length, 'assets');
assets.forEach((asset) => {
  console.log('Name:', asset.metadata.name);
  console.log('Mint:', asset.publicKey);
});
// [/OUTPUT]
