// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import {
  updateAsCollectionDelegateV2,
  collectionToggle,
} from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
const mint = publicKey('mintAddress...');
const collectionDelegate = umi.identity; // The delegate authority
const collectionMint = publicKey('collectionMintAddress...');
// [/SETUP]

// [MAIN]
await updateAsCollectionDelegateV2(umi, {
  mint,
  authority: collectionDelegate,
  collection: collectionToggle('Set', [
    { key: collectionMint, verified: false },
  ]),
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Collection set on asset');
// [/OUTPUT]
