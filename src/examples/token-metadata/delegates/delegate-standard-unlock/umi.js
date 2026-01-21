// [IMPORTS]
import { unlockV1 } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi, mint, and standardDelegate are set up
// [/SETUP]

// [MAIN]
await unlockV1(umi, {
  mint,
  authority: standardDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Asset unlocked (thawed) by Standard delegate');
// [/OUTPUT]
