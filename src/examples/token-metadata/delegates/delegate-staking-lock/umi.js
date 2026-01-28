// [IMPORTS]
import { lockV1 } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi, mint, and stakingDelegate are set up
// [/SETUP]

// [MAIN]
await lockV1(umi, {
  mint,
  authority: stakingDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('pNFT locked by Staking delegate');
// [/OUTPUT]
