// [IMPORTS]
import { burnV1 } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi, mint, standardDelegate, and currentOwner are set up
// [/SETUP]

// [MAIN]
await burnV1(umi, {
  mint,
  authority: standardDelegate,
  tokenOwner: currentOwner,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Asset burned by Standard delegate');
// [/OUTPUT]
