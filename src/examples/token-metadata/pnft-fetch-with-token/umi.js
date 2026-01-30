// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import { fetchDigitalAssetWithAssociatedToken } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
const mint = publicKey('11111111111111111111111111111111');
const owner = publicKey('22222222222222222222222222222222');
// [/SETUP]

// [MAIN]
const assetWithToken = await fetchDigitalAssetWithAssociatedToken(
  umi,
  mint,
  owner
);
// [/MAIN]

// [OUTPUT]
console.log('Metadata:', assetWithToken.metadata.name);
console.log('Token Record:', assetWithToken.tokenRecord);
// [/OUTPUT]
