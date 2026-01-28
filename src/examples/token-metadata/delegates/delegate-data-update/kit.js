// [IMPORTS]
import { address } from '@solana/addresses';
import {
  getUpdateAsDataDelegateV2InstructionAsync,
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

const updateIx = await getUpdateAsDataDelegateV2InstructionAsync({
  mint,
  authority: dataDelegate,
  data: {
    ...initialMetadata,
    name: 'Updated Name',
    creators: null, // Required when passing data
  },
});

await sendAndConfirm([updateIx], [dataDelegate]);
// [/MAIN]

// [OUTPUT]
console.log('Asset data updated via Data delegate');
// [/OUTPUT]
