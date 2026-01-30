// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import {
  updateAsDataDelegateV2,
  fetchMetadataFromSeeds,
} from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
const mint = publicKey('mintAddress...');
const dataDelegate = umi.identity; // The delegate authority
// [/SETUP]

// [MAIN]
const initialMetadata = await fetchMetadataFromSeeds(umi, { mint });
await updateAsDataDelegateV2(umi, {
  mint,
  authority: dataDelegate,
  data: { ...initialMetadata, name: 'Updated Name' },
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Asset data updated via Data delegate');
// [/OUTPUT]
