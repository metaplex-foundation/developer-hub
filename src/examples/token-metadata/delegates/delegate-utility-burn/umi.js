// [IMPORTS]
import { burnV1 } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi, mint, utilityDelegate, and currentOwner are set up
// [/SETUP]

// [MAIN]
await burnV1(umi, {
  mint,
  authority: utilityDelegate,
  tokenOwner: currentOwner,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('pNFT burned by Utility delegate');
// [/OUTPUT]
