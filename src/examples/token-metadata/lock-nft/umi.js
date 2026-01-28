// [IMPORTS]
import { lockV1 } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi, mint, and authority (delegate) are set up
// [/SETUP]

// [MAIN]
await lockV1(umi, {
  mint,
  authority,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('NFT locked');
// [/OUTPUT]
