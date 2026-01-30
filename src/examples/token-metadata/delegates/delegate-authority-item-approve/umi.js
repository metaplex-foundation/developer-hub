// [IMPORTS]
import { delegateAuthorityItemV1 } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi, mint, updateAuthority, and authorityItemDelegate are set up
// [/SETUP]

// [MAIN]
await delegateAuthorityItemV1(umi, {
  mint,
  authority: updateAuthority,
  delegate: authorityItemDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Authority Item delegate approved');
// [/OUTPUT]
