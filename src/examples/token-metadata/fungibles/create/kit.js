// [IMPORTS]
import { generateKeyPairSigner } from '@solana/kit';
import { createFungible } from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, and sendAndConfirmInstructions are set up
// See getting-started for full setup

const mint = await generateKeyPairSigner();
const authority = await generateKeyPairSigner(); // Your wallet
// [/SETUP]

// [MAIN]
// Create a fungible token with metadata and mint initial supply
const createAndMintIx = await createFungible({
  mint,
  authority,
  payer: authority,
  name: 'My Fungible Token',
  symbol: 'MFT',
  uri: 'https://example.com/my-token-metadata.json',
  sellerFeeBasisPoints: 0,
  decimals: 9,
  tokenOwner: authority.address,
  amount: 1_000_000_000_000_000n, // 1,000,000 tokens with 9 decimals
});

// Send the instruction (createFungible returns a single combined instruction)
await sendAndConfirmInstructions([createAndMintIx], [mint, authority]);
// [/MAIN]

// [OUTPUT]
console.log('Fungible token created:', mint.address);
console.log('Initial supply minted to:', authority.address);
// [/OUTPUT]
