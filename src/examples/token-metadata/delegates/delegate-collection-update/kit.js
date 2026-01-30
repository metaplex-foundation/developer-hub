// [IMPORTS]
import { address } from '@solana/addresses';
import {
  getUpdateAsCollectionDelegateV2InstructionAsync,
  CollectionToggle,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
const mint = address('mintAddress...');
const collectionMint = address('collectionMintAddress...');
// [/SETUP]

// [MAIN]
const updateIx = await getUpdateAsCollectionDelegateV2InstructionAsync({
  mint,
  authority: collectionDelegate,
  collection: {
    __kind: 'Set',
    fields: [{ key: collectionMint, verified: false }],
  },
});

await sendAndConfirm({
  instructions: [updateIx],
  payer: collectionDelegate,
});
// [/MAIN]

// [OUTPUT]
console.log('Collection set on asset');
// [/OUTPUT]
