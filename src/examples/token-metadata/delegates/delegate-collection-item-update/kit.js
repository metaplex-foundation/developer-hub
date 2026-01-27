// [IMPORTS]
import { address } from '@solana/addresses';
import {
  getUpdateAsCollectionItemDelegateV2InstructionAsync,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
const mint = address('mintAddress...');
const collectionMint = address('collectionMintAddress...');
// [/SETUP]

// [MAIN]
const updateIx = await getUpdateAsCollectionItemDelegateV2InstructionAsync({
  mint,
  authority: collectionItemDelegate,
  collection: {
    __kind: 'Set',
    fields: [{ key: collectionMint, verified: false }],
  },
});

await sendAndConfirm([updateIx], [collectionItemDelegate]);
// [/MAIN]

// [OUTPUT]
console.log('Collection set on asset via Collection Item delegate');
// [/OUTPUT]
