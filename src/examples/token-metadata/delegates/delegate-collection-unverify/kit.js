// [IMPORTS]
import { address } from '@solana/addresses';
import {
  getUnverifyCollectionV1InstructionAsync,
  findMetadataPda,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
const mint = address('mintAddress...'); // The item to unverify
const collectionMint = address('collectionMintAddress...');
// [/SETUP]

// [MAIN]
const [metadata] = await findMetadataPda({ mint });
const unverifyIx = await getUnverifyCollectionV1InstructionAsync({
  metadata,
  collectionMint,
  authority: collectionDelegate,
});

await sendAndConfirm([unverifyIx], [collectionDelegate]);
// [/MAIN]

// [OUTPUT]
console.log('Collection unverified on item');
// [/OUTPUT]
