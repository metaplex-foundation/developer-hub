// [IMPORTS]
import { delegateTransferV1 } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi, mint, owner, and transferDelegate are set up
// [/SETUP]

// [MAIN]
await delegateTransferV1(umi, {
  mint,
  tokenOwner: owner.publicKey,
  authority: owner,
  delegate: transferDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Transfer delegate approved');
// [/OUTPUT]
