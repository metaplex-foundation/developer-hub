// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import {
  updateAsCollectionDelegateV2,
  collectionToggle,
} from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
const mint = publicKey('mintAddress...'); // The item to clear collection from
const collectionMint = publicKey('collectionMintAddress...');
const collectionDelegate = umi.identity; // The delegate authority
// [/SETUP]

// [MAIN]
await updateAsCollectionDelegateV2(umi, {
  mint,
  delegateMint: collectionMint,
  authority: collectionDelegate,
  collection: collectionToggle('Clear'),
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Collection cleared from item');
// [/OUTPUT]
