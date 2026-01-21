// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import { fetchAllDigitalAsset } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi is set up with mplTokenMetadata plugin
// See getting-started for full setup

const mints = [
  publicKey('Ay1U9DWphDgc7hq58Yj1yHabt91zTzvV2YJbAWkPNbaK'),
  publicKey('8TQdiAzdZZEaKtHGjvnLMXhVGjfNsqMgPGBQPPsWYgo8'),
];
// [/SETUP]

// [MAIN]
// Fetch multiple digital assets by their mint addresses
const assets = await fetchAllDigitalAsset(umi, mints);
// [/MAIN]

// [OUTPUT]
assets.forEach((asset) => {
  console.log('Asset:', asset.publicKey);
  console.log('Name:', asset.metadata.name);
});
// [/OUTPUT]
