// [IMPORTS]
import { address } from '@solana/addresses';
import { fetchDigitalAssetWithAssociatedToken } from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
const mint = address('11111111111111111111111111111111');
const owner = address('22222222222222222222222222222222');
// [/SETUP]

// [MAIN]
const assetWithToken = await fetchDigitalAssetWithAssociatedToken(
  rpc,
  mint,
  owner
);
// [/MAIN]

// [OUTPUT]
console.log('Metadata:', assetWithToken.metadata.name);
console.log('Token Record:', assetWithToken.tokenRecord);
// [/OUTPUT]
