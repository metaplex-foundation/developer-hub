// [IMPORTS]
import { mintV1, TokenStandard } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi is set up with mplTokenMetadata plugin
// mint from createV1

const mintPublicKey = mint.publicKey; // From the created mint
const tokenOwner = umi.identity.publicKey; // Wallet to receive the token
// [/SETUP]

// [MAIN]
// Mint the NFT token
await mintV1(umi, {
  mint: mintPublicKey,
  authority: umi.identity,
  amount: 1,
  tokenOwner,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Minted NFT to:', tokenOwner);
// [/OUTPUT]
