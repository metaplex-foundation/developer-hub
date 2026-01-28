// [IMPORTS]
import { updateAsAuthorityItemDelegateV2 } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi, mint, authorityItemDelegate, and newUpdateAuthority are set up
// [/SETUP]

// [MAIN]
await updateAsAuthorityItemDelegateV2(umi, {
  mint,
  authority: authorityItemDelegate,
  newUpdateAuthority,
  isMutable: false,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Asset updated by Authority Item delegate');
// [/OUTPUT]
