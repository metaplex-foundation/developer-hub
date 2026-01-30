// [IMPORTS]
import { unlockV1 } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi, mint, and stakingDelegate are set up
// [/SETUP]

// [MAIN]
await unlockV1(umi, {
  mint,
  authority: stakingDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('pNFT unlocked by Staking delegate');
// [/OUTPUT]
