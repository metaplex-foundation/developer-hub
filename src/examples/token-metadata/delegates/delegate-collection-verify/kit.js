// [IMPORTS]
import { address } from '@solana/addresses';
import {
  getVerifyCollectionV1InstructionAsync,
  findMetadataPda,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
const mint = address('mintAddress...'); // The item to verify
const collectionMint = address('collectionMintAddress...');
// [/SETUP]

// [MAIN]
const [metadata] = await findMetadataPda({ mint });
const verifyIx = await getVerifyCollectionV1InstructionAsync({
  metadata,
  collectionMint,
  authority: collectionDelegate,
});

await sendAndConfirm({
  instructions: [verifyIx],
  payer: collectionDelegate,
});
// [/MAIN]

// [OUTPUT]
console.log('Collection verified on item');
// [/OUTPUT]
