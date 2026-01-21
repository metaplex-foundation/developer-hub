// [IMPORTS]
import { address } from '@solana/addresses';
import {
  getUpdateAsCollectionDelegateV2InstructionAsync,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
const mint = address('mintAddress...'); // The item to clear collection from
const collectionMint = address('collectionMintAddress...');
// [/SETUP]

// [MAIN]
const updateIx = await getUpdateAsCollectionDelegateV2InstructionAsync({
  mint,
  delegateMint: collectionMint,
  authority: collectionDelegate,
  collection: { __kind: 'Clear' },
});

await sendAndConfirm([updateIx], [collectionDelegate]);
// [/MAIN]

// [OUTPUT]
console.log('Collection cleared from item');
// [/OUTPUT]
