// [IMPORTS]
import { generateKeyPairSigner } from '@solana/kit';
import { createFungible } from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, and sendAndConfirm are set up

const mint = await generateKeyPairSigner();
const authority = await generateKeyPairSigner(); // Your wallet
// [/SETUP]

// [MAIN]
// Create a Fungible token (mint tokens separately later)
const createIx = await createFungible({
  mint,
  authority,
  payer: authority,
  name: 'My Fungible',
  uri: 'https://example.com/my-fungible.json',
  sellerFeeBasisPoints: 550, // 5.5%
  // decimals: 9, // Optional: default is 0
});

await sendAndConfirm({
  instructions: [createIx],
  payer: authority,
});
// [/MAIN]

// [OUTPUT]
console.log('Fungible token created:', mint.address);
// Mint tokens using getMintV1InstructionAsync
// [/OUTPUT]
