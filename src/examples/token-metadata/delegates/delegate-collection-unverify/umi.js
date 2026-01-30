// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import {
  unverifyCollectionV1,
  findMetadataPda,
} from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
const mint = publicKey('mintAddress...'); // The item to unverify
const collectionMint = publicKey('collectionMintAddress...');
const collectionDelegate = umi.identity; // The delegate authority
// [/SETUP]

// [MAIN]
await unverifyCollectionV1(umi, {
  metadata: findMetadataPda(umi, { mint }),
  collectionMint,
  authority: collectionDelegate,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Collection unverified on item');
// [/OUTPUT]
