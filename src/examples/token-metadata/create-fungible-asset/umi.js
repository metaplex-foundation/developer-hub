// [IMPORTS]
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi';
import { createFungibleAsset } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi is set up with mplTokenMetadata plugin

const mint = generateSigner(umi);
// [/SETUP]

// [MAIN]
// Create a FungibleAsset (SFT - mint tokens separately later)
await createFungibleAsset(umi, {
  mint,
  name: 'My Fungible Asset',
  uri: 'https://example.com/my-fungible-asset.json',
  sellerFeeBasisPoints: percentAmount(5.5),
  decimals: some(0), // FungibleAssets typically have 0 decimals
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Fungible Asset created:', mint.publicKey);
// Mint tokens using mintV1
// [/OUTPUT]
