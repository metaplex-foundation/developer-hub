// [IMPORTS]
import { unlockV1 } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi, mint, and utilityDelegate are set up
// [/SETUP]

// [MAIN]
await unlockV1(umi, {
  mint,
  authority: utilityDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('pNFT unlocked by Utility delegate');
// [/OUTPUT]
