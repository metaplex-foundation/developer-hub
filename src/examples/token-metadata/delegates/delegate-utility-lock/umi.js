// [IMPORTS]
import { lockV1 } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi, mint, and utilityDelegate are set up
// [/SETUP]

// [MAIN]
await lockV1(umi, {
  mint,
  authority: utilityDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('pNFT locked by Utility delegate');
// [/OUTPUT]
