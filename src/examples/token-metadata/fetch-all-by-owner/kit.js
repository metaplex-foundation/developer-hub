// [IMPORTS]
import { fetchAllDigitalAsset } from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc is set up
// See getting-started for full setup

// Get mint addresses from token accounts (use DAS API or getProgramAccounts)
const mintAddresses = ['mint1...', 'mint2...', 'mint3...'];
// [/SETUP]

// [MAIN]
// Fetch multiple digital assets efficiently in a single batch
const assets = await fetchAllDigitalAsset(rpc, mintAddresses);
// [/MAIN]

// [OUTPUT]
assets.forEach((asset) => {
  console.log('Name:', asset.metadata.name);
  console.log('URI:', asset.metadata.uri);
});
// [/OUTPUT]
