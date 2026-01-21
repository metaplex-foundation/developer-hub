// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import { verifyCollectionV1, findMetadataPda } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi, collectionMint, and collectionAuthority are set up

const mintAddress = publicKey('mintAddress...');
// [/SETUP]

// [MAIN]
// First find the metadata PDA to use later
const metadata = findMetadataPda(umi, {
  mint: mintAddress,
});

await verifyCollectionV1(umi, {
  metadata,
  collectionMint,
  authority: collectionAuthority,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Collection verified on NFT');
// [/OUTPUT]
