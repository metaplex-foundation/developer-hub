// [IMPORTS]
import {
  getVerifyCollectionV1InstructionAsync,
  findMetadataPda,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, and collectionAuthority are set up

const mintAddress = 'mintAddress...'; // The NFT to verify
const collectionMintAddress = 'collectionMintAddress...'; // The collection NFT
// [/SETUP]

// [MAIN]
// Find the metadata PDA
const [metadata] = await findMetadataPda({ mint: mintAddress });

// Verify the collection on the NFT
const verifyIx = await getVerifyCollectionV1InstructionAsync({
  metadata,
  collectionMint: collectionMintAddress,
  authority: collectionAuthority,
  payer: collectionAuthority,
});

await sendAndConfirm([verifyIx], [collectionAuthority]);
// [/MAIN]

// [OUTPUT]
console.log('Collection verified on NFT');
// [/OUTPUT]
