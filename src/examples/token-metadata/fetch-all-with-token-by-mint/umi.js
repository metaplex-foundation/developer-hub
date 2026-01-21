// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import { fetchAllDigitalAssetWithTokenByMint } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi is set up with mplTokenMetadata plugin
// See getting-started for full setup

const mint = publicKey('Ay1U9DWphDgc7hq58Yj1yHabt91zTzvV2YJbAWkPNbaK');
// [/SETUP]

// [MAIN]
// Fetch all token accounts for a given mint
const assets = await fetchAllDigitalAssetWithTokenByMint(umi, mint);
// [/MAIN]

// [OUTPUT]
console.log('Found', assets.length, 'token accounts');
assets.forEach((asset) => {
  console.log('Owner:', asset.token.owner);
  console.log('Amount:', asset.token.amount);
});
// [/OUTPUT]
