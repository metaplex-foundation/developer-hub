// [IMPORTS]
import { address } from '@solana/addresses';
import { fetchAllDigitalAsset } from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc is set up
// See getting-started for full setup

const mints = [
  address('Ay1U9DWphDgc7hq58Yj1yHabt91zTzvV2YJbAWkPNbaK'),
  address('8TQdiAzdZZEaKtHGjvnLMXhVGjfNsqMgPGBQPPsWYgo8'),
];
// [/SETUP]

// [MAIN]
// Fetch multiple digital assets by their mint addresses
const assets = await fetchAllDigitalAsset(rpc, mints);
// [/MAIN]

// [OUTPUT]
assets.forEach((asset) => {
  console.log('Asset:', asset.address);
  console.log('Name:', asset.metadata.name);
});
// [/OUTPUT]
