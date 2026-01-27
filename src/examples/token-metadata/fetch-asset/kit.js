// [IMPORTS]
import { address } from '@solana/addresses';
import { fetchDigitalAsset } from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc is set up
// See getting-started for full setup

const mintAddress = address('Ay1U9DWphDgc7hq58Yj1yHabt91zTzvV2YJbAWkPNbaK');
// [/SETUP]

// [MAIN]
// Fetch a digital asset by its mint address
const asset = await fetchDigitalAsset(rpc, mintAddress);
// [/MAIN]

// [OUTPUT]
console.log('Asset:', asset.address);
console.log('Name:', asset.metadata.name);
console.log('URI:', asset.metadata.uri);
console.log('Seller Fee:', asset.metadata.sellerFeeBasisPoints);
if (asset.edition) {
  console.log('Is Original:', asset.edition.isOriginal);
}
// [/OUTPUT]
