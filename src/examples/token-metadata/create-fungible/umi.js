// [IMPORTS]
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi';
import { createFungible } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi is set up with mplTokenMetadata plugin

const mint = generateSigner(umi);
// [/SETUP]

// [MAIN]
// Create a Fungible token (mint tokens separately later)
await createFungible(umi, {
  mint,
  name: 'My Fungible',
  uri: 'https://example.com/my-fungible.json',
  sellerFeeBasisPoints: percentAmount(5.5),
  decimals: some(9), // Use some(0) for 0 decimals
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Fungible token created:', mint.publicKey);
// Mint tokens using mintV1
// [/OUTPUT]
