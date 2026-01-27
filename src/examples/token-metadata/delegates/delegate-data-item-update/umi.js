// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import {
  updateAsDataItemDelegateV2,
  fetchMetadataFromSeeds,
} from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
const mint = publicKey('mintAddress...');
const dataItemDelegate = umi.identity; // The delegate authority
// [/SETUP]

// [MAIN]
const initialMetadata = await fetchMetadataFromSeeds(umi, { mint });
await updateAsDataItemDelegateV2(umi, {
  mint,
  authority: dataItemDelegate,
  data: { ...initialMetadata, name: 'Updated Name' },
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Asset data updated via Data Item delegate');
// [/OUTPUT]
