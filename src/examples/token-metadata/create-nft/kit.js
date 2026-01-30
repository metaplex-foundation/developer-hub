// [IMPORTS]
import { generateKeyPairSigner } from '@solana/kit';
import { createNft } from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, and sendAndConfirmInstructions are set up
// See getting-started for full setup

const mint = await generateKeyPairSigner();
const authority = await generateKeyPairSigner(); // Your wallet
// [/SETUP]

// [MAIN]
// Create and mint an NFT in one step
const [createIx, mintIx] = await createNft({
  mint,
  authority,
  payer: authority,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
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
console.log('NFT created:', mint.address);
// [/OUTPUT]
