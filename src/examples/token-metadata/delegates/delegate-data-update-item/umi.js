// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import {
  updateAsDataDelegateV2,
  fetchMetadataFromSeeds,
} from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
const mint = publicKey('mintAddress...'); // The collection item to update
const collectionMint = publicKey('collectionMintAddress...');
const dataDelegate = umi.identity; // The delegate authority (delegated on collection)
// [/SETUP]

// [MAIN]
const initialMetadata = await fetchMetadataFromSeeds(umi, { mint });
await updateAsDataDelegateV2(umi, {
  mint,
  delegateMint: collectionMint,
  authority: dataDelegate,
  data: { ...initialMetadata, name: 'Updated Name' },
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Collection item data updated via Data delegate');
// [/OUTPUT]
