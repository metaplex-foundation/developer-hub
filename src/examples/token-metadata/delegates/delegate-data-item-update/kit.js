// [IMPORTS]
import { address } from '@solana/addresses';
import {
  getUpdateAsDataItemDelegateV2InstructionAsync,
  fetchMetadata,
  findMetadataPda,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
const mint = address('mintAddress...');
// [/SETUP]

// [MAIN]
const [metadataAddress] = await findMetadataPda({ mint });
const initialMetadata = await fetchMetadata(rpc, metadataAddress);

const updateIx = await getUpdateAsDataItemDelegateV2InstructionAsync({
  mint,
  authority: dataItemDelegate,
  data: {
    ...initialMetadata,
    name: 'Updated Name',
    creators: null, // Required when passing data
  },
});

await sendAndConfirm({
  instructions: [updateIx],
  payer: dataItemDelegate,
});
// [/MAIN]

// [OUTPUT]
console.log('Asset data updated via Data Item delegate');
// [/OUTPUT]
