// [IMPORTS]
import { generateKeyPairSigner } from '@solana/signers';
import { createNft } from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, and authority are set up

const collectionMint = await generateKeyPairSigner();
// [/SETUP]

// [MAIN]
// Create a Collection NFT
const [createIx, mintIx] = await createNft({
  mint: collectionMint,
  authority,
  payer: authority,
  name: 'My Collection',
  uri: 'https://example.com/my-collection.json',
  sellerFeeBasisPoints: 550, // 5.5%
  tokenOwner: authority.address,
  isCollection: true,
});

await sendAndConfirm([createIx, mintIx], [collectionMint, authority]);
// [/MAIN]

// [OUTPUT]
console.log('Collection NFT created:', collectionMint.address);
// [/OUTPUT]
