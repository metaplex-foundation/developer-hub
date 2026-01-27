// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import { burnV1, TokenStandard } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi is set up with mplTokenMetadata plugin

const mintAddress = publicKey('mintAddress...');
// [/SETUP]

// [MAIN]
// Burn the Programmable NFT
// Note: pNFTs have Token Record accounts that are also cleaned up
await burnV1(umi, {
  mint: mintAddress,
  authority: umi.identity,
  tokenOwner: umi.identity.publicKey,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('pNFT burned:', mintAddress);
// [/OUTPUT]
