// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import { fetchAllDigitalAssetWithTokenByOwnerAndMint } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi is set up with mplTokenMetadata plugin
// See getting-started for full setup

const owner = publicKey('ownerAddress...');
const mint = publicKey('Ay1U9DWphDgc7hq58Yj1yHabt91zTzvV2YJbAWkPNbaK');
// [/SETUP]

// [MAIN]
// Fetch all token accounts for a given owner and mint
const assets = await fetchAllDigitalAssetWithTokenByOwnerAndMint(umi, owner, mint);
// [/MAIN]

// [OUTPUT]
console.log('Found', assets.length, 'token accounts');
assets.forEach((asset) => {
  console.log('Token Address:', asset.token.publicKey);
  console.log('Amount:', asset.token.amount);
});
// [/OUTPUT]
