// [IMPORTS]
import { transferV1 } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi, mint, saleDelegate, currentOwner, and newOwner are set up
// [/SETUP]

// [MAIN]
await transferV1(umi, {
  mint,
  authority: saleDelegate,
  tokenOwner: currentOwner,
  destinationOwner: newOwner,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('pNFT transferred by Sale delegate');
// [/OUTPUT]
