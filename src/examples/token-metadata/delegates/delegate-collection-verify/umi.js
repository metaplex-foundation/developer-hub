// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import {
  verifyCollectionV1,
  findMetadataPda,
} from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
const mint = publicKey('mintAddress...'); // The item to verify
const collectionMint = publicKey('collectionMintAddress...');
const collectionDelegate = umi.identity; // The delegate authority
// [/SETUP]

// [MAIN]
await verifyCollectionV1(umi, {
  metadata: findMetadataPda(umi, { mint }),
  collectionMint,
  authority: collectionDelegate,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Collection verified on item');
// [/OUTPUT]
