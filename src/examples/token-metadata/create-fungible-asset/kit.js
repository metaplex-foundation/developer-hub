// [IMPORTS]
import { generateKeyPairSigner } from '@solana/signers';
import { createFungibleAsset } from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, and sendAndConfirm are set up

const mint = await generateKeyPairSigner();
const authority = await generateKeyPairSigner(); // Your wallet
// [/SETUP]

// [MAIN]
// Create a FungibleAsset (SFT - mint tokens separately later)
const createIx = await createFungibleAsset({
  mint,
  authority,
  payer: authority,
  name: 'My Fungible Asset',
  uri: 'https://example.com/my-fungible-asset.json',
  sellerFeeBasisPoints: 550, // 5.5%
  // decimals: 0, // Optional: FungibleAssets typically have 0 decimals
});

await sendAndConfirm([createIx], [mint, authority]);
// [/MAIN]

// [OUTPUT]
console.log('Fungible Asset created:', mint.address);
// Mint tokens using getMintV1InstructionAsync
// [/OUTPUT]
