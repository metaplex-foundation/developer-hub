// [IMPORTS]
import { address } from '@solana/addresses';
import {
  getUpdateAsDataDelegateV2InstructionAsync,
  fetchMetadata,
  findMetadataPda,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
const mint = address('mintAddress...'); // The collection item to update
const collectionMint = address('collectionMintAddress...');
// [/SETUP]

// [MAIN]
const [metadataAddress] = await findMetadataPda({ mint });
const initialMetadata = await fetchMetadata(rpc, metadataAddress);

const updateIx = await getUpdateAsDataDelegateV2InstructionAsync({
  mint,
  delegateMint: collectionMint,
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
console.log('Collection item data updated via Data delegate');
// [/OUTPUT]
