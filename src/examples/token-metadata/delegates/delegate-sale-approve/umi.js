// [IMPORTS]
import { delegateSaleV1 } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi, mint, owner, and saleDelegate are set up
// [/SETUP]

// [MAIN]
await delegateSaleV1(umi, {
  mint,
  tokenOwner: owner.publicKey,
  authority: owner,
  delegate: saleDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Sale delegate approved');
// [/OUTPUT]
