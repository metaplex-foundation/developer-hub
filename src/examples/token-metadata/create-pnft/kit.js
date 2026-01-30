// [IMPORTS]
import { generateKeyPairSigner } from '@solana/kit';
import { createProgrammableNft } from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, and sendAndConfirmInstructions are set up

const mint = await generateKeyPairSigner();
const authority = await generateKeyPairSigner(); // Your wallet
// [/SETUP]

// [MAIN]
// Create and mint a Programmable NFT in one step
const [createIx, mintIx] = await createProgrammableNft({
  mint,
  authority,
  payer: authority,
  name: 'My Programmable NFT',
  uri: 'https://example.com/my-programmable-nft.json',
  sellerFeeBasisPoints: 550, // 5.5%
  tokenOwner: authority.address,
  // Optional: add to collection (must verify separately)
  // collection: { key: collectionMint.address, verified: false },
});

// Send both instructions in one transaction
await sendAndConfirm({
  instructions: [createIx, mintIx],
  payer: authority,
});
// [/MAIN]

// [OUTPUT]
console.log('Programmable NFT created:', mint.address);
// [/OUTPUT]
