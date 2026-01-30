// [IMPORTS]
import {
  getUnverifyCollectionV1InstructionAsync,
  findMetadataPda,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, and collectionAuthority are set up

const mintAddress = 'mintAddress...'; // The NFT to unverify
const collectionMintAddress = 'collectionMintAddress...'; // The collection NFT
// [/SETUP]

// [MAIN]
// Find the metadata PDA
const [metadata] = await findMetadataPda({ mint: mintAddress });

// Unverify the collection on the NFT
const unverifyIx = await getUnverifyCollectionV1InstructionAsync({
  metadata,
  collectionMint: collectionMintAddress,
  authority: collectionAuthority,
  payer: collectionAuthority,
});

await sendAndConfirm({
  instructions: [unverifyIx],
  payer: collectionAuthority,
});
// [/MAIN]

// [OUTPUT]
console.log('Collection unverified on NFT');
// [/OUTPUT]
