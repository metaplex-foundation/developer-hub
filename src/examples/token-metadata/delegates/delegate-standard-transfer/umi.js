// [IMPORTS]
import { transferV1 } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi, mint, standardDelegate, currentOwner, and newOwner are set up
// [/SETUP]

// [MAIN]
await transferV1(umi, {
  mint,
  authority: standardDelegate,
  tokenOwner: currentOwner,
  destinationOwner: newOwner,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Asset transferred by Standard delegate');
// [/OUTPUT]
