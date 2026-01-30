// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import {
  updateAsCollectionItemDelegateV2,
  collectionToggle,
} from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
const mint = publicKey('mintAddress...');
const collectionMint = publicKey('collectionMintAddress...');
const collectionItemDelegate = umi.identity; // The delegate authority
// [/SETUP]

// [MAIN]
await updateAsCollectionItemDelegateV2(umi, {
  mint,
  authority: collectionItemDelegate,
  collection: collectionToggle('Set', [
    { key: collectionMint, verified: false },
  ]),
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Collection set on asset via Collection Item delegate');
// [/OUTPUT]
