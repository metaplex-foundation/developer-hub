// [IMPORTS]
import { lockV1 } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi, mint, and standardDelegate are set up
// [/SETUP]

// [MAIN]
await lockV1(umi, {
  mint,
  authority: standardDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Asset locked (frozen) by Standard delegate');
// [/OUTPUT]
